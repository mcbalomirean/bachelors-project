const API_URL = "http://localhost:3001/monitoring";
const MESSAGES = {
  CHECK_BROWSER: "CHECK_BROWSER",
};
const MONITOR_STATES = {
  READY: "READY",
  WORKING: "WORKING",
};
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
      await asyncStorageSet({ monitorState: MONITOR_STATES.READY });
    case MONITOR_STATES.READY:
      // TODO: throws, validations
      userName = getUserName();
      quizId = getQuizId();

      if (
        !isUserNameValid() ||
        !(await isQuizActive()) ||
        !(await isOnlyTab())
      ) {
        return;
      }

      await asyncStorageSet({
        monitorState: MONITOR_STATES.WORKING,
        userName: userName,
        quizId: quizId,
      });
    case MONITOR_STATES.WORKING:
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

function isUserNameValid() {
  if (!userName || userName === "Log in" || userName === "Autentificare") {
    window.alert(
      "You need to log in before the Student Monitor extension can initialize!"
    );
    return false;
  }

  return true;
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
    window.alert("This quiz is not active.");
    return false;
  }

  return true;
}

async function isOnlyTab() {
  let ok = (await asyncSendMessage(MESSAGES.CHECK_BROWSER)).ok;

  if (!ok) {
    window.alert("Too many windows or tabs open. Reload page after fixing.");
    return false;
  }

  return true;
}

// TODO: userName change notification to server

async function validateParameters() {
  if (userName != getUserName() || quizId != getQuizId()) {
    await asyncStorageSet({ monitorState: MONITOR_STATES.READY });
    await asyncStorageRemove(["userName", "quizId"]);
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
  document.addEventListener("mouseleave", (event) => {
    if (!event.relatedTarget && !event.toElement) {
      sendEvent("Mouse cursor has left the page.");
    }
  });
}

async function sendEvent(event) {
  let data = new FormData();
  data.append("name", userName);
  data.append("id", quizId);
  data.append("misc", event);

  let response = await fetch(`${API_URL}/`, {
    method: "POST",
    body: data,
  });

  if (!response.ok && response.status != 200) {
    await asyncStorageSet({ monitorState: MONITOR_STATES.READY });
    await asyncStorageRemove(["userName", "quizId"]);
  }
}

async function monitor() {
  let videoTrack = await getVideoTrack();
  let imageCapture = new ImageCapture(videoTrack);

  interval = setInterval(async () => {
    let monitorState = (await asyncStorageGet({ monitorState: null }))
      .monitorState;
    if (monitorState != MONITOR_STATES.WORKING) {
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

    if (!response.ok && response.status != 200) {
      await asyncStorageSet({ monitorState: MONITOR_STATES.READY });
      await asyncStorageRemove(["userName", "quizId"]);
    }
  }, 1000);
}

function asyncSendMessage(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }

      resolve(response);
    });
  });
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

function asyncStorageRemove(keys) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove(keys, () => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }

      resolve();
    });
  });
}
