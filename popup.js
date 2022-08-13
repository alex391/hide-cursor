let hidden = false;
hide.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let css = "";
    if (hidden) {
        css = "* {cursor: auto !important}";
        hidden = false
    }
    else {
        css = "* {cursor: none !important}";
        hidden = true;
    }
    chrome.scripting.insertCSS({
      target: { tabId: tab.id, allFrames: true },
      css: css,
    });
});