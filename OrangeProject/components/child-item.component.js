import { Button } from "@rneui/themed";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, Text, View } from "react-native";

export default function ChildItem ({ navigation, child}){
    return (
        <View style={styles.main}>
            <Text style={styles.name}>{child.name}</Text>
            <View style={styles.age}>
                <Text style={{flex: 1}}>Age: </Text>
                <Text style={{flex: 1, textAlign: 'right'}}>{child.age}</Text>
            </View>
            <View style={styles.age}>
                <Button
                    containerStyle={{ margin: 5, flex: 4}}
                    disabledStyle={{
                        borderWidth: 2,
                        borderColor: "#00F"
                    }}
                    disabledTitleStyle={{ color: "#00F" }}
                    linearGradientProps={null}
                    iconContainerStyle={{ background: "#000" }}
                    loadingProps={{ animating: true }}
                    loadingStyle={{}}
                    onPress={()=> navigation.navigate('AddChild', {child})}
                    title="Edit"
                    titleProps={{}}
                    titleStyle={{ marginHorizontal: 5 }}
                    />
                <Button
                    containerStyle={{ margin: 5, flex: 1}}
                    disabledStyle={{
                        borderWidth: 2,
                        borderColor: "#00F"
                    }}
                    disabledTitleStyle={{ color: "#00F" }}
                    linearGradientProps={null}
                    iconContainerStyle={{ background: "#000" }}
                    loadingProps={{ animating: true }}
                    icon={<FontAwesome name='trash' size={20} color={'red'} />}
                    loadingStyle={{}}
                    onPress={()=> navigation.navigate({name: 'AddChild', params: child})}
                    title=""
                    titleProps={{}}
                    titleStyle={{ marginHorizontal: 5 }}
                    type="clear"
                    />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        borderColor: '#999',
        borderWidth: 2,
        borderRadius: 10,
        marginTop: 20,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
    }, name: {
        fontSize:20,
        fontWeight: 'bold'
    }, age : {
        paddingTop: 10,
        flexDirection: 'row',
        display: 'flex'
    }, option: {

    }
})