const {
  getProfiles,
  getProfileByEmail,
  updateUsername,
  updateUserData,
  updateUserDataById,
  saveUserReview,
  getUserReview,
  getProfileById,
} = require("../repo/profile.repo");

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

const deleteUser = async (req, res) => {
  res.send(`deleted ${req.params.id}`);
};
const listUser = async (req, res) => {
  const doc = await getProfiles();
  res.send(doc);
};
const user = async (req, res) => {
  try {
    const { email } = req.params;
    const doc = await getProfileByEmail(email);
    res.send(doc);
  } catch (error) {
    console.error(error);
    res.send({
      status: "Failed",
      message: error.message,
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

const getReview = async (req, res) => {
  try {
    const data = await getUserReview(req.params.id);
    res.send({
      status: "OK",
      data: await Promise.all(
        data.map(async (d) => ({
          ...d,
          userName: (await getProfileById(d.userId)).signup.displayName,
        }))
      ),
    });
  } catch (error) {
    console.error(error);
    res.send({
      status: "Failed",
      message: error.message,
    });
  }
};

const saveReview = async (req, res) => {
  try {
    const data = await saveUserReview(req.body);
    res.send({ status: "OK", data });
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
  user,
  getReview,
  saveReview,
};
