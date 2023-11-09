import { Header } from "@rneui/themed";
import Feather from "react-native-vector-icons/Feather";
import Subtitle from "../../components/text/subtitle";

export default function NoResultScreen({ navigation }) {
    return (
        <>
        <Header
            style={{marginTop:0}}
            backgroundColor="transparent"
            leftComponent={
                <Feather
                name="arrow-left"
                size={30}
                onPress={() =>
                    navigation.navigate("AuthorizedTabs", { screen: "Home" })
                }
                />
            }
        />
        <Subtitle>No Search Result Found</Subtitle>
        </>
    );
}
