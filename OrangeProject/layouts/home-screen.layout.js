import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, Text, View } from "react-native";

function HomeScreen({navigation}) {
    return (
      <>
        <View style={{flex: 1}}>
          <Text style={styles.title}>Hi,</Text>
          <Text style={styles.username}>HT</Text>
        </View>
        <View style={{...styles.home, flex: 2}}>
          <View style={styles.list}>
            <FontAwesome name='user' size={20} style={styles.leftIcon} />
            <Text style={styles.listText} onPress={()=> navigation.navigate('Account')}>Account</Text>
            <FontAwesome name='chevron-right' size={20} style={styles.rightIcon} />
          </View>
          <View style={styles.list}>
            <FontAwesome name='home' size={20} style={styles.leftIcon} />
            <Text style={styles.listText} onPress={()=> navigation.navigate('PersonalInformation')}>Personal Infomation</Text>
            <FontAwesome name='chevron-right' size={20} style={styles.rightIcon} />
          </View>
          <View style={styles.list}>
            <FontAwesome name='group' size={20} style={styles.leftIcon} />
            <Text style={styles.listText} onPress={()=> alert('hello')}>List of Children</Text>
            <FontAwesome name='chevron-right' size={20} style={styles.rightIcon} />
          </View>
          <View style={styles.list}>
            <FontAwesome name='table' size={20} style={styles.leftIcon} />
            <Text style={styles.listText} onPress={()=> alert('hello')}>Event History</Text>
            <FontAwesome name='chevron-right' size={20} style={styles.rightIcon} />
          </View>
          <View style={styles.list}>
            <FontAwesome name='gear' size={20} style={styles.leftIcon} />
            <Text style={styles.listText} onPress={()=> alert('hello')}>Setting</Text>
            <FontAwesome name='chevron-right' size={20} style={styles.rightIcon} />
          </View>
        </View>
      </>
    );
  }

  const styles = StyleSheet.create({
    title: {
      paddingTop: 40,
      fontSize: 40,
      fontWeight: 'bold',
      marginTop: 48,
      paddingLeft: 24
    },
    username: {
      paddingTop: 40,
      fontSize: 30,
      fontWeight: 'bold',
      paddingLeft: 40
    },
    home: {
      border: '1px solid #DDD',
      backgroundColor: 'white',
      borderTopLeftRadius: '50px',
      borderTopRightRadius: '50px',
      paddingTop: 16,
      alignItems: "center"
    }, list: {
      flexDirection: 'row',
      paddingLeft: 30,
      paddingTop: 60
    }, listText: {
      fontSize: 20,
      flex: 5
    },
    leftIcon: {
      flex: 1
    }, rightIcon: {
      flex: 1
    }
  })

  export default HomeScreen;