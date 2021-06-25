const express = require("express");
const router = express.Router();

const monitoringController = require("../controllers/monitoringcontroller");

router.get("/quiz/:id", monitoringController.checkQuiz);

router.post("/", monitoringController.receiveData);

module.exports = router;
