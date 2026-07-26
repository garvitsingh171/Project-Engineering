const prisma = require("../prisma/prisma");

async function getPosts() {
  return prisma.post.findMany({
    where: { published: true },
    include: { author: true },
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function getPost(id) {
  return prisma.post.findUnique({
    where: { id },
    include: { author: true },
  });
}

async function createPost(data) {
  return prisma.post.create({
    data: {
      ...data,
      published: false,
    },
  });
}

async function publishPost(id) {
  return prisma.post.update({
    where: { id },
    data: {
      published: true,
    },
  });
}

module.exports = {
  getPosts,
  getPost,
  createPost,
  publishPost,
};