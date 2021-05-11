const fs = require("fs/promises");

const { FlaggedData } = require("../models/database");
const { enums } = require("../data/constants");

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

async function analyzeFrame(path) {
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

  let result = null;
  try {
    result = await human.detect(tensor);
  } catch (error) {
    console.error(error);
  }

  return result;
}

// TODO: return flagged data? no real reason...
async function validateFrame(analyzedFrame, path) {
  try {
    // TODO: recognize face
    if (analyzedFrame.face.length !== 1) {
      let reason = `${analyzedFrame.face.length} faces detected.`;
      // TODO: weird way of getting enums...
      await flagData(enums.DATA_TYPES[0], path, reason);
      return;
    }

    faceGestures = analyzedFrame.gesture
      .filter((gesture) => {
        return gesture.hasOwnProperty("face");
      })
      .map((element) => {
        return element.gesture;
      });

    // TODO: normalize string? eh...
    if (!faceGestures.includes("facing center")) {
      let reason = "Not facing center.";
      await flagData(enums.DATA_TYPES[0], path, reason);
      return;
      // TODO: mouth open
      // TODO: head turned
    }

    faceGestures.forEach(gesture => {
      if (gesture.startsWith("mouth") && parseInt(gesture.match(/\d+/)[0]) > 10) {
        let reason = "Mouth open.";
        await flagData(enums.DATA_TYPES[0], path, reason);
        return;
      }
    });

    irisGestures = analyzedFrame.gesture
      .filter((gesture) => {
        return gesture.hasOwnProperty("iris");
      })
      .map((element) => {
        return element.gesture;
      });

    // TODO: test
    if (!irisGestures.includes("facing center") && !irisGestures.includes("looking center")) {
      let reason = "Not looking towards screen/camera.";
      await flagData(enums.DATA_TYPES[0], path, reason);
      return;
    }
  } catch (error) {
    console.log(error);
  }
}

async function flagData(type, path, reason) {
  if (!type || typeof type !== "string" || !enums.DATA_TYPES.includes(type)) {
    throw new Error("Type is invalid!");
  }

  if (path && typeof path !== "string") {
    throw new Error("Path is not a string!");
  }

  if (reason && typeof reason !== "string") {
    throw new Error("Reason is not a string!");
  }

  let result = null;
  try {
    result = await FlaggedData.create({
      type: type,
      path: path ?? "",
      reason: reason ?? "",
    });
  } catch (error) {
    console.error(error);
  }

  return result;
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

    // TODO: validate
    const analyzedFrame = await analyzeFrame(uploadPath);
    validateFrame(analyzedFrame, uploadPath);

    // TODO: move with detailed response?
    res.status(200).send();
  }
};
