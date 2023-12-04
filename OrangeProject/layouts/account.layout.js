import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Button, Input } from "@rneui/themed";
import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { getPersistData } from "../contexts/store";
import { get, post, put } from "../contexts/api";

function AccountScreen({ navigation }) {
  const [displayName, setDisplayname] = useState("");
  const [emailAddress, setEmailAddress] = useState("");

  const confirm = async () => {
    const result = (await put(`/profile/${emailAddress}`, { displayName }))
      .data;
    if (result && result.status === "OK") {
      alert("Name has updated");
    } else alert("Unable to connect to server");
  };

  const changePassword = async () => {
    const result = (await post("/auth/reset", { email: emailAddress })).data;
    if (result) {
      if (result.status === "OK") {
        alert("Password change request sent");
      }
    } else alert("Unable to connect to server");
  };

  React.useEffect(() => {
    getPersistData("userInfo").then(async (data) => {
      if (data && data.length > 0) {
        const { emailAddress } = data[0].signup;
        setEmailAddress(emailAddress);
        const result = (await get(`/profile/${emailAddress}`)).data[0];
        setDisplayname(result.signup.displayName);
      }
    });
  }, []);
  return (
    <View style={styles.main}>
      <Feather
        name="arrow-left"
        size={30}
        style={styles.leftIcon}
        onPress={() => navigation.goBack()}
      />
      <Text style={styles.title}>Account</Text>
      <Input
        containerStyle={{}}
        disabledInputStyle={{ backgroundColor: "#ddd" }}
        inputContainerStyle={{}}
        errorStyle={{}}
        errorProps={{}}
        inputStyle={{}}
        labelStyle={{}}
        labelProps={{}}
        value={displayName}
        leftIcon={<FontAwesome name="user" size={20} color={"#666"} />}
        leftIconContainerStyle={{}}
        rightIconContainerStyle={{}}
        placeholder="Name"
        label="Name"
      />
      <Input
        containerStyle={{}}
        disabledInputStyle={{ backgroundColor: 'transparent' }}
        inputContainerStyle={{}}
        disabled={true}
        errorStyle={{}}
        errorProps={{}}
        inputStyle={{color:'black'}}
        labelStyle={{}}
        labelProps={{}}
        value={emailAddress}
        leftIcon={<FontAwesome name="user" size={20} color={"#666"} />}
        leftIconContainerStyle={{}}
        rightIconContainerStyle={{}}
        placeholder="Email Address"
        label="Email Address"
      />

      <Button
        containerStyle={{ margin: 5 }}
        disabledStyle={{
          borderWidth: 2,
          borderColor: "#00F",
        }}
        disabledTitleStyle={{ color: "#00F" }}
        linearGradientProps={null}
        icon={<FontAwesome name="archive" size={20} color={"white"} />}
        iconContainerStyle={{ background: "#000" }}
        loadingProps={{ animating: true }}
        loadingStyle={{}}
        onPress={async () => await confirm()}
        title="Save"
        titleProps={{}}
        titleStyle={{ marginHorizontal: 5 }}
      />
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
        onPress={async () => await changePassword()}
        title="Change password"
        titleProps={{}}
        titleStyle={{ marginHorizontal: 5 }}
        type="clear"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    paddingLeft: 20,
    paddingRight: 20, 
    paddingTop: 60,
    backgroundColor: "white",
  },
  title: {
    paddingTop: 30,
    paddingBottom: 30,
    fontSize: 30,
  },
});

export default AccountScreen;
