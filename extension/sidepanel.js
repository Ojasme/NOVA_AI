const setup = document.querySelector("#setup");
const chat = document.querySelector("#chat");

chrome.storage.local.get("novaUrl", ({ novaUrl }) => {
  if (novaUrl) {
    chat.src = novaUrl;
    chat.hidden = false;
  } else {
    setup.hidden = false;
  }
});

document.querySelector("#open-options").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});