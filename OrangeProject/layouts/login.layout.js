import React, { useState } from 'react';
import { Button, Text, View } from "react-native";
import SigninGroup from "../components/input/SigninGroup";

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shouldValidate, setShouldValidate] = useState(false);

  const handleNextPress = () => {
      if (!email || !password) {
          setShouldValidate(true);
      } else {
          navigation.navigate('MyTabs');
      }
  };

  return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Login</Text>
          <SigninGroup 
              email={email} 
              password={password} 
              shouldValidate={shouldValidate}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
          />
          <Button onPress={handleNextPress} title="Next" />
      </View>
  );
}

export default LoginScreen;