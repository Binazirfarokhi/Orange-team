const { initializeApp } = require('firebase/app');
const { getFirestore } = require("firebase/firestore");
const { getAuth } = require("firebase/auth");
const fbAdmin = require('firebase-admin');

var config = require("../firebase-config.json");
var serviceAccountConfig = require("../firebase-service-config.json");

const firebase = initializeApp(config);
const firebaseAdmin = fbAdmin.initializeApp(serviceAccountConfig);
// Create a new client
const firestoreDB = getFirestore(firebase);
const auth = getAuth(firebase);

module.exports = { firestoreDB, auth, firebaseAdmin };