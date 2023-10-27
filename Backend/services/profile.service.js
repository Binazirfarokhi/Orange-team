const { 
    getProfiles, 
    getProfileByEmail, 
    getProfileByID,
    updateUsername, 
    updateUserData, 
    updateUserDataById, 
    getProfileImageURL
} = require("../repo/profile.repo")

const updateUser = async (req, res) => {
  const emailAddress = req.params.email;
  const displayName = req.body.displayName;
  try {
    await updateUsername(displayName, emailAddress);
    res.send({
      status: "OK",
    });
  } catch (error) {
    console.error(error);
    res.send({
      status: "Failed",
      message: error.message,
    });
  }
};
const updatePersonalInfo = async (req, res) => {
  const emailAddress = req.params.email;
  try {
    await updateUserData(emailAddress, req.body);
    res.send({
      status: "OK",
    });
  } catch (error) {
    console.error(error);
    res.send({
      status: "Failed",
      message: error.message,
    });
  }
};

const deleteUser = async(req,res)=> {
    res.send(`deleted ${req.params.id}`)
}

const listUser = async(req, res) => {
    try {
        const docs = await getProfiles();
        const promises = docs.map(async doc => {
            if (doc.id) {
                doc.profileImageURL = await getProfileImageURL(doc.id);
            }
            return doc;
        });

        const updatedDocs = await Promise.all(promises);
        res.send(updatedDocs);
    } catch (error) {
        console.error(error);
        res.send({
            status: 'Failed',
            message: error.message
        });
    }
}


const user = async(req,res)=> {
    try { 
        const { email } = req.params;
        const doc = await getProfileByEmail(email);
        if (doc && doc[0] && doc[0].id) {
            doc[0].profileImageURL = await getProfileImageURL(doc[0].id);
        }
        res.send(doc);
    } catch (error) {
        console.error(error);
        res.send({
            status: 'Failed',
            message: error.message
        });
    }
};


const setVolunteerPosition = async (req, res) => {
  try {
    await updateUserDataById(req.params.id, req.body);
    res.send({
      status: "OK",
      message: "User Information has been updated successfully.",
    });
  } catch (error) {
    console.error(error);
    res.send({
      status: "Failed",
      message: error.message,
    });
  }
};





module.exports = {
    updateUser,
    deleteUser,
    listUser,
    setVolunteerPosition,
    updatePersonalInfo,
    user
}
