chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
      chrome.tabs.create({ url: "landing.html" });
    }
  
    initializeDynamicRules();
  });
  
  function initializeDynamicRules() {
    chrome.storage.sync.get('whitelist', function (data) {
      const whitelist = data.whitelist || [];
  
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1],
        addRules: generateRules(whitelist)
      }, function () {
        if (chrome.runtime.lastError) {
            console.error("Error: ", chrome.runtime.lastError.message || chrome.runtime.lastError);
          }
      });
    });
  }
  
  function generateRules(whitelist) {
    const rule = {
      id: 1,
      priority: 1,
      action: { type: "block" },
      condition: {
        regexFilter: "[^\\x00-\\x7F]",
        excludedDomains: whitelist,
        resourceTypes: ["main_frame"]
      }
    };
  
    return [rule];
  }
  
  chrome.storage.onChanged.addListener(function (changes, area) {
    if (area === 'sync' && changes.whitelist) {
      initializeDynamicRules();
    }
  });
  