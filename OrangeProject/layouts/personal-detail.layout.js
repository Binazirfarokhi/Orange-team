import { ScrollView, Text, View } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useEffect, useState } from "react";
import { get } from "../contexts/api";
import { ProfileImage } from "../components/profile-image.component";
import { getPersistData } from "../contexts/store";

const ParentDetailScreen = ({ navigation, route }) => {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    getPersistData("userInfo")
      .then((data) => {
        setUserInfo(data[0]);
        // setOrganizationId(organization)
        // get(`/orgs/${organization}`).then(orgData => {
        //     setOrganization(orgData.data.name);
        // }).catch(error=> alert('Unable to load organization data'));
        // get(`/orgs/volunteer/${organization}`).then(volData => {
        //     setAvailableVolunteers(volData.data.data)
        // }).catch(error=> alert('Unable to load organization data'));
      })
      .catch((error) => alert("Unable to load user data"));
  }, []);

  return (
    <View style={styles.main}>
      <View style={{ paddingLeft: 20, height: 30 }}>
        <Feather
          name="arrow-left"
          size={30}
          style={styles.leftIcon}
          onPress={() => navigation.goBack()}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={{ ...styles.profileImage, ...styles.row }}>
          <ProfileImage />
        </View>
        <View style={{ ...styles.row }}>
          <Text style={styles.title}>
            {userInfo.signup.displayName || "Unknown"}
          </Text>
        </View>
        <View style={{ ...styles.row }}>
          <Text style={styles.title}>
            {userInfo.signup.displayName || "Unknown"}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = {
  leftIcon: {
    textAlign: "left",
  },
  main: {
    paddingTop: 50,
    display: "flex",
    backgroundImage: `url("../assets/parent-background.png")`,
  },
  name: {
    paddingTop: 10,
    fontSize: 30,
    fontWeight: "bold",
  },
  profileImage: {},
  scrollView: {
    alignItems: "center",
  },
  row: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
  },
  title: {
    fontSize: 40,
  },
};

export default ParentDetailScreen;
