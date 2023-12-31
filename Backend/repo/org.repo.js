const { collection, getDocs, getDoc, doc, query, setDoc, updateDoc, where, deleteDoc, getCountFromServer } = require("firebase/firestore");
const { firestoreDB } = require("./firebase");

const orgsCollection = collection(firestoreDB, "orgs");
const userCollection = collection(firestoreDB, "users");
const eventCollection = collection(firestoreDB, "events");
const getOrgs = async () => {
    return (await getDocs(orgsCollection)).docs.map(doc => ({ ...doc.data(), id: doc.id }));
}

const getOrg = async (id) => {
    let docRef = (await getDoc(doc(orgsCollection, id)));
    data = {
        ...docRef.data(),
        id: docRef.id,
        participants: (await getCountFromServer(query(userCollection, where('orgs', 'array-contains', docRef.id)))).data().count
    }
    const docs = await getDocs(query(userCollection, where('organization', '==', id)))
    const photo = docs.docs.map(doc => doc.data().photo)
    if (photo && photo.length > 0)
        data.photo = photo[0]
    return data;
}

const getOrgsByIds = async (ids) => {
    let docsRef = await Promise.all(ids.map(async id => getDoc(doc(orgsCollection, id))));
    return docsRef.map(doc => {
        return ({
            id: doc.id,
            name: doc.data().name
        })
    });
}

const saveOrg = async (organization) => {
    let docRef = doc(orgsCollection);
    await setDoc(docRef, organization);
    return docRef.id
}

const updateOrg = async (id, organization) => {
    await updateDoc(doc(orgsCollection, id), organization);
}

const getVolunteerByOrgIdRepo = async (id) => {
    const docRef = await getDocs(query(userCollection, where("orgs", 'array-contains', id)));
    const data = await Promise.all(docRef.docs.map(async doc => ({
        ...doc.data(),
        signup: (await getDoc(doc.data().signup)).data(),
        id: doc.id
    })));
    return data
}

const joinEventRepo = async (userId, id, role) => {
    const docRef = await getDoc(doc(eventCollection, id));
    if (role === 0) {
        let { participantsList } = docRef.data();
        if (participantsList) {
            if (participantsList.indexOf(userId) < 0) {
                participantsList = [...participantsList, userId]
            }
        } else {
            participantsList = [userId];
        }
        await updateDoc(docRef.ref, { participantsList })
    } else {
        let { volunteers } = docRef.data();
        if (volunteers) {
            if (volunteers.indexOf(userId) < 0) {
                volunteers = [...volunteers, userId]
            }
        } else {
            volunteers = [userId];
        }
        await updateDoc(docRef.ref, { volunteers })

    }
}

const saveEventRepo = async (id, data) => {
    let docRef;
    if (!id || id === null)
        docRef = doc(eventCollection);
    else
        docRef = doc(eventCollection, id);
    await setDoc(docRef, { ...data, createdAt: new Date() })
    return docRef.id
}

const getEventList = async (id) => {
    if (id && id !== null)
        return (await getDocs(query(eventCollection, where('organization', '==', id)))).docs.map(doc => ({ ...doc.data(), id: doc.id }));
    else
        return (await getDocs(eventCollection)).docs.map(doc => ({ ...doc.data(), id: doc.id }));

}
const getEventListJoined = async (id) => {
    if (id && id !== null)
        return (await getDocs(query(eventCollection, where('participantsList', 'array-contains', id)))).docs.map(doc => ({ ...doc.data(), id: doc.id }));
    else
        return (await getDocs(eventCollection)).docs.map(doc => ({ ...doc.data(), id: doc.id }));

}

const getVolunteerById = async (id) => {
    return (await getDoc(doc(volunteerC, id))).data();
}

const getEventDetail = async (id) => {
    let data = (await getDoc(doc(eventCollection, id))).data();
    return data;
}

const deleteEventData = async (id) => {
    deleteDoc(doc(eventCollection, id));
}

module.exports = { getOrg, getOrgs, getOrgsByIds, getVolunteerByOrgIdRepo, saveOrg, updateOrg, saveEventRepo, getEventList, getEventListJoined, getEventDetail, deleteEventData, joinEventRepo }
