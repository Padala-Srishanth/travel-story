const jwt = require('jsonwebtoken');

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ error: true, message: 'No token provided or invalid format' });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.ACCESS_TOKEN_SECRET || 'your_secret_key';

  console.log("🔐 Verifying token with secret:", secret); // Debug log

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      console.error("❌ JWT verification failed:", err.message);
      return res.status(403).json({ error: true, message: 'Invalid token' });
    }

    console.log("✅ Token verified successfully. Decoded user:", user); // Debug log
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };
