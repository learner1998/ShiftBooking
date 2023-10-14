import {Text, StyleSheet, View, ScrollView} from 'react-native';
import React, {Component, useEffect, useState} from 'react';
import {get} from '../Api';
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
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  text: {
    fontSize: 18,
  },
});
const MyShifts = () => {
  const [myShifts, setMyShifts] = useState([]);
  return (
    <View style={styles.container}>
      {myShifts.length ? (
        <ScrollView>
          {myShifts.map((item: any, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.text}>{item.area}</Text>
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
