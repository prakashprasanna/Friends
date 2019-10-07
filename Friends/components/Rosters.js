import React, { PureComponent } from 'react';
import { Alert, List, ListItem, FlatList, TextInput, View, StyleSheet, Image, KeyboardAvoidingView, ScrollView, ActivityIndicator, TouchableOpacity, TouchableHighlight, Picker, BackHandler, NetInfo, Dimensions, Platform, RefreshControl, Animated, TouchableWithoutFeedback} from 'react-native';
import { getRegoInfo } from './FetchVehicle';
//import ReceiptUpload from './ReceiptUpload';
import DatePicker from 'react-native-datepicker';
import { Dropdown } from 'react-native-material-dropdown';
import { getUserInfo } from './Users';
import LoginUser from './LoginUser';
import { DrawerNavigator, DrawerActions, DrawerItems, SafeAreaView, createStackNavigator, createBottomTabNavigator, createDrawerNavigator } from 'react-navigation'; 
import { Table, Rows, TableWrapper, Row, Cell } from 'react-native-table-component';
import { ImagePicker, Permissions, Constants, Location } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {FontAwesome} from '@expo/vector-icons';
import { NavigationActions } from 'react-navigation';
import TimePicker from 'react-native-simple-time-picker';
import uuid from 'uuid/v4';
import ModalDropdown from 'react-native-modal-dropdown';
import Notifications from './Notifications';
import moment from 'moment'; 
import { Header, Button, Badge, Tooltip, Text } from 'react-native-elements';
import IconBadge from 'react-native-icon-badge';
import Modal from 'react-native-modal';
import { Section, TableView, Separator } from 'react-native-tableview-simple';
import Dashboard from './Dashboard';
import EditTimesheet from './EditTimesheet';
import DateTimePicker from "react-native-modal-datetime-picker";
import PinLogin from './PinLogin';
import { SQLite } from 'expo-sqlite';
import SwitchToggle from 'react-native-switch-toggle';
import MPicker from 'react-month-picker';
const { width: WindowWidth } = Dimensions.get('window');

const { width } = Dimensions.get('window');

const db = SQLite.openDatabase('db.db');

export default class Rosters extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return{
title: "Rosters",
headerTintColor: 'white',
headerStyle: {
backgroundColor: "#71BF44"
},
headerRight: (
 <View style={{flexDirection:'row',paddingRight:20}}> 
  <View>
    <Button
    type="clear"
    icon={
        <Ionicons name="ios-home" size={30} color='white' />
        }       
    onPress={ () =>navigation.push('Dashboard',{"count":0,"username":params.username,"email":params.email,"baseURL":params.baseURL,"user_id":params.user_id,"addPin":params.addPin}) }    
    />  
  </View>  
 <View> 
  <Button
  icon={
    <IconBadge    
      MainElement={
      <Ionicons name="ios-notifications-outline" size={30} color='white' />
      }
      BadgeElement={
        <Text style={{color:'#FFFFFF'}}>{params.Count}</Text>
      }
      IconBadgeStyle={
        {width:10,
        height:20,
        backgroundColor: 'red'}
      }         
      Hidden={params.Count==0}
      /> 
  }         
    type='clear'
    onPress={() => navigation.push('Notifications',{"count":0,"username":params.username,"email":params.email,"baseURL":params.baseURL,"user_id":params.user_id, "addPin": params.addPin, "SH":params.selectedEndHours, 'SM':params.selectedEndMinutes})}
  />
</View>
</View>
),
};
};   
constructor(props) {
  super(props);
   this.getListCall= this.getListCall.bind(this);   
 //  this.handleMyHoursConnectivity = this.handleMyHoursConnectivity.bind(this);
 //  this.noInternet = this.noInternet.bind(this);
   this.createMyHoursDB = this.createMyHoursDB.bind(this);
 //  this.getMyHoursDown = this.getMyHoursDown.bind(this);
  this.pickMonth = this.pickMonth.bind(this);
   this.getItemLayout = this.getItemLayout.bind(this);
 this.getLocation = this.getLocation.bind(this);
 this.getColor = this.getColor.bind(this);
 this.getName = this.getName.bind(this);
  this.ModalLocations = this.ModalLocations.bind(this);
  this.ModalLocationsDone = this.ModalLocationsDone.bind(this);
  this.ModalRenderLocations = this.ModalRenderLocations.bind(this);  
  this.pickLocation = this.pickLocation.bind(this);
  this.getButtonText = this.getButtonText.bind(this);
  this.getRightText = this.getRightText.bind(this);
  this.getLeftText = this.getLeftText.bind(this);
  this.ModalMonths = this.ModalMonths.bind(this);
  this.ModalMonthsDone = this.ModalMonthsDone.bind(this);
  this.ModalRenderMonths = this.ModalRenderMonths.bind(this);    
   this.state = { 
     itemColour : [],
     backgroundColor: '',
    JSONResult: [],
          tableHead: ['                          '],
      tableData: '',
      itemC:'',
      itemCount:1,
      isConnected : '',
      displayOffline : '0',
      refreshing: false,
      topDays:[],
      bottomDays:[],
      topDate:'',
      endDate:'',
      rowLength:0,
      CurrentDateIndex:0,
      CurrentDate:'',
      addPin:'',
      Clients: [],
      email:'',
      username:'',
      userid:'',
      baseURL:'',
      Count:'',   
      lTitle:'All Locations',
      mTitle:'Month',   
      locations:-1, 
      Locations:[],  
      modalLoIsVisible: false,
      modalMoIsVisible: false,
      modalLoAnimatedValue: new Animated.Value(0),   
      modalMoAnimatedValue: new Animated.Value(0),
      title:null,
      title1:null,
      title2:null,
      title3:null,
      title4:null,
      title5:null,
      switchOn1: false,
      months:0,
      Months:[],
      RTO:0,
      Horizontal:false,
      StartDate:'',
      EndDate:'',
      MonthId:0,
      SMonth:null,
      ActivityIndicator_Loading: false,
      Error:null,
    }
}
componentDidMount(){
        this.getLocation()
        var that = this;  
      //  var date = moment(this.props.navigation.state.params.date).format("MMM Do YYYY");
        that.setState({
              //Setting the value of the date time
              username: this.props.navigation.state.params.username,
              email:this.props.navigation.state.params.email,
              baseURL:this.props.navigation.state.params.baseURL,
              userid:this.props.navigation.state.params.user_id,
              addPin:this.props.navigation.state.params.addPin,
      //        activity:this.props.navigation.state.params.activity,
            });                              
   this.props.navigation.setParams({ Count: this.props.navigation.state.params.notificationCount})

}

  // onRefresh = () => {
  //   this.setState({JSONResult:[],
  //                  refreshing:true});
  //   this.getMyHoursDown();

  // }  

createMyHoursDB(){

this.getListCall()
  
}

 //this.props.navigation.state.params.baseURL+'?ct=api&api=fuel_refund&act=put'
getListCall(){
  //console.log('getlistcall function')
var loc = []
var l = 0;
for(l=0;l<this.state.Locations.length;++l){
    // this["loc"+this.state.Locations[l].id] = [this.state.Locations[l].location];
    // var a1 = this["loc"+this.state.Locations[l].id]
    loc.push({location:this.state.Locations[l].location})
        console.log(loc)
}  
var that = this;
var i = [];
var count = 0;
var pCount = 0;
var pp= 0;
var c = 0;
var cc = 0;
var v = 0;
var a = 0;
var ecolor = '';
var title = []
var name = []
var co = []
var prev=[]
var niceDate='';
var pc=0
var prevLocations=''
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=roster&act=days&start_date='+this.state.StartDate+'&end_date='+this.state.EndDate+'&off='+this.state.RTO;
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
  if(!result.error){
     //   console.log(result.data)
    that.setState({Clients:result.data})
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var currentdate = year+'-'+0+month+'-'+date
       for(let r of result.data){
          for(let d of result.data[c]){
              niceDate = d.date_nice
           //   console.log(d.locations_a)
              if(currentdate === d.date){
                that.setState({CurrentDateIndex: c})
                console.log("currentdate - "+currentdate)                
                console.log(c)
              }
              if(d.title && count === 5){
           //     console.log(prev)    
                  for(l=0;l<d.locations_a.length;++l){
                 //     console.log(d.locations_a[l])
                      if(d.locations_a[l] === that.state.locations){
                        if(prev){ 
                          var rc = 0                
                          for(let ppc of prev){  
                              if(rc === 0){
                                var PT = ppc.prevTitle
                                var PC = ppc.prevColor
                                var PI = ppc.prevInitial
                                var PTC = ppc.prevTC
                              }   
                              if(rc === 1){
                                var PT1 = ppc.prevTitle
                                var PC1 = ppc.prevColor
                                var PI1 = ppc.prevInitial
                                var PTC1 = ppc.prevTC
                              }
                              if(rc === 2){
                                var PT2 = ppc.prevTitle
                                var PC2 = ppc.prevColor
                                var PI2 = ppc.prevInitial
                                var PTC2 = ppc.prevTC
                              }
                              if(rc === 3){
                                var PT3 = ppc.prevTitle
                                var PC3 = ppc.prevColor
                                var PI3 = ppc.prevInitial
                                var PTC3 = ppc.prevTC
                              }
                              if(rc === 4){
                                var PT4 = ppc.prevTitle
                                var PC4 = ppc.prevColor
                                var PI4 = ppc.prevInitial
                                var PTC4 = ppc.prevTC
                              }
                              rc++
                            }
                            cc++                   
                                var PT5 = d.title
                                var PC5 = d.color
                                var PI5 = d.initials
                                var PTC5 = d.textColor                  
                          name.push({title:PT,color:PC,initial:PI,tColor:PTC,
                                      title1:PT1,color1:PC1,initial1:PI1,tColor1:PTC1,
                                      title2:PT2,color2:PC2,initial2:PI2,tColor2:PTC2,
                                      title3:PT3,color3:PC3,initial3:PI3,tColor3:PTC3,
                                      title4:PT4,color4:PC4,initial4:PI4,tColor4:PTC4,
                                      title5:PT5,color5:PC5,initial5:PI5,tColor5:PTC5 });
                    //     console.log(name)                              
                          count=0
                          pCount++
                          rc=0
                          prev = []                   
                        }  
                         
                      }
                  }     
                  // if(count > 0){
                  //   count--
                  // }           
              } else {

                if(d.title){
                //  console.log(d.locations_a.length)
                  for(l=0;l<d.locations_a.length;++l){
                      if(d.locations_a[l] === that.state.locations){
                    //     console.log(d.locations_a[l])
                         prev.push({prevTitle:d.title,prevColor:d.color,prevInitial:d.initials,prevTC:d.textColor})
                         count++
                      }
                  }
                }
              }  
              v++
          }
       //   console.log(prev)      
          if(prev){   
            rc=0  
                  for(let p of prev){
                      if(rc === 0){
                         var PT6 = p.prevTitle
                         var PC6 = p.prevColor
                         var PI6 = p.prevInitial
                         var PTC6 = p.prevTC
                      }
                      if(rc === 1){
                         var PT7 = p.prevTitle
                         var PC7 = p.prevColor
                         var PI7 = p.prevInitial
                         var PTC7 = p.prevTC
                      }
                      if(rc === 2){
                         var PT8 = p.prevTitle
                         var PC8 = p.prevColor
                         var PI8 = p.prevInitial
                         var PTC8 = p.prevTC
                      }
                      if(rc === 3){
                         var PT9 = p.prevTitle
                         var PC9 = p.prevColor
                         var PI9 = p.prevInitial
                         var PTC9 = p.prevTC
                      }
                      if(rc === 4){
                         var PT0 = p.prevTitle
                         var PC0 = p.prevColor
                         var PI0 = p.prevInitial
                         var PTC0 = p.prevTC
                      }                                                                                                            
                   rc++
                  }
                  if(PT6){
                   name.push({title:PT6,color:PC6,initial:PI6,tColor:PTC6,
                              title1:PT7,color1:PC7,initial1:PI7,tColor1:PTC7,
                              title2:PT8,color2:PC8,initial2:PI8,tColor2:PTC8,
                              title3:PT9,color3:PC9,initial3:PI9,tColor3:PTC9,
                              title4:PT0,color4:PC0,initial4:PI0,tColor4:PTC0});
                  }            
                  prev = []
                  PT6=0;PT7=0;PT8=0;PT9=0;PT0=0;PC6=0;PC7=0;PC8=0;PC9=0;PC0=0;
                  PI6=0;PI7=0;PI8=0;PI9=0;PI0=0;PTC6=0;PTC7=0;PTC8=0;PTC9=0;PTC0=0;
          } 

      //    console.log(name)       
          i.push({date:niceDate,names:name}) 
          title=[]
          name=[]
          co=[]
          niceDate='' 
          prev=[]
          count = 0  
          c++
       }
      that.setState({ 
        JSONResult: i,
        ActivityIndicator_Loading: false
      });  
       console.log(that.state.JSONResult)  
     //   console.log(result.data) 
  }
 }).catch(function (error) {
   //console.log("-------- error ------- "+error);
  alert("result:"+error)
 });
}   
  getName(item){
    return item.map((data,index) => {
      return (
        <Button activeOpacity={0.9} title={data.names} buttonStyle={{backgroundColor: this.getColor(data.color,index)}}/>
      )
    }) 
  }

  getColor(color,index){
    console.log(index)
    return color
  }

  getItemLayout = (data, index) => (
    { length: this.state.rowLength, offset: this.state.rowLength * index, index }
  )    

ItemSeparatorLine = () => {
  return (
    <View
    style={{height: .5,width: "100%",backgroundColor: "#111a0b",}}
    />
  );
}

    ModalLocations = () => {
    if (this.state.modalLoIsVisible) {
      return;
    }

    this.setState({ modalLoIsVisible: true, ActivityIndicator_Loading: true }, () => {
      Animated.timing(this.state.modalLoAnimatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

    ModalLocationsDone = () => {
    Animated.timing(this.state.modalLoAnimatedValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ modalLoIsVisible: false, ActivityIndicator_Loading: false });
    });
  };

  ModalRenderLocations = () => {
    if (!this.state.modalLoIsVisible) {
      return null;
    }

    const { modalLoAnimatedValue } = this.state;
    const opacity = modalLoAnimatedValue;
    const translateY = modalLoAnimatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [300, 0],
    });

    return (
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents={this.state.modalLoIsVisible ? 'auto' : 'none'}>
        <TouchableWithoutFeedback onPress={this.ModalLocationsDone}>
          <Animated.View style={[styles.overlay, { opacity }]} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            transform: [{ translateY }],
          }}>
          <View style={styles.toolbar}>
            <View style={styles.toolbarRight}>
              <Button title="Done" buttonStyle={{backgroundColor:'#71BF44'}}  onPress={this.ModalLocationsDone} />
            </View>
          </View>
          <Picker style={{width: WindowWidth, backgroundColor: '#e1e1e1'}}
            selectedValue={this.state.locations}
            onValueChange={(itemValue, itemIndex) => this.pickLocation(itemIndex)} >
            { this.state.Locations.map((item, key)=>(
            <Picker.Item label={item.location} value={item.id} key={key} />)
            )}
          </Picker>            
        </Animated.View>
      </View>
    );
  }; 

    ModalMonths = () => {
    if (this.state.modalMoIsVisible) {
      return;
    }

    this.setState({ modalMoIsVisible: true, ActivityIndicator_Loading: true }, () => {
      Animated.timing(this.state.modalMoAnimatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

    ModalMonthsDone = () => {
    Animated.timing(this.state.modalMoAnimatedValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ modalMoIsVisible: false, ActivityIndicator_Loading: false });
    });
  };

  ModalRenderMonths = () => {
    if (!this.state.modalMoIsVisible) {
      return null;
    }

    const { modalMoAnimatedValue } = this.state;
    const opacity = modalMoAnimatedValue;
    const translateY = modalMoAnimatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [300, 0],
    });

    return (
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents={this.state.modalMoIsVisible ? 'auto' : 'none'}>
        <TouchableWithoutFeedback onPress={this.ModalMonthsDone}>
          <Animated.View style={[styles.overlay, { opacity }]} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            transform: [{ translateY }],
          }}>
          <View style={styles.toolbar}>
            <View style={styles.toolbarRight}>
              <Button title="Done" buttonStyle={{backgroundColor:'#71BF44'}}  onPress={this.ModalMonthsDone} />
            </View>
          </View>
          <Picker style={{width: WindowWidth, backgroundColor: '#e1e1e1'}}
            selectedValue={this.state.months}
            onValueChange={(itemValue, itemIndex) => this.pickMonth(itemIndex)} >
            { this.state.Months.map((item, key)=>(
            <Picker.Item label={item.month} value={item.id} key={key} />)
            )}
          </Picker>            
        </Animated.View>
      </View>
    );
  }; 

getLocation(){
  console.log('entered getLocation()')
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=system&act=locations';
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
  if(!result.error){
      var temp=[];
      var c = 0;
      var m = []
      var months    = [{id:4,month:'January'},{id:5,month:'February'},{id:6,month:'March'},{id:7,month:'April'},{id:8,month:'May'},{id:9,month:'June'},{id:10,month:'July'},{id:11,month:'August'},{id:0,month:'September'},{id:1,month:'October'},{id:2,month:'November'},{id:3,month:'December'}];
      var now       = new Date();
      var thisMonth = months[now.getMonth()];       
      console.log(result.data)
      console.log(thisMonth.month);
      var smonth = ''
    //  if(!that.state.SMonth){
         m.push({id:0,month:thisMonth.month})
         smonth = thisMonth.month
      // } else {
      //   m.push({id:that.state.MonthId,month:that.state.SMonth})
      //   smonth = that.state.SMonth
   //   }
      var f=0;
      var cc=1;
      var m2=[]
      for(let m1 of months){
         if(m1.month != thisMonth.month){
           if(f === 1){
             m.push({id:cc,month:m1.month})
             cc++
           } else {
             m2.push({id:m1.id,month:m1.month})             
           }
         } else {
           f=1
         }
      }

      for(let m3 of m2){
        m.push({id:cc,month:m3.month})
        cc++
      }
      console.log(m)

var date = new Date();
console.log(date);
var firstDay = new Date(date.getFullYear(), date.getMonth() + that.state.MonthId, 1);
console.log(firstDay);
var lastDay = new Date(date.getFullYear(), date.getMonth() + that.state.MonthId + 1, 0);
console.log(lastDay);
var fd = firstDay.getFullYear() + '-' + (firstDay.getMonth() + 1) + '-' + (firstDay.getDate());
var ld = lastDay.getFullYear() + '-' + (lastDay.getMonth() + 1) + '-' + (lastDay.getDate());

console.log("First Day - "+fd+'  '+ 'Last Day - ' + ld);

var cm = '';
if(!that.state.SMonth){
  cm = smonth
} else {
  cm = that.state.SMonth
}

      that.setState({Locations:result.data,
                     Months:m,
                     //months:thisMonth.month,
                     mTitle:cm,
                     StartDate:fd,
                     EndDate:ld})
   //   console.log(that.state.Locations)
    //  console.log(that.state.Locations.length)
console.log(that.state.months);
        that.createMyHoursDB()
  } else {
    console.log(result.error)
    that.setState({Error: result.error})
  }
 }).catch(function (error) {
   console.log("-------- error ------- "+error);
 });
//  console.log('Rosters Data - '+ that.state.JSONResult)
}  

pickLocation(index){

 this.state.Locations.map( (v,i)=>{
  if( index === i ){
    this.setState({
    locations: this.state.Locations[index].id,
    lTitle:this.state.Locations[index].location,
    ActivityIndicator_Loading: true,
   })
   console.log(this.state.locations)
   this.getLocation()
  }
 })
}


pickMonth(index){

 this.state.Months.map( (v,i)=>{
  if( index === i ){
    this.setState({
    months: this.state.Months[index].id,
    mTitle:this.state.Months[index].month,
    MonthId:this.state.Months[index].id,
    SMonth:this.state.Months[index].month,
    ActivityIndicator_Loading: true,
   })
   console.log('MonthID - ' + this.state.Months[index].id)
   this.getLocation()   
  }
 })
}

  header= () => {   
    return(
    <View style={{flexDirection:'row'}}>
     {Platform.OS === 'android' ? (  
      <View  style={styles.Dropdown}> 
        <Picker style={{width: '42%'}}
          selectedValue={this.state.locations}
          onValueChange={(itemValue, itemIndex) => this.pickLocation(itemIndex)} >
          { this.state.Locations.map((item, key)=>(
          <Picker.Item label={item.location} value={item.id} key={key} />)
          )} 
        </Picker>  
        <Picker style={{width: '38%'}}
          selectedValue={this.state.months}
          onValueChange={(itemValue, itemIndex) => this.pickMonth(itemIndex)} >
          { this.state.Months.map((item, key)=>(
          <Picker.Item label={item.month} value={item.id} key={key} />)
          )}
        </Picker>  
        <SwitchToggle
          buttonText={this.getButtonText()}
          backTextRight={this.getRightText()}
          backTextLeft={this.getLeftText()}        
          type={1}
          buttonStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute'
          }}
          
          rightContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
          leftContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}
        
          buttonTextStyle={{fontSize: 10, fontWeight:'bold'}}
          textRightStyle={{fontSize: 10, fontWeight:'bold'}}
          textLeftStyle={{fontSize: 10, fontWeight:'bold'}}
        
          containerStyle={{
            marginTop: 6,
            width: 80,
            height: 35,
            borderRadius: 15,
            padding: 5,
          }}
          backgroundColorOn='#D0D0D0'
          backgroundColorOff='#D0D0D0'
          circleStyle={{
            width: 30,
            height: 25,
            borderRadius: 18,
            backgroundColor: 'blue', 
          }}     

          switchOn={this.state.switchOn1}
          onPress={this.RTOonPress}
          circleColorOn='#71BF44'
        />                     
       </View>        
     ):
        <View style={{flexDirection:'row', backgroundColor: '#f0f0f0',}}>  
        <View style={{width:"38%"}}>   
          <Button buttonStyle={{justifyContent: 'center',width:'100%',height:48}} type='clear' title={this.state.lTitle} titleStyle={{color:'black',fontSize:15}} onPress={this.ModalLocations} />
       </View>
       <View style={{paddingLeft:5,width:"40%"}}>                    
                  <Button buttonStyle={{justifyContent: 'flex-start',width:'100%', height:48}} type='clear' title={this.state.mTitle} titleStyle={{color:'black',fontSize:15}} onPress={this.ModalMonths} />  
      </View>
        <SwitchToggle
          buttonText={this.getButtonText()}
          backTextRight={this.getRightText()}
          backTextLeft={this.getLeftText()}        
          type={1}
          buttonStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute'
          }}
          
          rightContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
          leftContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}
        
          buttonTextStyle={{fontSize: 10, fontWeight:'bold'}}
          textRightStyle={{fontSize: 10, fontWeight:'bold'}}
          textLeftStyle={{fontSize: 10, fontWeight:'bold'}}
        
          containerStyle={{
            marginTop: 6,
            width: 80,
            height: 35,
            borderRadius: 15,
            padding: 5,
          }}
          backgroundColorOn='#D0D0D0'
          backgroundColorOff='#D0D0D0'
          circleStyle={{
            width: 30,
            height: 25,
            borderRadius: 18,
            backgroundColor: 'blue', 
          }}     

          switchOn={this.state.switchOn1}
          onPress={this.RTOonPress}
          circleColorOn='#71BF44'
        />                                         
     </View>
     }             
    </View>);
  }

  getButtonText() {
    return this.state.switchOn1 ? 'on' : 'RTO';
  }
  
  getRightText() {
    return this.state.switchOn1 ? '' : 'off';
  }
  
  getLeftText() {
    return this.state.switchOn1 ? 'RTO' : '';
  }

  RTOonPress = () => {
    var off = 0;
    if(!this.state.switchOn1){
       off = 1;
    }
    this.setState({ switchOn1: !this.state.switchOn1,
                    RTO:off,
                    Horizontal:!this.state.switchOn1,
                    ActivityIndicator_Loading: true });
    this.getLocation();                    
  }

render() {
        const {navigate} = this.props.navigation;
if(this.state.Error){
  return(<View style={{
            flex: 1,
            flexDirection: 'column'
        }}> 
                    <View style={{
                flex: 1,
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',                
            }}>
  <View style={{alignItems: 'center',
   justifyContent: 'center',
    backgroundColor: 'white'}}>     
    <TouchableOpacity
      activeOpacity = { 0.5 } 
      style = { styles.TouchableOpacityStyle4 } 
    >              
    <View>
      <Text style={{color:'#71BF44',fontWeight:'bold'}}>No Roster Setup</Text>
    </View>
    </TouchableOpacity>
  </View>
  </View>
  </View>
  )
}else{
      return (
  //    <ScrollView>       
        <View style={{
            flex: 1,
            flexDirection: 'row',
        }}>       
  <Table borderStyle={{borderWidth: 2, borderColor: 'white'}}>
    <Row data={this.state.tableHead} style={{backgroundColor:'white'}} textStyle={styles.text}/>
  </Table>
        <Modal isVisible={this.state.modalLoIsVisible === true} style={{justifyContent: 'flex-end',margin: 0}}>
         {this.ModalRenderLocations()} 
        </Modal> 
        <Modal isVisible={this.state.modalMoIsVisible === true} style={{justifyContent: 'flex-end',margin: 0}}>
         {this.ModalRenderMonths()} 
        </Modal>   
               
    <FlatList
      data={ this.state.JSONResult }
      ItemSeparatorComponent = {this.ItemSeparatorLine}
      ref={(ref) => { this.flatListRef = ref; }}
      getItemLayout={this.getItemLayout} 
      ListHeaderComponent={this.header}  
      stickyHeaderIndices={[0]}  
    //  initialScrollIndex={this.state.CurrentDateIndex} 
          renderItem={({item}) => { 
              return(
              <TouchableOpacity activeOpacity={0.9} style={{backgroundColor: 'white'}}>
                <View style={[styles.item,{backgroundColor:'white'}]}>
                 <View style={{ flex:1,
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                padding: 10,
                                width:'80%'}}>
                  <Text style={{color:'black',fontWeight:'bold'}}>{item.date}</Text>                                 
                   <FlatList
                    data={ item.names }
                   //   horizontal={this.state.Horizontal}
                        renderItem={({item,index}) => {  
                          return(
                        <View style={{flexDirection:'row',margin:4}}>
                            {item.title ? (                        
                            <View>
                            <Tooltip backgroundColor={item.color} height={50} popover={<Text style={{color:item.tColor}}>{item.title}</Text>}>
                            <View style={{borderWidth: 3,borderRadius: 10,borderColor: item.color}}>
                              <Text style={{backgroundColor:item.color,color:item.tColor,height:40,width:40,textAlign: 'center',paddingTop:8,fontWeight:'bold'}}>{item.initial}</Text>
                              </View>
                            </Tooltip>
                            </View> ):null}
                            <Text>  </Text>
                             
                            {item.title1 ? (
                            <View>
                            <Tooltip backgroundColor={item.color1} height={50} popover={<Text style={{color:item.tColor1}}>{item.title1}</Text>}>
                            <View style={{borderWidth: 3,borderRadius: 10,borderColor: item.color1}}>
                              <Text style={{backgroundColor:item.color1,color:item.tColor1,height:40,width:40,textAlign: 'center',paddingTop:8,fontWeight:'bold'}}>{item.initial1}</Text>
                              </View>
                            </Tooltip>
                            </View> ):null}
                            <Text>  </Text>                            
                            {item.title2 ? (
                            <View>
                            <Tooltip backgroundColor={item.color2} height={50} popover={<Text style={{color:item.tColor2}}>{item.title2}</Text>}>
                            <View style={{borderWidth: 3,borderRadius: 10,borderColor: item.color2}}>
                              <Text style={{backgroundColor:item.color2,color:item.tColor2,height:40,width:40,textAlign: 'center',paddingTop:8,fontWeight:'bold'}}>{item.initial2}</Text>
                              </View>
                            </Tooltip>
                            </View> ):null}
                            <Text>  </Text>                            
                            {item.title3 ? (
                            <View>
                            <Tooltip backgroundColor={item.color3} height={50} popover={<Text style={{color:item.tColor3}}>{item.title3}</Text>}>
                            <View style={{borderWidth: 3,borderRadius: 10,borderColor: item.color3}}>
                              <Text style={{backgroundColor:item.color3,color:item.tColor3,height:40,width:40,textAlign: 'center',paddingTop:8,fontWeight:'bold'}}>{item.initial3}</Text>
                              </View>
                            </Tooltip>
                            </View> ):null}
                            <Text>  </Text>                            
                            {item.title4 ? (
                            <View>
                            <Tooltip backgroundColor={item.color4} height={50} popover={<Text style={{color:item.tColor4}}>{item.title4}</Text>}>
                            <View style={{borderWidth: 3,borderRadius: 10,borderColor: item.color4}}>
                              <Text style={{backgroundColor:item.color4,color:item.tColor4,height:40,width:40,textAlign: 'center',paddingTop:8,fontWeight:'bold'}}>{item.initial4}</Text>
                              </View>
                            </Tooltip>
                            </View> ):null}
                            <Text>  </Text>                            
                            {item.title5 ? (
                            <View>
                            <Tooltip backgroundColor={item.color5} height={50} popover={<Text style={{color:item.tColor5}}>{item.title5}</Text>}>
                            <View style={{borderWidth: 3,borderRadius: 10,borderColor: item.color5}}>
                              <Text style={{backgroundColor:item.color5,color:item.tColor5,height:40,width:40,textAlign: 'center',paddingTop:8,fontWeight:'bold'}}>{item.initial5}</Text>
                              </View>
                            </Tooltip>
                            </View> ):null}                                                                                                                
                        </View>
                          )
                        }}
                           keyExtractor={(item, index) => index}       
                         />                                                          
                 </View> 
                </View> 
              </TouchableOpacity>
              )
          }           
        }
        keyExtractor={(item, index) => index}       
        /> 

                {
        
                this.state.ActivityIndicator_Loading ? <View style={styles.loading}><ActivityIndicator color='#71BF44' size='large'style={styles.ActivityIndicatorStyle} /></View> : null
                
                }         

  </View>
 // </ScrollView>
        
        );
}
    }

}
const styles = StyleSheet.create({
 
  item: {
    backgroundColor: 'white',
    flexDirection: 'row',
    flex: 1,
    padding: 10,
  },
Dropdown: {
  flexDirection:'row',
  paddingTop:10,
  paddingBottom:10,
    borderRadius: 5,
    borderWidth: 0.5,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 5,
   backgroundColor: '#f0f0f0',
    color: 'black', 
   // height:50,
    flex:1
  }, 
    loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }, 

 
});
