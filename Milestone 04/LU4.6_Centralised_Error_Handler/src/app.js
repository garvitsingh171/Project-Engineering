// BUG — The four-parameter error handling middleware is completely missing.
// to the client when any route calls next(err) or throws unhandled.

const express = require('express');
const userRoutes = require('./routes/user.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());

app.use('/users', userRoutes);

// BUG — app.use(errorHandler) is intentionally absent here.
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;