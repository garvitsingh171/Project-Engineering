const errorHandler = async (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message: err.message
    });
};

module.exports = errorHandler;