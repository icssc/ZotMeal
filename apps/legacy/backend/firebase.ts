import firebase from "firebase-admin";

const serviceAccount = require("./firebase-service-account.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://zotpass-backend-default-rtdb.firebaseio.com/",
});

export const db = firebase.database();