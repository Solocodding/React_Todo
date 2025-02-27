const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = async (req, res, next) => {
  // console.log("verifyToken");
  const token = req.cookies.authToken;
  if (!token) return res.status(401).json({ message: "Access denied" });
  
  try {
   
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      // console.log(decoded);
      if (err) {
          req.isAuthenticated = false;
          req.user = undefined;
          return next();
      }
      const user = await User.findById(decoded.id).select("-password");
      // console.log(user);
      if(!user){
          req.isAuthenticated = false;
          req.user = undefined;
          return next();
      }

      req.isAuthenticated = true;
      req.user = user;
      // console.log(req.user);
      next();
  });
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
  
};


module.exports = verifyToken;
