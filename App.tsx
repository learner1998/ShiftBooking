/* eslint-disable prettier/prettier */
// App.js
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import AvailableShifts from './Components/AvailableShifts';
import MyShifts from './Components/MyShifts';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="My Shifts" component={MyShifts} />
        <Tab.Screen name="Available Shifts" component={AvailableShifts} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
