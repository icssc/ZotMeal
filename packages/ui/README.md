# Shared UI

This is an example package demonstrating how to import other packages in workspaces.


## How to use
- Add a build process
- Modify the `package.json` to point to the correct paths after building 
  (everything currently points to the untranspiled code)
- Import the built code into your other workspace projects


## Notes

### Fields in package.json

- typesVersions - some field for older versions of TypeScript to resolve paths to type definitions,
  e.g. declaration files

- exports - the new standard way to defining what files are exported by the package
  - import - the path to the file for an ESM import (i.e. `import x from 'my-package/subdirectory'`)
  - require - the path to the file for a CommonJS require (i.e. `require x from 'my-package/subdirectory'`)
  - default - the path to the file for a (ESM) default import. Basically the same as import ?
  - types - the path to the file for the type definitions.

#### Why are there so many different fields?
According to React-Native, there [might even be more](https://reactnative.dev/blog/2023/06/21/package-exports-support#what-is-package-exports) :facepalm:

The main idea is that not all files are compatible for all systems, i.e. ESM vs CJS vs. types.

You have a TypeScript file.
You build one version of the file for CommonJS.
You build another version of the file for ESM.
You emit a `.d.ts` file that just has type definitions.

All of those files are distinct and used in different circumstances.

This is because JavaScript is a great and straightforward ecosystem!



## FIXME
It seems like it's not possible to import untranspiled code directly into the expo app,
because babel doesn't handle it properly 
(this is actually possible with Vite, so skill diff between the bundlers I guess).
