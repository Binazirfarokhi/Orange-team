const { collection, getDocs, getDoc, doc, query, setDoc, updateDoc, where } = require("firebase/firestore");
const { firestoreDB } = require("./firebase");
const {  } = require("express");

const orgsCollection = collection(firestoreDB, "orgs");
const userCollection = collection(firestoreDB, "users");
const signupCollection = collection(firestoreDB, "signup");

const getOrgs = async() => {
    return (await getDocs(orgsCollection)).docs.map(doc=> ({...doc.data(), id: doc.id}));
}

const getOrg = async(id) => {
    return (await getDoc(doc(orgsCollection, id))).data();
}

const saveOrg = async(organization) => {
    let docRef = doc(orgsCollection);
    await setDoc(docRef, organization);
    return docRef.id
}

const updateOrg = async(id, organization) => {
    await updateDoc(doc(orgsCollection, id), organization);
}

const getVolunteerByOrgIdRepo = async(id) => {
    const docRef = await getDocs(query(userCollection, where("orgs", 'array-contains', id)));
    const data = await Promise.all(docRef.docs.map(async doc => ({
        ...doc.data(),
        signup: (await getDoc(doc.data().signup)).data(),
        id: doc.id
    })));
    return data
}

module.exports = { getOrg, getOrgs, getVolunteerByOrgIdRepo,saveOrg, updateOrg }