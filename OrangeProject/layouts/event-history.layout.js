import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Button, Input } from "@rneui/themed";
import { StyleSheet, Text, View } from "react-native";

function EventHistoryScreen({ navigation }) {
  return (
    <View style={styles.main}>
      <Feather
        name="arrow-left"
        size={30}
        style={styles.leftIcon}
        onPress={() => navigation.navigate("AuthorizedTabs")}
      />
      <Text style={styles.title}>Event History</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    paddingLeft: 20,
    paddingTop: 60,
  },
  title: {
    paddingTop: 30,
    paddingBottom: 30,
    fontSize: 30,
  },
});

export default EventHistoryScreen;
