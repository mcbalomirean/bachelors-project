const fs = require("fs/promises");

const { Quiz, Session, FlaggedData } = require("../models/database");
const { SESSIONS_PATH, enums } = require("../data/constants");

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
    buffer = await fs.readFile(`${SESSIONS_PATH}/${path}`);
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

  return result.persons;
}

// TODO: return flagged data? no real reason...
async function validateFrame(session, personsDetected, path) {
  try {
    // TODO: recognize face
    if (personsDetected.length !== 1) {
      let reason = `${personsDetected.length} faces detected.`;
      // TODO: weird way of getting enums...
      await flagData(session, enums.DATA_TYPES[0], path, reason);
      return;
    }

    faceGestures = personsDetected[0].gestures
      .filter((gesture) => {
        return gesture.hasOwnProperty("face");
      })
      .map((element) => {
        return element.gesture;
      });

    // TODO: normalize string? eh...
    if (!faceGestures.includes("facing center")) {
      let reason = "Not facing center.";
      await flagData(session, enums.DATA_TYPES[0], path, reason);
      return;
    }

    for (const gesture of faceGestures) {
      if (
        gesture.startsWith("mouth") &&
        parseInt(gesture.match(/\d+/)[0]) > 10
      ) {
        let reason = "Mouth open.";
        await flagData(session, enums.DATA_TYPES[0], path, reason);
        return;
      }
    }

    irisGestures = personsDetected[0].gestures
      .filter((gesture) => {
        return gesture.hasOwnProperty("iris");
      })
      .map((element) => {
        return element.gesture;
      });

    // TODO: test
    if (
      !irisGestures.includes("facing center") &&
      !irisGestures.includes("looking center")
    ) {
      let reason = "Not looking towards screen/camera.";
      await flagData(session, enums.DATA_TYPES[0], path, reason);
      return;
    }
  } catch (error) {
    console.log(error);
  }
}

async function flagData(session, type, path, reason) {
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
    result = await session.createFlaggedDatum({
      type: type,
      path: path ?? "",
      reason: reason ?? "",
    });
  } catch (error) {
    console.error(error);
  }

  return result;
}

async function isQuizActive(id) {
  try {
    let quiz = await Quiz.findByPk(id, {
      attributes: ["isActive"],
    });

    if (quiz) {
      return quiz.isActive;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports.checkQuiz = async (req, res) => {
  try {
    let quizActive = await isQuizActive(req.params.id);

    if (quizActive === null) {
      res.status(404).send("Quiz not found.");
    } else {
      res.status(200).send(quizActive);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

// TODO: validate, verify files
module.exports.receiveData = async (req, res) => {
  let name = req.body.name;
  let id = req.body.id;
  let frame = req.files.frame;

  let quizActive = await isQuizActive(id);

  if (quizActive === null) {
    return res.status(404).send({ message: "Quiz not found." });
  } else if (quizActive === false) {
    return res.status(406).send({ message: "Quiz not active" });
  }

  let [session, wasCreated] = await Session.findOrCreate({
    where: { StudentName: name, QuizId: id },
  });

  let sessionPath = `${SESSIONS_PATH}/${name}`;

  let uploadDate = new Date().getTime();
  let uploadPath = `${sessionPath}/${uploadDate}.png`;

  let storagePath = `${name}/${uploadDate}.png`;

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
    const personsDetected = await analyzeFrame(storagePath);
    validateFrame(session, personsDetected, storagePath);

    // TODO: move with detailed response?
    res.status(200).send();
  }
};
