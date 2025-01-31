# Frontend Structure

All of ZotMeal's frontend is contained within the `apps/expo` folder, which looks something like this.

```
📦apps/expo
 ┣ 📂node_modules
 ┣ 📂src
 ┃ ┣ 📂app
 ┃ ┣ 📂components
 ┃ ┣ 📂utils
 ┃ ...
 ...
```

### src/app

```
📂src/app
 ┣ 📂about
 ┣ 📂auth
 ┣ 📂events
 ┣ 📂privacy-policy
 ┣ 📂settings
 ┣ 📜_layout.tsx
 ┗ 📜index.tsx
```
Each subfolder contains an `index.tsx` file with ***React Native*** code corresponding to different pages on the app.

`_layout.tsx` encodes some information about how navigation beetween pages works.

The top level `index.tsx` contains code for the top level component of the app. This uses all other pages and components to display teh complete app.

### src/components

```
📂src/components
 ┣ 📂auth
 ┣ 📂menu
 ┣ 📂navigation
 ┗ 📂ui
```

Each of these subfolders contain `.tsx` files that hold smaller components that are used in app.
