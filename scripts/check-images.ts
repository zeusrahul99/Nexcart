import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, image: true, category: true },
  });

  console.log(`Total products: ${products.length}\n`);

  const broken: string[] = [];

  for (const p of products) {
    if (!p.image) {
      console.log(`❌ NO IMAGE  | ${p.name} [${p.category}]`);
      broken.push(p.id);
      continue;
    }
    try {
      const res = await fetch(p.image, { method: "HEAD", redirect: "follow" });
      if (!res.ok) {
        console.log(`❌ HTTP ${res.status} | ${p.name} [${p.category}] → ${p.image.substring(0, 60)}...`);
        broken.push(p.id);
      } else {
        console.log(`✅ OK        | ${p.name} [${p.category}]`);
      }
    } catch (e: any) {
      console.log(`❌ FETCH ERR | ${p.name} [${p.category}] → ${e.message}`);
      broken.push(p.id);
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(`Working: ${products.length - broken.length}`);
  console.log(`Broken:  ${broken.length}`);

  if (broken.length > 0) {
    console.log(`\nBroken product IDs:\n${broken.join("\n")}`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
