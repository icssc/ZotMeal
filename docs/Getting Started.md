### Pre-requisites

1. Install `Node.js`. This allows you to run JavaScript on your computer (outside of a browser).
   This is best done with a version manager that allows you to easily switch between
   Node.js versions based on the requirements of different projects.
   Try using any of the following.

   - [nvm](https://github.com/nvm-sh/nvm) - Node-Version-Manager.
   - [fnm](https://github.com/Schniz/fnm) - Fast-Node-Manager.
   - [nvm-widows](https://github.com/coreybutler/nvm-windows) - For Windows machines

   If none of those work for any reason, you can defer to your Operating System's
   package manager or [the downloads from the official website](https://nodejs.org/en/download).
   We will be using the latest LTS version of Node.

2. Install `pnpm`. This is our package manager of choice for this project.
   It's responsible for installing, uninstalling, and keeping track of the app's dependencies.
   `npm install --global pnpm`

3. Make sure to have `docker` installed, which can be installed from [the official website](https://www.docker.com/get-started/). It will allow you to
   - Run the local postgres database required for backend functions
   - Run backend tests that rely on test containers

### Developing

1. Clone the ZotMeal repository or your fork.
   `git clone https://github.com/icssc/ZotMeal.git`

3. Change your node version to the one specified in the .nvmrc
   `nvm use` or `fnm use`
   
5. Navigate to the root directory and install the dependencies.
   `cd ZotMeal && pnpm install`

6. To start a local Postgres container database run the `docker compose up` in the root directory.
   This will automatically set up and run a test database using docker.

7. Create a .env based on the example given in `.env.development`

8. Run `pnpm db:push` to push the schema to the docker database.

9. Start local development by running `pnpm dev:next` in the root directory.
   The tRPC procedures are available on <http://localhost:3000/><router.procedure\>?input={field: value}
   (e.g. http://localhost:3000/events.get/)


10. View the local website at <http://localhost:8080>.
   As you make changes to the Expo application, those changes will be automatically
   reflected on the local website as well as the mobile app.

### Troubleshooting

Sometimes, you may run into errors when trying to run some of the commands listed above. Here are some things that can help fix this:

Reinstall packages
- Run `rm -force node_modules` and `pnpm install` to reinstall all packages in the project

Ensure Node is correct version
- Node v20 (latest of that version)
- Check by running `node -v`
- If not, download/switch to v20, by running:
   - `fnm install v20` or `nvm install v20`
   - `fnm use 20` or `nvm use 20`

### Structure Overview

The following directory tree outlines the major folders in the ZotMeal repository:

```
📦ZotMeal
 ┣ 📂node_modules
 ┣ 📂apps
 ┃ ┣ 📂next
 ┃ ┗ 📂server
 ┣ 📂packages
 ┃ ┣ 📂api
 ┃ ┣ 📂db
 ┃ ┗ 📂validators
 ┣ 📜package.json
 ...
```

The `node_modules` folder contains all ***Node.js*** packages that the repository uses

The `apps` folder contains major endpoints that ZotMeal uses
- `apps/next` contains all of the frontend components and scripts used to build 
  the web app, written in **Next.js**.
- `apps/server` contains the scripts used to connect backend functions to AWS 
  Lambda Serverless procedures.

The `packages` folder contains all the functionality of the backend of ZotMeal.
- `packages/api` contains all the ***tRPC** procedures used
- `packages/db` contains the database schema (written using ***DrizzleORM***)
- `packages/validators` contains information used for type verification of 
  API schemas used in the backend (written using ***Zod***)

### Testing

Run `turbo test` at the root of the project.

**Database (IMPORTANT FOR NON-STATIC DATA)**

Run the following commands to pull data into your local database. 

```sh
cd apps/server

# For daily test
pnpm test:daily

# For weekly test
pnpm test:weekly
```

If you want to check the contents of the database, run the following command (while the server is not running)

```sh
pnpm db:studio
```

### Adding Workspaces

To add a new package run `turbo gen workspace` and follow the prompts
