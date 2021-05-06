// TODO: export to constants file?
// TODO: unique id?
const API_URL = "http://localhost:3001";
const STATUS_OK = 200;

const VALIDATE_BROWSER_MSG = "CHECK_BROWSER";
const WORKING_STATE = "WORKING";
const ILLEGAL_STATE = "ILLEGAL";

let scriptState = WORKING_STATE;
let interval;

const portOptions = { name: "bg" };
const port = chrome.runtime.connect(portOptions);

// TODO: get id?
const getUserName = () => {
  let a = document.querySelector(
    "#page-footer > div > div.logininfo > a:nth-child(1)"
  );

  return a ? a.innerHTML : null;
};

// TODO: grab all tracks, let user choose?
// TODO: cry when user closes window :(
// TODO: handle lack of tracks!

const getMediaTracks = async () => {
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
};

const preventCopying = () => {
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
};

const validateBrowser = () => {
  port.postMessage(VALIDATE_BROWSER_MSG);
};

const validateUserName = (userName) => {
  if (!userName || userName === "Log in") {
    window.alert(
      "You need to log in before the Student Failer extension can work!"
    );
    throw new Error("Student is not logged in.");
  }
};

// TODO: elaborate state
const validateScriptState = () => {
  if (scriptState === ILLEGAL_STATE) {
    // TODO: separate?
    clearInterval(interval);

    throw new Error(
      "Student Failer is in an illegal state. Reload page after fixing."
    );
  }
};

const beginMonitoring = async () => {
  validateBrowser();

  let userName = getUserName();
  validateUserName(userName);

  let [videoTrack, audioTrack] = await getMediaTracks();

  let imageCapture = new ImageCapture(videoTrack);

  interval = setInterval(async () => {
    // TODO: move validation? fix?
    // TODO: works but need to validate browser too
    validateScriptState();

    let data = new FormData();
    let frame = await imageCapture.takePhoto();
    data.append("name", userName);
    data.append("frame", frame);

    let response = await fetch(`${API_URL}/monitoring`, {
      method: "POST",
      body: data,
    });

    if (response.status == STATUS_OK) {
      console.log("Frame sent.");
    }
  }, 1000);
};

// TODO: add onDisconnect?
port.onMessage.addListener((message) => {
  switch (message) {
    case ILLEGAL_STATE:
      scriptState = ILLEGAL_STATE;
      break;

    default:
      break;
  }
});

preventCopying();
beginMonitoring();
