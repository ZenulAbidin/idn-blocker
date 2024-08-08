chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
      chrome.tabs.create({ url: "landing.html" });
    }
  });
  
  chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      const url = new URL(details.url);
      if (/[\u0080-\uFFFF]/.test(url.hostname)) {
        return { cancel: true };
      }
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
  );
  