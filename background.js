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
// TODO: This code is not DRY. I'm giving up for now because es6 export doesn't work in extensions.
// Maybe jQuery would help here? Just trying to get away with plain JS for this.
function isHidden(){
    // We need a way to tell if we've already hidden the cursor in the tab.
    // Just check if the link tag that we set up earlier is there
    const LINKID = "HideCursorLinkID"; // id for the link
    // It's hidden if the element exists
    return  Boolean(document.getElementById(LINKID));
}
function toggleHidden(hidden, cssLink){
    const LINKID = "HideCursorLinkID"; // id for the link

    // Set the variable to keep track of the state on that window
    if(!hidden){ // if it's not hidden, then hide it
        // Load the css to hide the cursor.
        // https://stackoverflow.com/a/19127555 
        let link = document.createElement("link");
        link.href = cssLink;
        link.id = LINKID;
        link.type = "text/css";
        link.rel = "stylesheet";
        document.getElementsByTagName("head")[0].appendChild(link);
    }
    else {
        // Unload the css
        let css = document.getElementById(LINKID);
        document.getElementsByTagName("head")[0].removeChild(css);
    }
}
chrome.commands.onCommand.addListener(async (command) => {
    if (command === 'toggle-hidden'){
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.scripting.executeScript({
            target: {tabId: tab.id },
            func: isHidden,
        },
        (injectionResults) => {
            const hidden = injectionResults[0].result; // we only care about the first one
            const cssLink = chrome.runtime.getURL("hidecursor.css");
            chrome.scripting.executeScript({
                target: {tabId: tab.id, allFrames: true },
                func: toggleHidden,
                args: [hidden, cssLink]
            })
        });
    }
});