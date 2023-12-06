import * as React from "react";
import { StyleSheet, Text, View, ImageBackground} from "react-native";
import { Image, Button, Input } from "@rneui/themed";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useState } from "react";
import AuthContext from "../contexts/auth";
import Feather from "react-native-vector-icons/Feather";
import { ButtonGroup } from "@rneui/base";
import { logo } from "../util/constants";

function LoginScreen() {
  const [formType, setFormType] = useState("home");
  const { signIn, signUp, forgotPassword } = React.useContext(AuthContext);

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const nextOption = async () => {
    if (formType === "signup") {
      result = await signUp({ username, password, role: selectedIndex });
      if (result === "OK") setFormType("confirm");
    } else if (formType === "login") {
      signIn({ username: username.toLowerCase(), password });
    } else if (formType === "confirm") {
      setFormType("home");
    }
  };

  const nextTitle = () => {
    switch (formType) {
      case "signup":
        return "Next";
      case "login":
        return "Sign In";
      case "confirm":
        return "Go to Email";
    }
  };

  return (
    <View>
      <ImageBackground
        source={require("../assets/parent-background.png")}
        imageStyle={{ opacity: 0.1, marginLeft: -20 }}
        resizeMode="cover"
      >
        <View style={formType === "confirm" ? styles.mainOutline : styles.main}>
          {formType !== "home" && (
            <Button
              containerStyle={styles.back}
              disabledStyle={{
                borderWidth: 2,
                borderColor: "#00F",
              }}
              disabledTitleStyle={{ color: "#00F" }}
              linearGradientProps={null}
              iconContainerStyle={{ background: "#000" }}
              icon={<Feather name="arrow-left" size={30} style={styles.leftIcon} />}
              loadingProps={{ animating: true }}
              loadingStyle={{}}
              onPress={() => setFormType("home")}
              titleProps={{}}
              titleStyle={{ marginHorizontal: 5 }}
              type="clear"
            />
          )}
          <View style={{ alignItems: "center" }}>
            <Image
              source={require("../assets/unilogo2.png")}
              style={{ width: 178, height: 155 }}
            />
            {formType === "forgot" && (
              <Text style={styles.title}>Forgot Password ?</Text>
            )}
          </View>
          {formType === "confirm" && (
            <Text style={styles.confirm}>Confirm your Email</Text>
          )}
          {formType === "confirm" && (
            <Text style={styles.confirmDescription}>
              Your account has been successfully registered. To complete 2 factor
              authentication please check your email and click the invitation link.
            </Text>
          )}
          <View
            style={formType !== "home" && formType !== "confirm" && styles.form}>
            {formType !== "home" && formType !== "confirm" && (
              <Input
                containerStyle={{}}
                disabledInputStyle={{ background: "#ddd" }}
                inputContainerStyle={{}}
                onChange={(e) => setUsername(e.nativeEvent.text.toLowerCase())}
                errorStyle={{}}
                errorProps={{}}
                inputStyle={{fontFamily: 'Roboto-Regular'}}
                labelStyle={{}}
                labelProps={{}}
                value={username}
                leftIcon={<FontAwesome name="user" size={20} color={"#666"} />}
                leftIconContainerStyle={{}}
                rightIconContainerStyle={{}}
                placeholder="Email Address"
              />
            )}
            {(formType === "login" || formType === "signup" || !formType) && (
              <Input
                containerStyle={{}}
                disabledInputStyle={{ background: "#ddd" }}
                inputContainerStyle={{}}
                onChange={(e) => setPassword(e.nativeEvent.text)}
                errorStyle={{}}
                errorProps={{}}
                inputStyle={{fontFamily: 'Roboto-Regular'}}
                labelStyle={{}}
                labelProps={{}}
                leftIcon={<FontAwesome name="key" size={20} color={"#666"} />}
                leftIconContainerStyle={{}}
                rightIconContainerStyle={{}}
                placeholder="Password"
                value={password}
                secureTextEntry={true}
              />
            )}
            {formType === "signup" && (
              <ButtonGroup
                buttons={["Parent", "Volunteer", "Organization"]}
                selectedIndex={selectedIndex}
                onPress={(value) => {
                  setSelectedIndex(value);
                }}
                containerStyle={{ marginBottom: 20 }}
              />
            )}
            {(formType === "login" ||
              formType === "confirm" ||
              formType === "signup" ||
              !formType) && (
              <Button
                containerStyle={{ margin: 5 }}
                disabledStyle={{
                  borderWidth: 2,
                  borderColor: "#00F",
                }}
                disabledTitleStyle={{ color: "#00F" }}
                linearGradientProps={null}
                icon={<FontAwesome name="sign-in" size={20} color={"white"} />}
                iconContainerStyle={{ background: "#000" }}
                loadingProps={{ animating: true }}
                loadingStyle={{}}
                onPress={() => nextOption()}
                title={nextTitle()}
                titleProps={{}}
                titleStyle={{ marginHorizontal: 5, fontFamily: 'Roboto-Regular' }}
              />
            )}
            {formType === "forgot" && (
              <Button
                containerStyle={{ margin: 5 }}
                disabledStyle={{
                  borderWidth: 2,
                  borderColor: "#00F",
                }}
                disabledTitleStyle={{ color: "#00F" }}
                linearGradientProps={null}
                icon={<FontAwesome name="envelope" size={20} color={"white"} />}
                iconContainerStyle={{ background: "#000" }}
                loadingProps={{ animating: true }}
                loadingStyle={{}}
                onPress={async () => await forgotPassword(username)}
                title="Request Password"
                titleProps={{}}
                titleStyle={{ marginHorizontal: 5, fontFamily: 'Roboto-Regular',}}
              />
            )}
            {(formType === "login" || !formType) && (
              <Button
                containerStyle={{ margin: 5 }}
                disabledStyle={{
                  borderWidth: 2,
                  borderColor: "#00F",
                }}
                disabledTitleStyle={{ color: "#00F" }}
                linearGradientProps={null}
                iconContainerStyle={{ background: "#000" }}
                loadingProps={{ animating: true }}
                loadingStyle={{}}
                onPress={() => setFormType("forgot")}
                title="Forgot Password"
                titleProps={{}}
                titleStyle={{ marginHorizontal: 5 }}
                type="clear"
              />
            )}

            {(formType === "home" || !formType) && (
              <Button
                containerStyle={{ margin: 5, marginTop: 200, marginBottom: 40 }}
                disabledStyle={{
                  borderWidth: 2,
                  borderColor: "#00F",
                }}
                disabledTitleStyle={{ color: "#00F" }}
                linearGradientProps={null}
                iconContainerStyle={{ background: "#000" }}
                loadingProps={{ animating: true }}
                loadingStyle={{}}
                onPress={() => setFormType("signup")}
                title="Sign Up"
                titleProps={{}}
                titleStyle={{ marginHorizontal: 5, fontFamily: 'Roboto-Regular', }}
              />
            )}

            {(formType === "home" || !formType) && (
              <Button
                containerStyle={{ margin: 5 }}
                disabledStyle={{
                  borderWidth: 2,
                  borderColor: "#00F",
                }}
                disabledTitleStyle={{ color: "#00F" }}
                linearGradientProps={null}
                iconContainerStyle={{ background: "#000" }}
                loadingProps={{ animating: true }}
                loadingStyle={{}}
                onPress={() => setFormType("login")}
                title="Login"
                titleProps={{}}
                titleStyle={{ marginHorizontal: 5, fontFamily: 'Roboto-Regular', }}
              />
            )}
          </View>
        </View>
      </ImageBackground>
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
    backgroundColor: "#CCC",
    borderRadius: 35,
    marginBottom:160
  },
  main: {
    paddingTop: 200,
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 160
  },
  form: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 80,
    borderWidth: 3,
    borderColor: "#999",
    borderRadius: 35,
    backgroundColor:'#f0f0f0'
  },
  title: {
    fontSize: 30,
    fontFamily: 'Satoshi-Bold',
    paddingTop: 20,
  },
  confirm: {
    paddingTop: 50,
    paddingBottom: 50,
    fontSize: 30,
    textAlign: "center",
  },
  confirmDescription: {
    paddingBottom: 50,
    textAlign: "center",
    fontFamily: 'Roboto-Regular',
  },
  back: {
    top: -150,
    left: -180,
  },
});

export default LoginScreen;
