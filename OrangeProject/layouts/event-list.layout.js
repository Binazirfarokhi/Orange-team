import { Button, Image, Input, Text, SearchBar, SpeedDial} from "@rneui/themed";
import { View } from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons'; 
import React, { useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
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
import { SafeAreaView } from "react-native-safe-area-context";
import CalendarComponent from "../components/calendar.component";

let index = 0;

const EventListScreen = ({ navigation, route }) => {
  const { signOut } = React.useContext(AuthContext);
  const [eventName, setEventName] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [orgPos, setOrgPos] = useState({});
  const [reloadOnce, setReloadOnce] = useState(true);
  const [role, setRole] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [open, setOpen] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  const reloadData = () => {
    if (!isFiltered) {
      setReloadOnce(!reloadOnce);
    }
  };

  const fetchData = async () => {
    const data = await getPersistData("userInfo");
    try {
      if (data && data.length > 0) {
        let result = [];
        const { orgs, positionOfOrganization, role } = data[0];
        setRole(role);
        setOrgPos(bindOrgAndPosition(orgs, positionOfOrganization));
        if (role === TYPE_ORGANIZATION) {
          result = (await get(`/orgs/events/${data[0].organization}`)).data
            .data;
        } else {
          result = (await get(`/orgs/events`)).data.data;
        }
        if (!isFiltered) {
          setEvents(result); 
        }
        // result.forEach(event => {
        //   console.log(event)
        //   console.log(moment(event.date).format(), new Date());
        //   console.log(moment(event.date).diff(new Date(), "days"));
        // });
      }
    } catch (error) {
      signOut();
    } 
  };

  useFocusEffect(
    React.useCallback(() => {
      if (!(route.params && route.params.filteredEvents) && !isFiltered) {
        fetchData();
      }
        return () => {
        // setIsFiltered(false);
      };
    }, [])
  );
  

  useEffect(() => {
    if (route.params && route.params.filteredEvents) {
      setEvents(route.params.filteredEvents);
      setIsFiltered(true); 
    }
  }, [route.params]);

  useEffect(() => {
    setReloadOnce(!reloadData);
    const timer = setTimeout(() => {
      setReloadOnce(!reloadData);
    }, 1000 * 5);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = () => {
    const keywordLower = searchKeyword.toLowerCase();

    const filteredEvents = events.filter((event) =>
      event.eventName.toLowerCase().includes(keywordLower)
    );

    if (filteredEvents.length === 0) {
      navigation.navigate("NoResult");
    } else {
      setEvents(filteredEvents);
    }
    setIsFiltered(true);
  };

  const handleCancel = () => {
    setSearchKeyword("");
    setIsFiltered(false);
    fetchData();
  };

  useFocusEffect(
    React.useCallback(() => {
      setSearchKeyword("");
      fetchData();
    }, [])
  );

  const [selectedDateEvents, setSelectedDateEvents] = useState([]);

  const handleDateChange = (date) => {
    const filteredEvents = events.filter((event) =>
      moment(event.date).isSame(date, "day")
    );
    setSelectedDateEvents(filteredEvents);
  };

  return (
    <SafeAreaView>
      <View style={styles.main}>
        <View style={styles.searchbar}>
          <Image
            source={require("../assets/unilogo.png")}
            style={{ width: 48, height: 48 }}
          />
          <SearchBar
            lightTheme
            placeholder="Search"
            onSubmitEditing={handleSearch}
            value={searchKeyword}
            onChangeText={(text) => setSearchKeyword(text)}
            onCancel={handleCancel}
            containerStyle={styles.searchBarContainer}
            inputContainerStyle={styles.searchBarInputContainer}
            inputStyle={{ color: "black" }}
          />
        </View>

        <View>
          <ButtonGroup
            buttons={["All", "Upcoming", "Calendar"]}
            containerStyle={{ marginRight: 20, marginTop: 20 }}
            onPress={(selectedIdx) => setSelectedIndex(selectedIdx)}
            selectedIndex={selectedIndex}
          />
        </View>
        <View style={{ paddingBottom: 150, paddingRight: 20 }}>
          <ScrollView>
            {selectedIndex === 2 ? (
              <CalendarComponent
                onDateChange={handleDateChange}
                events={events}
              />
            ) : (
              events.length > 0 &&
              events
                .filter(
                  (event) =>
                    selectedIndex === 0 ||
                    (selectedIndex === 1 &&
                      moment(event.date).diff(new Date(), "days") >= 0)
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
                ))
            )}
          </ScrollView>
        </View>

        {selectedIndex !== 2 && role !== TYPE_PARENT && (
          <>
            <SpeedDial
              isOpen={open}
              icon={() => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Feather name="plus-circle" size={28} color="white" />
                  <Text style={{ color: 'white', marginLeft: 10, marginRight:20 }}>New Event</Text>
                  <Feather name="chevron-up" size={24} color="white" />
                </View>
              )}
              openIcon={{ name: 'close', color:"white" }}
              onOpen={() => setOpen(!open)}
              onClose={() => setOpen(!open)}
              overlayColor="rgba(256,249,246,0.8)"
              buttonStyle={{ backgroundColor:"#613194", width:180, height:50, padding:0}}
            >
              <SpeedDial.Action
                icon={<MaterialCommunityIcons name="ticket-outline" size={30} color="#9B77C2" />}
                buttonStyle={{ backgroundColor:"#DEC8D5", width:50, height:50}}
                title="New Event"
                titleStyle={{backgroundColor:'transparent', fontSize: 18, fontWeight:'bold'}}
                onPress={() => {
                  navigation.navigate("CreateEvent");
                }}
              />
              <SpeedDial.Action
                icon={<Ionicons name="chatbubble-ellipses-outline" size={30} color="#9B77C2" />}
                buttonStyle={{ backgroundColor:"#DEC8D5", width:50, height:50}}
                titleStyle={{backgroundColor:'transparent', fontSize: 18, fontWeight:'bold'}}
                title="Update Parents"
                onPress={() => console.log('Add Something')}
              />
            </SpeedDial>
          </>
        )}
        {/* <View style={{paddingBottom:50}}></View> */}
      </View>
    </SafeAreaView>
  );
};

const styles = {
  main: {
    paddingLeft: 20,
    marginBottom: 210,
  },
  searchbar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 20,
  },
  searchBarContainer: {
    flex: 1,
    backgroundColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
  },
  searchBarInputContainer: {
    backgroundColor: "#D8D4DE",
    borderRadius: 25,
    height: 50,
    // flex: 1,
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
};
export default EventListScreen;
