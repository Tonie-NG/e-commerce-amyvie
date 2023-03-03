const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt; //take the value of the from the cookie
  // check validity of token
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (error, data) => {
      if (error) {
        res.status(400).send(error.message);
      } else {
        req.data = data;
        next();
      }
    });
  } else {
    res.status(400).send(error.message);
  }
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.data.isAdmin) {
      next();
      req.data;
    } else {
      res.status(403).json("Only an Admin is Allowed to do this");
    }
  });
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.data.id === req.params.id || req.data.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do this");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
};
