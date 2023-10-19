import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Button, CheckBox, Input } from '@rneui/themed';
import { ScrollView, StyleSheet, Text, View } from "react-native";
import ChildItem from '../components/child-item.component';

const children = [{
  name: 'John Doe',
  age: 12,
  id: 12321312,
}, {
  name: 'Johnson',
  age: 8,
  id: 2,
},{
  name: 'Joanna',
  age: 6,
  id: 3,
},{
  name: 'Jax',
  age: 6,
  id: 6,
},{
  name: 'Jeans',
  age: 4,
  id: 5,
},{
  name: 'John',
  age: 4,
  id: 4,
}]

function ChildrenListScreen({navigation}) {
    return (
      <>
        <View style={{flex: 0, ...styles.main}}>
          <Feather name='arrow-left' size={30} style={styles.leftIcon} onPress={() => navigation.navigate('AuthorizedTabs')} />
          <Text style={styles.title}>List of Children</Text>
          <View style={styles.options}>
            <CheckBox
            // checked={checked}
            containerStyle ={{backgroundColor: 'transparent', flex: 2}}
            checkedColor="#0F0"
            checkedTitle="Great!"
            onIconPress={() => setChecked(!checked)}
            onLongIconPress={() =>
              console.log("onLongIconPress()")
            }
            onLongPress={() => console.log("onLongPress()")}
            onPress={() => console.log("onPress()")}
            size={30}
            textStyle={{}}
            title="Allow everyone view?"
            titleProps={{}}
            uncheckedColor="#F00"
          />
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
            children.map(child=> (<ChildItem child={child} key={child.id} navigation={navigation} />))
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