import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../layouts/home-screen.layout';
import Setting from '../layouts/setting.layout';
import LoginScreen from '../layouts/login.layout';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator tabBarShowLabel={false}>
      <Tab.Screen name="Home" component={HomeScreen} options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size })=> (
          <FontAwesome name='home' size={size} color={color} />
        )
      }} />
      <Tab.Screen name="Settings" component={Setting} options={{
        tabBarLabel: 'Settings',
        tabBarIcon: ({ color, size })=> (
          <FontAwesome name='gear' size={size} color={color} />
        )
      }}  />
    </Tab.Navigator>
  );
}

export default MyTabs;