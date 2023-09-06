const jwt = require('jsonwebtoken');

const validateToken = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401);
      throw new Error('Token is missing in the request');
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error('User is not authorized!!!!!!!!');
      }
      req.user = decoded.user;
      next();
    });
  } else {
    res.status(401);
    throw new Error('User is not authorized!!!!!!!!!!');
  }
};

module.exports = validateToken;