try {
  const popupData = {
    focused: true,
    height: 800,
    width: 400,
    // type: "popup",
    url: "/html/popup.html",
  };

  chrome.runtime.onInstalled.addListener(() => {
    try {
      chrome.windows.create(popupData);
    } catch (error) {
      console.log(error);
    }
  });

  // TODO: connection between content script and background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(
      sender.tab
        ? "from a content script:" + sender.tab.url
        : "from the extension"
    );
    if (request.greeting == "hello") sendResponse({ greeting: "hello" });
  });
} catch (error) {
  console.err(error);
}
