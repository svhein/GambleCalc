import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LaunchScreen from "./screens/LaunchScreen";
import GambleScreen from './screens/GambleScreen';
import SetupScreen from './screens/SetupScreen';
import SavedGamesScreen from './screens/SavedGamesScreen';

import COLORS from './colors';
const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'red',
    card: COLORS.primary,
    text: 'red'
  },
};

function App(): JSX.Element {

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator initialRouteName='LaunchScreen'>
        <Stack.Screen name="LaunchScreen" component={LaunchScreen} options={{headerShown: false}}/>
        <Stack.Screen name="GambleScreen" component={GambleScreen} options={{headerShown: false}}/>
        <Stack.Screen name="SetupScreen" component={SetupScreen} options={{headerShown: false}}/>
        <Stack.Screen name="SavedGamesScreen" component={SavedGamesScreen} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    flex: 1
}
});

export default App;
