let hidden = false;
hide.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let css = "";
    if (hidden) {
        css = "* {cursor: auto !important}";
        document.getElementById("buttonimg").src = "images/cursor.svg";
        document.getElementById("buttonimg").alt = "Mouse cursor shown";
        document.getElementById("buttonimg").title = "Mouse cursor shown";
        hidden = false;
    }
    else {
        css = "* {cursor: none !important}";
        document.getElementById("buttonimg").src = "images/hidden.svg";
        document.getElementById("buttonimg").alt = "Mouse cursor hidden"
        document.getElementById("buttonimg").title = "Mouse cursor hidden";

        hidden = true;
    }
    chrome.scripting.insertCSS({
      target: { tabId: tab.id, allFrames: true },
      css: css,
    });
});