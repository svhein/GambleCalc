/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import GambleScreen from './screens/Gamble';

AppRegistry.registerComponent(appName, () => GambleScreen);
