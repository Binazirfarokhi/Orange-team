const express = require("express");
const {
  getVolunteerByOrgId,
  org,
  orgs,
  saveNewOrg,
  saveEvent,
  getEvent,
  getEvents,
  getJoinedEvents,
  deleteEvent,
  joinEvent,
  getOrgsByVolunteerId,
} = require("../services/orgs.service");
const { setVolunteerPosition } = require("../services/profile.service");
const router = express.Router();

// define the home page route
router.get("/", orgs);
router.post("/", saveNewOrg);
router.post("/event", saveEvent);
router.post("/event/:userId/:id/:role", joinEvent);
router.get("/events/:id", getEvents);
router.get("/events", getEvents);
router.get("/eventsJoined/:id", getJoinedEvents);
router.get("/event/:id", getEvent);
router.patch("/event/:id", saveEvent);
router.delete("/event/:id", deleteEvent);
router.get("/:id", org);
router.get("/volunteer/:id", getVolunteerByOrgId);
router.patch("/volunteer/:id", setVolunteerPosition);
router.get("/orgs/:volunteerId", getOrgsByVolunteerId);

module.exports = router;
