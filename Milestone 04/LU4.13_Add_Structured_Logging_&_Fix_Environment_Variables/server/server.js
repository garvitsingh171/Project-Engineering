const express = require('express');
const app = express();
require('dotenv').config();
const expenseRoutes = require('./src/routes/expenseRoutes');

// Morgan is installed but we aren't using it as middleware.
// This results in zero visibility into incoming requests and responses.
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/expenses', expenseRoutes);

// Hardcoded Port: This violates fail-fast principles and prevents environment portability.
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    // Basic logs without request context or status visibility.
    console.log(`Server is running on port ${PORT}`);
    console.log("Database connected.");
});
