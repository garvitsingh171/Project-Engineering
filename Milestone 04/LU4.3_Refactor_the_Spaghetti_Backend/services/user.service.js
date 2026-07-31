const prisma = require("../prisma/prisma");

async function getAllUsers() {
  const users = await prisma.user.findMany({
    where: { isActive: true },
    include: { posts: true },
  });

  return users.map((u) => ({
    ...u,
    fullName: `${u.firstName} ${u.lastName}`,
  }));
}

async function getUser(id) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { posts: true },
  });

  if (!user) return null;

  return {
    ...user,
    fullName: `${user.firstName} ${user.lastName}`,
  };
}

async function createUser(data) {
  return prisma.user.create({
    data: {
      ...data,
      isActive: true,
    },
  });
}

async function deactivateUser(id) {
  return prisma.user.update({
    where: { id },
    data: { isActive: false },
  });
}

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  deactivateUser,
};