/*
A chrome (and Firefox eventually) extension that hides the cursor.
Copyright (C) 2022  Alex Leute

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
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