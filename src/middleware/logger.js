const loggerMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const log = {
      timestamp: new Date().toISOString(),
      traceId: req.traceId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${Date.now() - start}ms`,
    };

    if (res.statusCode >= 400) {
      log.error = res.locals.errorDetails || null;
    }

    console.log(JSON.stringify(log));
  });

  next();
};

module.exports = loggerMiddleware;