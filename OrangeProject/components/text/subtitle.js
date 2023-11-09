import { Text } from "react-native";
export default function Subtitle({ children, style }) {
    return (
        <Text style={[{
            textAlign: 'center',
            fontSize: 22,
            fontWeight: '600', 
            color: 'black',
        }, style]} 
        >
            { children }
        </Text>
    );
}
