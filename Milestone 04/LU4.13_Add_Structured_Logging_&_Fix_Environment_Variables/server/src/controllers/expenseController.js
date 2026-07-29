const expenseService = require('../services/expenseService');

exports.addExpense = async (req, res) => {
    // Debugging relies on console.log(req.body) without request context (method/route).
    console.log("New entry data: ", req.body);
    try {
        const { amount, payerId } = req.body;

        if (!amount || !payerId) {
            return res.status(400).json({ error: 'Amount and PayerId are required'});
        }
        
        const expense = await expenseService.createExpense(req.body);
        res.status(201).json(expense);
    } catch (err) {
        // Returns generic error response without context or stack trace.
        // Errors are not propagated to a centralized handler.
        console.log("Error logic hit");
        res.status(500).json({ error: "Failed to create expense" });
    }
};

exports.getExpenses = async (req, res) => {
    console.log("Fetching all...");
    try {
        const expenses = await expenseService.getAllExpenses();
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch expenses" });
    }
};

exports.getBalances = async (req, res) => {
    console.log("Calculating...");
    try {
        const balances = await expenseService.calculateBalances();
        res.json(balances);
    } catch (err) {
        res.status(500).json({ error: "Failed to calculate balances" });
    }
};
