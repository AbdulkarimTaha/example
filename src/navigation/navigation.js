import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomePage from '../screens/HomePage';
import UserPage from '../screens/UserPage';
import ConsultationPage from '../screens/ConsultationPage';
import Chat from '../screens/Chat';
import WaitingRoom from '../screens/WaitingRoom';
import Video from '../screens/Video';

const Navigation = props => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'HomePage'}>
        <Stack.Screen name={'HomePage'} component={HomePage} />
        <Stack.Screen name={'UserPage'} component={UserPage} />
        <Stack.Screen name={'ConsultationPage'} component={ConsultationPage} />
        <Stack.Screen name={'ChatRoom'} component={Chat} />
        <Stack.Screen name={'Video'} component={Video} />
        <Stack.Screen name={'WaitingRoom'} component={WaitingRoom} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
