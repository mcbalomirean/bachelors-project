var express = require("express");
var router = express.Router();

const quizController = require("../controllers/quizcontroller");

router.get("/", quizController.findAll);

router.post("/", quizController.create);

router.put("/:id", quizController.toggle);

module.exports = router;
