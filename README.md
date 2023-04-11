# ZotMeal

## Running Locally

To run the app on different platforms use the corresponding command
- Web App : `npm run web`
- Android : `npm run android`
- iOS : `npm run ios`

## Organization

Here is a map of the important files in the project directory

```
├── app
│   └── App.tsx
├── zotmeal-vite
│   └── src
│       └── App.tsx
└── shared
    └── components
        ├── Home.tsx
        └── ...
```

The ```shared/components``` folder contains all the tsx files that modify the app's format.\
Both the mobile app and vite website refer to the shared components, so modifying the tsx files will affect both.
