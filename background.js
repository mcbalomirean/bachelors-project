try {
  const popupData = {
    focused: true,
    height: 800,
    width: 400,
    type: "popup",
    url: "/html/popup.html",
  };

  const portOptions = { name: "video" };

  chrome.runtime.onInstalled.addListener(() => {
    try {
      chrome.windows.create(popupData);
    } catch (error) {
      console.log(error);
    }
  });

  // TODO: connection between content script and background script
  chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((msg) => {
      console.log(msg);
      port.postMessage("Goodbye");
      port.disconnect();
    });
  });
} catch (error) {
  console.error(error);
}
