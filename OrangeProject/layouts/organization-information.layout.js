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

function OrganizationInformationScreen({ navigation, route }) {
  const [orgDetail, setOrgDetail] = useState({});
  const [currentOrgId, setCurrentOrgId] = useState(0);
  const [volunteers, setVolunteers] = useState([]);
  const [role, setRole] = useState([]);
  const [screen, setScreen] = useState(0);

  useEffect(() => {
    // get session data
    getPersistData("userInfo")
      .then((data) => {
        if (data && data.length > 0) {
          let org;
          if (route && route.params) {
            org = route.params.id;
          } else org = data[0].organization;
          setOrgDetail(data[0].orgDetail);
          setCurrentOrgId(org);
          setRole(data[0].role);
          // get volunteers
          get(`/orgs/volunteer/${data[0].organization}`)
            .then((volunteers) => {
              setVolunteers(volunteers.data.data);
            })
            .catch((error) => "Unable to find volunteer information");
        }
      })
      .catch((error) => {
        console.error(error);
        alert(error);
      });
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
          <View style={styles.card}>
            <Text>Events</Text>
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
    fontWeight:'bold'
  },
  card: {
    marginTop: 30,
    paddingLeft: 10,
    paddingRight: 30,
  },
  text: {
    marginTop: 10,
  },
});

export default OrganizationInformationScreen;
