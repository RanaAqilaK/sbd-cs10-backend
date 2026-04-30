class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
      error: err
    });
  }

  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      payload: null
    });
  } else {
    console.error('ERROR 💥', err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      payload: null
    });
  }
};

module.exports = { AppError, errorHandler };