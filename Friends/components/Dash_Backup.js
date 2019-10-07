import * as React from 'react';
import { Alert, Text, View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { Constants } from 'expo';
import FuelRefund from './FuelRefund';
import LoginUser from './LoginUser';
import Logout from './FuelRefund';

const ICON_SIZE = 70;
const FONT_SIZE = 18;



export default class Dashboard extends React.Component {
  static navigationOptions = {
title: "Agrismart Dashboard",
headerStyle: {
backgroundColor: "#73C6B6"
}
};   

getItem1 = () => (
  <View style={styles.iconStyle}>
    <FontAwesome name="list" size={ICON_SIZE} color="blue"/>
    <Text style={styles.textStyle}>Rosters  </Text>
  </View>
);

getItem2 = () => (
  <View style={styles.iconStyle}>
    <FontAwesome name="calendar" size={ICON_SIZE} color="orange" />
    <Text style={styles.textStyle} >Timesheets</Text>
  </View>
);


getItem3 = () => (
  <View style={styles.iconStyle}>
    <FontAwesome name="filter" size={ICON_SIZE} color="purple" />
    <Text style={styles.textStyle} >Fuel Refund</Text>
  </View>
);


getItem4 = () => (
  <View style={styles.iconStyle}>
    <FontAwesome name="medkit" size={ICON_SIZE} color="red"/>
    <Text style={styles.textStyle}>H & S</Text>
  </View>
);

getItem5 = () => (
  <View style={styles.iconStyle}>
    <MaterialCommunityIcons name="logout" size={ICON_SIZE} color="black"/>
    <Text style={styles.textStyle}>Logout</Text>
  </View>
);

 ViewScreen() {
  
 alert('Coming Soon');

 }

 ViewFuelRefund() {

 this.props.navigation.push("FuelRefund",{"username":this.props.navigation.state.params.username,"email":this.props.navigation.state.params.email,"baseURL":this.props.navigation.state.params.baseURL})

 }

render() {
      const {navigate} = this.props.navigation;
    return (
     <ScrollView style={styles.scroll}> 
      <View style={styles.container}>
    <TouchableOpacity 
      activeOpacity = { 0.5 } 
      style = { styles.TouchableOpacityStyle1 } 
      onPress = { this.ViewScreen }>
        <View style={styles.iconContainer}>
          {this.getItem1()}
        </View>
     </TouchableOpacity>     
    <TouchableOpacity 
      activeOpacity = { 0.5 } 
      style = { styles.TouchableOpacityStyle2 } 
      onPress = { this.ViewScreen }>        
        <View style={styles.iconContainer}>
          {this.getItem2()}
        </View>    
     </TouchableOpacity>     
    <TouchableOpacity 
      activeOpacity = { 0.5 } 
      style = { styles.TouchableOpacityStyle3 } 
       onPress={() => navigate('FuelRefund', {"username":this.props.navigation.state.params.username,"email":this.props.navigation.state.params.email,"baseURL":this.props.navigation.state.params.baseURL})}>  
        <View style={styles.iconContainer}>
          {this.getItem3()}
        </View>    
     </TouchableOpacity>     
    <TouchableOpacity
      activeOpacity = { 0.5 } 
      style = { styles.TouchableOpacityStyle4 } 
      onPress = { this.ViewScreen }>               
        <View style={styles.iconContainer}>
          {this.getItem4()}
        </View>
     </TouchableOpacity>     
    <TouchableOpacity
      activeOpacity = { 0.5 } 
      style = { styles.TouchableOpacityStyle5 } 
      onPress={() => navigate('Logout')}>               
        <View style={styles.iconContainer}>
          {this.getItem5()}
        </View>
     </TouchableOpacity>        
      </View>
    </ScrollView>  
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgreen',
    padding: 2,
  },
  scroll: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgreen',
    padding: 2,
  },  
  iconContainer: {
    width: ICON_SIZE * 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',    
  },
  iconStyle: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 6,
  },
  textStyle: {
    fontSize: FONT_SIZE,
  },
    TouchableOpacityStyle1:
   {
      paddingTop:10,
      paddingBottom:10,
      backgroundColor:'blue',
      marginBottom: 20,
      width: '90%',
    justifyContent: 'center',
    alignItems: 'center',      
 
    },  
    TouchableOpacityStyle2:
   {
      paddingTop:10,
      paddingBottom:10,
      backgroundColor:'orange',
      marginBottom: 20,
      width: '90%',
    justifyContent: 'center',
    alignItems: 'center',      
 
    }, 
    TouchableOpacityStyle3:
   {
      paddingTop:10,
      paddingBottom:10,
      backgroundColor:'purple',
      marginBottom: 20,
      width: '90%',
    justifyContent: 'center',
    alignItems: 'center',      
 
    }, 
    TouchableOpacityStyle4:
   {
      paddingTop:10,
      paddingBottom:10,
      backgroundColor:'red',
      marginBottom: 20,
      width: '90%',
    justifyContent: 'center',
    alignItems: 'center',      
 
    },    
    TouchableOpacityStyle5:
   {
      paddingTop:10,
      paddingBottom:10,
      backgroundColor:'black',
      marginBottom: 20,
      width: '90%',
    justifyContent: 'center',
    alignItems: 'center',      
 
    },               
});