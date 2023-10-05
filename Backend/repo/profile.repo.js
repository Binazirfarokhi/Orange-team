const { getDocs, collection } = require("firebase/firestore");
const { firestoreDB } = require("./firebase");

const getProfiles = async ()=> {
    try {
        const docRef = await getDocs(collection(firestoreDB, "users"));
        docRef.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
          });
          return  docRef.docs.map(doc=> ({
            ...doc.data(),
            signup: ''
        }));
      } catch (e) {
        console.error("Error adding document: ", e);
        return [];
      }
      
}

module.exports = { getProfiles }