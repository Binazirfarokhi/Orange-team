import { Text } from "react-native";
export default function Subtitle({ children }) {
    return (
        <Text style={{
            textAlign: 'center',
            // fontFamily: 'Poppins',
            fontSize: 22,
            fontWeight: 600
        }}>
            { children }
        </Text>
    );
}
