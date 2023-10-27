import React, { useState, useCallback, useEffect } from 'react';
import { View } from "react-native";
import { Header, Text } from '@rneui/themed';
import Feather from 'react-native-vector-icons/Feather';
import { GiftedChat } from 'react-native-gifted-chat';
import { get, post } from '../../contexts/api';


export default function ChatScreen({ navigation, route }) {
    const { userId, myUserId } = route.params;

    const [messages, setMessages] = useState([]);
    const [userProfile, setUserProfile] = useState({
        _id: null,
        name: '',
        avatar: ''
    });

    const timestampToDate = (timestamp) => {
        return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    }    
    
    const onSend = useCallback(async (messages = []) => {
        // console.log("Attempting to send a message:", messages);
        try {
            if (messages.length > 0) {
                const messageToSend = messages[0]; 
                const response = await post('/chat', {
                    senderId: myUserId,
                    receiverId: userId,
                    text: messageToSend.text
                }); 
                // console.log("API Response:", response);
                if (response && response.data) {
                    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
                }
            }
        } catch (error) {
            console.error('There was an error sending the message:', error.response.data);
        }
    }, [myUserId, userId]);
    
    
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // console.log('userId fetching profile1', userId)
                const response = await get(`/chat/${userId}`);
                // console.log('userId fetching profile2', response.data)
                if (response && response.data) {
                    setUserProfile({
                        _id: response.data.id,
                        name: `${response.data.firstName} ${response.data.lastName}`,
                        avatar: response.data.profileImageURL
                    });
                }
            } catch (error) {
                console.error('Error fetching the user profile', error);
            }
        };
        if (userId) fetchUserProfile();
    }, [userId]);  
    
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                // console.log("test1", userId, myUserId)
                const response = await get(`/chat/${myUserId}/${userId}`); 
                if (response && response.data) {
                    const transformedData = response.data.map(message => ({
                        ...message,
                        _id: message.id,  
                        createdAt: timestampToDate(message.createdAt),
                        user: { 
                            ...message.user, 
                            _id: message.senderId  
                        }
                    }));
                    setMessages(transformedData);
                }
                // console.log(response.data)
            } catch (error) {
                console.error('Error fetching the messages', error);
            }
        };
        if (myUserId && userId) fetchMessages();
    }, []);  
    
    return (
        <>
            <View style={{ flex: 1 }}>
                <Header 
                    backgroundColor='transparent' 
                    centerComponent={{ text: userProfile.name, style:{fontSize:25, fontWeight: '700' }}}
                    leftComponent={<Feather name='arrow-left' size={30} onPress={() => navigation.goBack()}/>}
                />
                <GiftedChat 
                    messages={messages}
                    onSend={newMessages => onSend(newMessages)}
                    user={{ _id: myUserId }}
                    showAvatarForEveryMessage={true}
                />
            </View>
        </>
    );
}
