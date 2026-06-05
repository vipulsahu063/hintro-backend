const sendSuccess = (res, data, traceId, statusCode = 200) => {
  return res.status(statusCode).json({
    traceId,
    success: true,
    data,
  });
};

const sendError = (res, code, message, traceId, statusCode = 400) => {
  return res.status(statusCode).json({
    traceId,
    success: false,
    error: {
      code,
      message,
    },
  });
};

module.exports = { sendSuccess, sendError };