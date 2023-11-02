import { Avatar, Text } from "@rneui/themed";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ProfileImage } from "./profile-image.component";
import { Button } from "@rneui/themed";


const PhotoUpload = ({ id, title, saveOption, cancelOption }) => {

    const upload = async () => {
        const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.allFiles],
        });
        this.setState({ singleFile: res });
    }

    const handleCancel = async () => {
        cancelOption();
    }

    const handleSave = async () => {
        saveOption();
    }

    return (
        <View style={styles.main}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={upload}>
                <View style={styles.profile}>
                    <Avatar
                        size={120}
                        rounded
                        icon={{ name: 'heartbeat', type: 'font-awesome' }}
                        containerStyle={{ backgroundColor: '#eb1561' }}>
                            <Avatar.Accessory size={34} />
                        </Avatar>
                </View>
            </TouchableOpacity>
            <View style={styles.options}>
                <Button containerStyle={styles.option} onPress={handleSave}>Save</Button>
                <Button containerStyle={styles.option} onPress={handleCancel}>Cancel</Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        width: 300,
    }, title: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        paddingTop: 20,
        paddingBottom: 20,
    }, profile: {
        alignItems: "center"
    }, options: {
        paddingTop: 20,
        display: 'flex',
        flexDirection: 'row',
    }, option: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
    }
})

export default PhotoUpload