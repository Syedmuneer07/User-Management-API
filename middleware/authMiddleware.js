const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization; // Bearer <token>

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized! faulty token provided" });
  }

  const token= authHeader.split(" ")[1]; // extract the token from the header

  try{
    const decoded=jwt.verify(token, process.env.JWT_SECRET); // verify the token and decode the payload
    req.user=decoded; // attach the decoded payload to the request object
    next();// proceed to the next middleware or route handler

  }catch(e){
    return res.status(401).json({ error: "Unauthorized! faulty token provided" });
  }


};


