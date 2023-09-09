# ZotMeal

zotmeal.com 

## Running Locally

- Web App : To run the app on web, simply type `npm run web` in the terminal while in the root directory
- Mobile : To run the app on mobile, first install the **Expo Go** app on your mobile device. In the terminal, run `npm run mobile` and scan the QR code that is generated. (Alternatively, you can use an andriod emulator to run the app directly on computer, following the instructions in the terminal to launch)

## Organization

Here is a map of the important files in the project directory

```
├── app
│   └── App.tsx
│
├── zotmeal-vite
│   └── src
│       └── App.tsx
│
├── shared
│   ├── components   <= front end changes here
│   │   ├── Home.tsx
│   │   └── ...
│   └── imageAssets   <= images
|
├── node_modules
└── package.json
```

The ```shared/components``` folder contains all the tsx files that modify the app's format. Both the mobile app and vite website refer to the shared components, so modifying the tsx files will affect both (specifically the App.tsx file refers to the components).

### App Structure

Here is the current structural breakdown of the App by component

```
Home
└── Location
    ├── LocationHeader
    └── Station
        ├── StationDetails
        └── Menu
            └── Item
                ├── ItemDisplay
                └── ItemDetails
                    └── ItemNutrtion
```
