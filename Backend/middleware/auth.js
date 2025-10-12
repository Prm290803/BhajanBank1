
// import jwt from 'jsonwebtoken';

// export default (req, res, next) => {
//   try {
//     const token = req.header('Authorization').replace('Bearer ', '');
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.userId;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: 'Authentication failed' });
//   }
// };

import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Make sure this matches what you used when signing the token
    req.userId = decoded.userId; 
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

export default authMiddleware;