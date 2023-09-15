const jwt = require("jsonwebtoken");
const path = require ('path')
require('dotenv').config({ path: path.resolve(__dirname, '../config/.env') });
const secretKey = process.env.key

async function generateToken(idUser) {
    const payload = { idUser };
    const options = { expiresIn: "7d" };
    return jwt.sign(payload, secretKey, options);
  }

async function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(token, secretKey, (err, decoded)=> {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  });
}  
  module.exports = {
    generateToken,
    verifyToken
  };