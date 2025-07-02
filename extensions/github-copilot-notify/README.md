# GitHub Copilot Notify

This extension shows a native system notification when a Copilot Chat participant finishes responding or when manual interaction is required. It wraps the chat participant creation API to display messages using the operating system's notification center via the [`node-notifier`](https://www.npmjs.com/package/node-notifier) package.

## Building

1. Install dependencies with `npm install`.
2. Run `npm run compile` to generate the compiled extension in the `dist` folder.

The extension is OS agnostic and works on macOS and Windows.
