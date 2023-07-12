/*
A Chrome (and Firefox eventually) extension that hides the cursor.
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
import { isHidden, toggleHidden } from "./background.js";
function setUI(hidden) {
    // change the image out
    const buttonImg = document.getElementById("buttonimg");
    if (hidden) {
        buttonImg.src = "images/hidden.svg";
        buttonImg.alt = "Mouse cursor hidden"
        buttonImg.title = "Mouse cursor hidden";
    }
    else {
        buttonImg.src = "images/cursor.svg";
        buttonImg.alt = "Mouse cursor shown";
        buttonImg.title = "Mouse cursor shown";
    }
}

async function init() {
    // initialize icon to be correct
    // and add click listeners
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: isHidden,
    },
        (injectionResults) => {
            const hidden = injectionResults[0].result; // we only care about the first one
            setUI(hidden);
        });
    const hide = document.getElementById("hide");
    hide.addEventListener("click", async () => {
        // listen for the button press, and then toggle the cursor
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: isHidden,
        },
            (injectionResults) => {
                const hidden = injectionResults[0].result; // we only care about the first one
                setUI(!hidden); // This is notted because we're about to change what isHidden would return (we update the UI before the change takes place).
                const cssLink = chrome.runtime.getURL("hidecursor.css");
                chrome.scripting.executeScript({
                    target: { tabId: tab.id, allFrames: true },
                    func: toggleHidden,
                    args: [hidden, cssLink]
                })
            });
    });
}
init();