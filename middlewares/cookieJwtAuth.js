const jwt = require("jsonwebtoken");

function cookieJwtAuth(req, res, next) {
  const token = req.cookies.token;
  const verify = jwt.verify(token, process.env.ACCESS_KEY, (err, decoded) => {
    if (err) {
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
