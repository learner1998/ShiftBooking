import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {get, post, put} from '../Api';
import {useFocusEffect} from '@react-navigation/native';
const styles = StyleSheet.create({
  shiftHeader: {
    backgroundColor: '#CBD2E1',
    height: '5%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '40%',
  },
  shiftHeaderTitle: {
    color: '#4F6C92',
    fontWeight: 'bold',
    marginLeft: '3%',
  },
  shiftHeaderLength: {
    color: '#A4B8D3',
    marginLeft: '3%',
  },
  container: {
    flex: 1,
    paddingTop: 50,
  },
  text: {
    fontSize: 18,
    color: '#4F6C92',
    height: 40,
    paddingTop: 8,
  },

  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50,
    alignItems: 'center',
    backgroundColor: '#F7F8FB',
    borderBottomWidth: 1, // Add border width
    borderColor: '#CBD2E1',
    marginHorizontal: 10,
  },

  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonCancel: {
    padding: 8,
    borderRadius: 20,
    width: 100,
    alignItems: 'center',
    backgroundColor: 'transparent', // Set the background color to transparent
    borderWidth: 1, // Add border width
    borderColor: '#E2006A',
  },
  buttonCancelDisabled: {
    padding: 8,
    borderRadius: 20,
    width: 100,
    alignItems: 'center',
    backgroundColor: 'transparent', // Set the background color to transparent
    borderWidth: 1, // Add border width
    borderColor: '#CBD2E1',
  },
  buttonTextCancel: {
    color: '#E2006A',
    fontSize: 14,
  },
  buttonTextCancelDisabled: {
    color: '#CBD2E1',
    fontSize: 14,
  },
});
const MyShifts = () => {
  const [myShifts, setMyShifts] = useState([]);
  const [totalShiftTime, setTotalShiftTime] = useState(0);
  // useEffect(() => {
  // }, [myShifts.length]);

  useFocusEffect(
    React.useCallback(() => {
      getShifts();
      // Your code here
    }, [myShifts.length]),
  );

  function getShifts() {
    get('/shifts')
      .then((response: any) => {
        let data = [];
        for (const item of response.data) {
          item['startDate'] = new Date(item.startTime).toLocaleDateString(
            'en-US',
            {month: 'long', day: 'numeric'},
          );
        }
        data = response.data.filter(
          (item: any) => item.booked && item.endTime > new Date().getTime(),
        );
        let timeShift = 0;
        // data.forEach(element => {
        //   timeShift +=
        //     parseInt(getTimeIn24HourFormat(element.startTime)) -
        //     parseInt(getTimeIn24HourFormat(element.endTime));
        // });
        console.log(timeShift);
        setMyShifts(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  const toggleBooking = (shift, index: number) => {
    let payload = {
      id: shift.id,
      booked: false,
      area: shift.area,
      startTime: shift.startTime,
      endTime: shift.endTime,
    };
    put(`/shifts/${shift.id}`, payload)
      .then((response: any) => {
        getShifts();
      })
      .catch(error => {
        // Handle any errors
        console.error('Error fetching data:', error);
      });
  };

  const groupedData = myShifts.reduce((acc, item) => {
    const {startDate, ...rest} = item;
    if (!acc[startDate]) {
      acc[startDate] = [];
    }
    acc[startDate].push(rest);
    return acc;
  }, {});
  const getTimeIn24HourFormat = time => {
    const date = new Date(time);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  function isWithinRange(startTime, endTime) {
    const current = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    return (current >= start && current <= end) || current >= start;
  }
  return (
    <View style={styles.container}>
      {myShifts.length ? (
        <ScrollView>
          {Object.keys(groupedData).map((date, index) => (
            <View key={index}>
              <Text style={styles.text}>{date}</Text>
              {groupedData[date].map((item, index) => (
                <View style={styles.listContainer} key={index}>
                  <Text>
                    {getTimeIn24HourFormat(item.startTime)} -
                    {getTimeIn24HourFormat(item.endTime)}
                  </Text>
                  <TouchableOpacity
                    style={
                      !isWithinRange(item.startTime, item.endTime)
                        ? !item.booked
                          ? styles.button
                          : styles.buttonCancel
                        : styles.buttonCancelDisabled
                    }
                    disabled={isWithinRange(item.startTime, item.endTime)}
                    onPress={() => toggleBooking(item, index)}>
                    <Text
                      style={
                        !isWithinRange(item.startTime, item.endTime)
                          ? !item.booked
                            ? styles.buttonText
                            : styles.buttonTextCancel
                          : styles.buttonTextCancelDisabled
                      }>
                      {item.booked ? 'Cancel' : 'Book'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>No Shifts Available</Text>
        </View>
      )}
    </View>
  );
};

export default MyShifts;
