import React, { Component } from 'react';
import {
  Alert,
  Text,
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  TouchableHighlight,
  Button,
  TextInput, AppState, NetInfo
} from 'react-native';
import { Constants } from 'expo';
import Dashboard from './components/Dashboard';
import FuelRefund from './components/FuelRefund';
import LoginUser from './components/LoginUser';
import TimesheetEntry from './components/TimesheetEntry';
import Rosters from './components/Rosters';
import MultiClient from './components/MultiClient';
import Notifications from './components/Notifications';
import EditTimesheet from './components/EditTimesheet';
import FloatingTimesheet from './components/FloatingTimesheet';
import ForgotPassword from './components/ForgotPassword';
import PinLogin from './components/PinLogin';
import Settings from './components/Settings';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';
import Payslips from './components/Payslips';
import PayslipDetails from './components/PayslipDetails';
import ConfirmHours from './components/ConfirmHours';

import {
  TabNavigator,
  StackNavigator,
  createStackNavigator, createBottomTabNavigator, createDrawerNavigator,createAppContainer
} from 'react-navigation';

const RootStack = createStackNavigator(
  {
    LoginUser: { screen: LoginUser },
    FuelRefund: {
      screen: FuelRefund,
      navigationOptions: {
        header: null
      }
    },     
    Dashboard: { screen: Dashboard },
    TimesheetEntry: {
      screen: TimesheetEntry,
      navigationOptions: {
        header: null
      }
    }, 
    Rosters: { screen: Rosters},
    Tasks: { screen: Tasks},     
    MultiClient: { screen: MultiClient},
    Notifications: { screen: Notifications },
    EditTimesheet: { screen: EditTimesheet },
    FloatingTimesheet: { screen: FloatingTimesheet },
    ForgotPassword: { screen: ForgotPassword },    
    PinLogin: { screen: PinLogin },
    Settings: { screen: Settings },
    AddTask: { screen: AddTask},    
    Payslips: { screen: Payslips},     
    PayslipDetails: { screen: PayslipDetails},   
    ConfirmHours: { screen: ConfirmHours},     
  },
  {
    initialRouteName: 'PinLogin',
  }
);

const App1 = createAppContainer(RootStack);

export default class App extends Component {
 
  render() {
    return <App1 />;
  }
}
