import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Feather from "react-native-vector-icons/Feather";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { getPersistData } from "../contexts/store";
import React, { useState } from "react";
import {
  TYPE_ORGANIZATION,
  TYPE_PARENT,
  TYPE_VOLUNTEER,
} from "../util/constants";
import { useContext } from "react";
import AuthContext from "../contexts/auth";
import { Avatar, Button, Image } from "@rneui/themed";
import { getImageUrl, uploadImage } from "../util/general-functions";
import { UserInactiveIcon } from "../components/icon/icon";
import { AccountIcon, EventHistoryIcon, PersonInfoIcon, SettingIcon, StarIcon, TimeIcon, TimeVolunteerIcon } from "../components/icon/profile-icon";

function HomeScreen({ navigation }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState(0);
  const [id, setId] = useState();
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
          setId(data[0].id);
          setRole(data[0].role);
          getImageUrl(data[0].id)
            .then((data) => {
              if (data !== "FAILED") setImage(data);
            })
            .catch((error) => console.error(error));
        }
      })
      .catch((error) => {
        console.error(error);
        alert(error);
      });
  }, []);

  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const img = await uploadImage("user", id);
    if (img !== "FAILED") setImage(img);
  };

  reloadUserData()
    .then((data) => {})
    .catch(console.log);
  return (
    <>
      <View style={{ flex: 1 }}>
        {role === TYPE_PARENT ? (
          <>
            <ImageBackground
              source={require("../assets/parent-background.png")} 
              style={{ flex: 1, marginBottom: -150}}
              resizeMode="cover"
            >
              <View style={{ 
                flex: 1, 
                backgroundColor: 'rgba(222, 200, 213, 0.9)', 
                justifyContent:'center',
                alignItems: 'center',}}
              >
                <Image
                  source={require("../assets/parent.png")}
                  style={{
                    opacity: 1,
                    width: 250,
                    height: 750,
                    marginLeft: 100,
                  }}
                  resizeMode="contain"
                />
              </View>
            </ImageBackground>
            <View style={{ position: 'relative' }}>
              <Text style={styles.title}>Hi,</Text>
              <Text style={styles.parentusername}>{name}</Text>
            </View>
            </>
        ) : (
          <>
            <ImageBackground
              source={require("../assets/parent-background.png")}
              imageStyle={{ opacity: 0.1, marginBottom: -200 }}
              resizeMode="cover">
              <View style={{ alignItems: "center", paddingTop: 50,marginTop:20 }}>
                <Avatar
                  size={100}
                  avatarStyle={{}}
                  rounded
                  source={
                    image ? { uri: image } : require("../assets/boy.png")
                  }>
                  <Avatar.Accessory size={34} onPress={pickImage} />
                </Avatar>
              </View>
              <Text style={styles.username}>{name}</Text>
            </ImageBackground>
          </>
        )}
      </View>
      <View
        style={{ ...styles.home, flex: role === TYPE_ORGANIZATION ? 1 : 2 }}>
        {role !== TYPE_ORGANIZATION && (
          <View style={styles.list}>
            <View style={styles.leftIcon}>
              <AccountIcon />
            </View>
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
            <View style={styles.leftIcon}>
              <PersonInfoIcon />
            </View>
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
            <View style={styles.leftIcon}>
              <TimeVolunteerIcon />
            </View>
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
            <View style={styles.leftUpIcon}>
              <EventHistoryIcon />
            </View>
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
            <View style={styles.leftUpIcon2}>
              <TimeIcon />
            </View>
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
            <View style={styles.leftIcon}>
              <TimeVolunteerIcon />
            </View>
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
          <View style={styles.leftUpIcon2}>
            <SettingIcon />
          </View>
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
          <View style={{ ...styles.list, display: "flex", marginBottom:15}}>
            <Button
              onPress={signOut}
              title="Login"
              containerStyle={{ flex: 1, marginRight: 30 }}>
              Logout
            </Button>
          </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontFamily: 'Roboto-Bold',
    color:"#613194",
    position: 'absolute', 
    top: -140, 
    left: 40, 
  },
  parentusername: {
    fontSize: 30,
    fontFamily: 'Roboto-Bold',
    color:"#613194",
    osition: 'absolute', 
    top: -100, 
    left: 40,
  },
  username: {
    paddingTop: 20,
    fontSize: 25,
    fontFamily: 'Roboto-Bold',
    textAlign:"center",
    color:"#613194"
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
    paddingTop: 20,
    flex: 1,
  },
  listText: {
    fontSize: 20,
    flex: 5,
  },
  leftIcon: {
    flex: 1,
  },
  leftUpIcon: {
    flex: 1,
    marginTop:5,
  },
  leftUpIcon2: {
    flex: 1,
    marginTop:3,
  },
  rightIcon: {
    flex: 1,
  },
});

export default HomeScreen;
