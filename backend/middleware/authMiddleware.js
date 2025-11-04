import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      console.log("❌ No Authorization header found");
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    if (!token) {
      console.log("❌ Empty token in header");
      return res
        .status(401)
        .json({ success: false, message: "Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { userId: decoded.id };

    next();
  } catch (error) {
    console.error("⚠️ Auth error:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid token" });
  }
};

export default auth;
