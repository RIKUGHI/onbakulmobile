/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import GlobalProvider from './context';
import { AuthScreen, DashboardScreen, Routes, SplashScreen } from './screens';

const Stack = createNativeStackNavigator()

const App = () => {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Splash' screenOptions={{headerShown: false}}>
          <Stack.Screen name='Splash' component={SplashScreen} />
          <Stack.Screen name='Auth' component={AuthScreen} />
          <Stack.Screen name='Main' component={Routes} />
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default GlobalProvider(App)
