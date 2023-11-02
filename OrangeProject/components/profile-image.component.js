import { StyleSheet, View, Image } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export const ProfileImage = ({size, uri}) => (
    <View style={{...styles.thumbnail, height: (size|| 80) +16, width: (size || 80)+16}}>
        {uri 
        ? <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
        : <FontAwesome name='user' size={size} color={'white'} />
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
      borderRadius: '50%',
      backgroundColor: '#666'
    },
  });