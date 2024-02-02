# ZotMeal

# About

ZotMeal is a cross-platform React Native Expo application.
A summary of the libraries we use are listed below.

## Technology

### Web/Mobile Application

- [Expo](https://expo.dev) - Universal framework for React Native.
- [NativeWind](https://www.nativewind.dev) - TailwindCSS for React Native.
- [Serverless Framework](https://www.serverless.com/) - Framework for cloud resources such as AWS Lambda.
- [tRPC](https://trpc.io/) - Typesafe RPCs.

# Getting Started

## Pre-requisites

1. Install `Node.js`. This allows you to run JavaScript on your computer (outside of a browser).
   This is best done with a version manager that allows you to easily switch between
   Node.js versions based on the requirements of different projects.
   Try using any of the following.

   - [nvm](https://github.com/nvm-sh/nvm) - Node-Version-Manager.
   - [fnm](https://github.com/Schniz/fnm) - Fast-Node-Manager.
   - [nvm-widows](https://github.com/coreybutler/nvm-windows)

   If none of those work for any reason, you can defer to your Operating System's
   package manager or [the downloads from the official website](https://nodejs.org/en/download).
   We will be using the latest LTS version, 20.10.0, lts/iron.

2. Install `pnpm`. This is our package manager of choice for this project.
   It's responsible for installing, uninstalling, and keeping track of the app's dependencies.
   `npm install --global pnpm`

## Developing

1. Clone the ZotMeal repository or your fork.
   `git clone https://github.com/icssc/ZotMeal.git`

2. Navigate to the root directory and install the dependencies.
   `cd ZotMeal && pnpm install`

3. Start the local development servers for expo and server.
   `pnpm dev`
   The tRPC procedures are available on http://localhost:3000/<router.procedure\>?input={field: value}

4. Change your node version to the one specified in .nvmrc
   `nvm use`

5. View the local website at http://localhost:19006 and/or with the [Expo Go mobile app](https://expo.dev/client).
   As you make changes to the Expo application, those changes will be automatically
   reflected on the local website as well as the mobile app.
