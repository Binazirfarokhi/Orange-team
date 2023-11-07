import { Button, Input, Overlay, Text } from "@rneui/themed";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { useState } from "react";
import moment from "moment";
import {
  DATE_FORMAT_DISPLAY,
  DATE_FORMAT_PICKER,
  TIME_FORMAT_DISPLAY,
  TIME_FORMAT_PICKER,
  TYPE_PARENT,
  TYPE_VOLUNTEER,
} from "../util/constants";

import { useEffect } from "react";
import { getPersistData } from "../contexts/store";
import { get, post } from "../contexts/api";
import { useId } from "react";

const EventDetailScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState(moment().format(DATE_FORMAT_DISPLAY));
  const [time, setTime] = useState(moment().format(TIME_FORMAT_DISPLAY));
  const [pickerOpen, setPickerOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [organization, setOrganization] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [eventType, setEventType] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [participants, setParticipants] = useState("");
  const [orgParticipants, setOrgParticipants] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [availableVolunteers, setAvailableVolunteers] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showVolunteer, setShowVolunteer] = useState(false);
  const [joined, setJoined] = useState(false);
  const [userId, setUserId] = useState("");
  const [joinedUser, setJoinedUser] = useState([]);
  const [role, setRole] = useState();
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    getPersistData("userInfo")
      .then((data) => {
        const { role, id, signup } = data[0];
        setUserId(id);
        setRole(role);
        setCurrentUser(data[0]);

        get(`/orgs/volunteer/${organization}`)
          .then((volData) => {
            setAvailableVolunteers(volData.data.data);
          })
          .catch((error) => alert("Unable to load organization data"));
      })
      .catch((error) => alert("Unable to load user data"));
  }, []);

  const joinEvent = async () => {
    const result = await post(`/orgs/event/${userId}/${id}/${role}`);
    if (result.data.status === "OK") {
      if (role === TYPE_PARENT) {
        setJoinedUser([...joinedUser, currentUser]);
      } else {
        setVolunteers([...volunteers, currentUser]);
      }
      setJoined(true);
    } else alert("Unable to join to the group");
  };

  const checkVolunteer = (id, email) => {
    navigation.navigate("VolunteerDetail", {
      email,
      fromOrg: true,
      orgId: organizationId,
      id: id,
    });
  };

  useEffect(() => {
    get(`/orgs/event/${id}`)
      .then((event) => {
        const {
          eventName,
          date,
          time,
          organization,
          participantsList,
          location,
          eventType,
          ageGroup,
          participants,
          description,
          note,
          volunteers,
          participantsUserList,
        } = event.data.data;
        setEventName(eventName);
        setDate(date);
        setTime(time);
        // setOrganization(organization)
        setLocation(location);
        setEventType(eventType);
        setAgeGroup(ageGroup);
        setParticipants(participants);
        setDescription(description);
        setOrganizationId(organization);
        setNote(note);
        setVolunteers(volunteers);
        setJoinedUser(participantsUserList);
        if (role === TYPE_PARENT)
          setJoined(
            participantsList &&
              participantsList !== null &&
              participantsList.indexOf(userId) >= 0
          );
        if (role === TYPE_VOLUNTEER && !joined) {
          setJoined(
            volunteers &&
              volunteers !== null &&
              volunteers.filter((vol) => vol.id === currentUser.id).length > 0
          );
        }

        get(`/orgs/${organization}`)
          .then((orgData) => {
            setOrganization(orgData.data.name);
            setOrgParticipants(orgData.data.participants);
          })
          .catch((error) => alert("Unable to load organization data"));
      })
      .catch((error) => alert("Unable to load organization data"));
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      keyboardVerticalOffset={150}
      style={styles.container}>
      <View style={styles.main}>
        <Feather
          name="arrow-left"
          size={30}
          style={styles.leftIcon}
          onPress={() => navigation.goBack()}
        />
        {/* <Text style={styles.title}>Event Page</Text> */}
        <View>
          <ScrollView style={{ paddingRight: 20 }}>
            <Text style={styles.title}>{eventName}</Text>
            <View
              style={{ ...styles.item, display: "flex", flexDirection: "row" }}>
              <FontAwesome name="building-o" size={40} />
              <View style={{ display: "flex" }}>
                <Text
                  style={styles.text1}
                  onPress={() =>
                    navigation.navigate("OrganizationDetails", {
                      id: organizationId,
                    })
                  }>
                  {" "}
                  {organization}
                </Text>
                <Text style={styles.text2}>
                  {" "}
                  Participants: {orgParticipants}
                </Text>
              </View>
            </View>
            <View
              style={{ ...styles.item, display: "flex", flexDirection: "row" }}>
              <Feather name="calendar" size={40} />
              <View style={{ display: "flex" }}>
                <Text style={styles.text1}> {date}</Text>
                <Text style={styles.text2}> {time}</Text>
              </View>
            </View>
            <View
              style={{ ...styles.item, display: "flex", flexDirection: "row" }}>
              <Feather name="map" size={30} />
              <Text style={styles.text1}> {location}</Text>
            </View>

            <View
              style={{ ...styles.item, display: "flex", flexDirection: "row" }}>
              <Text style={styles.text1}> Event Type: </Text>
              <Text style={styles.text3}> {eventType}</Text>
            </View>

            <View
              style={{ ...styles.item, display: "flex", flexDirection: "row" }}>
              <Text style={styles.text1}> Age Group: </Text>
              <Text style={styles.text3}> {ageGroup}</Text>
            </View>

            <View
              style={{ ...styles.item, display: "flex", flexDirection: "row" }}>
              <Text style={styles.text1}> Slot Availability: </Text>
              <Text style={styles.text3}> {participants}</Text>
            </View>

            <View
              style={{
                ...styles.item,
                display: "flex",
                flexDirection: "column",
              }}>
              <Text style={styles.text1}> About the event </Text>
              <Text
                style={{ ...styles.text3, paddingTop: 20, paddingBottom: 20 }}>
                {" "}
                {description}
              </Text>
            </View>

            <Text style={styles.text1}>Volunteer List </Text>
            <View style={styles.volunteers}>
              {volunteers.map((volunteer) => (
                <TouchableOpacity
                  onPress={() =>
                    checkVolunteer(volunteer.id, volunteer.signup.emailAddress)
                  }
                  key={volunteer.id}>
                  <View style={styles.volunteer}>
                    <Text>{volunteer.signup.displayName}</Text>
                    {/* <Text style={styles.remove} onPress={()=> removeVolunteer(volunteer.id)}>Remove</Text> */}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.text1}>ParticipantsList List </Text>

            <View style={styles.volunteers}>
              {joinedUser.map((volunteer) => (
                <View style={styles.volunteer} key={volunteer.id}>
                  <Text>{volunteer.signup.displayName}</Text>
                  {/* <Text style={styles.remove} onPress={()=> removeVolunteer(volunteer.id)}>Remove</Text> */}
                </View>
              ))}
            </View>

            <View
              style={{
                ...styles.item,
                display: "flex",
                flexDirection: "column",
              }}>
              <Text style={styles.text1}> Note </Text>
              <Text
                style={{ ...styles.text3, paddingTop: 20, paddingBottom: 20 }}>
                {" "}
                {note}
              </Text>
            </View>
            {moment(date, DATE_FORMAT_DISPLAY).diff(new Date(), "day") >= 0 && (
              <Button onPress={joinEvent} disabled={joined}>
                {joined ? "Joined" : "Register"}
              </Button>
            )}
          </ScrollView>
        </View>
      </View>
      {showVolunteer && (
        <Overlay>
          <View style={styles.searchbox}>
            <Input
              style={{ borderWidth: 0 }}
              onChange={(e) => setSearchText(e.nativeEvent.text)}
              containerStyle={{ height: 40 }}
              disabledInputStyle={{ background: "#ddd" }}
              inputContainerStyle={{ height: 40 }}
              errorStyle={{}}
              errorProps={{}}
              inputStyle={{}}
              labelStyle={{}}
              labelProps={{}}
              leftIcon={<FontAwesome name="search" size={20} color={"#666"} />}
              leftIconContainerStyle={{}}
              rightIconContainerStyle={{}}
              placeholder="Event Name"
              value={searchText}
            />
            <View style={{ flex: 7, padding: 20 }}>
              <ScrollView>
                {availableVolunteers
                  .filter(
                    (vol) =>
                      searchText === "" ||
                      vol.signup.displayName.indexOf(searchText) >= 0
                  )
                  .map((vol) => (
                    <View style={styles.volunteer} key={vol.id}>
                      <Text>{vol.signup.displayName}</Text>
                    </View>
                  ))}
              </ScrollView>
            </View>
            <Button onPress={() => setShowVolunteer(false)}>OK</Button>
          </View>
        </Overlay>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = {
  container: {
    flex: 1,
    // marginBottom: 3000
  },
  main: {
    paddingLeft: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  title: {
    paddingTop: 30,
    paddingBottom: 30,
    fontSize: 30,
  },
  logo: {
    /* Vector */
  },
  volunteers: {
    display: "flex",
    flexDirection: "column",
    paddingTop: 20,
  },
  volunteer: {
    backgroundColor: "#E2CCFA",
    borderRadius: 15,
    padding: 20,
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  remove: {
    textDecorationLine: "underline",
  },
  text1: {
    fontSize: 20,
    fontWeight: "bold",
  },
  text3: {
    fontSize: 20,
  },
  item: {
    paddingTop: 10,
    paddingBottom: 10,
  },
};

export default EventDetailScreen;
