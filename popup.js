let hidden = false;
hide.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let css = "";
    if (hidden) {
        css = "* {cursor: auto}";
        hidden = false
    }
    else {
        css = "* {cursor: none}"
        hidden = true;
    }
    chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      css: css,
    });
});