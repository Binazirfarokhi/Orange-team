import { Button, Image } from "@rneui/themed";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { POSITION_L1 } from "../util/constants";
import { Alert } from "react-native";
import { deleteCall } from "../contexts/api";
import { Avatar } from "react-native-gifted-chat";
import { ProfileImage } from "./profile-image.component";

export default function EventItem({ navigation, event, orgPos, reload, role }) {
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
  const dateOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const formattedDate = new Intl.DateTimeFormat("en-US", dateOptions).format(
    eventDate
  );
  const displayDateTime = `${formattedDate} ${time}`;

  const iconEdit =
    role === 0 ? (
      <Feather name="share" size={20} color="green" />
    ) : (
      <MaterialCommunityIcons name="pencil" size={22} color="green" />
    );
  const iconDelete =
    role === 0 ? (
      <Feather name="bookmark" size={20} color="green" />
    ) : (
      <FontAwesome name="trash" size={20} />
    );

  return (
    <View style={styles.main}>
      <View
        style={{
          flex: 1,
          paddingRight: 20,
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Image
          style={{
            width: 115,
            height: 115,
            borderRadius: 5,
          }}
          source={
            images && images !== null && images.length > 0
              ? { uri: images[0] }
              : require("../assets/unilogo.png")
          }
        />
      </View>
      <View style={{ flex: 2, display: "flex", flexDirection: "column" }}>
        <TouchableOpacity style={styles.button} onPress={goto}>
          <View style={{ marginTop: 5 }}>
            <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
              {eventName}
            </Text>
          </View>
          <View style={{ paddingTop: 15, paddingBottom: 12 }}>
            <Text style={styles.datetime}>{displayDateTime}</Text>
            <Text style={{ fontFamily: "Roboto-Regular" }}>
              {location.split(",")[0]}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.option}>
          <View style={{ flexDirection: "column", fex: 2, display: "flex" }}>
            <Text style={{ fontFamily: "Roboto-Regular" }}>
              {ageGroup} Years
            </Text>
            <Text style={{ fontFamily: "Roboto-Regular" }}>
              {participants} Participants
            </Text>
          </View>
          <View
            style={{ flex: 1, flexDirection: "row", gap: 1, marginLeft: 45 }}>
            <Button icon={iconEdit} onPress={editEvent} type="clear" />
            <Button icon={iconDelete} onPress={deleteEvent} type="clear" />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    padding: 10,
    display: "flex",
    minHeight: 150,
    flexDirection: "row",
  },
  name: {
    fontSize: 18,
    fontFamily: "Roboto-Bold",
  },
  datetime: {
    fontSize: 14,
    fontFamily: "Roboto-Bold",
  },
  option: {
    display: "flex",
    flexDirection: "row",
  },
});
