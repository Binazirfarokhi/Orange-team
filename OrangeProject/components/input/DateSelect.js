import React, { useState } from 'react';
import { View, Text } from 'react-native';

import Subtitle from '../text/subtitle';

export default function DateSelect({  }) {
   const [fromDate, setFromDate] = useState(null);
   const [toDate, setToDate] = useState(null);

  const handleFromDateChange = (date) => {
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
  };

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View>
        <Subtitle style={{ textAlign: 'left', color: '#444444' }}>From</Subtitle>
        <DateTimePicker
         
        />
      </View>
      <View>
        <Subtitle style={{ textAlign: 'left', color: '#444444' }}>To</Subtitle>
        <DateTimePicker
          
        />
      </View>
    </View>
)}
