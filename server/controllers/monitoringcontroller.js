// TODO: test ES6 imports

const tf = require("@tensorflow/tfjs-node");

var fs = require("fs");
var path = require("path");

// var { Canvas, Image, ImageData, loadImage } = require("canvas");
// var faceapi = require("@vladmandic/face-api");

// faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// // TODO: consolidate in functions

// console.log("Loading...");

// Promise.all([
//   faceapi.nets.tinyFaceDetector.loadFromDisk("./public/models"),
//   faceapi.nets.faceLandmark68TinyNet.loadFromDisk("./public/models"),
// ])
//   .then(
//     async () => {
//       console.log("Loaded!");

//       try {
//         const img = await loadImage(
//           "./sessions/MIRCEACRISTIAN BALOMIREAN/1620324485940.png"
//         );
//         const results = await faceapi
//           .detectAllFaces(
//             img,
//             new faceapi.TinyFaceDetectorOptions({
//               inputSize: 320,
//               scoreThreshold: 0.5,
//             })
//           )
//           .withFaceLandmarks(true);

//         console.log(results);

//         const out = faceapi.createCanvasFromMedia(img);
//         faceapi.draw.drawDetections(
//           out,
//           results.map((result) => result.detection)
//         );
//         faceapi.draw.drawFaceLandmarks(
//           out,
//           results.map((result) => result.landmarks),
//           { drawLines: true, color: "red" }
//         );

//         const baseDir = path.resolve(__dirname, "./out");

//         if (!fs.existsSync(baseDir)) {
//           fs.mkdirSync(baseDir);
//         }
//         // this is ok for prototyping but using sync methods
//         // is bad practice in NodeJS
//         fs.writeFileSync(
//           path.resolve(baseDir, "test.png"),
//           out.toBuffer("image/png")
//         );
//       } catch (error) {
//         console.error(error);
//       }
//     },
//     (reason) => {
//       console.log("Not loaded!");
//       console.error(reason);
//     }
//   )
//   .catch((err) => {
//     console.error(err);
//   });

function analyzeData() {}

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
