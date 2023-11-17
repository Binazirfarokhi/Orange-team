import { Avatar, Button, Image, Input, Overlay, Text, Header } from "@rneui/themed";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import moment from "moment";
import {
  DATE_FORMAT_DISPLAY,
  TIME_FORMAT_DISPLAY,
  TYPE_PARENT,
  TYPE_VOLUNTEER,
} from "../util/constants";

import { useEffect } from "react";
import { getPersistData } from "../contexts/store";
import { get, post, getLocation } from "../contexts/api";
import { getImageUrlWithName } from "../util/general-functions";
import { ProfileImage } from "../components/profile-image.component";

const EventDetailScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState(moment().format(DATE_FORMAT_DISPLAY));
  const [time, setTime] = useState(moment().format(TIME_FORMAT_DISPLAY));
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lon: null });
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
  const [myRole, setMyRoleType] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [images, setImages] = useState([]);
  const [photo, setPhoto] = useState();
  const [mapUrl, setMapUrl] = useState("");

  useEffect(() => {
    getPersistData("userInfo")
      .then((data) => {
        const { role, id, signup } = data[0];
        setUserId(id);
        setRole(role);
        setCurrentUser(data[0]);

        const myRole = data[0].role;
        setMyRoleType(myRole);
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
          images,
          location,
          coordinates,
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
        setCoordinates(coordinates);
        setEventType(eventType);
        setAgeGroup(ageGroup);
        setParticipants(participants);
        setDescription(description);
        setOrganizationId(organization);
        setNote(note);
        setVolunteers(volunteers);
        setJoinedUser(participantsUserList);
        if (images && images !== null) {
          setImages(images);
        }
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
            setPhoto(orgData.data.image);
          })
          .catch((error) => alert("Unable to load organization data"));
      })
      .catch((error) => alert("Unable to load organization data"));
  }, []);

  // Adding action of chat screen navigation and map display
  const navigateChat = (focusedTab) => {
    navigation.navigate("ChatList", { focusedTab: focusedTab });
  };

  // fetching coordinates data
  const fetchMap = async () => {
    try {
      const { lat, lon } = coordinates;
      if (!lat || !lon) {
        console.error("Latitude and longitude are missing");
        return;
      }
      const response = await getLocation("/location/displaymap", { lat, lon });
      setMapUrl(response.data.imageUrl);
    } catch (error) {
      console.error("Error fetching map", error);
    }
  };

  useEffect(() => {
    if (coordinates.lat && coordinates.lon) {
      fetchMap();
    }
  }, [coordinates]);

  const formattedDate = moment(date).format('dddd, MMMM Do');
  console.log("photo",photo)

  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      keyboardVerticalOffset={150}
      style={styles.container}>
      <Header
          backgroundColor="transparent"
          centerComponent={{
            text: "Event Page",
            style: { fontSize: 25, fontWeight: "700" },
          }}
          leftComponent={
            <Feather
              name="arrow-left"
              size={30}
              onPress={() =>
                navigation.navigate("AuthorizedTabs", { screen: "Home" })
              }
            />
          }
        />
      <View style={styles.main}>
        <View>
          <ScrollView style={{ paddingRight: 20 }}>
            {images && images.length > 0 && (
              <View style={{ alignItems: "center", height: 200 }}>
                <ScrollView horizontal={true}>
                  {images.map((uri) => (
                    <Image
                      key={uri}
                      // containerStyle={{width: 36, height: 36}}
                      source={{ uri }}
                      style={styles.image}
                    />
                  ))}
                </ScrollView>
              </View>
            )}
            <Text style={styles.title}>{eventName}</Text>
            <View
              style={{ ...styles.item, display: "flex", flexDirection: "row", marginLeft:-5 }}>
              <ProfileImage uri={photo} size={50}/>
              <View style={{ display: "flex" }}>
                <Text
                  style={styles.text1}
                  onPress={() =>
                    navigation.navigate("OrganizationDetails", {
                      id: organizationId,
                    })
                  }>
                  {organization}
                </Text>
                <Text style={styles.text2}>
                  {orgParticipants} participants
                </Text>
              </View>
            </View>
            <View
              style={{ ...styles.item, display: "flex", flexDirection: "row", gap:12, marginLeft:8 }}>
              <Feather name="calendar" size={35} />
              <View style={{ display: "flex" }}>
                <Text style={styles.text1}>{formattedDate}</Text>
                <Text style={styles.text2}>{time}</Text>
              </View>
            </View>
            <View style={{ ...styles.item, display: "flex", flexDirection: "row", gap:12, marginLeft:8}}>
              <Ionicons name="location-sharp" size={35} color="black" />
              <View style={{flexDirection:'column', width:300}}>
                <Text style={styles.text1}>{location.split(',')[0]}</Text>
                <Text style={styles.text2}>{location}</Text>
              </View>
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
                style={{ ...styles.text3, paddingTop: 20, paddingBottom: 20, marginLeft:5 }}>
                {description}
              </Text>
            </View>
            {/* Adding two chat buttons and map */}
            {role !== 2 && (
              <Button
                style={{ marginVertical: 10 }}
                onPress={() => navigateChat("organization")}>
                Chat with Organization
              </Button>
            )}
            <Button
              style={{ marginTop: 10, marginBottom: 30 }}
              onPress={() => navigateChat("parents")}>
              Chat with Parents
            </Button>

            <Text style={styles.text1}>Direction</Text>
            {mapUrl && (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 20,
                  marginBottom: 40,
                }}>
                <Image
                  source={{ uri: mapUrl }}
                  style={{ width: 350, height: 240 }}
                />
              </View>
            )}

            <Text style={styles.text1}>Volunteer List </Text>
            <View style={styles.volunteers}>
              {volunteers.map((volunteer) => (
                <TouchableOpacity
                  onPress={() =>
                    checkVolunteer(volunteer.id, volunteer.signup.emailAddress)
                  }
                  key={volunteer.id}
                  style={{paddingVertical:10}}>
                  <View style={styles.volunteer}>
                    <Text>{volunteer.signup.displayName}</Text>
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
            {moment(date).diff(new Date(), "days") >= 0 && (
              <Button onPress={joinEvent} disabled={joined} style={{marginBottom:80}}>
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
  },
  main: {
    paddingLeft: 20,
    marginTop:20,
    marginBottom:100
  },
  title: {
    paddingTop: 30,
    paddingBottom: 30,
    fontSize: 30,
    fontWeight: "bold",
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
  image: {
    width: 300,
    height: 200,
  },
};

export default EventDetailScreen;
