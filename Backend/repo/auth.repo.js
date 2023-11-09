const { firestoreDB, firebaseAdmin } = require("./firebase");

const userCollection = collection(firestoreDB, "users");
const signupCollection = collection(firestoreDB, "signup");

module.exports = {};
