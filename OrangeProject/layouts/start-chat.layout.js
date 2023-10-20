import React, { useState } from 'react';
import { Box, Image, Text } from "native-base"
import Subtitle from '../components/text/subtitle';


export default function StartChatScreen({ }) {

    return (
            <Box flex="1" alignItems="center" padding="10" justifyContent="center">
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
                        source={require('../assets/Intersect.png')} 
                        alt="Illustration for starting new chat" 
                        size="xl" 
                    />
                </Box>
            </Box>
    );
}
