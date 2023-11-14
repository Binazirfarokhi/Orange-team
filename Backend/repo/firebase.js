const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { getAuth } = require("firebase/auth");
const { getStorage } = require("firebase/storage");

const fbAdmin = require("firebase-admin");
var config = {
  ...require("../firebase-config.json"),
  storageBucket: "uniteer-wmdd-sept22.appspot.com",
};
var serviceAccountConfig = require("../firebase-service-config.json");

const firebase = initializeApp(config);
const firebaseAdmin = fbAdmin.initializeApp({
  credential: fbAdmin.credential.cert(serviceAccountConfig),
});
// Create a new client
const firestoreDB = getFirestore(firebase);
const auth = getAuth(firebase);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(firebase);

// Create a storage reference from our storage service

module.exports = { firestoreDB, auth, firebaseAdmin, storage };
