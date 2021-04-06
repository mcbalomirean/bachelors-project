var express = require("express");
var router = express.Router();
var fs = require("fs");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// TODO: validate, verify files
// TOOD: decide path based on student
router.post("/", (req, res, next) => {
  let frame = req.files.frame;
  let sessionPath = `${__dirname}/../sessions/SESSION_NAME/`;
  let uploadDate = new Date().getTime();
  let uploadPath = `${sessionPath}${uploadDate}.png`;

  if (frame) {
    fs.mkdir(sessionPath, (error) => {
      if (error.code != "EEXIST") {
        console.log(error);
      }
    });

    frame.mv(uploadPath, (error) => {
      if (error) {
        console.log(error);
        return res.status(500).send();
      } else {
        res.status(200).send();
      }
    });
  }
});

module.exports = router;
