module.exports = (err, req, res, next) => {
  console.error('[Server Error]', err);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  
  res.status(statusCode).json({
    message: err.message || "Server Error",
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
};
