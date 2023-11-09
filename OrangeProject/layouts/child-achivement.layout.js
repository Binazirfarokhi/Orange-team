import Feather from "react-native-vector-icons/Feather";
import { Button, Input, CheckBox } from "@rneui/themed";
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  ImageBackground,
} from "react-native";
import { useEffect, useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { get, post, put } from "../contexts/api";
import { getPersistData } from "../contexts/store";
import CardWithNext from "../components/card.component";
import ActivityItem from "../components/activity-item.component";
import { Avatar } from "@rneui/themed";

const badge = require("../assets/budge.png");

const ChildAchivementScreen = ({ navigation }) => {
  const back = () => navigation.goBack();
  return (
    <View style={styles.main}>
      <ScrollView style={{ paddingRight: 20 }}>
        <Feather
          name="arrow-left"
          size={30}
          style={styles.leftIcon}
          onPress={() => back()}
        />
        <Text style={styles.title}>Achievements</Text>
        <View>
          <Text style={styles.subtitle}>Girl Guides</Text>
          <View style={styles.item}>
            <Text style={styles.text}>Attendance</Text>
            <Text style={styles.text}> 12/56</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.text}>Level</Text>
            <Text style={styles.text}>Sparks</Text>
          </View>
          <Text style={styles.text}>Badges</Text>
          <View style={styles.badge}>
            <Avatar
              size={120}
              avatarStyle={{ marginTop: 5 }}
              rounded
              source={badge}></Avatar>
            <Avatar
              size={120}
              avatarStyle={{ marginTop: 5 }}
              rounded
              source={badge}></Avatar>
          </View>
        </View>
        <View
          style={{
            paddingTop: 20,
            marginBottom: 20,
            borderBottomColor: "black",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        <View>
          <Text style={styles.subtitle}>Girl Soccer Team</Text>
          <View style={styles.item}>
            <Text style={styles.text}>Attendance</Text>
            <Text style={styles.text}> 10/12</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.text}>Level</Text>
            <Text style={styles.text}>Junior</Text>
          </View>
          <Text style={styles.text}>Badges</Text>
          <View style={styles.badge}>
            <Avatar
              size={120}
              avatarStyle={{ marginTop: 5 }}
              rounded
              source={badge}></Avatar>
            <Avatar
              size={120}
              avatarStyle={{ marginTop: 5 }}
              rounded
              source={badge}></Avatar>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  main: {
    paddingLeft: 20,
    paddingTop: 60,
    flex: 1,
    display: "flex",
    backgroundImage: `url("../assets/parent-background.png")`,
  },
  title: {
    paddingTop: 30,
    paddingBottom: 30,
    fontSize: 30,
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: 20,
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  text: {
    padding: 15,
    fontSize: 20,
  },
  badge: {
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
});

export default ChildAchivementScreen;
