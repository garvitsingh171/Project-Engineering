// src/user.controller.js
//
// KNOWN BUGS — do not fix these until you have built the safety net:
//
// Bug 1 — Inconsistent error shapes across three endpoints.
// Bug 2 — Duplicate email triggers a raw Prisma P2002 error.
// Bug 3 — deleteUser has no try/catch at all (Prisma P2025 crashes the app).
// Bug 4 — crashTest throws a raw Error that sends an HTML stack trace.

const AppError = require('../utils/AppError');
const prisma = require('./lib/db');

// POST /users
async function createUser(req, res, next) {
  const { name, email } = req.body;

  if (!name || !email) {
    // 🚨 BUG 1: Inconsistent error shape. Returns { error: "..." }
    return next(new AppError("Please Provide Name and Email", 404));
  }

  try {
    const user = await prisma.user.create({ data: { name, email } });
    res.status(201).json(user);
  } catch (err) {
    // 🚨 BUG 1 & 2: Inconsistent shape AND it leaks raw Prisma errors (like P2002).
    if (err.code === 'P2002') {
      return next(new AppError("Email already Exists", 409))
    }
    next(err)
  }
}

// GET /users/:id
async function getUser(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      // 🚨 BUG 1: Inconsistent error shape. Returns a plain text string!
      return next(new AppError("Not Found", 404));
    }

    res.json(user);
  } catch (err) {
    // 🚨 BUG 1: It leaks raw Prisma errors
    next(err);
  }
}

// DELETE /users/:id
async function deleteUser(req, res, next) {
  try {
    const id = parseInt(req.params.id);
  
    // 🚨 BUG 3: Missing try/catch block completely!
    await prisma.user.delete({ where: { id } });
    res.status(204).send();

  } catch (err) {
    if (err.code === 'P2025') {
      return next(new AppError("User Not Found", 404));
    }
    next(err);
  }
  // const id = parseInt(req.params.id);
  
  // // 🚨 BUG 3: Missing try/catch block completely!
  // await prisma.user.delete({ where: { id } });
  // res.status(204).send();
}

// GET /users/crash/test
async function crashTest(req, res, next) {
  // 🚨 BUG 4: This intentionally throws an error to simulate a bug. Wrap this in a try/catch and use next(err).
  // throw new Error('Simulated server crash!');
  try {
    throw new Error('Simulated server crash!');
  } catch (err) {
    next(err);
  }
}

module.exports = { createUser, getUser, deleteUser, crashTest };