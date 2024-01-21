# Development Guide

## Preparing Environment

### Node.js

`Node.js` is a JavaScript runtime and is used for building applications. In the context of FiveM it is necessary to bundle resources into a single package that can be ran on both the server and client.

- [Download](https://nodejs.org/en) and install the LTS version of Node.js
- Once installed you can open a command-line terminal (e.g. `Terminal` or `Command Prompt`) and enter `node --version` to confirm the expected version has been installed correctly

### pnpm

pnpm
`pnpm` is a fast and disk-space-efficient package manager, serving as an alternative to `npm` and `yarn`.

- Ensure you have installed `Node.js` properly (see [section above](#nodejs))
- Open a command-line terminal (e.g. `Terminal` or `Command Prompt`)
- Enter `npm install -g pnpm` to globally install the pnpm package to your environment

### Installing Package Dependencies

With both [Node.js](#nodejs) and [pnpm](#pnpm) installed you can move on to installing the dependencies for ht_mlotool.

- Open a command-line terminal (e.g. `Terminal` or `Command Prompt`)
- Navigate to the `ht_mlotool/web` folder in your command-line terminal
- Enter `pnpm i` to install the dependencies for the project

## Development

### Making UI Changes

#### Before Starting

If you want to make UI changes first make sure that you are working off of a Fork of the repository or download a [source version](https://github.com/Hedgehog-Technologies/ht_mlotool/archive/refs/heads/main.zip) of the code.

This resource utilizes [Mantine v5](https://v5.mantine.dev/) as its UI component library, please familiarize yourself with it before diving into any UI edits.

#### Style Changes

Style changes can be made in any number of places, however the three main locations are as follows:

- [ht_mlotool/web/src/index.css](../web/src/index.css)
- [ht_mlotool/web/src/App.tsx:useStyles](../web/src/App.tsx#L13)
- In-line with the given element that you want to edit the style of
   - See Mantine's [Style documentation](https://v5.mantine.dev/styles/sx/) for more information

### Testing UI Changes

#### Testing in Browser

- Open a command-line terminal (e.g. `Terminal` or `Command Prompt`)
- Navigate to the `ht_mlotool/web` folder in your command-line terminal
- Enter `pnpm start` to start up a locally-accessible web server that can used to iterate quickly on UI changes

#### Testing in Game

- Open a command-line terminal (e.g. `Terminal` or `Command Prompt`)
- Navigate to the `ht_mlotool/web` folder in your command-line terminal
- Enter `pnpm start:game` to start up a service that will actively rebuild the package whenever changes are detected
- Ensure the resource in-game to pick up the updated package
