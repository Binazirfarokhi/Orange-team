import { Text } from "@rneui/themed";
import { StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { View } from "react-native";

const CardWithNext = ({ onNext, title, tile }) => {
    return (
        <TouchableOpacity onPress={onNext}>
            <View style={styles.main}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch' }}>
                    <View style={{ display: 'flex', flex: 6 }}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.tile}>{tile}</Text>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <FontAwesome name='chevron-right' size={20} color='white' style={{ flex: 1 }} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    main: {
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#613194',
        padding: 20,
        borderRadius: 15
    }, title: {
        paddingBottom: 20,
        fontWeight: 'bold',
        fontSize: 20,
        color: '#FFF'
    }, tile: {
        color: '#FFF'
    }
})

export default CardWithNext;