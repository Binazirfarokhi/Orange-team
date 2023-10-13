import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Button, Input } from '@rneui/themed';
import { StyleSheet, Text, View } from "react-native";

function AccountScreen({navigation}) {
    return (
      <View style={styles.main}>
        <Feather name='arrow-left' size={30} style={styles.leftIcon} onPress={() => navigation.navigate('MyTabs')} />
        <Text style={styles.title}>Account</Text>
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
        leftIcon={<FontAwesome name='user' size={20} color={'#666'} />}
        leftIconContainerStyle={{}}
        rightIconContainerStyle={{}}
        placeholder="Email Address"
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
        placeholder="Change Password"
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
        leftIcon={<FontAwesome name='key' size={20} color={'#666'} />}
        leftIconContainerStyle={{}}
        rightIconContainerStyle={{}}
        placeholder="Confirm Passwood"
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

  export default AccountScreen;