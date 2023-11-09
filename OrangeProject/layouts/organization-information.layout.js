import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Button, Input, CheckBox } from '@rneui/themed';
import { StyleSheet, Text, View } from "react-native";
import { get, put } from '../contexts/api';
import React, { useState, useEffect } from 'react';
import { getPersistData } from '../contexts/store';
import { TYPE_ORGANIZATION, TYPE_PARENT, TYPE_VOLUNTEER } from '../util/constants';
import { ButtonGroup } from '@rneui/base';
import VolunteerItem from '../components/volunteer-item.component';

function OrganizationInformationScreen({navigation, route}) {
  const [ orgDetail, setOrgDetail ] = useState({})
  const [ currentOrgId, setCurrentOrgId ] = useState(0)
  const [ volunteers, setVolunteers ] = useState([])
  const [ role, setRole ] = useState([])
  const [ screen, setScreen ] = useState(0)
        
    useEffect(()=> {
      // get session data
      getPersistData('userInfo').then(data=> {
        if(data && data.length > 0) {
          let org;
          if (route && route.params) {
            org = route.params.id;
          } else 
            org = data[0].organization
          setOrgDetail(data[0].orgDetail);
          setCurrentOrgId(org)
          setRole(data[0].role);
          // get volunteers
          get(`/orgs/volunteer/${data[0].organization}`).then(volunteers=> {
            setVolunteers(volunteers.data.data)
          }).catch(error=> 'Unable to find volunteer information')
        }            
      }).catch(error=> {
        console.error(error);
        alert(error)
      });

    },[]);
    
 
    

    return (
      <View style={styles.main}>
        <View style={{paddingLeft: 20, height: 30}}>
              <Feather name='arrow-left' size={30} style={styles.leftIcon} onPress={() => navigation.goBack()} />
          </View>
        <Text style={styles.title}>{orgDetail.name}</Text>
        <ButtonGroup
          buttonContainerStyle={{}}
          buttons={["About", "Events", "Volunteer"]}
          containerStyle={{}}
          disabledStyle={{}}
          disabledTextStyle={{}}
          disabledSelectedStyle={{}}
          disabledSelectedTextStyle={{}}
          innerBorderStyle={{}}
          onPress={selectedIdx =>
            setScreen(selectedIdx)
          }
          selectedButtonStyle={{}}
          selectedIndex={screen}
          selectedTextStyle={{}}
          textStyle={{}}
          />
          { screen === 0 &&
            <View style={styles.card}>
              <Text>{orgDetail.description || ''}</Text>
              <Text style={styles.text}>Founded Since : {orgDetail.establishedYear}</Text>
              <Text style={styles.text}>Volunteers : {volunteers.length}</Text>
            </View>
          }
          { screen === 1 &&
            <View style={styles.card}>
              <Text>Events</Text>
            </View>
          }
          { screen === 2 &&
            <View style={styles.card}>
              <Text>Volunteer</Text>
              {
                volunteers.map(volunteer=> 
                  (<VolunteerItem key={volunteer.id} volunteer={volunteer} navigation={navigation} orgId={currentOrgId} />)
                  )
              }
            </View>
          }
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
      fontSize: 30,
      textAlign: 'center'
    },
    card: {
      marginTop: 30,
      paddingLeft: 10,
      paddingRight: 30,
    },
    text: {
      marginTop:10
    }
  })

  export default OrganizationInformationScreen;