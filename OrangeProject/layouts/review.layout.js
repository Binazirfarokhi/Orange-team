import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Button, Input } from '@rneui/themed';
import { StyleSheet, Text, View } from "react-native";
import React, { useState } from 'react';
import { getPersistData } from '../contexts/store';
import { get, post, put } from '../contexts/api';

function ReviewScreen({navigation}) {
  const [displayName, setDisplayname] = useState('');
  const [emailAddress, setEmailAddress] = useState('');


  React.useEffect(()=> {
    getPersistData('userInfo').then(async data=> {
        if(data && data.length > 0) {
          const { emailAddress } = data[0].signup;
          setEmailAddress(emailAddress);
        }        
      });
    },[]);
    return (
      <View style={styles.main}>
        <Feather name='arrow-left' size={30} style={styles.leftIcon} onPress={() => navigation.navigate('AuthorizedTabs')} />
        <Text style={styles.title}>Review</Text>
       
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

  export default ReviewScreen;