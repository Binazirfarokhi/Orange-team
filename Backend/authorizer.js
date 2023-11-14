const { validateLocal } = require("./services/auth.service");

module.exports = function (req, res, next) {
  try {
    if (req.path.indexOf("/auth") >= 0) return next();
    const token = req.headers.authorization.substring(7);

    const result = validateLocal(token);
    if (result && result.uid) {
      return next(); // No error proceed to next middleware
    } else {
      res.status(401).send("Unauthorzed");
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      ...error,
      status: "Failed",
    });
  }
};
