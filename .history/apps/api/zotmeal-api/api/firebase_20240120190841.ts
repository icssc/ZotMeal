import firebase from "firebase-admin";
// const firebase = require("firebase-admin")

import * as serviceAccount from ""
// const serviceAccount = require("./firebase-service-account.json");


firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://zotpass-backend-default-rtdb.firebaseio.com/",
});

export const db = firebase.database();
export const auth = firebase.auth();