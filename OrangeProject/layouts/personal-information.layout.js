import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Button, Input, CheckBox } from '@rneui/themed';
import { StyleSheet, Text, View } from "react-native";
import { get, put } from '../contexts/api';
import React, { useState } from 'react';
import { getPersistData } from '../contexts/store';
import { POSITION_L1, TYPE_ORGANIZATION, TYPE_PARENT, TYPE_VOLUNTEER } from '../util/constants';
import { MultiSelect } from 'react-native-element-dropdown';
import { bindOrgAndPosition } from '../util/general-functions';

function PersonalInformationScreen({navigation}) {
  const [ contactNumber, setContactNumber ] = useState('')
  const [ address, setAddress ] = useState('')
  const [ organization, setOrganization ] = useState('')
  const [ allowAddress, setAllowAddress ] = useState(false)
  const [ emailAddress, setEmailAddress ] = useState('')
  const [ role, setRole] = useState(0)
  const [ isFocus, setIsFocus] = useState(false)
  const [ org, setOrg ] = useState([])
  const [ orgs, setOrgs ] = useState([])
  const [ orgPos, setOrgPos ] = useState([])
  
  React.useEffect(()=> {
    //get session data
    getPersistData('userInfo').then(async data=> {
      if(data && data.length > 0) {
        const { signup, organization, role } = data[0];
          setRole(role);
          setOrganization(organization)
          const { emailAddress } = signup;
          setEmailAddress(emailAddress)
          const result = (await get(`/profile/${emailAddress}`)).data[0];
          setContactNumber(result.contactNumber);
          setAddress(result.address);
          setAllowAddress(result.allowAddress);
          setOrg(result.orgs)
          // setOrgPos()
          setOrgPos(bindOrgAndPosition(data[0].orgs, data[0].positionOfOrganization))
        }        
      }).catch(error=> console.error(error));
    },[]);
    
    React.useEffect(()=> {
      //fetch org
      get(`/orgs`).then(data=> {
        let index = 0;
        setOrgs(data.data.map(or => ({
          label: `${++index} . ${or.name}`,
          value: or.id
        })));
      });
    },[]);

    const save = async() =>{
      if(role === TYPE_VOLUNTEER && ( !org || org.length === 0)) {
        alert('Please select Organization');
        return;
      } else if(!contactNumber || contactNumber.trim() === '') {
        alert('Please enter Phone Number');
        return
      }
      const positionOfOrganization = [];
      if(org && org != null) positionOfOrganization = org.map(o=> orgPos[o] || POSITION_L1)
      const result = (await put(`/profile/personal/${emailAddress}`, {contactNumber, allowAddress, address, orgs: org, organization, positionOfOrganization})).data;
      if(result && result.status === 'OK') {
            alert('Personal Information has been updated');
      } else alert('Unable to connect to server') 
    }

    return (
      <View style={styles.main}>
        <Feather name='arrow-left' size={30} style={styles.leftIcon} onPress={() => navigation.goBack()} />
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
        label="Phone Number"
        value={contactNumber}
        /> 
      { role === TYPE_PARENT && 
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
          leftIcon={<Feather name='map-pin' size={20} color={'#666'} />}
          leftIconContainerStyle={{}}
          rightIconContainerStyle={{}}
          placeholder="Addresss"
          label="Addresss"
          value={address}
        />
      }
      { role === TYPE_ORGANIZATION && 
        <Input
          containerStyle={{}}
          onChange={(e)=> setOrganization(e.nativeEvent.text)}
          disabledInputStyle={{ background: "#ddd" }}
          inputContainerStyle={{}}
          errorStyle={{}}
          errorProps={{}}
          inputStyle={{}}
          labelStyle={{}}
          labelProps={{}}
          leftIcon={<FontAwesome name='building-o' size={20} color={'#666'} />}
          leftIconContainerStyle={{}}
          rightIconContainerStyle={{}}
          placeholder="Organization"
          label="Organization"
          value={organization}
        />
      }
      { role === TYPE_PARENT && 
        <CheckBox
          checked={allowAddress}
          containerStyle ={{backgroundColor: 'transparent', paddingLeft: 20}}
          checkedColor="#0F0"
          onIconPress={() => setChecked(!checked)}
          onLongIconPress={() =>
            console.log("onLongIconPress()")
          }
          
          onPress={(e) => setAllowAddress(!allowAddress)}
          size={30}
          textStyle={{}}
          title="Allow everyone to check your address"
          titleProps={{}}
          uncheckedColor="#F00"
        />
      }

      { role === TYPE_VOLUNTEER && 
        <MultiSelect
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          // placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={{paddingLeft: 20}}
          // inputSearchStyle={styles.inputSearchStyle}
          iconStyle={{paddingLeft:10}}
          data={orgs}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          value={org}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setOrg(item);
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <FontAwesome name='map-pin' size={20} color={'#666'} />
          )}
        />
      }
      <Button
        containerStyle={{ margin: 5, marginTop: 20 }}
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