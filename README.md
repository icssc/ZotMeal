# ZotMeal

<pre style="color: green;">
__/\\\\\\\\\\\\\\\______________________________/\\\\____________/\\\\________________________________/\\\\\\____
 _\////////////\\\______________________________\/\\\\\\________/\\\\\\_______________________________\////\\\____
  ___________/\\\/_____________________/\\\______\/\\\//\\\____/\\\//\\\__________________________________\/\\\____
   _________/\\\/_________/\\\\\_____/\\\\\\\\\\\_\/\\\\///\\\/\\\/_\/\\\_____/\\\\\\\\___/\\\\\\\\\_______\/\\\____
    _______/\\\/_________/\\\///\\\__\////\\\////__\/\\\__\///\\\/___\/\\\___/\\\/////\\\_\////////\\\______\/\\\____
     _____/\\\/__________/\\\__\//\\\____\/\\\______\/\\\____\///_____\/\\\__/\\\\\\\\\\\____/\\\\\\\\\\_____\/\\\____
      ___/\\\/___________\//\\\__/\\\_____\/\\\_/\\__\/\\\_____________\/\\\_\//\\///////____/\\\/////\\\_____\/\\\____
       __/\\\\\\\\\\\\\\\__\///\\\\\/______\//\\\\\___\/\\\_____________\/\\\__\//\\\\\\\\\\_\//\\\\\\\\/\\__/\\\\\\\\\_
        _\///////////////_____\/////_________\/////____\///______________\///____\//////////___\////////\//__\/////////__
</pre>

# About

ZotMeal is a cross-platform React Native Expo application.
A summary of the libraries we use are listed below.

## Technology

### Web/Mobile Application

- [Expo](https://expo.dev) - Universal framework for React Native.
- [Tamagui](https://tamagui.dev/) - UI component library for React Native.
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

3. Make sure to have `docker` installed, which will allow you to run the local postgres database
   required for backend functions. You can install it from [the official website here](https://www.docker.com/get-started/).

## Developing

1. Clone the ZotMeal repository or your fork.
   `git clone https://github.com/icssc/ZotMeal.git`

2. Change your node version to the one specified in .nvmrc
   `nvm use`
3. Navigate to the root directory and install the dependencies.
   `cd ZotMeal && pnpm install`

4. To start a local Postgres container database run the `docker compose up` in the root directory.
   This will automatically set up and run a test database using docker.

5. Create a .env based on the example given in `.env.development`

6. Run `pnpm db:push` to push the schema to the docker database.

7. Start the local development servers for expo and server with `pnpm dev`.
   The tRPC procedures are available on <http://localhost:3000/><router.procedure\>?input={field: value}

8. View the local website at <http://localhost:8081> and/or with the [Expo Go mobile app](https://expo.dev/client).
   As you make changes to the Expo application, those changes will be automatically
   reflected on the local website as well as the mobile app.

## Testing

Run `turbo test` at the root of the project.

## Adding Workspaces

To add a new package run `turbo gen workspace` and follow the prompts
