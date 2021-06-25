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
      await asyncStorageSet({ monitorState: "READY" });
    case "READY":
      // TODO: throws, validations
      userName = getUserName();
      validateUserName(userName);

      quizId = getQuizId();
      if (!(await isQuizActive())) {
        return;
      }

      await asyncStorageSet({
        monitorState: "WORKING",
        userName: userName,
        quizId: quizId,
      });
    case "WORKING":
      if (!userName || !quizId) {
        let values = await asyncStorageGet(["userName", "quizId"]);
        userName = values.userName;
        quizId = values.quizId;

        await validateParameters();
      }

      preventCopying();
      monitor();
      break;

    default:
      break;
  }
}

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

// TODO: check if parameter
function getQuizId() {
  // TODO: validate
  return new URLSearchParams(window.location.search).get("id");
}

async function isQuizActive() {
  let response = await fetch(`${API_URL}/quiz/${quizId}`, {
    method: "GET",
  });

  if (response.status == STATUSES.STATUS_NOT_FOUND) {
    console.log("Quiz not found.");
    return null;
  } else {
    response = await response.json();
  }

  if (!response) {
    console.log("Quiz inactive.");
    return false;
  }

  return true;
}

// TODO: userName change notification to server

async function validateParameters() {
  if (userName != getUserName() || quizId != getQuizId()) {
    asyncStorageSet({ monitorState: "READY" });
    location.reload();
  }
}

// TODO: handle lack of tracks!

async function getVideoTrack() {
  try {
    let constraints = {
      audio: false,
      video: true,
    };

    let stream = await navigator.mediaDevices.getUserMedia(constraints);
    let videoTrack = stream.getVideoTracks()[0];

    return videoTrack;
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
  let videoTrack = await getVideoTrack();
  let imageCapture = new ImageCapture(videoTrack);

  interval = setInterval(async () => {
    let monitorState = (await asyncStorageGet({ monitorState: null }))
      .monitorState;
    if (monitorState != "WORKING") {
      clearInterval(interval);
    }

    let frame = await imageCapture.takePhoto();

    let data = new FormData();
    data.append("name", userName);
    data.append("id", quizId);
    data.append("frame", frame);

    let response = await fetch(`${API_URL}/`, {
      method: "POST",
      body: data,
    });

    if (response.ok && response.status == 200) {
      console.log("Frame sent.");
    } else {
      console.log(response.ok, response.status);
      await asyncStorageSet({ monitorState: "READY" });
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
