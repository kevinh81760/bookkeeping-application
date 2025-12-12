import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // First, try to decode as base64 demo token
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      if (decoded.userId === "guest-demo-user") {
        console.log("✅ Demo token accepted for guest user");
        req.user = decoded;
        return next();
      }
    } catch (e) {
      // Not a valid base64 JSON token, will try JWT next
    }
    
    // If not a demo token, try regular JWT verification for Google OAuth users
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user payload to request
    next();
  } catch (err) {
    console.error("❌ Auth error:", err.message);
    res.status(403).json({ error: "Invalid or expired token" });
  }
};
