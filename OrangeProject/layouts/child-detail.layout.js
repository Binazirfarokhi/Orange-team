import Feather from 'react-native-vector-icons/Feather';
import { Button, Input, CheckBox, Avatar } from '@rneui/themed';
import { Keyboard, KeyboardAvoidingView, StyleSheet, Text, View, ScrollView, TouchableWithoutFeedback, ImageBackground } from "react-native";
import { useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { get, post, put } from '../contexts/api';
import { getPersistData } from '../contexts/store';
import CardWithNext from '../components/card.component';
import ActivityItem from '../components/activity-item.component';


const image = { uri: '../../assets/parent-background.png' };
// const image = {uri: 'https://legacy.reactjs.org/logo-og.png'};


const ChildDetailScreen = ({ navigation, route }) => {
  const [name, setName] = useState('')
  const [age, setAge] = useState(0)
  const [character, setCharacter] = useState('')
  const [allergy, setAllergy] = useState('')
  const [hasAllergy, setHasAllergy] = useState(false)
  const [activities, setActivities] = useState('')
  const [hasActivities, setHasActivities] = useState(false)
  const [canView, setCanView] = useState(false)
  const [email, setEmail] = useState('')
  const [events, setEvents] = useState([])
  let childId;
  if (route.params && route.params.child)
    childId = route.params.child.id;

  useEffect(() => {
    getPersistData('userInfo').then(async data => {
      if (data && data.length > 0) {
        const { emailAddress } = data[0].signup;
        setEmail(emailAddress);
        if (childId) {
          const result = (await get(`/children/child/${childId}`)).data.data;
          const eventJoin = (await get(`/orgs/eventsJoined/${result.parent.id}`)).data.data;
          if (eventJoin && eventJoin !== null) {
            setEvents(eventJoin)
          }
          setName(result.name);
          setAge(result.age);
          setCharacter(result.character);
          setAllergy(result.allergy);
          setHasAllergy(result.hasAllergy);
          setActivities(result.activities);
          setHasActivities(result.hasActivities);
          setCanView(result.canView);
        }
      }
    });
  }, []);

  const back = () => navigation.goBack()

  const save = async () => {
    if (childId) {
      const result = (await put(`/children/${childId}`, { name, age, character, allergy, hasActivities, hasAllergy, activities, canView })).data;
      if (result) {
        if (result.status === 'OK') {
          alert('Saved Child');
          back();
        }
      } else alert('Unable to connect to server')
    } else {
      const result = (await post(`/children/${email}`, { name, age, character, allergy, hasActivities, hasAllergy, activities, canView })).data;
      if (result) {
        if (result.status === 'OK') {
          alert('Child Added');
          back();
        }
      } else alert('Unable to connect to server')
    }

  }

  return (
    <KeyboardAvoidingView
      behavior={'padding'}
      keyboardVerticalOffset={0}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.main}>
          <ImageBackground source={require('../assets/parent-background.png')} imageStyle={{ opacity: 0.1, marginLeft: -20 }} resizeMode='cover'>
            <ScrollView style={{ paddingRight: 20 }}>
              <Feather name='arrow-left' size={30} style={styles.leftIcon} onPress={() => back()} />
              <View style={styles.profile}>
                <Avatar
                  size={120}
                  avatarStyle={{marginLeft: 10}}
                  rounded
                  source={require('../assets/boy.png')}
                  containerStyle={{ backgroundColor: '#eb1561' }}>
                  <Avatar.Accessory size={34} />
                </Avatar>
              </View>
              <Text style={styles.title}>{name}</Text>
              <CardWithNext onNext={() => navigation.navigate('AuthorizedTabs')} title={"Group Participation"} tile={`participating in ${events.length} group(s).`} />
              <CardWithNext onNext={() => navigation.navigate('AchivementDetail')} title={"Achievements"} tile={`Stats on goals and levels`} />
              {
                events.map(event => <ActivityItem event={event} key={event.id} />)
              }
            </ScrollView>
            <Button style={styles.button} onPress={()=> navigation.navigate('AuthorizedTabs')}>View Full History</Button>
          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  main: {
    paddingLeft: 20,
    paddingTop: 60,
    flex: 1,
    display: 'flex',
    backgroundImage: `url("../assets/parent-background.png")`
  },
  title: {
    paddingTop: 30,
    paddingBottom: 30,
    fontSize: 30,
    textAlign: 'center',
  }, container: {
    flex: 1,
    // marginBottom: 3000
  }, button: {
    marginTop: 20,
    marginRight: 20
  }, profile: {
    alignItems: "center"
},
})

export default ChildDetailScreen;