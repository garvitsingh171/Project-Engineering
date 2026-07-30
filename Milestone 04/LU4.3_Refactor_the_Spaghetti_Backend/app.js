const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.use("/users", require("./routes/user.routes"));
app.use("/posts", require("./routes/post.routes"));

app.listen(3000, () => console.log('Server running on port 3000'));
