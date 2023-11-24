import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Button, Input, CheckBox } from "@rneui/themed";
import { StyleSheet, Text, View, ImageBackground } from "react-native";
import { get, put } from "../contexts/api";
import React, { useState, useEffect } from "react";
import { getPersistData } from "../contexts/store";
import {
  TYPE_ORGANIZATION,
  TYPE_PARENT,
  TYPE_VOLUNTEER,
} from "../util/constants";
import { ButtonGroup } from "@rneui/base";
import VolunteerItem from "../components/volunteer-item.component";
import { ProfileImage } from "../components/profile-image.component";
import EventItem from "../components/event-item.component";

function OrganizationInformationScreen({ navigation, route }) {
  const [orgDetail, setOrgDetail] = useState({});
  const [currentOrgId, setCurrentOrgId] = useState(0);
  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);
  const [role, setRole] = useState([]);
  const [screen, setScreen] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const userInfo = await getPersistData("userInfo");
        if (userInfo && userInfo.length > 0) {
          let orgId = route?.params?.id || userInfo[0].organization;
  
          setOrgDetail(userInfo[0].orgDetail);
          setCurrentOrgId(orgId);
          setRole(userInfo[0].role);
  
          // Get volunteers
          const volunteersResponse = await get(`/orgs/volunteer/${orgId}`);
          setVolunteers(volunteersResponse.data.data);
  
          // Get events for the organization
          const eventsResponse = await get(`/orgs/events/${orgId}`);
          if (eventsResponse.data && eventsResponse.data.data) {
            const filteredEvents = eventsResponse.data.data.filter((event) => event.organization === orgId);
            setEvents(filteredEvents);
            console.log(filteredEvents);
          } else {
            console.error("Events data is not in the expected format:", eventsResponse.data);
          }
        }
      } catch (error) {
        console.error("An error occurred during data fetching:", error);
        alert("Unable to load data: " + error.message);
      }
    })();
  }, []);
  
  return (
    <View>
      <ImageBackground
        source={require("../assets/parent-background.png")} 
        style={{ height:300 }}
        resizeMode="cover"
      >
      <View style={{backgroundColor: 'rgba(222, 200, 213, 0.9)',}}>
        <Feather
          name="arrow-left"
          size={30}
          style={{ marginTop: 60, marginLeft: 20 }}
          onPress={() => navigation.goBack()}
        />
        <View style={{justifyContent: 'center', alignItems:'center', marginTop: 20}}>
          <View style={{backgroundColor:'white', position: 'absolute', height:200, width:'100%', top:70, borderTopLeftRadius:20, borderTopRightRadius:20}}></View>
          <ProfileImage uri={orgDetail.image} size={120}/>
          <Text style={styles.title}>{orgDetail.name}</Text>
        </View>
      </View>
      </ImageBackground>
      <View style={{ paddingHorizontal:20, backgroundColor:'white', height:'100%'}}>
        <ButtonGroup
          buttonContainerStyle={{backgroundColor:'#9B77C2'}}
          buttons={["About", "Events", "Volunteer"]}
          containerStyle={{}}
          disabledStyle={{}}
          disabledTextStyle={{}}
          disabledSelectedStyle={{}}
          disabledSelectedTextStyle={{}}
          innerBorderStyle={{}}
          onPress={(selectedIdx) => setScreen(selectedIdx)}
          selectedButtonStyle={{backgroundColor:'#613194'}}
          selectedIndex={screen}
          selectedTextStyle={{}}
          textStyle={{color:'white'}}
        />
        {screen === 0 && (
          <View style={styles.card}>
            <Text>{orgDetail.description || ""}</Text>
            <Text style={styles.text}>
              Founded Since : {orgDetail.establishedYear}
            </Text>
            <Text style={styles.text}>Volunteers : {volunteers.length}</Text>
          </View>
        )}
        {screen === 1 && (
          <View style={styles.eventcard}>
            {events.map((event) => (
              <EventItem
                key={event.id}
                event={event}
                navigation={navigation}
                orgPos={0}
                role={role}
              />
            ))}
          </View>
        )}
        {screen === 2 && (
          <View style={styles.card}>
            <Text>Volunteer</Text>
            {volunteers.map((volunteer) => (
              <VolunteerItem
                key={volunteer.id}
                volunteer={volunteer}
                navigation={navigation}
                orgId={currentOrgId}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    paddingTop: 5,
    paddingBottom: 30,
    fontSize: 25,
    textAlign: "center",
    fontFamily: 'Satoshi-Bold',
  },
  card: {
    marginTop: 30,
    paddingLeft: 10,
    paddingRight: 30,
  },
  eventcard: {
    marginTop: 0,
    paddingLeft: 10,
    paddingRight: 30,
  },
  text: {
    marginTop: 10,
  },
});

export default OrganizationInformationScreen;
