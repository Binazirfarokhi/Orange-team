import { ImageBackground, ScrollView, Text, View } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { get, patch } from "../contexts/api";
import moment from "moment/moment";
import { POSITIONS, getPositionByIndex } from "../util/constants";
import { Dropdown } from "react-native-element-dropdown";
import { getPersistData } from "../contexts/store";
import { Avatar, Button, Image, Card } from "@rneui/themed";
import { getImageUrl } from "../util/general-functions";

const VolunteerDetailScreen = ({ navigation, route }) => {
  const [id, setid] = useState();
  const [email, setEmail] = useState();
  const [fromOrg, setFromOrg] = useState();
  const [orgId, setOrgId] = useState();
  const [avgStar, setAvgStar] = useState(0);
  useEffect(() => {
    if (route && route.params) {
      setEmail(route.params.email);
      setFromOrg(route.params.fromOrg);
      setOrgId(route.params.orgId);
      setid(route.params.id);
    }
  }, []);

  const [image, setImage] = useState();

  const [volunteerInfo, setVolunteerInfo] = useState({});
  const [collapse, setCollapse] = useState(99);
  const [selectedDropdown, setSelectedDropdown] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [updatedOrgPosition, setUpdatedOrgPosition] = useState(false);
  const [orgList, setOrgList] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);

  const setCollapseToggle = (index) => {
    setCollapse(collapse === index ? 99 : index);
  };

  const loadReview = async (id) => {
    const result = await get(`/profile/review/${id}`);
    setReviews(result.data.data);
    let starCount = 0;
    if (result.data.data && result.data.data.length > 0)
      result.data.data.forEach((review) => {
        starCount += review.stars;
      });
    setAvgStar(starCount / result.data.data.length);
  };

  useEffect(() => {
    get(`/orgs`)
      .then((data) => {
        setOrgList(data.data);
      })
      .catch((error) => {
        console.error(error);
        alert("Unable to load organization list.");
      });
  }, []);

  useEffect(() => {
    getPersistData("userInfo").then(async (data) => {
      if (data && data.length > 0) {
        const { emailAddress } = data[0].signup;
        if (!email || email === null) setEmail(emailAddress);
        const result = (await get(`/profile/${emailAddress}`)).data[0];
        getImageUrl(data[0].id)
          .then((data) => {
            if (data !== "FAILED") setImage(data);
          })
          .catch((error) => {});
        get(`/profile/${email && email !== null ? email : emailAddress}`)
          .then((data) => {
            setid(data.data[0].id);
            setVolunteerInfo(data.data[0]);
            if (
              data.data[0] &&
              data.data[0].positionOfOrganization &&
              data.data[0].positionOfOrganization.length > 0
            ) {
              let posits = data.data[0].positionOfOrganization.map((posit) =>
                getPositionByIndex(posit)
              );
              setSelectedDropdown(posits);
            }

            loadReview(data.data[0].id);
          })
          .catch((error) => {
            console.error(error);
            alert("Unable to find volunteer information");
          });
      }
    });
  }, [email]);

  useEffect(() => {
    if (updatedOrgPosition) {
      console.log(
        id,
        selectedDropdown.map((drop) => drop.value)
      );
      patch(
        `/orgs/volunteer/${id}`,
        selectedDropdown.map((drop) => drop.value)
      )
        .then((data) => alert(data.data.message))
        .catch((error) => {
          alert(error);
          console.error(error);
        });
    }
  }, [selectedDropdown]);

  const getOrg = (index) => {
    let org = "",
      positon = "Please reach out to Organization Admin";
    if (volunteerInfo.orgs.length > index) {
      org = volunteerInfo.orgs[index];
      org = orgList.filter((o) => o.id === org)[0].name;
    } else {
      return;
    }
    if (volunteerInfo.positionOfOrganization.length > index)
      positon = volunteerInfo.positionOfOrganization[index];
    return (
      <View
        key={index}
        style={{
          display: "flex",
          flexDirection: "column",
          height: (fromOrg ? 40 : 20) * volunteerInfo.orgs.length,
        }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardItem}>{org}:</Text>
        </View>
        <View style={{ flex: 1, paddingLeft: 30 }}>
          {getOrgPosition(positon, index)}
        </View>
      </View>
    );
  };

  const getOrgPosition = (position, index) => {
    if (!fromOrg) return <Text style={styles.cardItem}>{position}</Text>;
    return (
      <Dropdown
        style={{
          ...styles.dropdown,
          height: 30,
        }}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={POSITIONS}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "Select item" : "..."}
        searchPlaceholder="Search..."
        value={selectedDropdown[index]}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          let data = [...selectedDropdown];
          data[index] = item;
          setSelectedDropdown(data);
          setIsFocus(false);
          setUpdatedOrgPosition(true);
        }}
      />
    );
  };

  const eventsData = [
    { eventName: "Girls Basketball", date: "Nov 2, 2023", time: "12:00PM" },
    { eventName: "Building Your Lemonade Stand", date: "Nov 20, 2023", time: "3:00PM" },
    { eventName: "Soccer Training", date: "Nov 7, 2023", time: "6:00PM" },
    { eventName: "Girls Hockey Competition", date: "Nov 12, 2023", time: "10:00AM" }
  ];

  if (!volunteerInfo || !volunteerInfo.signup) return null;
  return (
    <>
      <View style={styles.main}>

        <ImageBackground
          source={require("../assets/parent-background.png")}
          imageStyle={{ opacity: 0.1, marginBottom: -100 }}
          resizeMode="cover">
          <View style={{marginTop:50}}>
            <View style={{ paddingLeft: 20, height: 30 }}>
              <Feather
                name="arrow-left"
                size={30}
                style={styles.leftIcon}
                onPress={() => navigation.goBack()}
              />
            </View>
            <ScrollView style={{ paddingBottom: 250 }}>
              <View style={{ alignItems: "center" }}>
                <Avatar
                  size={120}
                  avatarStyle={{ marginLeft: 0 }}
                  rounded
                  source={
                    image ? { uri: image } : require("../assets/boy.png")
                  }></Avatar>
                <Text style={styles.name}>
                  {volunteerInfo.signup.displayName}
                </Text>
              </View>
              <View style={styles.someInfo}>
                <View style={styles.eachInfo}>
                  <Text style={{fontWeight:'bold', fontSize:18}}>4</Text>
                  <Text style={styles.smallFont}>Event Joined</Text>
                </View>
                <View style={styles.eachInfo}>
                  <Text style={{fontWeight:'bold', fontSize:18}}>
                    {`${moment().diff(moment.unix(volunteerInfo.signup.createdAt.seconds), 'days')} days`}
                  </Text>
                  <Text style={styles.smallFont}>Time in Volunteer</Text>
                </View>
                {/* <View style={styles.eachInfo}><Text>0</Text><Text style={styles.smallFont}>View Profile</Text></View> */}
              </View>
              <View style={styles.list}>
                <View style={styles.item}>
                  <FontAwesome5
                    name="user-alt"
                    size={20}
                    style={styles.leftIcon}
                  />
                  <Text
                    style={styles.itemText}
                    onPress={() => setCollapseToggle(0)}>
                    Personal Information
                  </Text>
                  <FontAwesome
                    name={collapse === 0 ? "chevron-up" : "chevron-down"}
                    size={20}
                    style={styles.rightIcon}
                  />
                </View>
                {collapse === 0 && (
                  <View style={styles.card}>
                    <Text style={styles.cardLabel}>Email</Text>
                    <Text style={styles.cardItem}>
                      {volunteerInfo.signup.emailAddress}
                    </Text>
                    <Text style={styles.cardLabel}>Phone Number</Text>
                    <Text style={styles.cardItem}>
                      (778)-321-5361
                    </Text>
                    <Text style={styles.cardLabel}>Organization</Text>
                    <Text style={styles.cardItem}>
                      Girl Guides
                    </Text>
                    {volunteerInfo.orgs && (
                      <>
                        <Text style={styles.cardLabel}>
                          Position of Organization
                        </Text>
                        <View>
                        <Text style={styles.cardItem}>
                          Volunteer
                        </Text>
                        </View>
                      </>
                    )}
                  </View>
                )}
                <View style={styles.item}>
                  <FontAwesome name="clock-o" size={20} style={styles.leftIcon} />
                  <Text
                    style={styles.itemText}
                    onPress={() => setCollapseToggle(2)}>
                    Time In Volunteer
                  </Text>
                  <FontAwesome
                    name={collapse === 2 ? "chevron-up" : "chevron-down"}
                    size={20}
                    style={styles.rightIcon}
                  />
                </View>

                {collapse === 2 && (
                  <View style={styles.card}>
                    <Text style={styles.cardItem}>
                      Times in:{" "}
                      {`${moment().diff(moment.unix(volunteerInfo.signup.createdAt.seconds), 'days')} days`}
                    </Text>
                    <Text style={styles.cardItem}>
                      Since:{" "}
                      {moment
                        .unix(volunteerInfo.signup.createdAt.seconds)
                        .format("MMMM Do YYYY, h:mm:ss a")}
                    </Text>
                  </View>
                )}

                <View style={styles.item}>
                  <MaterialIcons
                    name="event-available"
                    size={20}
                    style={styles.leftIcon}
                  />
                  <Text
                    style={styles.itemText}
                    onPress={() => setCollapseToggle(3)}>
                    Event History
                  </Text>
                  <FontAwesome
                    name={collapse === 3 ? "chevron-up" : "chevron-down"}
                    size={20}
                    style={styles.rightIcon}
                  />
                </View>

                {collapse === 3 && (
                  <View style={{marginBottom:20}}>
                  {eventsData.map((event, index) => (
                    <Card key={index} containerStyle={{backgroundColor:'#613194', borderRadius:10, marginBottom:10, marginRight:40, flexDirection:'row', position: 'relative', padding: 20}}>
                      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent:'space-between' }}>
                        <View style={{ flexShrink: 1 }}>
                          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>
                            {event.eventName}
                          </Text>
                          <Text style={{ color: 'white' }}>{moment(event.date, "MMM D, YYYY").format('YYYY-MM-DD')}</Text>
                          <Text style={{ color: 'white' }}>{event.time}</Text>
                        </View>
                      </View>
                    </Card>            
                  ))}
                  </View>
                )}
                <View style={styles.item}>
                  <MaterialIcons
                    name="star-border"
                    size={20}
                    style={styles.leftIcon}
                  />
                  <Text
                    style={styles.itemText}
                    onPress={() => setCollapseToggle(4)}>
                    Reviews
                  </Text>
                  <FontAwesome
                    name={collapse === 4 ? "chevron-up" : "chevron-down"}
                    size={20}
                    style={styles.rightIcon}
                  />
                </View>

                {collapse === 4 && reviews && reviews.length > 0 && (
                  <View style={{ display: "flex" }}>
                    <Text>
                      <Star count={avgStar} /> (5)
                    </Text>
                    {reviews &&
                      reviews.map((review) => (
                        <View key={review.id} style={styles.review}>
                          <Text style={{ lineHeight: 40 }}>
                            Melyssa Tanaka
                          </Text>
                          <Text>
                            <Star count={review.stars} />
                          </Text>
                          <Text>{review.description}</Text>
                          <View
                            style={{
                              flexDirection: "row",
                              flexWrap: "wrap",
                              display: "flex",
                              paddingTop: 30,
                              paddingBottom: 30,
                              justifyContent: "space-evenly",
                            }}></View>
                        </View>
                      ))}
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
      </View>
    </>
  );
};

const Star = ({ count }) => {
  function getStar() {
    const star = [];
    for (i = 0; i < count; i++)
      star.push(<FontAwesome key={i} name="star" size={20} />);
    if (star.length < 5) {
      for (i = 0; i < 5 - count; i++) {
        star.push(
          <FontAwesome key={i + 5} name="star" color={"gray"} size={20} />
        );
      }
    }
    return star;
  }
  return <>{getStar()}</>;
};

const styles = {
  leftIcon: {
    textAlign: "left",
  },
  main: {
    display: "flex",
    backgroundColor: "pink",
  },
  name: {
    paddingTop: 10,
    fontSize: 30,
    fontFamily: 'Roboto-Bold',
  },
  someInfo: {
    paddingTop: 20,
    paddingBottom: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  smallFont: {
    fontSize: 15,
  },
  eachInfo: {
    alignItems: "center",
  },
  collapser: {
    backgroundColor: "white",
    borderRadius: 50,
  },
  list: {
    flexDirection: "column",
    display: "flex",
    paddingLeft: 30,
    paddingTop: 40,
    backgroundColor: "#EFEFEF",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingBottom:250
  },
  item: {
    display: "flex",
    flexDirection: "row",
    height: 60,
  },
  itemText: {
    fontSize: 20,
    flex: 5,
  },
  leftIcon: {
    flex: 1,
  },
  rightIcon: {
    flex: 1,
  },
  card: {
    backgroundColor: "#DDD",
    marginBottom: 20,
    marginRight: 20,
    padding: 20,
  },
  cardLabel: {
    height: 20,
    fontFamily: 'Satoshi-Bold',
  },
  cardItem: {
    height: 30,
    lineHeight: 30,
    paddingLeft: 20,
  },
  dropdown: {
    paddingLeft: 20,
    backgroundColor: "white",
  },
  review: {
    flex: 1,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
  },
};

export default VolunteerDetailScreen;
