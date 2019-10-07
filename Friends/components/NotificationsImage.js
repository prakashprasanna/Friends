import React, { Component } from 'react';

import { StyleSheet, View, Text, Image, Alert, TouchableHighlight } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import IconBadge from 'react-native-icon-badge';
import { Constants} from 'expo';
import { SQLite } from 'expo-sqlite';
const db = SQLite.openDatabase('db.db');
import Notifications from './Notifications';
import { StackNavigator } from 'react-navigation';

export default class NotificationsImage  extends React.Component {
constructor(props) {
  super(props);
   this.TimesheetNotifications = this.TimesheetNotifications.bind(this);
   this.state = { 
    Count:0,
   }
}
componentDidMount(){

   this.TimesheetNotifications();
}  

TimesheetNotifications(){
         console.log('TimesheetNotifications')
            db.transaction(
      tx => {        
        tx.executeSql( 
          'select * from Timesheet where error_flag="1"',[],
           (tx,res) => {  console.log('Timesheets error count - ' + res.rows.length)
            var temp = [];
            if(res.rows.length > 0){
                  this.setState({
                          Count:res.rows.length,
                      });
            } else {
                  this.setState({
                          Count:0,
                      });              
            }            
              // if(res.rows.length > 0){
              //   Alert.alert( 'Offline-Mode update error', 'Please visit Notifications screen',
              //     [
              //       {text: 'Ok', onPress: () => this.props.navigation.navigate("Notifications")},
              //     ],
              //     { cancelable: false }
              //   );
              // }                          
                    
                }                          
        )
      })    
}

  render() {
    return (
      <View style={{ flexDirection: 'row' }}>  
       <IconBadge    
         MainElement={
          <Ionicons name="ios-notifications-outline" size={50} />
         }
          BadgeElement={
            <Text style={{color:'#FFFFFF'}}>{this.state.Count}</Text>
          }
          IconBadgeStyle={
            {width:30,
            height:30,
            backgroundColor: 'red'}
          }         
          Hidden={this.state.Count==0}
          />  
      </View>
    );
  }
}
