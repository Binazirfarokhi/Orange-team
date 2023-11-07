import { ImageBackground, ScrollView, Text, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useEffect, useState } from 'react';
import { get, patch } from '../contexts/api';
import moment from 'moment/moment';
import { POSITIONS, getPositionByIndex } from '../util/constants';
import { Dropdown } from 'react-native-element-dropdown';
import { getPersistData } from '../contexts/store';
import { Avatar, Button, Overlay } from '@rneui/themed';
import { getImageUrl } from '../util/general-functions';
import EventItem from '../components/event-item.component';


const VolunteerDetailScreen = ({ navigation, route }) => {
    const [id, setid] = useState();
    const [email, setEmail] = useState();
    const [fromOrg, setFromOrg] = useState();
    const [orgId, setOrgId] = useState();
    useEffect(() => {
        if (route && route.params) {
            setEmail(route.params.email)
            setFromOrg(route.params.fromOrg)
            setOrgId(route.params.orgId)
            setid(route.params.id)
        }
    }, []);

    const [image, setImage] = useState();

    const [volunteerInfo, setVolunteerInfo] = useState({});
    const [collapse, setCollapse] = useState(0);
    const [selectedDropdown, setSelectedDropdown] = useState([]);
    const [isFocus, setIsFocus] = useState(false);
    const [updatedOrgPosition, setUpdatedOrgPosition] = useState(false);
    const [orgList, setOrgList] = useState([]);


    useEffect(() => {
        get(`/orgs`).then(data => {
            setOrgList(data.data)
        }).catch(error => {
            console.error(error);
            alert('Unable to load organization list.');
        })
    }, []);

    useEffect(() => {

        getPersistData('userInfo').then(async data => {
            if (data && data.length > 0) {
                const { emailAddress } = data[0].signup;
                setEmail(emailAddress)
                const result = (await get(`/profile/${emailAddress}`)).data[0];
                getImageUrl(data[0].id).then(data => {
                    if (data !== 'FAILED')
                        setImage(data)
                }).catch(error => { });

                get(`/profile/${email && email !== null ? email : emailAddress}`).then(data => {
                    setid(data.data[0].id);
                    setVolunteerInfo(data.data[0]);
                    let posits = data.data[0].positionOfOrganization.map(posit => getPositionByIndex(posit));
                    setSelectedDropdown(posits)
                }).catch(error => {
                    console.error(error);
                    alert('Unable to find volunteer information');
                })
            }
        });
    }, []);

    useEffect(() => {
        if (updatedOrgPosition) {
            console.log(id, selectedDropdown.map(drop => drop.value))
            patch(`/orgs/volunteer/${id}`, selectedDropdown.map(drop => drop.value))
                .then(data => alert(data.data.message))
                .catch(error => { alert(error); console.error(error) });
        }
    }, [selectedDropdown])

    const getOrg = (index) => {
        let org = '', positon = 'Please reach out to Organization Admin';
        if (volunteerInfo.orgs.length > index) {
            org = volunteerInfo.orgs[index];
            org = orgList.filter(o => o.id === org)[0].name
        } else {
            return;
        }
        if (volunteerInfo.positionOfOrganization.length > index)
            positon = volunteerInfo.positionOfOrganization[index]
        return (
            <View key={index} style={{ display: 'flex', flexDirection: 'column', height: (fromOrg ? 40 : 20) * volunteerInfo.orgs.length }}>
                <View style={{ flex: 1 }}><Text style={styles.cardItem}>{org}:</Text></View>
                <View style={{ flex: 1, paddingLeft: 30 }}>
                    {getOrgPosition(positon, index)}
                </View>
            </View>
        );
    }

    const getOrgPosition = (position, index) => {
        if (!fromOrg) return (<Text style={styles.cardItem}>{position}</Text>);
        return (<Dropdown
            style={{
                ...styles.dropdown,
                height: 30,
            }}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={POSITIONS}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Select item' : '...'}
            searchPlaceholder="Search..."
            value={selectedDropdown[index]}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
                let data = [...selectedDropdown];
                data[index] = item;
                setSelectedDropdown(data);
                setIsFocus(false);
                setUpdatedOrgPosition(true);
            }}
        />)
    }

    if (!volunteerInfo || !volunteerInfo.signup) return null
    return (
        <>
            <View style={styles.main}>
                <ImageBackground source={require('../assets/parent-background.png')} imageStyle={{ opacity: .1, marginBottom: -100 }} resizeMode='cover'>
                    <View style={{ paddingLeft: 20, height: 30 }}>
                        <Feather name='arrow-left' size={30} style={styles.leftIcon} onPress={() => navigation.goBack()} />
                    </View>
                    <ScrollView style={{ marginBottom: 30 }}>
                        <View style={{ alignItems: 'center' }}>
                            <Avatar
                                size={120}
                                avatarStyle={{ marginLeft: 10 }}
                                rounded
                                source={image ? { uri: image } : require('../assets/boy.png')}>

                            </Avatar>
                            <Text style={styles.name}>{volunteerInfo.signup.displayName}</Text>
                        </View>
                        <View style={styles.someInfo}>
                            <View style={styles.eachInfo}><Text>0</Text><Text style={styles.smallFont}>Event Joined</Text></View>
                            <View style={styles.eachInfo}><Text>{moment.unix(volunteerInfo.signup.createdAt.seconds).fromNow(true)}</Text><Text style={styles.smallFont}>Times in Volunteer</Text></View>
                            {/* <View style={styles.eachInfo}><Text>0</Text><Text style={styles.smallFont}>View Profile</Text></View> */}
                        </View>
                        <View style={styles.list}>
                            <View style={styles.item}>
                                <FontAwesome5 name='user-alt' size={20} style={styles.leftIcon} />
                                <Text style={styles.itemText} onPress={() => setCollapse(0)}>Personal Information</Text>
                                <FontAwesome name={collapse === 0 ? 'chevron-up' : 'chevron-down'} size={20} style={styles.rightIcon} />
                            </View>
                            {collapse === 0 &&
                                <View style={styles.card}>
                                    <Text style={styles.cardLabel}>Email</Text>
                                    <Text style={styles.cardItem}>{volunteerInfo.signup.emailAddress}</Text>
                                    <Text style={styles.cardLabel}>Phone Number</Text>
                                    <Text style={styles.cardItem}>{volunteerInfo.contactNumber}</Text>
                                    <Text style={styles.cardLabel}>Organization</Text>
                                    <Text style={styles.cardItem}>{volunteerInfo.signup.emailAddress}</Text>
                                    <Text style={styles.cardLabel}>Position of Organization</Text>
                                    <View>
                                        {orgId === undefined ?
                                            volunteerInfo.orgs.map((org, index) => getOrg(index))
                                            :
                                            volunteerInfo.orgs.filter(vi => vi === orgId).map((org, index) => getOrg(index))
                                        }
                                    </View>
                                </View>
                            }
                            <View style={styles.item}>
                                <MaterialIcons name='event-available' size={20} style={styles.leftIcon} />
                                <Text style={styles.itemText} onPress={() => navigation.navigate('EventHistory')}>Event History</Text>
                                <FontAwesome name={'chevron-right'} size={20} style={styles.rightIcon} />
                            </View>
                            <View style={styles.item}>
                                <FontAwesome name='clock-o' size={20} style={styles.leftIcon} />
                                <Text style={styles.itemText} onPress={() => setCollapse(2)}>Time In Volunteer</Text>
                                <FontAwesome name={collapse === 2 ? 'chevron-up' : 'chevron-down'} size={20} style={styles.rightIcon} />
                            </View>

                            {collapse === 2 &&
                                <View style={styles.card}>
                                    <Text style={styles.cardItem}>Times in: {moment.unix(volunteerInfo.signup.createdAt.seconds).fromNow(true)}</Text>
                                    <Text style={styles.cardItem}>Since: {moment.unix(volunteerInfo.signup.createdAt.seconds).format('MMMM Do YYYY, h:mm:ss a')}</Text>
                                </View>
                            }
                            <View style={styles.item}>
                                <MaterialIcons name='star-border' size={20} style={styles.leftIcon} />
                                <Text style={styles.itemText} onPress={() => setCollapse(3)}>Review</Text>
                                <FontAwesome name={collapse === 3 ? 'chevron-up' : 'chevron-down'} size={20} style={styles.rightIcon} />
                            </View>
                            {collapse === 3 &&
                                <View style={styles.card}>
                                    {events.length > 0 ?
                                        <Text>Reviews</Text>
                                        :
                                        <Text>No reviews found.</Text>
                                    }
                                </View>
                            }
                        </View>
                    </ScrollView>
                </ImageBackground>
            </View>
        </>
    )
}

const styles = {
    leftIcon: {
        textAlign: 'left'
    },
    main: {
        paddingTop: 60,
        display: 'flex',
        backgroundColor: 'pink'
    }, name: {
        paddingTop: 10,
        fontSize: 30,
        fontWeight: 'bold'
    }, someInfo: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingRight: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    }, smallFont: {
        fontSize: 15
    }, eachInfo: {
        alignItems: 'center'
    }, collapser: {
        backgroundColor: 'white',
        borderRadius: 50
    }, list: {
        flexDirection: 'column',
        display: 'flex',
        paddingLeft: 30,
        paddingTop: 40,
        backgroundColor: '#EFEFEF',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    }, item: {
        display: 'flex',
        flexDirection: 'row',
        height: 60,
    }, itemText: {
        fontSize: 20,
        flex: 5
    }, leftIcon: {
        flex: 1
    }, rightIcon: {
        flex: 1
    }, card: {
        backgroundColor: '#DDD',
        marginBottom: 20,
        marginRight: 20,
        padding: 20,
    }, cardLabel: {
        height: 20,
        fontWeight: 'bold',
    }, cardLabel: {
        height: 20,
        fontWeight: 'bold',
    }, cardItem: {
        height: 30,
        lineHeight: 30,
        paddingLeft: 20,
    }, dropdown: {
        paddingLeft: 20,
        backgroundColor: 'white'
    }

}

export default VolunteerDetailScreen