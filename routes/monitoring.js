var express = require("express");
var router = express.Router();
var fs = require("fs");

// TODO: validate, verify files
// TOOD: decide path based on student
router.post("/", (req, res, next) => {
  let name = req.body.name;
  let frame = req.files.frame;
  let sessionPath = `${__dirname}/../sessions/${name}/`;
  let uploadDate = new Date().getTime();
  let uploadPath = `${sessionPath}${uploadDate}.png`;

  if (frame) {
    fs.mkdir(sessionPath, (error) => {
      if (error && error.code != "EEXIST") {
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
