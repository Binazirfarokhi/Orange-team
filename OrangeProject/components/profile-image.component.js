import { StyleSheet, View } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export const ProfileImage = ({size, children}) => (
    <View style={{...styles.thumbnail, height: (size|| 80) +16, width: (size || 80)+16}}>
          {
            children || <FontAwesome name='user' size={size || 80} color={'white'} />
                
          }
    </View>
)

const styles = StyleSheet.create({
    thumbnail: {
      height: 68,
      width: 68,
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: '8px solid #CCC',
      borderRadius: 35,
      backgroundColor: '#666'
    },
  });