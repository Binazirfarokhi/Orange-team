import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Card } from '@rneui/themed';
import { Calendar } from 'react-native-calendars'; 
import { Feather } from '@expo/vector-icons'; 
import moment from 'moment'; 
import { useNavigation } from '@react-navigation/native';


export default function CalendarComponent({ onDateChange, events }) {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedEvents, setSelectedEvents] = useState([]);

    const navigation = useNavigation();

    const handleDayPress = (day) => {
        setSelectedDate(day.dateString);
        onDateChange(day.dateString); 
        const eventsForDate = events.filter(event => moment(event.date).isSame(day.dateString, 'day'));
        setSelectedEvents(eventsForDate);
    };

    const markedDates = events.reduce((acc, event) => {
        const formattedDate = moment(event.date).format('YYYY-MM-DD');
        acc[formattedDate] = { marked: true, dotColor: '#E99EB3' };
        return acc;
    }, {});

    
    if (selectedDate) {
        markedDates[selectedDate] = { ...(markedDates[selectedDate] || {}), selected: true, selectedColor: '#7C53C3' };
    }

    return (
        <>
        <Calendar
            onDayPress={handleDayPress}
            markedDates={markedDates}
            style={{
                borderWidth: 0,
                borderColor: 'transparent',
                marginTop: 20,
            }}
            headerStyle={{backgroundColor:'#613194', }}
            theme={{
                backgroundColor: '#613194',
                calendarBackground: 'transparent',
                textSectionTitleDisabledColor: 'grey',
                selectedDayBackgroundColor: '#E99EB3',
                todayTextColor: 'blue',
                todayButtonFontWeight: 'bold',
                textDisabledColor: 'grey',
                dotColor: '#E99EB3',
                selectedDotColor: '#E99EB3',
                arrowColor: 'white',
                textMonthFontWeight:'bold',
                monthTextColor:'white',
                textDayStyle:{overflow: 'hidden'},
                selectedDayBackgroundColor:'#E99EB3'
            }}
            />
        <View style={{ marginVertical: 10,  }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 20, marginLeft:15}}>Registered Activities</Text>
            {selectedEvents.map((event, index) => (
                <TouchableOpacity onPress={() => navigation.navigate("EventDetail", { id: event.id })}>
                <Card key={index} containerStyle={{backgroundColor:'#613194', borderRadius:10, marginBottom:10, flexDirection:'row'}}>
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 10 }}>
                    <View style={{marginRight: 100}}>
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>
                        {event.eventName}
                      </Text>
                      <Text style={{ color: 'white' }}>{moment(event.date).format('YYYY-MM-DD')}</Text>
                      <Text style={{ color: 'white' }}>{event.time}</Text>
                    </View>
                    <Feather name="chevron-right" size={24} color="white" style={{marginVertical:10}}/>
                  </View>
                </Card>
              </TouchableOpacity>              
            ))}
        </View>
        </>
    );
}
