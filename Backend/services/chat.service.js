const { getDocs, getDoc, query, where, doc, setDoc, collection } = require("@firebase/firestore");
const { getProfileImageURL} = require("../repo/profile.repo");
const { firestoreDB } = require("../repo/firebase");
const messagesCollection = collection(firestoreDB, "messages");
const usersCollection = collection(firestoreDB, "users");

const singleUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;

        const docRef = doc(usersCollection, userId);
        const docData = await getDoc(docRef);

        if (!docData.exists()) {
            return res.status(404).send("User not found");
        }

        const data = {
            id: docData.id,
            ...docData.data(),
            profileImageURL: await getProfileImageURL(docData.id)
        };

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}


const getMessages = async (req, res) => {
    try {
        const senderId = req.params.senderId;
        const receiverId = req.params.receiverId;

        const q1 = query(
            messagesCollection,
            where("senderId", "==", senderId),
            where("receiverId", "==", receiverId)
        );
        const querySnapshot1 = await getDocs(q1);
        
        const q2 = query(
            messagesCollection,
            where("senderId", "==", receiverId),
            where("receiverId", "==", senderId)
        );
        const querySnapshot2 = await getDocs(q2);

        const mergedMessages = [...querySnapshot1.docs, ...querySnapshot2.docs];

        const sortedMessages = mergedMessages.sort((a, b) => 
            b.data().createdAt.toDate() - a.data().createdAt.toDate()
        );

        const formattedMessages = sortedMessages.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(formattedMessages);
    } catch (error) {
        console.error("Error fetching messages:", error.message);
        res.status(500).send("Internal server error");
    }
};


const sendMessages = async (req, res) => {
    try {
        const { senderId, receiverId, text } = req.body;

        if (!senderId || !receiverId || !text) {
            return res.status(400).json({ error: "Missing required parameters." });
        }

        const newMessage = {
            senderId,
            receiverId,
            text,
            createdAt: new Date()
        };
        const messageDocRef = doc(messagesCollection);
        await setDoc(messageDocRef, newMessage);

        return res.status(201).json({ messageId: messageDocRef.id });
    } catch (error) {
        console.error("Error sending message:", error.message);
        return res.status(500).json({ error: "Internal server error." });
    }
};



module.exports = {
    sendMessages,
    getMessages,
    singleUserProfile
}