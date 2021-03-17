let videoElement;

const constraints = {
  audio: false,
  video: true,
};

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

chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {
  console.log(response.greeting);
});

window.addEventListener("DOMContentLoaded", (event) => {
  video = document.querySelector("video");

  getMediaStream();
});
