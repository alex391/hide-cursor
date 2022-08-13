// TODO: fix the link to the github, and the gnome project
hide.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: hideCursor,
    });
});

function hideCursor(){
    console.log("hiding");
    let elements = document.getElementsByTagName("*");
    for(let i = 0; i < elements.length; i++){
        if (elements[i].style.cursor == "none"){
            elements[i].style.cursor = "auto";
        }
        else{
            elements[i].style.cursor = "none";
        }
    }
}
