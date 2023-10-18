const { getDocs, collection, query, where, setDoc, doc } = require("firebase/firestore");
const { firestoreDB } = require("./firebase");

const userCollection = collection(firestoreDB, "users");
const signupCollection = collection(firestoreDB, "signup");

const getProfiles = async ()=> {
    try {
        const docRef = await getDocs(userCollection);
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

const getProfileByEmail = async (email) => {
    try{
        const q =  query(signupCollection, where("emailAddress","==", email));
        const ref = (await getDocs(q)).docs[0];
        const data = (await getDocs(query(userCollection, where("signup", "==", ref.ref))))
            .docs.map(doc=> ({
                ...doc.data(), 
                signup : {
                    ...ref.data(),
                    password: null
                }}));
        return data;
    } catch (error) {
        console.error(error)
    }
}

const saveProfile = async(username, displayName) => {
    try {
        let docRef = doc(signupCollection, username);
        await setDoc(docRef,{emailAddress: username, displayName, createdAt: new Date()})
        await setDoc(doc(userCollection),{signup: `signup/${username}`, createdAt: new Date(), role: "parent"})
    } catch (error) {
         console.error(error)
    }
}

module.exports = { getProfiles, getProfileByEmail, saveProfile }