import AuthContext from '../contexts/auth';
import React from "react";
import Feather from 'react-native-vector-icons/Feather';
import { Button, Input } from '@rneui/themed';
import { StyleSheet, Text, View } from "react-native";

function SettingsScreen({navigation}) {
  const { signOut } = React.useContext(AuthContext);
    return (
      <View style={styles.main}>
        <Feather name='arrow-left' size={30} style={styles.leftIcon} onPress={() => navigation.navigate('AuthorizedTabs', {screen: 'Home'})} />
        <Text style={styles.title}>Settings</Text>
        <Button onPress={signOut} title="Login">Logout</Button>
      </View>
    );
  }

  
  const styles = StyleSheet.create({
    main: {
      paddingLeft: 20,
      paddingTop: 60
    },
    title: {
      paddingTop: 30,
      paddingBottom:30,
      fontSize: 30
    }
  })


  export default SettingsScreen;