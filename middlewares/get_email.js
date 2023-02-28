const get_email = (req, res, next) => {
  const email = req.cookies.email; //take the value of the from the cookie
  // check validity of token
  if (email) {
    req.email = email;
    next();
  } else {
    res.status(401).json({ error: "I don't have your email address" });
  }
};

module.exports = {
  get_email,
};
