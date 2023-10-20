import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../layouts/home-screen.layout';
import SettingsScreen from '../layouts/setting.layout';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as React from 'react';
import StartChatScreen from '../layouts/start-chat.layout';
import ChatActiveIcon from '../assets/chat-active-icon.svg';
import ChatInactiveIcon from '../assets/chat-inactive-icon.svg';


const Tab = createBottomTabNavigator();

function AuthorizedTabs() {

  return (
    <>
      <Tab.Navigator  screenOptions={{headerShown: false,}}>
        <Tab.Screen name="Home" component={HomeScreen} options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size })=> (
            <FontAwesome name='home' size={size} color={color} />
          )
        }} />
        <Tab.Screen name="Chat" component={StartChatScreen} options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color, size })=> (
            <FontAwesome name='comments' size={size} color={color} />
          )
        }} />
        {/* <Tab.Screen 
            name="Chat" 
            component={StartChatScreen} 
            options={{
                tabBarLabel: 'Chat',
                tabBarIcon: ({ focused, color, size }) => {
                    if (focused) {
                        return <FontAwesome name='comments' color="#371958" size={size}/>;
                    } else {
                        return <FontAwesome name='comments' size={size}/>;
                    }
                }
            }} 
        /> */}
        <Tab.Screen name="Settings" component={SettingsScreen} options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size })=> (
            <FontAwesome name='gear' size={size} color={color} />
          )
        }} />
      </Tab.Navigator>
    </>
  );
}

export default AuthorizedTabs;