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
"use strict";
function isHidden(){
    // We need a way to tell if we've already hidden the cursor in the tab.
    // We do this by assuming that no one is dumb enough to hide the cursor in the "html" element, except for us.
    // (if they are, then it'll work the second time and that's good enough)
    // There's probably better ways to do this, but this works.
    return (getComputedStyle(document.getElementsByTagName("html")[0]).cursor == "none")? true : false; 
}
async function init(){
    //initialize icon to be correct
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: isHidden,
    },
    (injectionResults) => {
        let hidden = injectionResults[0].result; // we only care about the first one
        if (!hidden) {
            document.getElementById("buttonimg").src = "images/cursor.svg";
            document.getElementById("buttonimg").alt = "Mouse cursor shown";
            document.getElementById("buttonimg").title = "Mouse cursor shown";
        }
        else {
            document.getElementById("buttonimg").src = "images/hidden.svg";
            document.getElementById("buttonimg").alt = "Mouse cursor hidden"
            document.getElementById("buttonimg").title = "Mouse cursor hidden";
        }
    });
}
init();
hide.addEventListener("click", async () => {
    // listen for the button press, and then toggle the cursor
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: {tabId: tab.id },
        func: isHidden,
    },
    (injectionResults) => {
        let hidden = injectionResults[0].result; // we only care about the first one
        let css = "";
        if (hidden) {
            css = "* {cursor: auto !important}";
            document.getElementById("buttonimg").src = "images/cursor.svg";
            document.getElementById("buttonimg").alt = "Mouse cursor shown";
            document.getElementById("buttonimg").title = "Mouse cursor shown";
        }
        else {
            css = "* {cursor: none !important}";
            document.getElementById("buttonimg").src = "images/hidden.svg";
            document.getElementById("buttonimg").alt = "Mouse cursor hidden"
            document.getElementById("buttonimg").title = "Mouse cursor hidden";
        }
        chrome.scripting.insertCSS({
            target: { tabId: tab.id, allFrames: true },
            css: css,
        });
    });
    
});

