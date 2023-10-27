import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Feather from "react-native-vector-icons/Feather";
import { StyleSheet, Text, View } from "react-native";
import { getPersistData } from "../contexts/store";
import React, { useState } from "react";
import {
  TYPE_ORGANIZATION,
  TYPE_PARENT,
  TYPE_VOLUNTEER,
} from "../util/constants";
import { useContext } from "react";
import AuthContext from "../contexts/auth";
import { Button } from "@rneui/themed";

function HomeScreen({ navigation }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState(0);
  const { reloadUserData, signOut } = useContext(AuthContext);
  React.useEffect(() => {
    getPersistData("userInfo")
      .then((data) => {
        if (data && data.length > 0) {
          if (data[0].role === TYPE_ORGANIZATION) {
            const { name } = data[0].orgDetail;
            setName(name);
          } else {
            const { displayName } = data[0].signup;
            setName(displayName);
          }
          setRole(data[0].role);
        }
      })
      .catch((error) => {
        console.error(error);
        alert(error);
      });
  }, []);
  reloadUserData()
    .then((data) => {})
    .catch(console.log);
  return (
    <>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Hi,</Text>
        <Text style={styles.username}>{name}</Text>
      </View>
      <View
        style={{ ...styles.home, flex: role === TYPE_ORGANIZATION ? 1 : 2 }}>
        {role !== TYPE_ORGANIZATION && (
          <View style={styles.list}>
            <FontAwesome name="user" size={20} style={styles.leftIcon} />
            <Text
              style={styles.listText}
              onPress={() => navigation.navigate("Account")}>
              Account
            </Text>
            <FontAwesome
              name="chevron-right"
              size={20}
              style={styles.rightIcon}
            />
          </View>
        )}
        <View style={styles.list}>
          <FontAwesome name="home" size={20} style={styles.leftIcon} />
          <Text
            style={styles.listText}
            onPress={() => navigation.navigate("PersonalInformation")}>
            {role === TYPE_ORGANIZATION ? "Contact" : "Personal"} Infomation
          </Text>
          <FontAwesome
            name="chevron-right"
            size={20}
            style={styles.rightIcon}
          />
        </View>
        {role === TYPE_PARENT && (
          <View style={styles.list}>
            <FontAwesome name="group" size={20} style={styles.leftIcon} />
            <Text
              style={styles.listText}
              onPress={() => navigation.navigate("ChildrenList")}>
              List of Children
            </Text>
            <FontAwesome
              name="chevron-right"
              size={20}
              style={styles.rightIcon}
            />
          </View>
        )}
        {role !== TYPE_ORGANIZATION && (
          <View style={styles.list}>
            <FontAwesome name="table" size={20} style={styles.leftIcon} />
            <Text
              style={styles.listText}
              onPress={() => navigation.navigate("EventHistory")}>
              Event History
            </Text>
            <FontAwesome
              name="chevron-right"
              size={20}
              style={styles.rightIcon}
            />
          </View>
        )}
        {role === TYPE_ORGANIZATION && (
          <View style={styles.list}>
            <Feather name="file-plus" size={20} style={styles.leftIcon} />
            <Text
              style={styles.listText}
              onPress={() => navigation.navigate("Event")}>
              Event
            </Text>
            <FontAwesome
              name="chevron-right"
              size={20}
              style={styles.rightIcon}
            />
          </View>
        )}
        {role === TYPE_ORGANIZATION && (
          <View style={styles.list}>
            <FontAwesome name="building-o" size={20} style={styles.leftIcon} />
            <Text
              style={styles.listText}
              onPress={() => navigation.navigate("OrganizationDetails")}>
              Organization Information
            </Text>
            <FontAwesome
              name="chevron-right"
              size={20}
              style={styles.rightIcon}
            />
          </View>
        )}
        {role === TYPE_VOLUNTEER && (
          <View style={styles.list}>
            <FontAwesome5 name="user-tag" size={20} style={styles.leftIcon} />
            <Text
              style={styles.listText}
              onPress={() => navigation.navigate("TimeInVolunteer")}>
              Time In Volunteer
            </Text>
            <FontAwesome
              name="chevron-right"
              size={20}
              style={styles.rightIcon}
            />
          </View>
        )}
        {role === TYPE_VOLUNTEER && (
          <View style={styles.list}>
            <FontAwesome5
              name="align-justify"
              size={20}
              style={styles.leftIcon}
            />
            <Text
              style={styles.listText}
              onPress={() => navigation.navigate("VolunteerDetail")}>
              Volunteer Detail
            </Text>
            <FontAwesome
              name="chevron-right"
              size={20}
              style={styles.rightIcon}
            />
          </View>
        )}
        {role === TYPE_VOLUNTEER ||
          (role === TYPE_ORGANIZATION && (
            <View style={styles.list}>
              <FontAwesome name="star" size={20} style={styles.leftIcon} />
              <Text
                style={styles.listText}
                onPress={() => navigation.navigate("Review")}>
                Review
              </Text>
              <FontAwesome
                name="chevron-right"
                size={20}
                style={styles.rightIcon}
              />
            </View>
          ))}
        <View style={styles.list}>
          <FontAwesome name="gear" size={20} style={styles.leftIcon} />
          <Text
            style={styles.listText}
            onPress={() => navigation.navigate("Settings")}>
            Setting
          </Text>
          <FontAwesome
            name="chevron-right"
            size={20}
            style={styles.rightIcon}
          />
        </View>
        {role === TYPE_ORGANIZATION && (
          <View style={{ ...styles.list, display: "flex" }}>
            <Button
              onPress={signOut}
              title="Login"
              containerStyle={{ flex: 1, marginRight: 20 }}>
              Logout
            </Button>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    paddingTop: 40,
    fontSize: 40,
    fontWeight: "bold",
    marginTop: 48,
    paddingLeft: 24,
  },
  username: {
    paddingTop: 40,
    fontSize: 30,
    fontWeight: "bold",
    paddingLeft: 40,
  },
  home: {
    border: "1px solid #DDD",
    backgroundColor: "white",
    borderTopLeftRadius: "50px",
    borderTopRightRadius: "50px",
    paddingTop: 16,
    alignItems: "center",
  },
  list: {
    flexDirection: "row",
    paddingLeft: 30,
    paddingTop: 30,
    flex: 1,
  },
  listText: {
    fontSize: 20,
    flex: 5,
  },
  leftIcon: {
    flex: 1,
  },
  rightIcon: {
    flex: 1,
  },
});

export default HomeScreen;
