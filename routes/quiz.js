var express = require("express");
var router = express.Router();

const quizController = require("../controllers/quizcontroller");

router.post("/", quizController.create);
router.get("/", quizController.findAll);
router.put("/:id", quizController.toggle);

module.exports = router;
