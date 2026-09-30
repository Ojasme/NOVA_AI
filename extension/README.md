# Nova AI Chrome Extension

The extension opens the existing hosted Nova app in Chrome's side panel. Chat requests still go to
the app's server, so `GEMINI_API_KEY` stays on the server and must not be added to this folder.

## Develop locally

1. Start the app with `NITRO_PRESET=node-server` and `GEMINI_API_KEY` configured.
2. Open `chrome://extensions` in Chrome and enable **Developer mode**.
3. Choose **Load unpacked** and select this `extension` folder.
4. Open the extension's **Details** page, then **Extension options**. Set the app URL to
   `http://localhost:8080`.
5. Pin Nova from Chrome's Extensions menu and click its toolbar icon to open the side panel.

## Deploy the app to Vercel

1. Push this repository to GitHub and import it in Vercel.
2. Use the default install command and set the build command to `npm run build`.
3. In Vercel project settings, add `NITRO_PRESET=vercel` and `GEMINI_API_KEY` for Production (and
   Preview if needed), then redeploy. Do not use a `VITE_` prefix for the key.
4. Copy the deployed HTTPS URL and enter it in the extension's options page.

The root `vercel.json` permits Chrome extension pages to frame the app. Once the extension has a
Chrome Web Store ID, tighten its `frame-ancestors` value from `chrome-extension:` to the exact
origin, for example `chrome-extension://abcdefghijklmnopabcdefghijklmnop`, and redeploy. This
keeps unrelated extensions from embedding the app.

## Publish to the Chrome Web Store

1. Load the unpacked extension and confirm the deployed chat works in the side panel.
2. Create a ZIP containing the files inside this folder (the `manifest.json` must be at the ZIP
   root): `cd extension && zip -r ../nova-ai-extension.zip .`.
3. Register for a Chrome Web Store developer account, create a new item, upload the ZIP, and save
   it as a draft to obtain its extension ID.
4. Replace the broad `chrome-extension:` source in `vercel.json` with that exact extension origin,
   redeploy the app, then test the draft extension again.
5. Complete the store listing, privacy disclosures, screenshots, and review submission in the
   Chrome Web Store Developer Dashboard.

Store registration and review require your Google account; they cannot be completed from this
repository. The extension package itself does not contain a Gemini key or call Gemini directly.