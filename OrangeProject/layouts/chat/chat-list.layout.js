import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { SearchBar, Header, Button, Divider, Text } from "@rneui/themed";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { ProfileImage } from "../../components/profile-image.component";
import { get } from "../../contexts/api";
import { getPersistData } from "../../contexts/store";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChatListScreen({navigation, route}) {
  const [focusedButton, setFocusedButton] = useState('parents');
  const [users, setUsers] = useState([]);
  const [myUserId, setMyUserId] = useState(null);
  const [myRoleType, setMyRoleType] = useState(null);

  useEffect(() => {
      if (route.params?.focusedTab) {
          setFocusedButton(route.params.focusedTab);
      }
  }, [route.params]);

  useEffect(() => {
    const fetchMyUserId = async () => {
      try {
        const data = await getPersistData("userInfo");
        // console.log('userInfo', data);
        if (data && data.length > 0) {
          const myId = data[0].id;
          const myRole = data[0].role;
          setMyUserId(myId);
          setMyRoleType(myRole);
        }
      } catch (error) {
        console.error("Error fetching my user ID", error);
      }
    };
    fetchMyUserId();
  }, []);

  useEffect(() => {
    const fetchUsersAndMessages = async () => {
      try {
        const userResponse = await get("/chat/userlist");
        if (userResponse && userResponse.data) {
          const usersWithData = await Promise.all(
            userResponse.data.map(async (user) => {
              if (user.id !== myUserId) {
                const latestMessage = await fetchLatestMessage(user.id);
                return {
                  ...user,
                  latestMessageText: latestMessage ? latestMessage.text : "No messages yet",
                  latestMessageDate: latestMessage ? latestMessage.createdAt : null,
                };
              }
              return user;
            })
          );
          setUsers(usersWithData);
        }
      } catch (error) {
        console.error("There was an error:", error);
      }
    };
  
    if (myUserId) {
      fetchUsersAndMessages();
    }
  }, [myUserId]);
  
  const fetchLatestMessage= async (userId) => {
    try {
      const response = await get(`/chat/${myUserId}/${userId}`);
      if (response && response.data && response.data.length > 0) {
        const sortedMessages = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return sortedMessages[0];
      }
    } catch (error) {
      console.error("Error fetching the messages", error);
    }
    return null;
  };

  const filteredUsers = users.filter((user) => {
    if (focusedButton === "parents") {
      return user.role === 0;
    } else if (focusedButton === "organization") {
      return user.role === 1;
    }
    return true;
  });

  return (
    <>
      <View style={{ paddingHorizontal: "3%" }}>
        <Header
          backgroundColor="transparent"
          centerComponent={{
            text: "Chat",
            style: { fontSize: 25, fontWeight: "700" },
          }}
          leftComponent={
            <Feather
              name="arrow-left"
              size={30}
              onPress={() =>
                navigation.navigate("AuthorizedTabs", { screen: "Home" })
              }
            />
          }
          rightComponent={<FontAwesome name="plus" size={30} />}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
          }}>
          <SearchBar
            lightTheme
            placeholder="Search"
            containerStyle={{
              flex: 1,
              backgroundColor: "transparent",
              borderBottomColor: "transparent",
              borderTopColor: "transparent",
              paddingHorizontal: 0,
            }}
            inputContainerStyle={{
              backgroundColor: "#D8D4DE",
              borderRadius: 25,
            }}
          />
          <View style={{ marginLeft: 10 }}>
            <Ionicons name="filter-outline" size={24} color="black" />
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginBottom: "2%",
          }}>
          <Button
            title="Parents"
            onPress={() => setFocusedButton("parents")}
            buttonStyle={{
              backgroundColor:
                focusedButton === "parents" ? "#613194" : "#9B77C2",
              borderRadius: 50,
            }}
            containerStyle={{
              width: "45%",
              marginVertical: 5,
            }}
          />
          {myRoleType !== 2 && (
            <Button
              title="Organization"
              onPress={() => setFocusedButton("organization")}
              buttonStyle={{
                backgroundColor:
                  focusedButton === "organization" ? "#613194" : "#9B77C2",
                borderRadius: 50,
              }}
              containerStyle={{
                width: "45%",
                marginVertical: 5,
              }}
            />
          )}
        </View>
        <Divider />

        <ScrollView style={{marginBottom:210}}>
          {filteredUsers.map((user, i) => {
            if (user.id !== myUserId) {
              let fullName = user.firstName + ' ' + user.lastName;
              let maxLength = 21;

              if (fullName.length > maxLength) {
                fullName = fullName.substring(0, maxLength) + '...';
              }

              return (
                <TouchableOpacity
                  key={i}
                  style={{
                    flexDirection: "row",
                    marginVertical: "1.5%",
                    alignItems: "center",
                    gap: "20",
                  }}
                  onPress={() => {
                    navigation.navigate("ChatDetail", {
                      userId: user.id,
                      myUserId: myUserId,
                    });
                  }}>
                  <ProfileImage uri={user.profileImageURL} size={65} />
                  <View style={{ flexGrow: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}>
                      <Text style={{ fontSize: 18, fontWeight: "600" }}>
                        {fullName}
                      </Text>
                      {user.latestMessageDate &&
                        user.latestMessageDate.seconds && (
                          <Text>
                            {new Date(
                              user.latestMessageDate.seconds * 1000
                            ).toLocaleDateString()}
                          </Text>
                        )}
                    </View>
                    <Text style={{ marginBottom: "20%" }}>
                      {user.latestMessageText}
                    </Text>

                    <Divider />
                  </View>
                </TouchableOpacity>
                
              );
            }
            return null;
          })}
        </ScrollView>
      </View>
    </>
  );
}
