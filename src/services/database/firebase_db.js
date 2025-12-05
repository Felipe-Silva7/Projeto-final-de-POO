// firebase_db.js
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = {  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = db;
