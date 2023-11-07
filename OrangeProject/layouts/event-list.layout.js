import { Button, Image, Input, Text } from "@rneui/themed";
import { View } from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import React, { useEffect } from "react";
import { useState } from "react";
import MyTheme from "../contexts/theme";
import { ButtonGroup } from "@rneui/themed";
import { ScrollView } from "react-native";
import EventItem from "../components/event-item.component";
import { getPersistData } from "../contexts/store";
import { get } from "../contexts/api";
import {
  DATE_FORMAT_DISPLAY,
  POSITION_L1,
  TYPE_ORGANIZATION,
  TYPE_PARENT,
} from "../util/constants";
import moment from "moment";
import { bindOrgAndPosition } from "../util/general-functions";
import AuthContext from "../contexts/auth";

let index = 0;

const EventListScreen = ({ navigation }) => {
  const { signOut } = React.useContext(AuthContext);
  const [eventName, setEventName] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [orgPos, setOrgPos] = useState({});
  const [reloadOnce, setReloadOnce] = useState(true);
  const [role, setRole] = useState(0);

  const reloadData = () => {
    setReloadOnce(!reloadOnce);
  };

  useEffect(() => {
    getPersistData("userInfo").then(async (data) => {
      if (data && data.length > 0) {
        let result = [];
        const { orgs, positionOfOrganization, role } = data[0];
        setRole(role);
        setOrgPos(bindOrgAndPosition(orgs, positionOfOrganization));
        if (data[0].role === TYPE_ORGANIZATION) {
          result = (await get(`/orgs/events/${data[0].organization}`)).data
            .data;
          setEvents(result);
        } else if (role === TYPE_PARENT) {
          result = (await get(`/orgs/events`)).data.data;
          setEvents(result);
        } else {
          if (data[0].orgs) {
            await Promise.all(
              data[0].orgs.map(async (org) => {
                const record = (await get(`/orgs/events/${org}`)).data.data;
                result = [...result, ...record];
              })
            );
            setEvents(result);
          }
        }
      }
    });
  }, [reloadOnce]);

  useEffect(() => {
    setReloadOnce(!reloadData);
    const timer = setTimeout(() => {
      setReloadOnce(!reloadData);
    }, 1000 * 5);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.main}>
      <View style={styles.searchbar}>
        <View style={{ flex: 1 }}>
          <Image
            // containerStyle={{width: 36, height: 36}}
            source={require("../assets/unilogo.png")}
            style={{ width: 48, height: 48 }}
          />
        </View>
        <View style={styles.searchbox}>
          <Input
            style={{ borderWidth: 0 }}
            onChange={(e) => setEventName(e.nativeEvent.text)}
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
            value={eventName}
          />
        </View>
        {!role && (
          <View>
            <Button
              onPress={signOut}
              title="Login"
              containerStyle={{ flex: 1, marginRight: 20 }}>
              Logout
            </Button>
          </View>
        )}
      </View>

      <View>
        <ButtonGroup
          buttonStyle={{}}
          buttonContainerStyle={{}}
          buttons={["All", "Upcoming"]}
          containerStyle={{ marginRight: 20, marginTop: 20 }}
          disabled={[3, 4]}
          disabledStyle={{}}
          disabledTextStyle={{}}
          disabledSelectedStyle={{}}
          disabledSelectedTextStyle={{}}
          innerBorderStyle={{}}
          onPress={(selectedIdx) => setSelectedIndex(selectedIdx)}
          selectedButtonStyle={{}}
          selectedIndex={selectedIndex}
          selectedTextStyle={{}}
          textStyle={{}}
        />
      </View>
      <View style={{ paddingBottom: 150, paddingRight: 20 }}>
        <ScrollView>
          {events.length > 0 &&
            events
              .filter(
                (event) =>
                  selectedIndex === 0 ||
                  (selectedIndex === 1 &&
                    moment(event.date, DATE_FORMAT_DISPLAY).diff(
                      new Date(),
                      "day"
                    ) >= 0)
              )
              .filter(
                (event) =>
                  eventName === "" || event.eventName.indexOf(eventName) >= 0
              )
              .map((event) => (
                <EventItem
                  key={event.id}
                  event={event}
                  navigation={navigation}
                  orgPos={orgPos}
                  reload={reloadData}
                />
              ))}
        </ScrollView>
      </View>
      {/* <View style={styles.backdrop}></View> */}
      {role !== TYPE_PARENT && (
        <View style={styles.container}>
          <Button
            titleStyle={styles.button}
            containerStyle={{ borderRightWidth: 1, borderRightColor: "#CCC" }}
            onPress={() => {
              navigation.navigate("CreateEvent");
            }}
            type="clear">
            <Ionicons name="add-circle-outline" size={20} color={"#FFF"} /> New
            Event
          </Button>
          {/* <Button titleStyle={styles.button}
                        onPressItem={name => {
                            
                        }}
                        type="clear"
                    ><FontAwesome name='chevron-up' size={20} color={'#FFF'} /></Button> */}
        </View>
      )}
      {/* <View style={styles.fabs}>
                <View style={styles.fab}>
                    <Text>New Event</Text>
                    <FontAwesome name='chevron-up' size={20} color={'#FFF'} />
                </View>
                <View style={styles.fab}>
                    <Text>Send Picture</Text>
                    <FontAwesome name='chevron-up' size={20} color={'#FFF'} />
                </View>
                <View style={styles.fab}>
                    <Text>Update Location</Text>
                    <FontAwesome name='chevron-up' size={20} color={'#FFF'} />
                </View>
                <View style={styles.fab}>
                    <Text>New Event</Text>
                    <FontAwesome name='chevron-up' size={20} color={'#FFF'} />
                </View>
            </View> */}
    </View>
  );
};

const styles = {
  main: {
    flex: 1,
    paddingLeft: 20,
    paddingTop: 60,
    display: "flex",
    flexDirection: "column",
  },
  searchbar: {
    display: "flex",
    flexDirection: "row",
    paddingRight: 20,
  },
  searchbox: {
    flex: 4,
    backgroundColor: "#D8D4DE",
    borderRadius: 50,
    lineHeight: 50,
    height: 50,
    paddingLeft: 20,
  },
  container: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    position: "absolute",
    bottom: 20,
    right: 20,
    // paddingHorizontal: 20,
    // paddingVertical: 10,
    // display: 'none',
    display: "flex",
    flexDirection: "row",
    backgroundColor: MyTheme.colors.primary,
  },
  button: {
    color: "white",
  },
  // , fabs: {
  //     display: 'flex',
  //     flexDirection: 'column-reverse',
  //     position: 'absolute',
  //     bottom: 20,
  //     right: 20,
  //     height: 200
  // }, backdrop: {
  //     left: 0,
  //     top: 0,
  //     right: 0,
  //     botton: 0,
  //     position: 'absolute',
  //     backgroundColor: 'rgba(255,255,255,0.5)',
  //     height: '200%'
  // }, fab: {

  // }
};
export default EventListScreen;
