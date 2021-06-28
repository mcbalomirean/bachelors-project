var express = require("express");
var router = express.Router();

const reviewingController = require("../controllers/reviewingcontroller");

router.get("/", reviewingController.findAll);

router.get("/:id", reviewingController.getQuizSessions);

router.get("/:id/:type", reviewingController.getFlaggedData);

router.post("/", reviewingController.create);

router.put("/", reviewingController.toggleQuizState);

router.delete("/:id", reviewingController.unflagData);

module.exports = router;
