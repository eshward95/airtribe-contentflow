const jwt = require("jsonwebtoken");
const { config } = require("../config");

const generateToken = (userId) => {
  const payload = {
    email: userId,
  };
  return jwt.sign(payload, config.secret, {
    expiresIn: "1 day",
  });
};

const verifyToken = async (token) => {
  return jwt.verify(token, config.secret);
};

module.exports = {
  generateToken,
  verifyToken,
};
