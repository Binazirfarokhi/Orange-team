const { getDocs, collection, query, where, setDoc, doc, updateDoc, getDoc } = require("firebase/firestore");
const { firestoreDB } = require("./firebase");
const { saveOrg, updateOrg, getOrg } = require("./org.repo");

const userCollection = collection(firestoreDB, "users");
const signupCollection = collection(firestoreDB, "signup");
const reviewCollection = collection(firestoreDB, "reviews");


const getProfiles = async () => {
    try {
        const docRef = await getDocs(userCollection);
        docRef.forEach((doc) => {
            // console.log(`${doc.id} => ${doc.data()}`);
        });
        return docRef.docs.map(doc => ({
            ...doc.data(),
            signup: ''
        }));
    } catch (e) {
        console.error("Error adding document: ", e);
        return [];
    }

}

const getProfileByEmail = async (email) => {
    try {
        const q = query(signupCollection, where("emailAddress", "==", email));
        const ref = (await getDocs(q)).docs[0];
        const data = (await getDocs(query(userCollection, where("signup", "==", ref.ref))))
            .docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
                signup: {
                    ...ref.data(),
                    password: null
                }
            }));
        let doc = data[0];
        if (doc.organization && doc.organization !== '') {
            data[0].orgDetail = await getOrg(doc.organization);
        }
        return data;
    } catch (error) {
        console.error(error)
    }
}

const saveProfile = async (username, displayName, role) => {
    try {
        let docRef = doc(signupCollection, username);
        await setDoc(docRef, { emailAddress: username, displayName, createdAt: new Date() })
        const q = query(signupCollection, where("emailAddress", "==", username));
        const ref = (await getDocs(q)).docs[0];
        await setDoc(doc(userCollection), { signup: ref.ref, createdAt: new Date(), role })
    } catch (error) {
        console.error(error)
    }
}

const updateUsername = async (displayName, emailAddress) => {
    try {
        let docRef = doc(signupCollection, emailAddress);
        await updateDoc(docRef, { displayName })
    } catch (error) {
        console.error(error)
    }
}

const getUserRefByEmail = async (emailAddress) => {
    let docRef = doc(signupCollection, emailAddress);
    const userDoc = (await getDocs(query(userCollection, where("signup", "==", docRef))))
    return userDoc.docs[0].ref;
}

const updateUserDataById = async (id, data) => {
    let docRef = doc(userCollection, id)
    await updateDoc(docRef, { positionOfOrganization: data });
}

const updateUserData = async (emailAddress, data) => {
    try {
        if (data.organization) {
            const orgName = data.organization;
            delete data.organization;
            const user = (await getProfileByEmail(emailAddress))[0];
            const orgId = user.organization;
            if (orgId) {
                await updateOrg(orgId, { name: orgName })
            } else {
                const newOrgId = await saveOrg({ name: orgName });
                data.organization = newOrgId;
            }
        }
        await updateDoc(await getUserRefByEmail(emailAddress), data)
    } catch (error) {
        console.error(error)
    }
}

const getProfileById = async (id) => {
    let data = (await (getDoc(doc(userCollection, id))))
    data = {
        ...data.data(),
        id: data.id,
        signup: (await getDoc(data.data().signup)).data()
    }
    return data;
}

const saveUserReview = async (data) => {
    return setDoc(doc(reviewCollection), data)
}
const getUserReview = async (id) => {
    return (await getDocs(query(reviewCollection, where('userId', '==', id)))).docs.map(data => ({ id: data.id, ... data.data() }))
}

const saveUserPhoto = async (id, photo) => {
    const docRef = doc(userCollection, id)
    await updateDoc(docRef, { photo })
}

module.exports = { getProfiles, getProfileByEmail, saveProfile, updateUsername, updateUserDataById, updateUserData, getUserRefByEmail, getProfileById, saveUserPhoto, saveUserReview, getUserReview }