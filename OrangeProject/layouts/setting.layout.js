import { Link } from "@react-navigation/native";
import { Button, Text, View } from "react-native";

function Setting({navigation}) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Setting</Text>
        <Button onPress={()=> navigation.navigate('Login')} title="Login">Logout</Button>
      </View>
    );
  }

  export default Setting;