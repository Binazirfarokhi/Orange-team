import * as React from 'react';
import { StyleSheet, Text, View } from "react-native";
import { ProfileImage } from '../components/profile-image.component';
import { Avatar, Button, Input } from '@rneui/themed';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useState } from 'react';
import AuthContext from '../contexts/auth';
import Feather from 'react-native-vector-icons/Feather';
import { ButtonGroup } from '@rneui/base';
import { logo } from '../util/constants';

function LoginScreen() {
  const [formType, setFormType] = useState('home')
  const { signIn, signUp, forgotPassword } = React.useContext(AuthContext);

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const nextOption = async () => {
    if (formType === 'signup') {
      result = await signUp({ username, password, role: selectedIndex })
      if (result === "OK")
        setFormType('confirm')
    } else if (formType === 'login') {
      signIn({ username: username.toLowerCase(), password })
    } else if (formType === 'confirm') {
      setFormType('home')
    }
  }

  const nextTitle = () => {
    switch (formType) {
      case 'signup': return 'Next';
      case 'login': return 'Sign In';
      case 'confirm': return 'Go to Email';
    }
  }

  return (
    <View style={formType === 'confirm' ? styles.mainOutline : styles.main}>
      {formType !== 'home' && <Button
        containerStyle={styles.back}
        disabledStyle={{
          borderWidth: 2,
          borderColor: "#00F"
        }}
        disabledTitleStyle={{ color: "#00F" }}
        linearGradientProps={null}
        iconContainerStyle={{ background: "#000" }}
        icon={<Feather name='arrow-left' size={30} style={styles.leftIcon} />}
        loadingProps={{ animating: true }}
        loadingStyle={{}}
        onPress={() => setFormType('home')}
        titleProps={{}}
        titleStyle={{ marginHorizontal: 5 }}
        type="clear"
      />}
      <View style={{ alignItems: 'center' }}>
        <Avatar
          size={120}
          avatarStyle={{ marginTop: 5, marginTop: 20, marginLeft: 20 }}
          rounded
          source={logo}
          containerStyle={{ backgroundColor: '#DDD',  }}>
        </Avatar>
        {(formType === 'forgot') &&
          <Text style={styles.title}>
            Forgot Password ?
          </Text>
        }
      </View>
      {formType === 'confirm' && <Text style={styles.confirm}>Confirm your Email</Text>}
      {formType === 'confirm' && <Text style={styles.confirmDescription}>Your account has been successfully registered. To complete 2 factor authentication please check your email and click the invitation link.</Text>}
      <View style={(formType !== 'home' && formType !== 'confirm') && styles.form}>
        {formType !== 'home' && formType !== 'confirm' && <Input
          containerStyle={{}}
          disabledInputStyle={{ background: "#ddd" }}
          inputContainerStyle={{}}
          onChange={(e) => setUsername(e.nativeEvent.text)}
          errorStyle={{}}
          errorProps={{}}
          inputStyle={{}}
          labelStyle={{}}
          labelProps={{}}
          value={username}
          leftIcon={<FontAwesome name='user' size={20} color={'#666'} />}
          leftIconContainerStyle={{}}
          rightIconContainerStyle={{}}
          placeholder="Email Address"
        />
        }
        {(formType === 'login' || formType === 'signup' || !formType) &&
          <Input
            containerStyle={{}}
            disabledInputStyle={{ background: "#ddd" }}
            inputContainerStyle={{}}
            onChange={(e) => setPassword(e.nativeEvent.text)}
            errorStyle={{}}
            errorProps={{}}
            inputStyle={{}}
            labelStyle={{}}
            labelProps={{}}
            leftIcon={<FontAwesome name='key' size={20} color={'#666'} />}
            leftIconContainerStyle={{}}
            rightIconContainerStyle={{}}
            placeholder="Password"
            value={password}
            secureTextEntry={true}
          />
        }
        {(formType === 'signup') &&
          <ButtonGroup
            buttons={['Parent', 'Volunteer', 'Organization']}
            selectedIndex={selectedIndex}
            onPress={(value) => {
              setSelectedIndex(value);
            }}
            containerStyle={{ marginBottom: 20 }}
          />
        }
        {(formType === 'login' || formType === 'confirm' || formType === 'signup' || !formType) &&
          <Button
            containerStyle={{ margin: 5 }}
            disabledStyle={{
              borderWidth: 2,
              borderColor: "#00F"
            }}
            disabledTitleStyle={{ color: "#00F" }}
            linearGradientProps={null}
            icon={<FontAwesome name='sign-in' size={20} color={'white'} />}
            iconContainerStyle={{ background: "#000" }}
            loadingProps={{ animating: true }}
            loadingStyle={{}}
            onPress={() => nextOption()}
            title={nextTitle()}
            titleProps={{}}
            titleStyle={{ marginHorizontal: 5 }}
          />
        }
        {(formType === 'forgot') &&
          <Button
            containerStyle={{ margin: 5 }}
            disabledStyle={{
              borderWidth: 2,
              borderColor: "#00F"
            }}
            disabledTitleStyle={{ color: "#00F" }}
            linearGradientProps={null}
            icon={<FontAwesome name='envelope' size={20} color={'white'} />}
            iconContainerStyle={{ background: "#000" }}
            loadingProps={{ animating: true }}
            loadingStyle={{}}
            onPress={async () => await forgotPassword(username)}
            title="Request Password"
            titleProps={{}}
            titleStyle={{ marginHorizontal: 5 }}
          />
        }
        {(formType === 'login' || !formType) &&

          <Button
            containerStyle={{ margin: 5 }}
            disabledStyle={{
              borderWidth: 2,
              borderColor: "#00F"
            }}
            disabledTitleStyle={{ color: "#00F" }}
            linearGradientProps={null}
            iconContainerStyle={{ background: "#000" }}
            loadingProps={{ animating: true }}
            loadingStyle={{}}
            onPress={() => setFormType('forgot')}
            title="Forgot Password"
            titleProps={{}}
            titleStyle={{ marginHorizontal: 5 }}
            type="clear"
          />
        }

        {(formType === 'home' || !formType) &&

          <Button
            containerStyle={{ margin: 5, marginTop: 200, marginBottom: 40 }}
            disabledStyle={{
              borderWidth: 2,
              borderColor: "#00F"
            }}
            disabledTitleStyle={{ color: "#00F" }}
            linearGradientProps={null}
            iconContainerStyle={{ background: "#000" }}
            loadingProps={{ animating: true }}
            loadingStyle={{}}
            onPress={() => setFormType('signup')}
            title="Sign Up"
            titleProps={{}}
            titleStyle={{ marginHorizontal: 5 }}
          />
        }

        {(formType === 'home' || !formType) &&

          <Button
            containerStyle={{ margin: 5 }}
            disabledStyle={{
              borderWidth: 2,
              borderColor: "#00F"
            }}
            disabledTitleStyle={{ color: "#00F" }}
            linearGradientProps={null}
            iconContainerStyle={{ background: "#000" }}
            loadingProps={{ animating: true }}
            loadingStyle={{}}
            onPress={() => setFormType('login')}
            title="Login"
            titleProps={{}}
            titleStyle={{ marginHorizontal: 5 }}
          />
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainOutline: {
    top: 150,
    paddingTop: 50,
    paddingBottom: 50,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#CCC',
    borderRadius: 35,
  }, main: {
    paddingTop: 200,
    paddingLeft: 16,
    paddingRight: 16
  }, form: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 80,
    borderWidth: 3,
    borderColor: '#999',
    borderRadius: 35
  }, title: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingTop: 20
  }, confirm: {
    paddingTop: 50,
    paddingBottom: 50,
    fontSize: 30,
    textAlign: 'center'
  }, confirmDescription: {
    paddingBottom: 50,
    textAlign: 'center',
  }, back: {
    top: -150,
    left: -180,
  }
})

export default LoginScreen;