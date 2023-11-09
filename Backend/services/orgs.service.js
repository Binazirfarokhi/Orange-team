const {
  getOrgs,
  getOrg,
  saveOrg,
  getVolunteerByOrgIdRepo,
  saveEventRepo,
  getEventList,
  getEventListJoined,
  getEventDetail,
  deleteEventData,
  joinEventRepo,
  getOrgsByIds,
} = require("../repo/org.repo");
const { getProfileById, getUserRefByEmail } = require("../repo/profile.repo");

const orgs = async (req, res) => {
  try {
    res.send(await getOrgs());
  } catch (error) {
    console.error(error);
    res.send({
      status: "Failed",
      message: error,
      data: [],
    });
  }
};

const org = async (req, res) => {
  try {
    res.send(await getOrg(req.params.id));
  } catch (error) {
    console.error(error);
    res.send({
      status: "Failed",
      message: error,
      data: [],
    });
  }
};

const saveNewOrg = async (req, res) => {
  try {
    await saveOrg(req.body);
    res.send({
      status: "OK",
      message: "Organization Information has been saved",
    });
  } catch (error) {
    console.error(error);
    res.send({
      status: "Failed",
      message: error,
      data: [],
    });
  }
};

const getVolunteerByOrgId = async (req, res) => {
  try {
    const data = await getVolunteerByOrgIdRepo(req.params.id);
    res.send({
      status: "OK",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: error,
      data: [],
    });
  }
};

const saveEvent = async (req, res) => {
  try {
    const id = await saveEventRepo(req.params.id, req.body);
    res.send({
      status: "OK",
      data: id,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: error,
      data: [],
    });
  }
};

const getEvents = async (req, res) => {
  try {
    const data = await getEventList(req.params.id);
    res.send({
      status: "OK",
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: error,
      data: [],
    });
  }
};
const getJoinedEvents = async (req, res) => {
  try {
    const data = await getEventListJoined(req.params.id);
    res.send({
      status: "OK",
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: error,
      data: [],
    });
  }
};

const getEvent = async (req, res) => {
  try {
    let data = await getEventDetail(req.params.id);

    data = {
      ...data,
      volunteers: await Promise.all(
        data.volunteers.map(async (vol) => await getProfileById(vol))
      ),
      participantsUserList:
        data.participantsList && data.participantsList !== null
          ? await Promise.all(
              data.participantsList.map(
                async (vol) => await getProfileById(vol)
              )
            )
          : [],
    };
    res.send({
      status: "OK",
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: error,
      data: [],
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    await deleteEventData(req.params.id);
    res.send({
      status: "OK",
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: error,
      data: [],
    });
  }
};
const joinEvent = async (req, res) => {
  try {
    await joinEventRepo(req.params.userId, req.params.id, req.params.role);
    res.send({
      status: "OK",
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: error,
      data: [],
    });
  }
};

const getOrgsByVolunteerId = async (req, res) => {
  try {
    const data = await getProfileById(req.params.volunteerId);
    const orgs = await getOrgsByIds(data.orgs);
    res.send({
      status: "OK",
      data: orgs,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: error,
      data: [],
    });
  }
};

module.exports = {
  orgs,
  org,
  saveNewOrg,
  getVolunteerByOrgId,
  saveEvent,
  getEvent,
  getEvents,
  deleteEvent,
  joinEvent,
  getJoinedEvents,
  getOrgsByVolunteerId,
};
