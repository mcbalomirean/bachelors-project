const API_URL = "http://localhost:3001/monitoring";
const STATUSES = {
  STATUS_OK: 200,
  STATUS_NOT_FOUND: 404,
  STATUS_ERROR: 500,
};

let userName, quizId, interval;

main();

async function main() {
  let monitorState = (await asyncStorageGet({ monitorState: null }))
    .monitorState;

  switch (monitorState) {
    case null:
      // TODO: wrap trycatch
      userName = getUserName();
      validateUserName(userName);

      await asyncStorageSet({ monitorState: "READY", userName: userName });
    case "READY":
      // TODO: throws, validations
      userName = (await asyncStorageGet("userName")).userName;
      quizId = getQuizId();

      // TODO: wrap in trycatch
      let response = await fetch(`${API_URL}/${quizId}`, {
        method: "GET",
      });

      if (response.status == STATUSES.STATUS_NOT_FOUND) {
        console.log("Quiz not found.");
        return;
      } else {
        response = await response.json();
      }

      if (!response) {
        console.log("Quiz inactive.");
        return;
      }

      await asyncStorageSet({ monitorState: "WORKING", quizId: quizId });
    case "WORKING":
      if (!userName || !quizId) {
        let values = await asyncStorageGet(["userName", "quizId"]);
        userName = values.userName;
        quizId = values.quizId;
      }

      preventCopying();
      monitor();
      break;

    default:
      break;
  }
}

// TODO: get id?
function getUserName() {
  let a = document.querySelector(
    "#page-footer > div > div.logininfo > a:nth-child(1)"
  );

  return a ? a.innerHTML : null;
}

function validateUserName(userName) {
  if (!userName || userName === "Log in" || userName === "Autentificare") {
    window.alert(
      "You need to log in before the Student Monitor extension can initialize!"
    );
    throw new Error("Student not logged in.");
  }
}

function getQuizId() {
  // TODO: validate
  return new URLSearchParams(window.location.search).get("id");
}

// TODO: grab all tracks, let user choose?
// TODO: cry when user closes window :(
// TODO: handle lack of tracks!

async function getMediaTracks() {
  try {
    let constraints = {
      audio: true,
      video: true,
    };

    let stream = await navigator.mediaDevices.getUserMedia(constraints);
    let videoTrack = stream.getVideoTracks()[0];
    let audioTrack = stream.getAudioTracks()[0];

    return [videoTrack, audioTrack];
  } catch (error) {
    console.error(error);
  }
}

function preventCopying() {
  document.addEventListener("cut", (event) => {
    event.preventDefault();
  });
  document.addEventListener("copy", (event) => {
    event.preventDefault();
  });
  document.addEventListener("paste", (event) => {
    event.preventDefault();
  });
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });
  // TODO: necessary?
  document.addEventListener("selectstart", (event) => {
    event.preventDefault();
  });
}

async function monitor() {
  let [videoTrack, audioTrack] = await getMediaTracks();
  let imageCapture = new ImageCapture(videoTrack);

  interval = setInterval(async () => {
    let frame = await imageCapture.takePhoto();

    let data = new FormData();
    data.append("name", userName);
    data.append("id", quizId);
    data.append("frame", frame);

    let response = await fetch(`${API_URL}/monitoring`, {
      method: "POST",
      body: data,
    });

    if (response.ok) {
      console.log("Frame sent.");
    }
  }, 1000);
}

// TODO: chrome.runtime.lastError not available
function asyncStorageGet(keys) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(keys, (items) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }

      resolve(items);
    });
  });
}

function asyncStorageSet(keys) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(keys, (items) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }

      resolve(items);
    });
  });
}
