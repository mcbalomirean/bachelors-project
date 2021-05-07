const fs = require("fs/promises");

const tf = require("@tensorflow/tfjs-node");
const Human = require("@vladmandic/human").default;
const { humanConfig } = require("../data/constants");

const human = new Human(humanConfig);

// TODO: remove legacy code
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

async function analyzeData(path) {
  if (!path || typeof path !== "string") {
    throw new Error("Path is invalid!");
  }

  // TODO: handle rejection?
  let buffer;
  try {
    buffer = await fs.readFile(path);
  } catch (error) {
    throw error;
  }

  const tensor = tf.tidy(() => {
    const decode = tf.node.decodeImage(buffer, 3);

    let expand;
    if (decode.shape[2] === 4) {
      const channels = human.tf.split(decode, 4, 2);
      const rgb = human.tf.stack([channels[0], channels[1], channels[2]], 2);
      expand = human.tf.reshape(rgb, [1, decode.shape[0], decode.shape[1], 3]);
    } else {
      expand = human.tf.expandDims(decode, 0);
    }

    const cast = human.tf.cast(expand, "float32");
    return cast;
  });

  let result;
  try {
    result = await human.detect(tensor);
  } catch (error) {
    console.error(error);
  }

  console.log(result);
}

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
    try {
      await fs.mkdir(sessionPath);
    } catch (error) {
      if (error && error.code != "EEXIST") {
        console.log(error);
      }
    }

    try {
      await frame.mv(uploadPath);
    } catch (error) {
      console.log(error);
      return res.status(500).send();
    }

    res.status(200).send();
  }

  analyzeData(uploadPath);
};
