import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../layouts/home-screen.layout";
import EventListScreen from "../layouts/event-list.layout";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as React from "react";
import { useState } from "react";
import { getPersistData } from "../contexts/store";
import {
  TYPE_ORGANIZATION,
  TYPE_PARENT,
  TYPE_VOLUNTEER,
} from "../util/constants";
import ParentDetailScreen from "../layouts/personal-detail.layout";
import ChatListScreen from '../layouts/chat/chat-list.layout';
import { 
  ChatActiveIcon, 
  ChatInactiveIcon, 
  UserActiveIcon, 
  UserInactiveIcon,
  EventActiveIcon, 
  EventInactiveIcon,
  SearchInactiveIcon,
  SearchActiveIcon
} from "./icon/icon";
import AuthContext from "../contexts/auth";
import SearchEventScreen from "../layouts/search/search.layout";

const Tab = createBottomTabNavigator();


function AuthorizedTabs() {
  const [role, setRole] = useState([]);
  const [formParam, setFormParam] = useState({});

  React.useEffect(() => {
    getPersistData("userInfo")
      .then((data) => {
        const { role, signup, id } = data[0];
        setRole(role);
        setFormParam({
          email: signup.emailAddress,
          fromOrg: false,
          id,
        });
      })
      .catch((error) => {
        console.error(error);
        alert(error);
      });
  }, []);

  return (
    <>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="Event"
          component={EventListScreen}
          options={{
            tabBarLabel: "Events",
            tabBarIcon: ({ focused }) => (
              focused ? <EventActiveIcon /> : <EventInactiveIcon />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchEventScreen}
          options={{
            tabBarLabel: "Search",
            tabBarIcon: ({ focused }) => (
              focused ? <SearchActiveIcon /> : <SearchInactiveIcon />
            ),
          }}
        />
        <Tab.Screen
          name="Chat"
          component={ChatListScreen}
          options={{
            tabBarLabel: "Chat",
            tabBarIcon: ({ focused }) => (
              focused ? <ChatActiveIcon /> : <ChatInactiveIcon />
            ),
          }}
        />
        {role === TYPE_VOLUNTEER && (
          // <Tab.Screen name="User" component={VolunteerDetailScreen} options={{
          <Tab.Screen
            name="User"
            component={HomeScreen}
            options={{
              tabBarLabel: "Profile",
              tabBarIcon: ({ focused }) => (
                focused ? <UserActiveIcon /> : <UserInactiveIcon />
              ),
            }}
            initialParams={formParam}
          />
        )}
        {role === TYPE_PARENT && (
          <Tab.Screen
            name="User"
            component={HomeScreen}
            options={{
              tabBarLabel: "Profile",
              tabBarIcon: ({ focused }) => (
                focused ? <UserActiveIcon /> : <UserInactiveIcon />
              ),
            }}
            initialParams={formParam}
          />
        )}
        {role === TYPE_ORGANIZATION && (
          <Tab.Screen
            name="OrganizationInfo"
            component={HomeScreen}
            options={{
              tabBarLabel: "Info",
              tabBarIcon: ({ focused }) => (
                focused ? <UserActiveIcon /> : <UserInactiveIcon />
              ),
            }}
          />
        )}
      </Tab.Navigator>
    </>
  );
}

export default AuthorizedTabs;
