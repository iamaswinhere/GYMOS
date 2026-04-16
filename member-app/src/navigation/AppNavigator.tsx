import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { COLORS } from '../constants/theme';

import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AttendanceScannerScreen from '../screens/AttendanceScannerScreen';
import AttendanceScannerScreen from '../screens/AttendanceScannerScreen';

import StartupLoader from '../components/StartupLoader';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { member, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <StartupLoader />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={member ? "Dashboard" : "Login"}
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Scanner" component={AttendanceScannerScreen} />
        <Stack.Screen name="Scanner" component={AttendanceScannerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
