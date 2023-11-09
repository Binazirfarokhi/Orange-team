import { Button, Image } from "@rneui/themed";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { POSITION_L1 } from "../util/constants";
import { Alert } from "react-native";
import { deleteCall } from "../contexts/api";
import { Avatar } from "react-native-gifted-chat";
import { ProfileImage } from "./profile-image.component";

export default function EventItem({ navigation, event, orgPos, reload }) {
    const { eventName, date, time, organization, images, location, id, ageGroup, participants } = event;
    const postion = orgPos[organization] || POSITION_L1;
    const goto = () => {
        navigation.navigate('EventDetail', { id })
    }

    const deleteEvent = () => {
        Alert.alert('Warning', `Would you like to delete event "${eventName}"`, [
            {
                text: 'Cancel',
                onPress: () => { },
                style: 'cancel',
            },
            { text: 'OK', onPress: confirmDelete },
        ]);
    }

    const confirmDelete = async () => {
        try {
            const result = await deleteCall(`/orgs/event/${id}`).data;
            if (result.status === "OK") reload();
        } catch (error) {
            console.error(error)
            alert('Unable to delete event.')
        }
    }

    const editEvent = () => {
        navigation.navigate('CreateEvent', { id })
    }

    return (
        <View style={styles.main}>
            <View style={{ flex: 1, paddingRight: 20, alignItems: 'center', justifyContent: 'center' }}>
                <Image
                    style={{
                        width: 140,
                        height: 140,
                        borderRadius: 15,
                    }}
                    source={(images && images !== null && images.length > 0)?{ uri: images[0] }: require('../assets/unilogo.png')} />
            </View>
            <View style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
                <TouchableOpacity style={styles.button} onPress={goto}>
                    <View style={{}}>
                        <Text style={styles.name}>{eventName}</Text>
                    </View>
                    <View style={{ paddingTop: 15, paddingBottom: 16, }}>
                        <Text>{date} {time}</Text>
                        <Text>{location}</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.option}>
                    <View style={{ flexDirection: 'column', fex: 2, display: 'flex' }}>
                        <Text>{ageGroup} Years</Text>
                        <Text>{participants} Participants</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: 'space-around' }}>
                        <Button icon={<FontAwesome name='edit' size={20} color="green" />} onPress={editEvent} type="clear" />
                        <Button icon={<FontAwesome name='trash' size={20} />} onPress={deleteEvent} type="clear" />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        marginTop: 20,
        paddingTop: 20,
        paddingLeft: 10,
        paddingRightt: 10,
        paddingBottom: 20,
        display: 'flex',
        minHeight: 150,
        flexDirection: "row",
    }, name: {
        fontSize: 16,
        fontWeight: 'bold'
    }, option: {
        display: 'flex',
        flexDirection: 'row',
    }
})