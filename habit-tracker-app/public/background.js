// This is the background script for the Habitlio Chrome Extension.
// It can be used to listen for events, manage state, or perform tasks that need to run in the background.

console.log("Habitlio background script loaded.");
// Open up side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  if (!tab?.id) return;
  chrome.sidePanel.open({ tabId: tab.id });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "notify") {
    if (message.reason === "habitCreation") {
      // Show a notification when a habit is created successfully
      const chosenTitle = ["Congratulations🔥", "What a Beast🤩🤩", "Congrats😎"];
      chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.runtime.getURL("icons/Habitlio-Icon128.png"),
        title: chosenTitle[Math.floor(Math.random() * chosenTitle.length)],
        message: message.message
      });
    }
    return true;
  }

  sendResponse({ error: "Unknown type", got: message });
  return false;
});