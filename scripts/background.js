chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
      chrome.tabs.create({ url: "landing.html" });
    }
  
    initializeDynamicRules();
  });
  
  function initializeDynamicRules() {
    chrome.storage.sync.get('whitelist', function (data) {
      const whitelist = data.whitelist || [];
  
      // Convert whitelist domains to Punycode if necessary
      const punycodeWhitelist = whitelist.map(domain => {
        try {
          if (domain.startsWith('http://') || domain.startsWith('https://')) {
            return new URL(domain).hostname;
          }
          else {
            return new URL(`http://${domain}`).hostname;
          }
        } catch (e) {
          console.error("Invalid domain:", domain);
          return domain;
        }
      });
      console.log("Whitelist in Punycode:", punycodeWhitelist);
  
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1],
        addRules: generateRules(punycodeWhitelist)
      }, function () {
        if (chrome.runtime.lastError) {
            console.error("Error: ", chrome.runtime.lastError.message || chrome.runtime.lastError);
          } else {
            console.log("Rules successfully updated.");
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
          regexFilter: "://xn--|\\.xn--",
          excludedRequestDomains: whitelist,
          resourceTypes: ["main_frame"]
        }
      };

      return [rule];
  }

  
  chrome.storage.onChanged.addListener(function (changes, area) {
    console.log("Storage changed:", changes, area);
    if (area === 'sync' && changes.whitelist) {
      initializeDynamicRules();
    }
  });
  