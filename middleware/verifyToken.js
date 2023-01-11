const jwt = require("jsonwebtoken");

const middlewareVerify = {
  verifyToken: async (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(
        accessToken,
        process.env.JWT__ACCESS__KEY,
        (err, resultsDecode) => {
          if (err) {
            return res.status(400).json({ message: "Token is not valid" });
          }
          req.user = resultsDecode;
          next();
        }
      );
    } else {
      res.status(401).json({ message: "Unauthorized...!!" });
    }
  },
  verifyTokenAdmin: async (req, res, next) => {
    middlewareVerify.verifyToken(req, res, () => {
      if (req.user.admin) {
        next();
      } else {
        res.status(403).json({ message: "You are not admin" });
      }
    });
  },
};

module.exports = middlewareVerify;
