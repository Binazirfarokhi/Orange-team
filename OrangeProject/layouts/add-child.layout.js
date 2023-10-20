import Feather from 'react-native-vector-icons/Feather';
import { Button, Input, CheckBox } from '@rneui/themed';
import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { get, post, put } from '../contexts/api';
import { getPersistData } from '../contexts/store';

function AddChildrenScreen({navigation, route}) {
  const [name, setName] = useState('')
  const [age, setAge] = useState(0)
  const [character, setCharacter] = useState('')
  const [allergy, setAllergy] = useState('')
  const [hasAllergy, setHasAllergy] = useState(false)
  const [activities, setActivities] = useState('')
  const [hasActivities, setHasActivities] = useState(false)
  const [canView, setCanView] = useState(false)
  const [email, setEmail] = useState('')
  let childId;
  if(route.params && route.params.child)
    childId = route.params.child.id;

  useEffect(() => {
    getPersistData('userInfo').then(async data=> {
      if(data && data.length > 0) {
        const { emailAddress } = data[0].signup;
        setEmail(emailAddress);
        if(childId) {
          const result = (await get(`/children/${emailAddress}`)).data.data.filter(child=> child.id === childId)[0];
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
  
  const back = () => navigation.navigate('ChildrenList')

  const save = async()=> {
    if(childId) {
      const result = (await put(`/children/${childId}`, {name, age, character, allergy, hasActivities, hasAllergy,activities, canView})).data;
      if(result) {
        if(result.status === 'OK') {
            alert('Saved Child');
            back();
          }
        } else alert('Unable to connect to server') 
      } else {
        const result = (await post(`/children/${email}`, {name, age, character, allergy, hasActivities, hasAllergy,activities, canView})).data;
        if(result) {
          if(result.status === 'OK') {
            alert('Child Added'); 
            back();
          }
        } else alert('Unable to connect to server') 
      }
    
  }

  return (
      <View style={styles.main}>
        <Feather name='arrow-left' size={30} style={styles.leftIcon} onPress={() => back()} />
        <Text style={styles.title}>{childId? "Update": "Add"} Child, {name}</Text>
        <Input
          containerStyle={{}}
          onChange={(e)=> setName(e.nativeEvent.text)}
          disabledInputStyle={{ background: "#ddd" }}
          inputContainerStyle={{}}
          value={name}
          errorStyle={{}}
          errorProps={{}}
          inputStyle={{}}
          labelStyle={{}}
          labelProps={{}}
          leftIconContainerStyle={{}}
          rightIconContainerStyle={{}}
          placeholder="Name"
        />
       
       <Input
          containerStyle={{}}
          onChange={(e)=> setAge(e.nativeEvent.text)}
          disabledInputStyle={{ background: "#ddd" }}
          inputContainerStyle={{}}
          value={age+''}
          keyboardType='numeric'
          errorStyle={{}}
          errorProps={{}}
          inputStyle={{}}
          labelStyle={{}}
          labelProps={{}}
          leftIconContainerStyle={{}}
          rightIconContainerStyle={{}}
          placeholder="Age"
        />        
        <Input
          containerStyle={{}}
          disabledInputStyle={{ background: "#ddd" }}
          onChange={(e)=> setCharacter(e.nativeEvent.text)}
          inputContainerStyle={{}}
          value={character}
          errorStyle={{}}
          errorProps={{}}
          inputStyle={{}}
          labelStyle={{}}
          labelProps={{}}
          leftIconContainerStyle={{}}
          rightIconContainerStyle={{}}
          placeholder="Character"
        />
        <CheckBox
          checked={hasAllergy}
          containerStyle ={{backgroundColor: 'transparent'}}
          checkedColor="#0F0"
          onIconPress={() => setHasAllergy(!hasAllergy)}
          onLongIconPress={() =>
            console.log("onLongIconPress()")
          }
          onLongPress={() => console.log("onLongPress()")}
          onPress={() => setHasAllergy(!hasAllergy)}
          size={30}
          textStyle={{}}
          title="Allergy"
          titleProps={{}}
          uncheckedColor="#F00"
        />
        <Input
          containerStyle={{}}
          onChange={(e)=> setAllergy(e.nativeEvent.text)}
          disabledInputStyle={{ background: "#ddd" }}
          inputContainerStyle={{}}
          value={allergy}
          errorStyle={{}}
          errorProps={{}}
          inputStyle={{}}
          labelStyle={{}}
          labelProps={{}}
          leftIconContainerStyle={{}}
          rightIconContainerStyle={{}}
          placeholder="Allergy"
        />
        <CheckBox
          checked={hasActivities}
          containerStyle ={{backgroundColor: 'transparent'}}
          checkedColor="#0F0"
          onIconPress={() => setHasActivities(!hasActivities)}
          onLongIconPress={() =>
            console.log("onLongIconPress()")
          }
          onLongPress={() => console.log("onLongPress()")}
          onPress={() => setHasActivities(!hasActivities)}
          size={30}
          textStyle={{}}
          title="Activities Group"
          titleProps={{}}
          uncheckedColor="#F00"
        />
        <Input
          containerStyle={{}}
          onChange={(e)=> setActivities(e.nativeEvent.text)}
          disabledInputStyle={{ background: "#ddd" }}
          inputContainerStyle={{}}
          value={activities}
          errorStyle={{}}
          errorProps={{}}
          inputStyle={{}}
          labelStyle={{}}
          labelProps={{}}
          leftIconContainerStyle={{}}
          rightIconContainerStyle={{}}
          placeholder="Activities Group"
        />
        <CheckBox
          checked={canView}
          containerStyle ={{backgroundColor: 'transparent'}}
          checkedColor="#0F0"
          checkedTitle="Great!"
          onIconPress={() => setCanView(!canView)}
          onLongIconPress={() =>
            console.log("onLongIconPress()")
          }
          onLongPress={() => console.log("onLongPress()")}
          onPress={() => setCanView(!canView)}
          size={30}
          textStyle={{}}
          title="Everyone can view"
          titleProps={{}}
          uncheckedColor="#F00"
        />
        <Button
            containerStyle={{ margin: 5}}
            disabledStyle={{
              borderWidth: 2,
              borderColor: "#00F"
            }}
            disabledTitleStyle={{ color: "#00F" }}
            linearGradientProps={null}
            iconContainerStyle={{ background: "#000" }}
            loadingProps={{ animating: true }}
            loadingStyle={{}}
            onPress={()=> save()}
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

  export default AddChildrenScreen;