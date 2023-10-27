const { getDoc, getDocs, collection, query, where, setDoc, doc, updateDoc } = require("firebase/firestore");
const { getStorage, ref, getDownloadURL } = require("firebase/storage");
const { firestoreDB } = require("./firebase");
const { saveOrg, updateOrg, getOrg } = require("./org.repo");

const userCollection = collection(firestoreDB, "users");
const signupCollection = collection(firestoreDB, "signup");
const storage = getStorage(); 

const getProfiles = async ()=> {
    try {
        const docRef = await getDocs(userCollection);
        docRef.forEach((doc) => {
          });
          return docRef.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
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
    const data = (
      await getDocs(query(userCollection, where("signup", "==", ref.ref)))
    ).docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      signup: {
        ...ref.data(),
        password: null,
      },
    }));
    let doc = data[0];
    if (doc.organization && doc.organization !== "") {
      data[0].orgDetail = await getOrg(doc.organization);
    }
    return data;
  } catch (error) {
    console.error(error);
  }
};

const saveProfile = async (username, displayName, role) => {
  try {
    let docRef = doc(signupCollection, username);
    await setDoc(docRef, {
      emailAddress: username,
      displayName,
      createdAt: new Date(),
    });
    const q = query(signupCollection, where("emailAddress", "==", username));
    const ref = (await getDocs(q)).docs[0];
    await setDoc(doc(userCollection), {
      signup: ref.ref,
      createdAt: new Date(),
      role,
    });
  } catch (error) {
    console.error(error);
  }
};

const updateUsername = async (displayName, emailAddress) => {
  try {
    let docRef = doc(signupCollection, emailAddress);
    await updateDoc(docRef, { displayName });
  } catch (error) {
    console.error(error);
  }
};

const getUserRefByEmail = async (emailAddress) => {
  let docRef = doc(signupCollection, emailAddress);
  const userDoc = await getDocs(
    query(userCollection, where("signup", "==", docRef))
  );
  return userDoc.docs[0].ref;
};

const updateUserDataById = async (id, data) => {
  let docRef = doc(userCollection, id);
  await updateDoc(docRef, { positionOfOrganization: data });
};

const updateUserData = async (emailAddress, data) => {
    try {
      if (data.organization) {
        const orgName = data.organization;
        delete data.organization;
        const user = (await getProfileByEmail(emailAddress))[0];
        const orgId = user.organization;
        if (orgId) {
          await updateOrg(orgId, { name: orgName });
        } else {
          const newOrgId = await saveOrg({ name: orgName });
          data.organization = newOrgId;
        }
      }
      await updateDoc(await getUserRefByEmail(emailAddress), data);
    } catch (error) {
      console.error(error);
    }
  };

const getProfileImageURL = async (docId) => {
    try {
        const imagePath = `portrait/${docId}.png`; 
        const imageRef = ref(storage, imagePath);
        
        return await getDownloadURL(imageRef);
    } catch (error) {
        console.error("Error fetching profile image:", error);

        const defaultImagePath = 'portrait/default.png';
        const defaultImageRef = ref(storage, defaultImagePath);
        return await getDownloadURL(defaultImageRef);
    }
};

const getProfileById = async (id) => {
    let data = await getDoc(doc(userCollection, id));
    data = {
      ...data.data(),
      id: data.id,
      signup: (await getDoc(data.data().signup)).data(),
    };
    return data;
};
  
module.exports = { 
    getProfiles, 
    getProfileByEmail, 
    saveProfile, 
    updateUsername, 
    updateUserDataById, 
    updateUserData, 
    getUserRefByEmail, 
    getProfileImageURL,
    getProfileById,
}
