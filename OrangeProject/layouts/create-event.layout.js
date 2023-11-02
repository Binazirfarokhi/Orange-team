import { Button, Input, Overlay, Text } from "@rneui/themed";
import {
  Platform,
  ScrollView,
  View,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import { useState } from "react";
import DateTimePicker from "react-native-ui-datepicker";
import moment from "moment";
import {
  DATE_FORMAT_DISPLAY,
  DATE_FORMAT_PICKER,
  TIME_FORMAT_DISPLAY,
  TIME_FORMAT_PICKER,
} from "../util/constants";

import { useHeaderHeight } from "@react-navigation/elements";
import { useEffect } from "react";
import { getPersistData } from "../contexts/store";
import { get, patch, post } from "../contexts/api";

const CreateEventScreen = ({ navigation, route }) => {
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
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [availableVolunteers, setAvailableVolunteers] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showVolunteer, setShowVolunteer] = useState(false);
  const height = useHeaderHeight();

  let id;
  if (route && route.params) {
    id = route.params.id;
  }

  useEffect(() => {
    getPersistData("userInfo")
      .then((data) => {
        const organization = data[0].organization;
        setOrganizationId(organization);
        get(`/orgs/${organization}`)
          .then((orgData) => {
            setOrganization(orgData.data.name);
          })
          .catch((error) => alert("Unable to load organization data"));
        get(`/orgs/volunteer/${organization}`)
          .then((volData) => {
            setAvailableVolunteers(volData.data.data);
          })
          .catch((error) => alert("Unable to load organization data"));
      })
      .catch((error) => alert("Unable to load user data"));
  }, []);
  // load event for edit
  useEffect(() => {
    if (id) {
      get(`/orgs/event/${id}`)
        .then((data) => {
          const {
            ageGroup,
            date,
            description,
            eventName,
            eventType,
            location,
            note,
            organization,
            participants,
            time,
            volunteers,
          } = data.data.data;
          setEventName(eventName);
          setAgeGroup(ageGroup);
          setDate(date);
          setDescription(description);
          setEventType(eventType);
          setLocation(location);
          setNote(note);
          setOrganization(organization);
          setParticipants(participants);
          setTime(time);
          setVolunteers(volunteers);
          const tempVolunteer = volunteers.map((v) => v.id);
          setAvailableVolunteers(
            availableVolunteers.filter(
              (vol) => tempVolunteer.indexOf(vol.id) < 0
            )
          );
        })
        .catch((error) => {
          console.error(error);
          alert("Unable to load Event Information.");
        });
    }
  }, []);

  const removeVolunteer = (id) => {
    setAvailableVolunteers([
      ...availableVolunteers,
      ...volunteers.filter((v) => v.id === id),
    ]);
    setVolunteers([...volunteers.filter((v) => v.id !== id)]);
  };

  const addVolunteer = (id) => {
    if (volunteers.map((vol) => vol.id).indexOf(id) < 0) {
      setVolunteers([
        ...volunteers,
        ...availableVolunteers.filter((vol) => vol.id === id),
      ]);
      setAvailableVolunteers([
        ...availableVolunteers.filter((vol) => vol.id !== id),
      ]);
    }
  };

  const save = () => {
    let message = "";
    if (eventName === "") message = "Event Name should not be blank.\n";
    if (date === "") message += "Date should not be blank.\n";
    if (time === "") message += "Time should not be blank.\n";
    if (location === "") message += "Location should not be blank.\n";
    if (eventType === "") message += "Event Type should not be blank.\n";
    if (ageGroup === "") message += "Age Group should not be blank.\n";
    if (participants === "") message += "Participants should not be blank.\n";
    if (volunteers.length === 0) message += "Volunteers should not be blank.\n";

    if (message !== "") {
      alert(message);
    } else {
      const data = {
        eventName,
        date,
        time,
        organization,
        location,
        organizationId,
        eventType,
        ageGroup,
        participants,
        description,
        note,
        volunteers: volunteers.map((vol) => vol.id),
      };
      if (id) {
        patch(`/orgs/event/${id}`, data)
          .then((result) => {
            if (result.data.status === "OK") {
              alert("Event has been saved.");
              navigation.goBack();
            } else {
              alert("Unable to save event. Please try again later.");
            }
          })
          .catch((error) => console.error(error));
      } else {
        post("/orgs/event", data)
          .then((result) => {
            if (result.data.status === "OK") {
              alert("Event has been saved.");
              navigation.goBack();
            } else {
              alert("Unable to save event. Please try again later.");
            }
          })
          .catch((error) => console.error(error));
      }
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      keyboardVerticalOffset={50}
      style={styles.container}>
      <View style={styles.main}>
        <Feather
          name="arrow-left"
          size={30}
          style={styles.leftIcon}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>Create Event</Text>
        <View>
          <ScrollView style={{ marginBottom: 100, paddingRight: 20 }}>
            <Input
              onChange={(e) => setEventName(e.nativeEvent.text)}
              containerStyle={{}}
              disabledInputStyle={{ background: "#ddd" }}
              inputContainerStyle={{}}
              errorStyle={{}}
              errorProps={{}}
              inputStyle={{}}
              labelStyle={{}}
              labelProps={{}}
              leftIcon={
                <MaterialCommunityIcons
                  name="settings-helper"
                  size={20}
                  color={"#666"}
                />
              }
              leftIconContainerStyle={{}}
              rightIconContainerStyle={{}}
              placeholder="Event Name"
              label="Event Name"
              value={eventName}
            />
            <Input
              onFocus={(e) => setPickerOpen(true)}
              onBlur={(e) => setPickerOpen(false)}
              onChange={(e) => setDate(e.nativeEvent.text)}
              containerStyle={{}}
              disabledInputStyle={{ background: "#ddd" }}
              inputContainerStyle={{}}
              errorStyle={{}}
              errorProps={{}}
              inputStyle={{}}
              labelStyle={{}}
              labelProps={{}}
              leftIcon={<Feather name="calendar" size={20} color={"#666"} />}
              leftIconContainerStyle={{}}
              rightIconContainerStyle={{}}
              placeholder="Date"
              label="Date"
              value={date}
            />
            {/* {pickerOpen && 
                        <DateTimePicker
                            value={new Date()}
                            mode='date'
                            onValueChange={(date) => setDate(moment(date, DATE_FORMAT_PICKER).format(DATE_FORMAT_DISPLAY))}
                    />
                        } */}
            <Input
              onChange={(e) => setTime(e.nativeEvent.text)}
              containerStyle={{}}
              disabledInputStyle={{ background: "#ddd" }}
              inputContainerStyle={{}}
              errorStyle={{}}
              errorProps={{}}
              inputStyle={{}}
              labelStyle={{}}
              labelProps={{}}
              leftIcon={<Feather name="clock" size={20} color={"#666"} />}
              leftIconContainerStyle={{}}
              rightIconContainerStyle={{}}
              placeholder="Time"
              label="Time"
              value={time}
            />
            <Input
              onChange={(e) => setLocation(e.nativeEvent.text)}
              containerStyle={{}}
              disabledInputStyle={{ background: "#ddd" }}
              inputContainerStyle={{}}
              errorStyle={{}}
              errorProps={{}}
              inputStyle={{}}
              labelStyle={{}}
              labelProps={{}}
              leftIcon={<Feather name="map" size={20} color={"#666"} />}
              leftIconContainerStyle={{}}
              rightIconContainerStyle={{}}
              placeholder="Location"
              label="Location"
              value={location}
            />
            <Input
              onChange={(e) => setEventType(e.nativeEvent.text)}
              containerStyle={{}}
              disabledInputStyle={{ background: "#ddd" }}
              inputContainerStyle={{}}
              errorStyle={{}}
              errorProps={{}}
              inputStyle={{}}
              labelStyle={{}}
              labelProps={{}}
              leftIcon={<Feather name="grid" size={20} color={"#666"} />}
              leftIconContainerStyle={{}}
              rightIconContainerStyle={{}}
              placeholder="Event Type"
              label="Event Type"
              value={eventType}
            />
            <Input
              onChange={(e) => setAgeGroup(e.nativeEvent.text)}
              containerStyle={{}}
              disabledInputStyle={{ background: "#ddd" }}
              inputContainerStyle={{}}
              errorStyle={{}}
              errorProps={{}}
              inputStyle={{}}
              labelStyle={{}}
              labelProps={{}}
              leftIcon={<Feather name="columns" size={20} color={"#666"} />}
              leftIconContainerStyle={{}}
              rightIconContainerStyle={{}}
              placeholder="Age Group"
              label="Age Group"
              value={ageGroup}
            />
            <Input
              onChange={(e) => setParticipants(e.nativeEvent.text)}
              containerStyle={{}}
              disabledInputStyle={{ background: "#ddd" }}
              inputContainerStyle={{}}
              errorStyle={{}}
              errorProps={{}}
              inputStyle={{}}
              labelStyle={{}}
              labelProps={{}}
              leftIcon={<Feather name="users" size={20} color={"#666"} />}
              leftIconContainerStyle={{}}
              rightIconContainerStyle={{}}
              placeholder="Participants"
              label="Participants"
              value={participants}
            />
            <Input
              onChange={(e) => setDescription(e.nativeEvent.text)}
              containerStyle={{}}
              disabledInputStyle={{ background: "#ddd" }}
              inputContainerStyle={{}}
              errorStyle={{}}
              errorProps={{}}
              inputStyle={{}}
              multiline={true}
              labelStyle={{}}
              labelProps={{}}
              // leftIcon={<Feather name='list' size={20} color={'#666'} />}
              leftIconContainerStyle={{}}
              rightIconContainerStyle={{}}
              placeholder="Description"
              label="Description"
              value={description}
            />
            <Button onPress={() => setShowVolunteer(true)}>
              Add Volunteer
            </Button>
            <View style={styles.volunteers}>
              {volunteers.map((volunteer) => (
                <View style={styles.volunteer} key={volunteer.id}>
                  <Text>{volunteer.signup.displayName}</Text>
                  <Text
                    style={styles.remove}
                    onPress={() => removeVolunteer(volunteer.id)}>
                    Remove
                  </Text>
                </View>
              ))}
            </View>
            <Input
              onChange={(e) => setNote(e.nativeEvent.text)}
              containerStyle={{}}
              disabledInputStyle={{ background: "#ddd" }}
              inputContainerStyle={{}}
              errorStyle={{}}
              errorProps={{}}
              inputStyle={{}}
              multiline={true}
              labelStyle={{}}
              labelProps={{}}
              // leftIcon={<Feather name='list' size={20} color={'#666'} />}
              leftIconContainerStyle={{}}
              rightIconContainerStyle={{}}
              placeholder="Notes"
              label="Notes"
              value={note}
            />

            <Button onPress={save}>{id ? "Save" : "Create"} Event</Button>
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
                {availableVolunteers &&
                  availableVolunteers
                    .filter(
                      (vol) =>
                        searchText === "" ||
                        vol.signup.displayName.indexOf(searchText) >= 0
                    )
                    .map((vol) => (
                      <View style={styles.volunteer} key={vol.id}>
                        <Text onPress={() => addVolunteer(vol.id)}>
                          {vol.signup.displayName}
                        </Text>
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
    padding: 20,
    backgroundColor: "#DDD",
  },
  volunteer: {
    borderBottomWidth: 1,
    borderColor: "#CCC",
    paddingTop: 20,
    paddingBottom: 20,
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  remove: {
    textDecorationLine: "underline",
  },
  searchbox: {
    width: 300,
    height: 400,
    display: "flex",
  },
};

export default CreateEventScreen;
