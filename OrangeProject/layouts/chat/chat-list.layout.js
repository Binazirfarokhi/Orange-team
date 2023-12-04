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
    const fetchUsers = async () => {
      try {
        const response = await get("/chat/userlist");
        if (response && response.data) {
          setUsers(response.data);
        }
        // console.log(response.data);
      } catch (error) {
        console.error("There was an error fetching the users:", error);
      }
    };

    fetchUsers();
  }, []);

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

  const fetchMessages = async (userId) => {
    try {
      const response = await get(`/chat/${myUserId}/${userId}`);
      if (response && response.data) {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching the messages", error);
    }
    return [];
  };

  useEffect(() => {
    const fetchLatestMessages = async () => {
      for (const user of users) {
        if (user.id !== myUserId) {
          const cachedMessages = await AsyncStorage.getItem(`messages_${user.id}`);
          if (cachedMessages) {
            user.latestMessageText = JSON.parse(cachedMessages).text;
            user.latestMessageDate = JSON.parse(cachedMessages).createdAt;
          }
    
          const userMessages = await fetchMessages(user.id);
          userMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          const latestMessage = userMessages[0];
    
          if (latestMessage && (!cachedMessages || new Date(latestMessage.createdAt) > new Date(JSON.parse(cachedMessages).createdAt))) {
            await AsyncStorage.setItem(`messages_${user.id}`, JSON.stringify(latestMessage));
            user.latestMessageText = latestMessage.text;
            user.latestMessageDate = latestMessage.createdAt;
          }
        }
      }
    };

    fetchLatestMessages();
  }, [users]);

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
                        {user.firstName} {user.lastName}
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
