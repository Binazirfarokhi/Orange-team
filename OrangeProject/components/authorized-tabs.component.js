import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../layouts/home-screen.layout';
import SettingsScreen from '../layouts/setting.layout';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as React from 'react';
import { useState } from 'react';
import { getPersistData } from '../contexts/store';
import { TYPE_ORGANIZATION, TYPE_VOLUNTEER } from '../util/constants';
import OrganizationInformationScreen from '../layouts/organization-information.layout';
import VolunteerDetailScreen from '../layouts/volunteer-detail.layout';

const Tab = createBottomTabNavigator();

function AuthorizedTabs() {
  const [ role, setRole ] = useState([])
  const [ formParam, setFormParam ] = useState({})
        
    React.useEffect(()=> {
      getPersistData('userInfo').then(data=> {
        const { role, signup, id } = data[0]
          setRole(role);
          setFormParam({
            email: signup.emailAddress,
            fromOrg: false,
            id
          });
      }).catch(error=> {
        console.error(error);
        alert(error)
      });
    },[]);

  return (
    <>
      <Tab.Navigator  screenOptions={{headerShown: false,}}>
        <Tab.Screen name="Home" component={HomeScreen} options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size })=> (
            <FontAwesome name='home' size={size} color={color} />
          )
        }} />
        { role === TYPE_ORGANIZATION || role === TYPE_VOLUNTEER &&
          <Tab.Screen name="Chat" component={SettingsScreen} options={{
            tabBarLabel: 'Chat',
            tabBarIcon: ({ color, size })=> (
              <Ionicons name='chatbubble-ellipses-outline' size={size} color={color} />
              )
            }} />
          }
        { role === TYPE_VOLUNTEER &&
          <Tab.Screen name="User" component={VolunteerDetailScreen} options={{
            tabBarLabel: 'user',
            tabBarIcon: ({ color, size })=> (
              <FontAwesome name='user' size={size} color={color} />
            )
          }} initialParams={formParam}/>
        }
        { role === TYPE_ORGANIZATION &&
          <Tab.Screen name="OrganizationInfo" component={OrganizationInformationScreen} options={{
            tabBarLabel: 'Info',
            tabBarIcon: ({ color, size })=> (
              <FontAwesome name='building-o' size={size} color={color} />
            )
          }} />
        }
      </Tab.Navigator>
    </>
  );
}

export default AuthorizedTabs;