const { getDocs, collection, query, where, setDoc, doc, updateDoc } = require("firebase/firestore");
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
        const q =  query(signupCollection, where("emailAddress","==", username));
        const ref = (await getDocs(q)).docs[0];
        await setDoc(doc(userCollection),{signup: ref.ref, createdAt: new Date(), role: "parent"})
    } catch (error) {
         console.error(error)
    }
}

const updateUsername = async(displayName, emailAddress) => {
    try {
        let docRef = doc(signupCollection, emailAddress);
        await updateDoc(docRef,{displayName})
    } catch (error) {
         console.error(error)
    }
}

const updateUserData = async(emailAddress, data) => {
    try {
        let docRef = doc(signupCollection, emailAddress);
        const userDoc = (await getDocs(query(userCollection, where("signup", "==", docRef))))
        await updateDoc(userDoc.docs[0].ref,data)
    } catch (error) {
         console.error(error)
    }
}
module.exports = { getProfiles, getProfileByEmail, saveProfile, updateUsername, updateUserData }