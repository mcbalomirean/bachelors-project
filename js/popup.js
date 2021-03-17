let videoElement;

const constraints = {
  audio: false,
  video: true,
};

// TODO: export to constants file?
const portOptions = { name: "video" };

const port = chrome.runtime.connect(portOptions);

// TODO: handle lack of permissions
// TODO: grab all tracks, let user choose?
// TODO: cry when user closes window :(

const getMediaStream = async () => {
  try {
    let stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
  } catch (error) {
    console.error(error);
  }
};

port.postMessage("Hello");
port.onMessage.addListener((msg) => {
  console.log(msg);
  port.disconnect();
});

window.addEventListener("DOMContentLoaded", (event) => {
  video = document.querySelector("video");

  getMediaStream();
});
