import React from 'react';
import { Image, StyleSheet, View } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export const ProfileImage = ({size, source}) => {
    const containerSize = (size || 80) + 16;

    return (
        <View style={{...styles.thumbnail, height: containerSize, width: containerSize}}>
            {
                source 
                ? <Image source={source} style={{height: size || 80, width: size || 80}} />
                : <FontAwesome name='user' size={size || 80} color={'white'} />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    thumbnail: {
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
    //   borderWidth: 8,
    //   borderColor: '#CCC',
      borderRadius: 50,
      backgroundColor: '#666'
    },
});
