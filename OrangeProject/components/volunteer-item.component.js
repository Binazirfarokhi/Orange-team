import { Button } from "@rneui/themed";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, Text, View } from "react-native";
import { ProfileImage } from "./profile-image.component";
import moment from "moment";

export default function VolunteerItem ({ navigation, volunteer, orgId}){
    return (
        <View style={styles.main}>
            <View style={{flex: 2, paddingRight:40}}>
                <ProfileImage size={60} />
            </View>
            <View style={{flex: 7}}>
                <Text style={styles.name} onPress={()=> navigation.navigate('VolunteerDetail', 
                    {email: volunteer.signup.emailAddress, fromOrg: true, orgId, id: volunteer.id})}>{volunteer.signup.displayName}</Text>
                <Text>Year of Join: {moment.unix(volunteer.signup.createdAt.seconds).format('YYYY')}</Text>
            </View>
            <View style={styles.option}>
                <FontAwesome name='chevron-right' size={20} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        backgroundColor: '#E2CCFA',
        borderRadius: 10,
        marginTop: 20,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        display: 'flex',
        height: 120,
        flexDirection: "row"
    }, name: {
        fontSize:20,
        fontWeight: 'bold'
    }, option: {
        flex: 1,
        paddingTop: 30
    }
})