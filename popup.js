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
    // mostly just a check for undefined
    if (window.cursorHidden === undefined){ 
        //the website is in it's default state - the cursor hasn't been hidden by us yet
        return false;
    }
    else {
        // it has been hidden by us, so just return the value.
        return window.cursorHidden;
    }
}
function toggleHidden(hidden){
    //Set the variable to keep track of the state on that window
    //TODO: might as well also actually do the cursor hiding here too
    if(hidden){
        window.cursorHidden= false; // can't just not it because it might not exist.
    }
    else {
        window.cursorHidden = true;
    }
}
function setUI(hidden) {
    //change the image out
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
//TODO: function setCSS(hidden){} to change the css to the right value
async function init(){
    //initialize icon to be correct
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: isHidden,
    },
    (injectionResults) => {
        const hidden = injectionResults[0].result; // we only care about the first one
        setUI(hidden);
    });
    hide.addEventListener("click", async () => {
        // listen for the button press, and then toggle the cursor
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.scripting.executeScript({
            target: {tabId: tab.id },
            func: isHidden,
        },
        (injectionResults) => {
            const hidden = injectionResults[0].result; // we only care about the first one
            let css = "";
            setUI(!hidden); // This is notted because we're about to change what isHidden would return (we update the UI before the change takes place).
            if (hidden) {
                css = "* {cursor: auto !important}";
            }
            else {
                css = "* {cursor: none !important}";
            }
            chrome.scripting.insertCSS({
                target: { tabId: tab.id, allFrames: true }, //TODO: inject a link tag rather than injecting css this way https://stackoverflow.com/a/19127555
                css: css,
            });
            chrome.scripting.executeScript({
                target: {tabId: tab.id },
                func: toggleHidden,
                args: [hidden]
            })
        });
        
        
    });
}
init();