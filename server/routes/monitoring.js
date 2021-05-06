var express = require("express");
var router = express.Router();

const monitoringController = require("../controllers/monitoringcontroller");

router.post("/", monitoringController.receiveData);

module.exports = router;
