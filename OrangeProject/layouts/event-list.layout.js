import { Button, Image, Input, Text, SearchBar } from "@rneui/themed";
import { View } from "react-native";

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useEffect } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { useState } from "react";
import MyTheme from "../contexts/theme";
import { ButtonGroup } from "@rneui/themed";
import { ScrollView } from "react-native";
import EventItem from "../components/event-item.component";
import { getPersistData } from "../contexts/store";
import { get } from "../contexts/api";
import { DATE_FORMAT_DISPLAY, POSITION_L1, TYPE_ORGANIZATION, TYPE_PARENT } from "../util/constants";
import moment from "moment";
import { bindOrgAndPosition } from '../util/general-functions'
import AuthContext from "../contexts/auth";
import { SafeAreaView } from "react-native-safe-area-context";

let index = 0;

const EventListScreen = ({ navigation, route }) => {
  const { signOut } = React.useContext(AuthContext);
  const [eventName, setEventName] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [orgPos, setOrgPos] = useState({});
  const [reloadOnce, setReloadOnce] = useState(true);
  const [role, setRole] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');

    const reloadData = () => {
        setReloadOnce(!reloadOnce)
    }

  const fetchData = async () => {
    const data = await getPersistData("userInfo");
    if (data && data.length > 0) {
      let result = [];
      const { orgs, positionOfOrganization, role } = data[0];
      setRole(role);
      setOrgPos(bindOrgAndPosition(orgs, positionOfOrganization));
      if (role === TYPE_ORGANIZATION) {
        result = (await get(`/orgs/events/${data[0].organization}`)).data.data;
      } else {
        result = (await get(`/orgs/events`)).data.data;
      }
      setEvents(result);
    }
  };

  useEffect(() => {
    if (!(route.params && route.params.filteredEvents)) {
      fetchData();
    }
  }, [reloadOnce]);

  useEffect(() => {
    if (route.params && route.params.filteredEvents) {
      setEvents(route.params.filteredEvents);
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
  
    const filteredEvents = events.filter(event =>
      event.eventName.toLowerCase().includes(keywordLower)
    );
  
    if (filteredEvents.length === 0) {
      navigation.navigate('NoResult');
    } else {
      setEvents(filteredEvents);
    }
  };
  
  const handleCancel = () => {
    setSearchKeyword('');
    fetchData(); 
  };

  useFocusEffect(
    React.useCallback(() => {
      setSearchKeyword('');
      fetchData();
    }, [])
  );
  

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
          inputStyle={{color:'black'}}
        />
      </View>

            <View>
                <ButtonGroup
                    buttonStyle={{}}
                    buttonContainerStyle={{}}
                    buttons={[
                        "All",
                        "Upcoming"
                    ]}
                    containerStyle={{ marginRight: 20, marginTop: 20 }}
                    disabled={[3, 4]}
                    disabledStyle={{}}
                    disabledTextStyle={{}}
                    disabledSelectedStyle={{}}
                    disabledSelectedTextStyle={{}}
                    innerBorderStyle={{}}
                    onPress={selectedIdx =>
                        setSelectedIndex(selectedIdx)
                    }
                    selectedButtonStyle={{}}
                    selectedIndex={selectedIndex}
                    selectedTextStyle={{}}
                    textStyle={{}}
                />
            </View>
            <View style={{ paddingBottom: 150, paddingRight: 20 }}>
                <ScrollView>
                    {events.length > 0 && events
                        .filter(event => selectedIndex === 0 || (selectedIndex === 1 && moment(event.date, DATE_FORMAT_DISPLAY).diff(new Date(), 'day') >= 0))
                        .filter(event => eventName === '' || event.eventName.indexOf(eventName) >= 0)
                        .map(event => (<EventItem key={event.id} event={event} navigation={navigation} orgPos={orgPos} reload={reloadData} />))}
                </ScrollView>
            </View>
            {/* <View style={styles.backdrop}></View> */}
            {role !== TYPE_PARENT &&
                <View style={styles.container}>
                    <Button titleStyle={styles.button}
                        containerStyle={{ borderRightWidth: 1, borderRightColor: '#CCC' }}
                        onPress={() => {
                            navigation.navigate('CreateEvent')
                        }}
                        type="clear"
                    ><Ionicons name="add-circle-outline" size={20} color={'#FFF'} /> New Event</Button>
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
    </SafeAreaView>
  );
};

const styles = {
  main: {
    paddingLeft: 20,
  },
  searchbar: {
    display: "flex",
    flexDirection: "row",
    alignItems: 'center', 
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

