import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { SearchBar, Header, Button, Divider, Text } from '@rneui/themed';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ProfileImage } from '../../components/profile-image.component';
import { get } from '../../contexts/api';
import { getPersistData } from '../../contexts/store';

export default function ChatListScreen({navigation}) {
    const [focusedButton, setFocusedButton] = useState('parents');
    const [users, setUsers] = useState([]);
    const [myUserId, setMyUserId] = useState(null);


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await get('/profile');  
                if (response && response.data) {
                    setUsers(response.data);
                }
                // console.log(response.data);
            } catch (error) {
                console.error('There was an error fetching the users:', error);
            }
        };
    
        fetchUsers();
    }, []);

    
    useEffect(() => {
        const fetchMyUserId = async () => {
            try {
                const data = await getPersistData('userInfo');
                if (data && data.length > 0) {
                    const myId = data[0].id; 
                    setMyUserId(myId);
                }
            } catch (error) {
                console.error('Error fetching my user ID', error);
            }
        };
        fetchMyUserId();
    }, []);  

    const filteredUsers = users.filter(user => {
        if (focusedButton === 'parents') {
            return user.role === 0;
        } else if (focusedButton === 'organization') {
            return user.role === 1;
        }
        return true;
    });


    return (
        <>
        <View style={{paddingHorizontal:'3%'}}>
            <Header 
                backgroundColor='transparent' 
                centerComponent={{ text: 'Chat', style:{fontSize:25, fontWeight: '700', }}}
                leftComponent={<Feather name='arrow-left' size={30} onPress={() => navigation.navigate('AuthorizedTabs', {screen: 'Home'})} />}
                rightComponent={<FontAwesome name='plus' size={30}/>}
            />
            <View>
                <SearchBar 
                    lightTheme='true'
                    placeholder="Search"
                    containerStyle={{backgroundColor:'transparent', borderBottomColor: 'transparent', borderTopColor: 'transparent'}}
                    inputContainerStyle={{backgroundColor:'#D8D4DE', borderRadius:'50'}}
                />
                {/* <Icon name='filter' type='octicons' onPress={() => console.log('hello')} /> */}
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-evenly', marginBottom:'2%'}}>
                <Button
                title="Parents"
                onPress={() => setFocusedButton('parents')}
                buttonStyle={{
                    backgroundColor: focusedButton === 'parents' ? '#613194' : '#9B77C2',
                    borderRadius: 50,
                }}
                containerStyle={{
                    width: '45%',
                    marginVertical: 5,
                }}
                />
                <Button
                    title="Organization"
                    onPress={() => setFocusedButton('organization')}
                    buttonStyle={{
                        backgroundColor: focusedButton === 'organization' ? '#613194' : '#9B77C2',
                        borderRadius: 50,
                    }}
                    containerStyle={{
                        width: '45%',
                        marginVertical: 5,
                    }}
                />
            </View>
            <Divider />

            {filteredUsers.map((user, i) => {
                if(user.id !== myUserId) { 
                    return (
                        <TouchableOpacity 
                            key={i} 
                            style={{flexDirection:'row', marginVertical: '5%', alignItems: 'center', gap:'20'}} 
                            onPress={() => {navigation.navigate('ChatDetail',{userId: user.id, myUserId: myUserId});}}
                        >
                            <ProfileImage source={{uri: user.profileImageURL}} style={{borderRadius: 50, width: 60, height: 60, marginRight: 10}} />
                            <View style={{flexGrow:1}}>
                                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                    <Text style={{fontSize:18, fontWeight:'600'}}>{user.firstName} {user.lastName}</Text>
                                    <Text>Date</Text>
                                </View>
                                {/* <Text>{user.role}</Text> */}
                                <Text style={{marginBottom:'20%'}}>message preview</Text>
                                
                                <Divider />
                            </View>
                        </TouchableOpacity>
                    )
                }
                return null; 
            })}


        </View>
        </>
    );
}
