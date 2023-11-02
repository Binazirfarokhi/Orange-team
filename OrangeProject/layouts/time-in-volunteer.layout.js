import Feather from 'react-native-vector-icons/Feather';
import { StyleSheet, Text, View } from "react-native";
import React, { useState } from 'react';
import { getPersistData } from '../contexts/store';
import moment from 'moment';

function TimeInVolunteerScreen({navigation}) {
  const [timeIn, setTimeIn] = useState('');

  React.useEffect(()=> {
    getPersistData('userInfo').then(async data=> {
        if(data && data.length > 0) {
          const { signup } = data[0];
          setTimeIn(signup.createdAt? new moment.unix(signup.createdAt.seconds).fromNow() :''); 
        }        
      });
    },[]);
    return (
      <View style={styles.main}>
        <Feather name='arrow-left' size={30} style={styles.leftIcon} onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Time In Volunteer</Text>
        <Text style={styles.dayCount}>{timeIn}</Text>
        
        
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
    },
    dayCount: {
      fontSize: 50
    }, days: {
      fontSize: 20
    }

  })

  export default TimeInVolunteerScreen;