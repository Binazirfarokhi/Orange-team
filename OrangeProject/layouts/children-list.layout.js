import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Button, CheckBox, Input } from '@rneui/themed';
import { ScrollView, StyleSheet, Text, View } from "react-native";
import ChildItem from '../components/child-item.component';
import { useEffect, useState } from 'react';
import { getPersistData } from '../contexts/store';
import { deleteCall, get } from '../contexts/api';

function ChildrenListScreen({navigation}) {
  const [email, setEmail] = useState('')
  const [children, setChildren] = useState([]);
  const [lastReload, setLastReload] = useState('')
    
    useEffect(() => {
      getPersistData('userInfo').then(async data=> {
        if(data && data.length > 0) {
          const { emailAddress } = data[0].signup;
          setEmail(emailAddress);
          const result = (await get(`/children/${emailAddress}`)).data.data;
          setChildren(result);
          console.log(result)
        }        
      });
    }, [lastReload])

    async function deleteChild(id) {
      const result = (await deleteCall(`/children/${id}`)).data;
      if(result) {
        if(result.status === 'OK') {
          setLastReload(new Date())
        } else {
          alert(result.status)
        }
      } else alert('Unable to load children list');
    }

    return (
      <>
        <View style={{flex: 0, ...styles.main}}>
          <Feather name='arrow-left' size={30} style={styles.leftIcon} onPress={() => navigation.goBack()} />
          <Text style={styles.title}>List of Children</Text>
          <View style={styles.options}>
           
          <Button
            containerStyle={{ margin: 5, flex: 1}}
            disabledStyle={{
              borderWidth: 2,
              borderColor: "#00F"
            }}
            disabledTitleStyle={{ color: "#00F" }}
            linearGradientProps={null}
            icon={<FontAwesome name='plus' size={20} color={'white'} />}
            iconContainerStyle={{ background: "#000" }}
            loadingProps={{ animating: true }}
            loadingStyle={{}}
            onPress={()=> navigation.navigate('AddChild')}
            title="Add"
            titleProps={{}}
            titleStyle={{ marginHorizontal: 5 }}
          />
          </View>
        </View>
        <ScrollView style={styles.children}>
          {
            children.map(child=> (<ChildItem child={child} key={child.id} navigation={navigation} deleteChild={deleteChild} />))
          }        
        </ScrollView>
      </>
    );
  }

  const styles = StyleSheet.create({
    main: {
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 60,
    },
    title: {
      paddingTop: 30,
      paddingBottom:30,
      fontSize: 30
    }, options : {
      flexDirection: 'row',
       display: 'flex'
    }, children: {
      paddingLeft: 20,
      paddingRight: 20,
      flex: 4
    }
  })

  export default ChildrenListScreen;