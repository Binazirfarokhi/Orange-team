import { Button } from "@rneui/themed";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, Text, View } from "react-native";

const ActivityItem = ({ event: { date, description, organization } }) => (
    <View style={styles.main}>
        <View style={{...styles.side, flex: 1}}>
        <FontAwesome name="tag" size={20} />
        </View>
        <View style={styles.center}>
            <Text style={styles.name}>{organization}</Text>
            <Text>{description} </Text>
        </View>
        <Text style={{...styles.side, flex: 2}}>{date}</Text>
    </View>
);

const styles = StyleSheet.create({
    main: {

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'stretch',
        borderColor: '#999',
        borderWidth: 2,
        borderRadius: 10,
        marginTop: 20,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
    }, name: {
        fontSize: 20,
        fontWeight: 'bold'
    }, center: {
        flex: 3,
        display: 'flex',
        justifyContent: 'flex-start'        
    }, side: {
        justifyContent: 'center'        
    }
})

export default ActivityItem