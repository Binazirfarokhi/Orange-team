import React, { useState, useEffect } from 'react';
import { Button, SearchBar } from "@rneui/themed";
import { SafeAreaView, ScrollView, View, Text, Dimensions  } from "react-native";
import { Feather } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons'; 
import Subtitle from "../../components/text/subtitle";
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import DatePicker from 'react-native-date-picker';
import * as Location from 'expo-location';
import { getLocation, get } from '../../contexts/api';
import { getPersistData } from "../../contexts/store";
import { bindOrgAndPosition } from "../../util/general-functions";

export default function SearchEventScreen({ navigation }) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [ageGroupValues, setAgeGroupValues] = useState([3, 10]);
  const [participants, setParticipants] = useState('100');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [isFromPickerVisible, setFromPickerVisible] = useState(false);
  const [isToPickerVisible, setToPickerVisible] = useState(false);
  const [address, setAddress] = useState("UBC Robson Square, 800 Robson St, Vancouver, BC V6E 1A7");
  const [location, setLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [role, setRole] = useState(0);
  const [orgPos, setOrgPos] = useState({});
  const [events, setEvents] = useState([]);
  const [reloadOnce, setReloadOnce] = useState(true);

  const LeftIcon = () => (
    <Feather name="chevron-left" size={24} color="black" />
  );

  // Get long and lat data via EXPO locaiton
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      const coordinates = {
        lat: location.coords.latitude,
        lon: location.coords.longitude,
      };
  
      // console.log(coordinates)
      fetchAddress(coordinates);
    })();
  }, []);

  // get address by reverse geocoding
  const fetchAddress = async (coordinates) => {
    try {
      const { lat, lon } = coordinates;
      if (!lat || !lon) {
        console.error('Latitude and longitude are missing');
        return;
      }
      const response = await getLocation('/location/geocoding', { lat, lon });
      // console.log('Features:', response.data.address.features);
      // console.log(response.data.address.features[0].properties.formatted);
      const formattedAddress = response.data.address.features[0].properties.formatted;
      setAddress(formattedAddress);
      // console.log(address);
    } catch (error) {
      console.error('Error fetching address data', error);
    }
  };

  useEffect(() => {
    getPersistData("userInfo").then(async (data) => {
      if (data && data.length > 0) {
        let result = [];
        const { orgs, positionOfOrganization, role } = data[0];
        setRole(role);
        setOrgPos(bindOrgAndPosition(orgs, positionOfOrganization));
        if (data[0].role === 2) {
          result = (await get(`/orgs/events/${data[0].organization}`)).data
            .data;
          setEvents(result);
        } else {
          result = (await get(`/orgs/events`)).data.data;
          setEvents(result);
          console.log(events)
        } 
      }
    });
  }, [reloadOnce]);

  const reloadData = () => {
    setReloadOnce(!reloadOnce);
  };

  useEffect(() => {
    setReloadOnce(!reloadData);
    const timer = setTimeout(() => {
      setReloadOnce(!reloadData);
    }, 1000 * 5);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = () => {
    const filteredEvents = events.filter(event =>
      event.eventName.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    console.log(filteredEvents);
  
    if (filteredEvents.length > 0) {
      navigation.navigate('Event', { filteredEvents });
  
    } else {
      navigation.navigate('NoResult');
    }
  };
  
  
  const screenWidth = Dimensions.get('window').width;
  const sliderWidth = screenWidth - 40; 
  
  const categories = ['Sports', 'Community', 'Music', 'Kids', 'Charity', 'Cooking', 'Festivals', 'Arts', 'Outdoor', 'Other'];
  const handlePress = (category) => {
    setSelectedCategory(category);
  };

  return (
      <>
      <SafeAreaView>
        <ScrollView>
          <View style={{marginHorizontal: '5%'}}>
            <SearchBar
              lightTheme
              placeholder="Search events"
              onChangeText={(text) => setSearchKeyword(text)}
              value={searchKeyword}
              containerStyle={{
                flex: 1,
                backgroundColor: "transparent",
                borderBottomColor: "transparent",
                borderTopColor: "transparent",
                paddingHorizontal: 0,
              }}
              inputContainerStyle={{
                backgroundColor: "#D8D4DE",
                borderRadius: 25,
                height: 50
              }}
              inputStyle={{color:'black'}}
              searchIcon={<LeftIcon />}
            />

            {/* Location */}
            <View style={{flexDirection:'row', justifyContent:'space-between', gap: 10, marginVertical: 20}}>
              <Ionicons name="location-sharp" size={28} color="black" />
              <Text style={{ flexShrink: 1 }}>{address}</Text>
              <MaterialIcons name="edit" size={28} color="#06655B" />
            </View>

            {/* Date section */}
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <View>
                <Subtitle style={{ textAlign: 'left', color:'#444444' }}>From</Subtitle>
                <Button 
                  type='outline' 
                  buttonStyle={{marginVertical: 10, borderRadius:0, borderWidth:1, borderColor: 'black', paddingVertical:5}}
                  titleStyle={{color: '#444444'}}
                  onPress={() => setFromPickerVisible(true)}
                >
                  {fromDate.toLocaleDateString()}
                </Button>
                <DatePicker
                  modal
                  open={isFromPickerVisible}
                  date={fromDate}
                  onConfirm={(date) => {
                    setFromPickerVisible(false);
                    setFromDate(date);
                  }}
                  onCancel={() => {
                    setFromPickerVisible(false);
                  }}
                />
              </View>
              <View>
                <Subtitle style={{ textAlign: 'left', color:'#444444' }}>To</Subtitle>
                <Button 
                  type='outline' 
                  buttonStyle={{marginVertical: 10, borderRadius:0, borderWidth:1, borderColor: 'black', paddingVertical:5 }}
                  titleStyle={{color: '#444444'}}
                  onPress={() => setToPickerVisible(true)}
                >
                  {toDate.toLocaleDateString()}
                </Button>
                <DatePicker
                  modal
                  open={isToPickerVisible}
                  date={toDate}
                  onConfirm={(date) => {
                    setToPickerVisible(false);
                    setToDate(date);
                  }}
                  onCancel={() => {
                    setToPickerVisible(false);
                  }}
                />
              </View>
            </View>

            {/* Category section */}
            <View style={{marginVertical: 10}}>
              <Subtitle style={{ textAlign: 'left', color:'#444444' }}>Categories</Subtitle>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', marginTop: 10, gap:10 }}>
                {categories.map((category, index) => (
                  <Button
                    key={index}
                    buttonStyle={{ borderRadius: 50, backgroundColor: selectedCategory === category ? '#613194' : '#9B77C2', }} 
                    title={category}
                    titleStyle={{fontSize:12, fontWeight: 600}}
                    onPress={() => handlePress(category)}
                  />
                ))}
              </View>
            </View>

            {/* Age group section */}
            <View style={{ marginVertical: 10 }}>
              <Subtitle style={{ textAlign: 'left', color: '#444444' }}>Age Group</Subtitle>
              <MultiSlider
                values={ageGroupValues}
                onValuesChange={setAgeGroupValues}
                sliderLength={sliderWidth}
                min={0}
                max={20}
                step={1}
                allowOverlap={false}
                snapped
                minMarkerOverlapDistance={10}
                customMarkerLeft={(e) => <CustomMarker currentValue={ageGroupValues[0]} />}
                customMarkerRight={(e) => <CustomMarker currentValue={ageGroupValues[1]} />}
                trackStyle={{
                  height: 10,
                  backgroundColor: '#f0f0f0',
                  borderRadius: 5
                }}
                selectedStyle={{
                  backgroundColor: '#613194',
                }}
                unselectedStyle={{
                  backgroundColor: '#E99EB3',
                }}
                containerStyle={{
                  marginTop: 10
                }}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#444' }}>{ageGroupValues[0]}</Text>
                <Text style={{ color: '#444' }}>{ageGroupValues[1]}</Text>
              </View>
            </View>

            {/* participants section */}
            <View style={{marginTop: 10, marginBottom: 20}}>
              <Subtitle style={{ textAlign: 'left', color:'#444444' }}>Participants</Subtitle>
              <MultiSlider
                values={[participants]} 
                onValuesChange={(values) => setParticipants(values[0])} 
                sliderLength={sliderWidth} 
                min={0}
                max={100}
                step={5}
                allowOverlap={false}
                snapped
                minMarkerOverlapDistance={10}
                customMarkerLeft={(e) => <CustomMarker currentValue={participants} />}
                trackStyle={{
                  height: 10,
                  backgroundColor: '#f0f0f0',
                  borderRadius: 5
                }}
                selectedStyle={{
                  backgroundColor: '#613194',
                }}
                unselectedStyle={{
                  backgroundColor: '#E99EB3',
                }}
                containerStyle={{
                  marginTop: 10
                }}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <Text style={{ color: '#444' }}>{participants}</Text>
              </View>
            </View>
            <Button onPress={handleSearch}>Search</Button>
          </View>
        </ScrollView>
      </SafeAreaView>
      </>
  );
}
