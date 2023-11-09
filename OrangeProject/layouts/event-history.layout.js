import { Text } from "@rneui/themed";
import { View } from "react-native";

import Feather from 'react-native-vector-icons/Feather';
import { useEffect } from "react";
import { useState } from "react";
import MyTheme from "../contexts/theme";
import { ScrollView } from "react-native";
import EventItem from "../components/event-item.component";
import { getPersistData } from "../contexts/store";
import { get } from "../contexts/api";
import { DATE_FORMAT_DISPLAY, POSITION_L1, TYPE_ORGANIZATION, TYPE_PARENT, TYPE_VOLUNTEER } from "../util/constants";
import moment from "moment";
import { bindOrgAndPosition } from '../util/general-functions'

let index = 0;

const EventHistoryScreen = ({ navigation }) => {
    const [eventName, setEventName] = useState('');
    const [events, setEvents] = useState([]);
    const [orgPos, setOrgPos] = useState({})
    const [reloadOnce, setReloadOnce] = useState(true);
    const [role, setRole] = useState(0);

    const reloadData = () => {
        setReloadOnce(!reloadOnce)
    }

    useEffect(() => {
        getPersistData('userInfo').then(async data => {
            if (data && data.length > 0) {
                let result = [];
                const { orgs, positionOfOrganization, role, id } = data[0];
                setRole(role)
                setOrgPos(bindOrgAndPosition(orgs, positionOfOrganization));
                if (role === TYPE_PARENT) {
                    result = (await get(`/orgs/eventsJoined/${id}`)).data.data;
                    setEvents(result);
                } else if (role === TYPE_VOLUNTEER) {
                    if (data[0].orgs) {
                        await Promise.all(data[0].orgs.map(async org => {
                            const record = (await get(`/orgs/events/${org}`)).data.data;
                            result = [
                                ...result,
                                ...record
                            ]
                        }));
                        setEvents(result)
                    }

                }
            }
        });
    }, [reloadOnce]);

    useEffect(() => {
        setReloadOnce(!reloadData)
        const timer = setTimeout(() => {
            setReloadOnce(!reloadData)
        }, 1000 * 60);
        return () => clearTimeout(timer);
    }, [])

    return (
        <View style={styles.main}>
            <Feather name='arrow-left' size={30} style={styles.leftIcon} onPress={() => navigation.goBack()} />
            <Text style={styles.title}>Event History</Text>
            <View style={{ paddingBottom: 150, paddingRight: 20 }}>
                <ScrollView>
                    {events.length > 0 && events
                        .filter(event => moment(event.date, DATE_FORMAT_DISPLAY).diff(new Date(), 'day') < 0)
                        .filter(event => eventName === '' || event.eventName.indexOf(eventName) >= 0)
                        .map(event => (<EventItem key={event.id} event={event} navigation={navigation} orgPos={orgPos} reload={reloadData} />))}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = {
    main: {
        flex: 1,
        paddingLeft: 20,
        paddingTop: 60,
        display: 'flex',
        flexDirection: 'column',
    }, title: {
        paddingTop: 30,
        paddingBottom: 30,
        fontSize: 30
    }, searchbar: {
        display: 'flex',
        flexDirection: 'row',
        paddingRight: 20
    }, searchbox: {
        flex: 4,
        backgroundColor: '#D8D4DE',
        borderRadius: 50,
        lineHeight: 50,
        height: 50,
        paddingLeft: 20,
    }, container: {
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        position: "absolute",
        bottom: 20,
        right: 20,
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: MyTheme.colors.primary
    }, button: {
        color: 'white'
    }
}
export default EventHistoryScreen;