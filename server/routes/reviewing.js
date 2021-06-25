var express = require("express");
var router = express.Router();

const reviewingController = require("../controllers/reviewingcontroller");

router.get("/", reviewingController.findAll);

router.get("/:id", reviewingController.getQuizSessions);

router.post("/", reviewingController.create);

router.put("/:id", reviewingController.toggle);

module.exports = router;
