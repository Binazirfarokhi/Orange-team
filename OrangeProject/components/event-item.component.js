import { Button, Image } from "@rneui/themed";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { POSITION_L1 } from "../util/constants";
import { Alert } from "react-native";
import { deleteCall } from "../contexts/api";
import { Avatar } from "react-native-gifted-chat";
import { ProfileImage } from "./profile-image.component";

export default function EventItem({ navigation, event, orgPos, reload }) {
  const {
    eventName,
    date,
    time,
    organization,
    images,
    location,
    id,
    ageGroup,
    participants,
  } = event;
  const postion = orgPos[organization] || POSITION_L1;
  const goto = () => {
    navigation.navigate("EventDetail", { id });
  };

  const deleteEvent = () => {
    Alert.alert("Warning", `Would you like to delete event "${eventName}"`, [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      { text: "OK", onPress: confirmDelete },
    ]);
  };

  const confirmDelete = async () => {
    try {
      const result = await deleteCall(`/orgs/event/${id}`).data;
      if (result.status === "OK") reload();
    } catch (error) {
      console.error(error);
      alert("Unable to delete event.");
    }
  };

  const editEvent = () => {
    navigation.navigate("CreateEvent", { id });
  };

  const eventDate = new Date(date);
  const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(eventDate);
  const displayDateTime = `${formattedDate} ${time}`;
  return (
      <View style={styles.main}>
          <View style={{ flex: 1, paddingRight: 20, alignItems: 'center', justifyContent: 'center' }}>
              <Image
                  style={{
                      width: 110,
                      height: 110,
                      borderRadius: 15,
                  }}
                  source={(images && images !== null && images.length > 0)?{ uri: images[0] }: require('../assets/unilogo.png')} />
          </View>
          <View style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
              <TouchableOpacity style={styles.button} onPress={goto}>
                  <View style={{}}>
                      <Text style={styles.name}>{eventName}</Text>
                  </View>
                  <View style={{ paddingTop: 15, paddingBottom: 16, }}>
                      <Text style={styles.datetime}>{displayDateTime}</Text>
                      <Text>{location.split(',')[0]}</Text>
                  </View>
              </TouchableOpacity>
              <View style={styles.option}>
                  <View style={{ flexDirection: 'column', fex: 2, display: 'flex' }}>
                      <Text>{ageGroup} Years</Text>
                      <Text>{participants} Participants</Text>
                  </View>
                  <View style={{ flex: 1, flexDirection: "row", justifyContent: 'space-around' }}>
                      <Button icon={<FontAwesome name='edit' size={20} color="green" />} onPress={editEvent} type="clear" />
                      <Button icon={<FontAwesome name='trash' size={20} />} onPress={deleteEvent} type="clear" />
                  </View>
              </View>
          </View>
      </View>
  );
}

const styles = StyleSheet.create({
    main: {
        marginTop: 10,
        padding: 10,
        display: 'flex',
        minHeight: 150,
        flexDirection: "row",
    }, name: {
        fontSize: 17,
        fontWeight: 'bold'
    }, datetime: {
        fontSize: 14,
        fontWeight: 'bold'
    }
    , option: {
        display: 'flex',
        flexDirection: 'row',
    }
})