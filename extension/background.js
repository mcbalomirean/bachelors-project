try {
  const MESSAGES = {
    CHECK_BROWSER: "CHECK_BROWSER",
  };
  const MONITOR_STATES = {
    READY: "READY",
    WORKING: "WORKING",
  };

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message) {
      case MESSAGES.CHECK_BROWSER:
        const queryOptions = { populate: true };
        chrome.windows.getAll(queryOptions, (windows) => {
          if (windows.length > 1 || windows[0].tabs.length > 1) {
            sendResponse({ ok: false });
          } else {
            sendResponse({ ok: true });
          }
        });
        break;
      default:
        sendResponse({ ok: true });
        break;
    }

    return true;
  });

  chrome.tabs.onCreated.addListener(async (tab) => {
    if (
      (await asyncStorageGet({ monitorState: null })).monitorState ==
        MONITOR_STATES.WORKING &&
      (await chrome.tabs.query({ url: "https://online.ase.ro/mod/quiz/*" }))
        .length > 0
    ) {
      sendEvent(
        `Tab created with id ${tab.id} and pending URL ${tab.pendingUrl}.`
      );
    }
  });

  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (
      (await asyncStorageGet({ monitorState: null })).monitorState ==
        MONITOR_STATES.WORKING &&
      (await chrome.tabs.query({ url: "https://online.ase.ro/mod/quiz/*" }))
        .length > 0 &&
      changeInfo.url
    ) {
      sendEvent(`Tab with id ${tabId} has changed URL to ${changeInfo.url}.`);
    }
  });
} catch (error) {
  console.error(error);
}

async function sendEvent(event) {
  const API_URL = "http://localhost:3001/monitoring";

  let values = await asyncStorageGet(["userName", "quizId"]);
  let userName = values.userName;
  let quizId = values.quizId;

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
