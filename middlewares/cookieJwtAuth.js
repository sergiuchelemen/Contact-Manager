const jwt = require("jsonwebtoken");

function cookieJwtAuth(req, res, next) {
  const token = req.cookies.token;
  jwt.verify(token, process.env.ACCESS_KEY, (err, decoded) => {
    if (err) {
      console.log(err);
      res.clearCookie("token");
      res.redirect("/login");
      return;
    } else {
      req.user = decoded.user;
      next();
    }
  });
}

module.exports = cookieJwtAuth;
