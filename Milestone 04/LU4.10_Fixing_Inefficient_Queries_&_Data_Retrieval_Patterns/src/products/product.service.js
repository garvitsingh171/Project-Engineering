import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getProducts(_query) {
  // 🚨 Firehose problem: returns everything, ignores all parameters
  const page = Number(_query.page) || 1;
  const limit = Number(_query.limit) || 10;

  const MAX_LIMIT = 100;
  const safeLimit = Math.min(limit, MAX_LIMIT);

  const skip = (page - 1) * 100

  const allowedSortFields = ["id", "name", "price", "createdAt"];
  const allowedOrder = ["asc", "desc"];

  const sortBy = _query.sortBy || "id";
  const order = _query.order || "asc";

  if (!allowedSortFields.includes(sortBy)) {
    return res.status(400).json({ error: "Invalid sortBy field" });
  }

  if (!allowedOrders.includes(order)) {
    return res.status(400).json({ error: "Invalid order value" });
  }

  const products = await prisma.product.findMany({
    skip,
    take: safeLimit,
    orderBy: {
      sortBy: order
    }
  });

  res.json({
    data: products,
    meta: {
      page,
      limit: safeLimit,
    }
  })
}

export async function getProductById(id) {
  return prisma.product.findUnique({ where: { id } });
}