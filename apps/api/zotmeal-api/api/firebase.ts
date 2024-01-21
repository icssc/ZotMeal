import firebase from 'firebase-admin';

import serviceAccount from './firebase-service-account.json';

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount as firebase.ServiceAccount),
  databaseURL: 'https://zotpass-backend-default-rtdb.firebaseio.com/',
});

export const db = firebase.database();
