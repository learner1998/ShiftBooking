/* eslint-disable prettier/prettier */
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {get, put} from '../Api';
import CustomLoader from './Loader';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  text: {
    fontSize: 18,
    color: '#4F6C92',
    height: 40,
    paddingTop: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
    marginTop: '3%',
    backgroundColor: '#F7F8FB',
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
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    color: '#004FB4',
  },
  tabText: {
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 8,
    borderRadius: 20,
    width: 100,
    alignItems: 'center',
    backgroundColor: 'transparent', // Set the background color to transparent
    borderWidth: 1, // Add border width
    borderColor: '#16A64D', // Set the border color
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
  buttonText: {
    color: '#16A64D',
    fontSize: 14,
  },
  buttonTextCancel: {
    color: '#E2006A',
    fontSize: 14,
  },
});
function AvailableShifts() {
  const [loading, setLoading] = useState(false);
  const [shifts, setShifts] = useState([]);
  const [dataTabs, setDataTabs] = useState({});
  useEffect(() => {
    getAvailableShifts();
  }, []);
  const handleDataTabsUpdate = (newData) => {
    setDataTabs(newData);
  };
  const getAvailableShifts = () => {
    setLoading(true);
    get('/shifts')
      .then((response: any) => {
        let data = {};
        response.data.map(city => {
          data[city.area] = response.data.filter(
            item => item.area == city.area && (new Date(item.startTime).getDate() >= new Date().getDate()),
          );
        });
        for (const key of Object.keys(data)) {
          for (const item of data[key]) {
            item['startDate'] = new Date(item.startTime).toLocaleDateString(
              'en-US',
              {month: 'long', day: 'numeric'},
            );
          }
        }
        setDataTabs(data);
        setShifts(response.data);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        console.error('Error fetching data:', error);
      });
  };
  return loading ? (
    <CustomLoader loading={loading} />
  ) : (
    <TabsWithHeader data={dataTabs} handleDataTabsUpdate={handleDataTabsUpdate} />
  );
}

const TabsWithHeader = ({data = {}, handleDataTabsUpdate }) => {
  const [loadingMap, setLoadingMap] = useState({});

  const updatedToggleBooking = (shift, index) => {
    setLoadingMap((prevLoadingMap) => ({
      ...prevLoadingMap,
      [shift.id]: true,
    }));
    let payload = {
      id: shift.id,
      booked: !shift.booked,
      area: shift.area,
      startTime: shift.startTime,
      endTime: shift.endTime,
    };
    put(`/shifts/${shift.id}`, payload)
      .then((response: any) => {
        const newData = { ...data };
        const activeDataCopy = [...data[activeTab]];
        activeDataCopy.forEach(element => {
          if(element.id === shift.id){
            element.booked = !shift.booked;
          }
        })
        newData[activeTab] = activeDataCopy;
        handleDataTabsUpdate(newData);
        setLoadingMap((prevLoadingMap) => ({
          ...prevLoadingMap,
          [shift.id]: false,
        }));
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };
  function isWithinRange(startTime, endTime) {
    const current = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    return ( current >= start && current <= end ||  current >= start);
  }
  const [activeTab, setActiveTab] = useState(
    Object.keys(data).length > 0 ? Object.keys(data)[0] : '',
  );
  const [activeData, setActiveData]: any = useState(
    Object.values(data).length > 0 ? Object.values(data)[0] : [],
  );
  const onTabPress = (tabId: string) => {
    setActiveTab(tabId);
    setActiveData(data[tabId]);
  };
  const groupedData = activeData.reduce((acc, item) => {
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

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {Object.keys(data).map(item => (
          <TouchableOpacity
            key={item}
            onPress={() => onTabPress(item)}
            style={[styles.tab]}>
            <Text
              style={[
                styles.tabText,
                activeTab === item && styles.activeTab,
              ]}>
              {item} ({data[item]?.length})
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView>
        {Object.keys(groupedData).map((date, index) => (
          <View key={index}>
            <Text style={styles.text}>{date === new Date().toLocaleDateString(
            'en-US',
            {month: 'long', day: 'numeric'},
          ) ? 'Today' : date}</Text>
            {groupedData[date].map((item, index) => (
              <View style={styles.listContainer} key={index}>
                <Text>
                  {getTimeIn24HourFormat(item.startTime)} -{' '}
                  {getTimeIn24HourFormat(item.endTime)}
                </Text>
                <Text>{item.booked ? 'Booked' : ''}</Text>
                <TouchableOpacity
                  disabled={isWithinRange(item.startTime, item.endTime)}
                  style={!item.booked ? styles.button : styles.buttonCancel}
                  onPress={() => updatedToggleBooking(item, index)}>
                 {loadingMap[item.id] ? (
                    <CustomLoader loading={loadingMap[item.id]} />
                  //   <Image
                  //   style={{height:'10px'}}
                  //   source={require('../assets/spinner_green.svg')}
                  // />
                  ) : (
                    <Text
                      style={
                        !item.booked
                          ? styles.buttonText
                          : styles.buttonTextCancel
                      }
                    >
                      {item.booked ? 'Cancel' : 'Book'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default AvailableShifts;
