var fs = require("fs");

// TODO: validate, verify files
// TODO: decide path based on student
// TODO: justify using async
module.exports.receiveData = async (req, res) => {
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
};
