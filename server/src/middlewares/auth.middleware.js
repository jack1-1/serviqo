const { verifyToken } = require('../utils/jwt');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: 'Authorization token is required'
      });
    }

    const token = authHeader.split(' ')[1]; // bearer eerYY88238..........

    if (!token) {
      return res.status(401).json({
        message: 'Invalid authorization header'
      });
    }

    const decoded = verifyToken(token);

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token'
    });
  }
};

module.exports = authMiddleware;