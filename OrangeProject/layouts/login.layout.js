import { Button, Text, View } from "react-native";

function LoginScreen({navigation}) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Login</Text>
        <Button onPress={()=> {
          navigation.navigate('MyTabs')
        }}
        title="Login" />
      </View>
    );
  }

  export default LoginScreen;