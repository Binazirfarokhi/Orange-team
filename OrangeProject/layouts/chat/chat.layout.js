import React, { useState, useCallback, useEffect } from 'react';
import { View } from "react-native";
import { Header, Text, Image } from '@rneui/themed';
import Feather from 'react-native-vector-icons/Feather';
import { GiftedChat, Bubble, Time, InputToolbar, Composer, Send, Actions } from 'react-native-gifted-chat';
import { get, post } from '../../contexts/api';
import { Ionicons } from '@expo/vector-icons';


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
        const intervalId = setInterval(fetchMessages, 2000);
        return () => clearInterval(intervalId);
    }, []);  


    const renderInputToolbar = (props) => (
        <InputToolbar {...props} 
            containerStyle={{ padding: 15, flex: 0, justifyContent:'center' }} 
            renderSend={renderSend}
            renderComposer={renderComposer}
            renderActions={renderActions}
        />
    );
    
    const renderComposer = (props) => (
        <Composer {...props} 
            textInputStyle={{ 
                borderRadius: 20, 
                borderWidth: 0.5, 
                borderColor: 'grey', 
                paddingTop: 8.5,
                paddingHorizontal: 10, 
                marginRight: 0,
                marginLeft: 10,
            }}
        />
    );
    
    const renderSend = (props) => (
        <Send {...props}>
            <View style={{width: 25, height: 25, justifyContent:'center'}}>
                <Ionicons name="md-send-sharp" size={25} color="#613194" />
            </View>
        </Send>
    );
    
    
    const renderActions = (props) => (
        <Actions {...props}>
           
        </Actions>
    );

    const renderTime = (props) => {
        return (
            <Time
                {...props}
                timeTextStyle={{
                    right: { color: '#817E7E' },
                    left: { color: 'white' },
                }}
            />
        );
    };
    
    const renderBubble = (props) => {
        const isLastMessage = props.currentMessage._id === messages[0]._id;
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: 'white',
                        borderTopLeftRadius: 12, 
                        borderTopRightRadius: 12,
                        borderBottomRightRadius: 3,
                        borderBottomLeftRadius: 12,
                        marginBottom: isLastMessage ? 40 : 5,
                    },
                    left: {
                        backgroundColor: '#9B77C2',
                        borderTopLeftRadius: 12, 
                        borderTopRightRadius: 12,
                        borderBottomRightRadius: 12,
                        borderBottomLeftRadius: 3,
                        marginBottom: isLastMessage ? 40 : 5,
                    }
                }}
                textStyle={{
                    right: { color: 'black' },
                    left: { color: 'white' },
                }}
                linkStyle={{
                    right: { color: 'black' },
                    left: { color: 'white' },
                }}
                renderTime={renderTime}
            />
        );
    };

    const renderAvatar = () => null;
    
    return (
        <>
            <View style={{ flex: 1, backgroundColor: "#D8D4DE" }}>
                <Header 
                    backgroundColor='white' 
                    centerComponent={{ 
                        children:(
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {userProfile.avatar ? 
                                <Image 
                                    source={{ uri: userProfile.avatar }} 
                                    style={{ width: 30, height: 30, borderRadius: 15, marginRight: 10 }}
                                /> 
                            : null }
                            <Text style={{ fontSize: 25, fontWeight: '700' }}>
                                {userProfile.name}
                            </Text>
                        </View>
                    )}}
                    leftComponent={<Feather name='arrow-left' size={30} onPress={() => navigation.goBack()}/>}
                />
                <GiftedChat 
                    messages={messages}
                    onSend={newMessages => onSend(newMessages)}
                    user={{ _id: myUserId }}
                    showAvatarForEveryMessage={false}
                    renderAvatar={renderAvatar}
                    renderBubble={renderBubble}
                    renderInputToolbar={renderInputToolbar}
                />
            </View>
        </>
    );
}
