const { getDocs, collection, query, where, setDoc, doc, getDoc, updateDoc, deleteDoc } = require("firebase/firestore");
const { firestoreDB } = require("./firebase");

const userCollection = collection(firestoreDB, "users");
const childrenCollection = collection(firestoreDB, "children");

const saveChild = async(userRef, data) => {
    let docRef = doc(childrenCollection);
    setDoc(docRef,{...data,parent: userRef, createdAt: new Date()})
}

const updateChild = async(childId, data) => {
    let docRef = doc(childrenCollection, childId);
    updateDoc(docRef,data)
}

const deleteChild = async(childId) => {
    let docRef = doc(childrenCollection, childId);
    deleteDoc(docRef)
}

const getChildList = async(parentRef) => {
    const q = query(childrenCollection, where('parent', '==', parentRef));
    return getDocs(q)
}

module.exports = { getChildList, saveChild, updateChild, deleteChild }