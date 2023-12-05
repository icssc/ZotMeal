const firebase = require("firebase-admin");

const serviceAccount = require("./firebase-service-account.json");
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://zotpass-backend-default-rtdb.firebaseio.com/",
});

const db = firebase.database();

module.exports = db;
