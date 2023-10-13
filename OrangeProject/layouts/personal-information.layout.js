import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Button, Input, CheckBox } from '@rneui/themed';
import { StyleSheet, Text, View } from "react-native";

function PersonalInformationScreen({navigation}) {
    return (
      <View style={styles.main}>
        <Feather name='arrow-left' size={30} style={styles.leftIcon} onPress={() => navigation.navigate('MyTabs')} />
        <Text style={styles.title}>Personal Infomation</Text>
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
        leftIcon={<FontAwesome name='user' size={20} color={'#666'} />}
        leftIconContainerStyle={{}}
        rightIconContainerStyle={{}}
        placeholder="Phone Number"
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
        leftIcon={<FontAwesome name='user' size={20} color={'#666'} />}
        leftIconContainerStyle={{}}
        rightIconContainerStyle={{}}
        placeholder="Addresss"
      />
      <CheckBox
        // checked={checked}
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
        // onPress={}
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