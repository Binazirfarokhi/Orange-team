import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Button, Input, CheckBox } from '@rneui/themed';
import { StyleSheet, Text, View } from "react-native";
import { get, put } from '../contexts/api';
import React, { useState } from 'react';
import { getPersistData } from '../contexts/store';

function PersonalInformationScreen({navigation}) {
  const [contactNumber, setContactNumber] = useState('')
  const [address, setAddress] = useState('')
  const [allowAddress, setAllowAddress] = useState(false)
  const [emailAddress, setEmailAddress] = useState('')
  
  React.useEffect(()=> {
    getPersistData('userInfo').then(async data=> {
        if(data && data.length > 0) {
          const { emailAddress } = data[0].signup;
          setEmailAddress(emailAddress)
          const result = (await get(`/profile/${emailAddress}`)).data[0];
          setContactNumber(result.contactNumber);
          setAddress(result.address);
          setAllowAddress(result.allowAddress);
        }        
      });
    },[]);

    const save = async() =>{   
      const result = (await put(`/profile/personal/${emailAddress}`, {contactNumber, allowAddress, address})).data;
      if(result && result.status === 'OK') {
            alert('Personal Information has been updated');
      } else alert('Unable to connect to server') 
    }

    return (
      <View style={styles.main}>
        <Feather name='arrow-left' size={30} style={styles.leftIcon} onPress={() => navigation.navigate('AuthorizedTabs')} />
        <Text style={styles.title}>Personal Infomation</Text>
        <Input
        onChange={(e)=> setContactNumber(e.nativeEvent.text)}
        containerStyle={{}}
        disabledInputStyle={{ background: "#ddd" }}
        inputContainerStyle={{}}
        errorStyle={{}}
        errorProps={{}}
        inputStyle={{}}
        labelStyle={{}}
        labelProps={{}}
        leftIcon={<FontAwesome name='user' size={20} color={'#666'} />}
        leftIconContainerStyle={{}}
        rightIconContainerStyle={{}}
        placeholder="Phone Number"
        value={contactNumber}
        /> 
      <Input
        containerStyle={{}}
        onChange={(e)=> setAddress(e.nativeEvent.text)}
        disabledInputStyle={{ background: "#ddd" }}
        inputContainerStyle={{}}
        errorStyle={{}}
        errorProps={{}}
        inputStyle={{}}
        labelStyle={{}}
        labelProps={{}}
        leftIcon={<FontAwesome name='user' size={20} color={'#666'} />}
        leftIconContainerStyle={{}}
        rightIconContainerStyle={{}}
        placeholder="Addresss"
        value={address}
      />
      <CheckBox
        checked={allowAddress}
        containerStyle ={{backgroundColor: 'transparent'}}
        checkedColor="#0F0"
        onIconPress={() => setChecked(!checked)}
        onLongIconPress={() =>
          console.log("onLongIconPress()")
        }
        onLongPress={() => console.log("onLongPress()")}
        onPress={(e) => setAllowAddress(!allowAddress)}
        size={30}
        textStyle={{}}
        title="Allow everyone to check your address"
        titleProps={{}}
        uncheckedColor="#F00"
      />
      <Button
        containerStyle={{ margin: 5 }}
        disabledStyle={{
          borderWidth: 2,
          borderColor: "#00F"
        }}
        disabledTitleStyle={{ color: "#00F" }}
        linearGradientProps={null}
        icon={<FontAwesome name='archive' size={20} color={'white'} />}
        iconContainerStyle={{ background: "#000" }}
        loadingProps={{ animating: true }}
        loadingStyle={{}}
        onPress={async()=> await save()}
        title="Save"
        titleProps={{}}
        titleStyle={{ marginHorizontal: 5 }}
      />
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

  export default PersonalInformationScreen;