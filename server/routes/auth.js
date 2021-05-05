var express = require("express");
var router = express.Router();
var authController = require("../controllers/AuthController");

router.get(
  "/login",
  (req, res, next) => {
    req.session.backUrl = req.get("Referrer");
    next();
  },
  authController.passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

//callback route
router.get(
  "/callback",
  authController.passport.authenticate("google", {
    scope: ["profile", "email"],
    successRedirect: "redirect",
    failureRedirect: "login",
  })
);

//TODO: test, improve? add errors?
router.get("/redirect", (req, res) => {
  if (req.session.backUrl === undefined) {
    res.status(301).send("Logged in with an invalid referrer.");
  } else {
    res.status(301).redirect(req.session.backUrl);
  }
});

router.get("/status", (req, res) => {
  if (req.user) {
    res.status(200).end();
  } else {
    res.status(401).end();
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  res.status(200).end();
});

module.exports = router;
