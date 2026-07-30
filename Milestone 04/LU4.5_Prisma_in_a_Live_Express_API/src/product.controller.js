// const { Pool } = require('pg');
// const { PrismaClient } = require('@prisma/client');

// const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// const prisma = new PrismaClient();

const prisma = require("../prisma/db");

async function getProducts(req, res) {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getProductById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return res.status(404).json({ error: "Product Not Found" });
    }

    res.json({ name: product.name, price: product.price });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getProducts, getProductById };