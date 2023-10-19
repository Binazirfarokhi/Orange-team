import Feather from 'react-native-vector-icons/Feather';
import { Button, Input, CheckBox } from '@rneui/themed';
import { StyleSheet, Text, View } from "react-native";
import { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

function AddChildrenScreen({navigation, route}) {
  const [age, setAge] = useState(10)
    return (
      <View style={styles.main}>
        <Feather name='arrow-left' size={30} style={styles.leftIcon} onPress={() => navigation.navigate('ChildrenList')} />
        <Text style={styles.title}>Add Child, {route.params.child.name}</Text>
        <Input
          containerStyle={{}}
          disabledInputStyle={{ background: "#ddd" }}
          inputContainerStyle={{}}
          errorMessage="Oops! that's not correct."
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
          disabledInputStyle={{ background: "#ddd" }}
          inputContainerStyle={{}}
          errorMessage="Oops! that's not correct."
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
          inputContainerStyle={{}}
          errorMessage="Oops! that's not correct."
          errorStyle={{}}
          errorProps={{}}
          inputStyle={{}}
          labelStyle={{}}
          labelProps={{}}
          leftIconContainerStyle={{}}
          rightIconContainerStyle={{}}
          placeholder="Addresss"
        />
        <CheckBox
          // checked={checked}
          containerStyle ={{backgroundColor: 'transparent'}}
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
          title="Allergy"
          titleProps={{}}
          uncheckedColor="#F00"
        />
        <Input
          containerStyle={{}}
          disabledInputStyle={{ background: "#ddd" }}
          inputContainerStyle={{}}
          errorMessage="Oops! that's not correct."
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
          // checked={checked}
          containerStyle ={{backgroundColor: 'transparent'}}
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
          title="Activities Group"
          titleProps={{}}
          uncheckedColor="#F00"
        />
        <Input
          containerStyle={{}}
          disabledInputStyle={{ background: "#ddd" }}
          inputContainerStyle={{}}
          errorMessage="Oops! that's not correct."
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
          // checked={checked}
          containerStyle ={{backgroundColor: 'transparent'}}
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
            onPress={()=> navigation.navigate('ChildrenList')}
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