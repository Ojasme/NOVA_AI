const form = document.querySelector("#settings-form");
const urlInput = document.querySelector("#nova-url");
const status = document.querySelector("#status");

chrome.storage.local.get("novaUrl", ({ novaUrl }) => {
  if (novaUrl) urlInput.value = novaUrl;
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  status.textContent = "";

  let url;
  try {
    url = new URL(urlInput.value.trim());
  } catch {
    status.textContent = "Enter a valid app URL.";
    return;
  }

  const isLocalhost = ["localhost", "127.0.0.1"].includes(url.hostname);
  if (url.protocol !== "https:" && !(isLocalhost && url.protocol === "http:")) {
    status.textContent = "Use HTTPS, or HTTP for localhost during development.";
    return;
  }

  url.hash = "";
  url.search = "";
  urlInput.value = url.href.replace(/\/$/, "");
  await chrome.storage.local.set({ novaUrl: urlInput.value });
  status.textContent = "Saved. Reopen the Nova side panel to load your chat.";
});