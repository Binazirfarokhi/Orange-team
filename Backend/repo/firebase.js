const { initializeApp } = require('firebase/app');
const { getFirestore } = require("firebase/firestore");

var serviceAccount = require("../firebase-config.json");

const firebase = initializeApp(serviceAccount);

// Create a new client
const firestoreDB = getFirestore(firebase);

module.exports = { firestoreDB };