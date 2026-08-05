const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || "fabricflow_super_secret_jwt_key_2026_safe",
    {
      expiresIn: "30d",
    }
  );
};

module.exports = generateToken;
