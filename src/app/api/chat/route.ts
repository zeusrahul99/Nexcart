import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid messages array" },
        { status: 400 }
      );
    }

    const latestMessage = messages[messages.length - 1];
    const text = latestMessage.content.toLowerCase();

    // 1. Check for basic greetings
    const greetings = ["hi", "hello", "hey", "greetings", "good morning", "good afternoon"];
    const isGreetingOnly = greetings.some(g => text.trim() === g || text.trim() === g + "!");

    if (isGreetingOnly) {
      // Return a set of featured items on greeting
      const featured = await prisma.product.findMany({
        take: 3,
        orderBy: { rating: "desc" },
      });
      return NextResponse.json({
        response: "Hello! I'm your AI Shopping Assistant. 📦\n\nI can help you find premium products by category, price, or description. What are you looking for today?\n\nHere are some of our top-rated featured products to get you started:",
        products: featured,
      });
    }

    // 2. Parse category filters
    let categoryFilter: string | undefined = undefined;
    if (text.includes("electronic") || text.includes("gadget") || text.includes("tech") || text.includes("laptop") || text.includes("phone") || text.includes("camera") || text.includes("speaker") || text.includes("keyboard") || text.includes("headphone") || text.includes("watch") || text.includes("charger") || text.includes("ssd")) {
      categoryFilter = "Electronics";
    } else if (text.includes("fashion") || text.includes("cloth") || text.includes("hoodie") || text.includes("wear") || text.includes("backpack") || text.includes("bag") || text.includes("shoe") || text.includes("sneaker") || text.includes("jacket") || text.includes("shirt") || text.includes("sunglass") || text.includes("belt") || text.includes("beanie")) {
      categoryFilter = "Fashion";
    } else if (text.includes("book") || text.includes("read") || text.includes("stationery") || text.includes("notebook") || text.includes("pen") || text.includes("journal") || text.includes("desk") || text.includes("lamp") || text.includes("write") || text.includes("writing")) {
      categoryFilter = "Books & Stationery";
    }

    // 3. Parse price filter (e.g. "under $100", "under 100", "less than 50")
    let maxPrice: number | undefined = undefined;
    const priceRegexes = [
      /under\s*(?:\$)?\s*(\d+(?:\.\d{2})?)/i,
      /less\s*than\s*(?:\$)?\s*(\d+(?:\.\d{2})?)/i,
      /below\s*(?:\$)?\s*(\d+(?:\.\d{2})?)/i,
      /cheaper\s*than\s*(?:\$)?\s*(\d+(?:\.\d{2})?)/i,
      /budget\s*(?:\$)?\s*(\d+(?:\.\d{2})?)/i,
    ];

    for (const regex of priceRegexes) {
      const match = text.match(regex);
      if (match && match[1]) {
        maxPrice = parseFloat(match[1]);
        break;
      }
    }

    // 4. Parse keyword search terms
    const keywords = [
      // Electronics
      "headphones", "watch", "laptop", "keyboard", "camera", "charging", "charger",
      "speaker", "bluetooth", "webcam", "ssd", "hub", "smart",
      // Fashion
      "backpack", "hoodie", "sneaker", "shoe", "running", "sunglasses", "jacket",
      "denim", "leather", "belt", "beanie", "t-shirt", "tshirt",
      // Books & Stationery
      "programmer", "notebook", "pen", "journal", "habits", "code", "clean",
      "lamp", "organizer", "calligraphy", "deep work",
    ];
    const matchedKeywords = keywords.filter(kw => text.includes(kw));

    // 5. Construct Prisma query where clause
    const whereClause: any = {};

    if (categoryFilter) {
      whereClause.category = categoryFilter;
    }

    if (maxPrice !== undefined) {
      whereClause.price = { lte: maxPrice };
    }

    // If keywords are matched or user is writing text, build OR conditions for name/description
    if (matchedKeywords.length > 0) {
      whereClause.OR = matchedKeywords.flatMap(kw => [
        { name: { contains: kw } },
        { description: { contains: kw } },
      ]);
    } else if (!categoryFilter && maxPrice === undefined) {
      // General search: try matching any words in the message (filtering out common stop words)
      const stopWords = ["want", "find", "show", "need", "like", "look", "good", "some", "with", "have", "here", "that", "this", "what", "your", "please", "could", "would", "about", "from", "they", "them", "best", "great", "nice"];
      const words = text.split(/\s+/).filter((w: string) => w.length > 3 && !stopWords.includes(w));
      if (words.length > 0) {
        whereClause.OR = words.flatMap((word: string) => [
          { name: { contains: word } },
          { description: { contains: word } },
        ]);
      }
    }

    // 6. Fetch products
    let products = await prisma.product.findMany({
      where: whereClause,
      take: 4,
      orderBy: { rating: "desc" },
    });

    // 7. Formulate AI Response Text
    let responseText = "";
    if (products.length > 0) {
      const productNames = products.map(p => `"${p.name}"`).join(", ");
      
      responseText = `I found some premium products that match your request!\n\n`;
      
      if (categoryFilter) responseText += `• Category: **${categoryFilter}**\n`;
      if (maxPrice !== undefined) responseText += `• Price cap: **Under $${maxPrice.toFixed(2)}**\n`;
      if (matchedKeywords.length > 0) responseText += `• Key terms: ${matchedKeywords.map(k => `_${k}_`).join(", ")}\n`;
      
      responseText += `\nHere are the top matches I recommend. You can click on them or add them directly to your cart:`;
    } else {
      // If nothing matches, get top 3 general popular items as recommendations
      const popular = await prisma.product.findMany({
        take: 3,
        orderBy: { rating: "desc" },
      });
      
      responseText = `I couldn't find any products matching those exact specifications, but here are some of our best-selling featured items that you might like:`;
      products = popular;
    }

    return NextResponse.json({
      response: responseText,
      products,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
