try {
  // TODO: connection between content script and background script
  // TODO: handle disconnection

  const VALIDATE_BROWSER_MSG = "CHECK_BROWSER";
  const ILLEGAL_STATE = "ILLEGAL";

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.message) {
      case VALIDATE_BROWSER_MSG:
        const queryOptions = { populate: true };
        chrome.windows.getAll(queryOptions, (windows) => {
          if (windows.length > 1 || windows[0].tabs.length > 1) {
            sendResponse({ message: ILLEGAL_STATE });
          }
        });
        break;

      default:
        break;
    }

    return true;
  });

  chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((message) => {
      switch (message) {
        case VALIDATE_BROWSER_MSG:
          const queryOptions = { populate: true };

          chrome.windows.getAll(queryOptions, (windows) => {
            if (windows.length > 1) {
              port.postMessage(ILLEGAL_STATE);
            } else if (windows[0].tabs.length > 1) {
              port.postMessage(ILLEGAL_STATE);
            }
          });
          break;
        default:
          break;
      }
    });
  });
} catch (error) {
  console.error(error);
}
