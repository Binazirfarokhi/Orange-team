import React, { useState } from 'react';
import { Box, Image, Text } from "@gluestack-ui/themed"
import Subtitle from '../../components/text/subtitle';
import Feather from 'react-native-vector-icons/Feather';


export default function StartChatScreen({navigation}) {
    return (
            <Box flex="1" alignItems="center" padding="10" justifyContent="center">
                <Feather name='arrow-left' size={30} onPress={() => navigation.navigate('AuthorizedTabs', {screen: 'Home'})} />
                <Subtitle>Start a new chat</Subtitle>
                <Text textAlign="center">Tap the icon on the top right corner to start a new chat. </Text>
                <Box
                    width="110"
                    height="110" 
                    borderRadius="100"
                    backgroundColor="#06655B"
                    justifyContent="center"
                    alignItems="center"
                    paddingBottom="5"
                    marginTop="5"
                >
                    <Image 
                        source={require('../../assets/Intersect.png')} 
                        alt="Illustration for starting new chat" 
                        size="xl" 
                    />
                </Box>
            </Box>
    );
}
