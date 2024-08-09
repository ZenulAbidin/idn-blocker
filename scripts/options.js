document.addEventListener('DOMContentLoaded', function () {
    const whitelistTextarea = document.getElementById('whitelist');
    const saveButton = document.getElementById('save');
  
    // Load the whitelist from storage
    chrome.storage.sync.get('whitelist', function (data) {
      if (data.whitelist) {
        whitelistTextarea.value = data.whitelist.join('\n');
      }
    });
  
    // Save the whitelist to storage
    saveButton.addEventListener('click', function () {
      const whitelist = whitelistTextarea.value.split('\n').map(line => line.trim()).filter(line => line);
      chrome.storage.sync.set({ whitelist: whitelist }, function () {
        alert('Changes saved!');
      });
    });
  });
  