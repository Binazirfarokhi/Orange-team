import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../layouts/home-screen.layout";
import SettingsScreen from "../layouts/setting.layout";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as React from "react";

const Tab = createBottomTabNavigator();

function AuthorizedTabs() {
  return (
    <>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: "Settings",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="gear" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}

export default AuthorizedTabs;
