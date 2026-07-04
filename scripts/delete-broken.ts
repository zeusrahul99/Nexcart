import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const brokenIds = [
  "cmr6g3u1g0001wg67eoijosca",
  "cmr6g3u40000bwg67k99vqcc1",
  "cmr6g3u6j000mwg67o5nsbs3t",
  "cmr6g3u6r000nwg67ef54ackt",
  "cmr6g3u7h000qwg67eixz9kui",
  "cmr6g3u88000twg67ru36t7zr",
];

async function main() {
  for (const id of brokenIds) {
    await prisma.cartItem.deleteMany({ where: { productId: id } });
    await prisma.orderItem.deleteMany({ where: { productId: id } });
    await prisma.review.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });
    console.log("Deleted: " + id);
  }
  const count = await prisma.product.count();
  console.log("\nRemaining products: " + count);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
