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
import {MaterialIcons} from '@expo/vector-icons';
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
import AddTask from './AddTask';
import { SQLite } from 'expo-sqlite';
import SwitchToggle from 'react-native-switch-toggle';
import MPicker from 'react-month-picker';
const { width: WindowWidth } = Dimensions.get('window');

const { width } = Dimensions.get('window');

const db = SQLite.openDatabase('db.db');

export default class Tasks extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return{
title: "Tasks",
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
  this.pickClient = this.pickClient.bind(this);
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
  this.ModalClients = this.ModalClients.bind(this);
  this.ModalClientsDone = this.ModalClientsDone.bind(this);
  this.ModalRenderClients = this.ModalRenderClients.bind(this);  
  this.TaskModal = this.TaskModal.bind(this);
  this.TaskModalContent = this.TaskModalContent.bind(this);  
  this.StartTask = this.StartTask.bind(this);  
  this.CompleteTask = this.CompleteTask.bind(this);
  this.AddNote = this.AddNote.bind(this);
  this.ModalDisplayTask = this.ModalDisplayTask.bind(this);
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
      cTitle:'All Employees',   
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
      months:'',
      Months:[],
      RTO:0,
      Horizontal:false,
      StartDate:'',
      EndDate:'',
      ClientId:0,
      CClient:null,
      ActivityIndicator_Loading: false,
      Error:null,
      niceDate:null,
      visibleModal:null,
      description:'',
      notes:'',
      complete:null,
      in_progress:null,
      client:'',
      clients:0,
      selectedC:0,
      selectedL:-1,
      Next:null,
      Previous:null,
      show_start:null,
      show_complete:null,
      task_id:'',
      Alert:null,
      comments:'',
      Show_AddNote:null,
      readwrite:null,
      AddTask:'',
      task_settings:[],
      TasksDate:null,
      ATAT:[],

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
              AddTask:this.props.navigation.state.params.taskSettings.add_task,
              
            });                              
   this.props.navigation.setParams({ Count: this.props.navigation.state.params.notificationCount})

   if(!that.state.niceDate){ 
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var currentdate = year+'-'+month+'-'+date
       that.setState({TasksDate:currentdate})        
   }         
   console.log('current date - '+currentdate)
   console.log('this.props.navigation.state.params.taskSettings.add_task - '+this.props.navigation.state.params.taskSettings.add_task)

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
}  
var that = this;
var clients = [];
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
var task = []
var co = []
var prev=[]
var niceDate='';
var user='';
var pc=0
var prevLocations=''
var url='';
var ATAT = [];
if(that.state.Next && this.state.TasksDate != null){
  url = this.props.navigation.state.params.baseURL+'?ct=api&api=task&act=day&location_id='+this.state.selectedL+'&user_id='+this.state.selectedC+'&next='+this.state.Next+'&date='+this.state.TasksDate  
} 
if(that.state.Previous && this.state.TasksDate != null){
    url = this.props.navigation.state.params.baseURL+'?ct=api&api=task&act=day&location_id='+this.state.selectedL+'&user_id='+this.state.selectedC+'&prev='+this.state.Previous+'&date='+this.state.TasksDate 
}
if(!that.state.Previous && !that.state.Next){
  url = this.props.navigation.state.params.baseURL+'?ct=api&api=task&act=day&location_id='+this.state.selectedL+'&user_id='+this.state.selectedC+'&date='+this.state.TasksDate
}  
//api=roster&act=days&start_date='+this.state.StartDate+'&end_date='+this.state.EndDate+'&off='+this.state.RTO;
//
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
  if(!result.error){
       console.log(result.data)
     clients.push({id:0,client:'Select an Employee'})    
     ATAT.push({id:0,client:'Select an Employee'})    
    //that.setState({Clients:result.data})
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var currentdate = year+'-'+0+month+'-'+date
          niceDate = result.data.nice_date  
       that.setState({niceDate:result.data.nice_date,
                      TasksDate:result.data.date})    
     //  console.log(that.state.niceDate) 
         user = result.data.users[c].name
         for(let u of result.data.users){
            that.setState({niceDate:result.data.nice_date})    
        //    console.log(that.state.niceDate) 
            user = result.data.users[c].name   
             clients.push({id:result.data.users[c].id,client:result.data.users[c].name})
             ATAT.push({id:result.data.users[c].id,client:result.data.users[c].name})
          for(let d of result.data.users[c].tasks){
           //   console.log(d.locations_a)
              if(count === 2){
           //     console.log(prev)    
               //   for(l=0;l<d.locations_a.length;++l){
                 //     console.log(d.locations_a[l])
//prevCode:d.code,prevDescription:d.description,prevBGC:d.bgcolor,prevFGC:d.fgcolor,prevST:d.show_start,prevSC:d.show_complete,prevWorking:d.working,prevRW:d.readwrite,prevNotes:d.notes,prevComplete:d.complete,prevIP:d.in_progress                 
                        if(prev){ 
                          var rc = 0                
                          for(let ppc of prev){  
                              if(rc === 0){
                                var PPC = ppc.prevCode
                                var PPD = ppc.prevDescription
                                var PBGC = ppc.prevBGC
                                var PFGC = ppc.prevFGC
                                var PST = ppc.prevST
                                var PSC = ppc.prevSC
                                var PW = ppc.prevWorking
                                var PRW = ppc.prevRW   
                                var PN = ppc.prevNotes
                                var PC = ppc.prevComplete
                                var PIP = ppc.prevIP  
                                var PT = ppc.prevPT                                                            
                              }   
                              if(rc === 1){
                                var PPC1 = ppc.prevCode
                                var PPD1 = ppc.prevDescription
                                var PBGC1 = ppc.prevBGC
                                var PFGC1 = ppc.prevFGC
                                var PST1 = ppc.prevST
                                var PSC1 = ppc.prevSC
                                var PW1 = ppc.prevWorking
                                var PRW1 = ppc.prevRW   
                                var PN1 = ppc.prevNotes
                                var PC1 = ppc.prevComplete
                                var PIP1 = ppc.prevIP 
                                var PT1 = ppc.prevPT
                              }
                              rc++
                            }
                            cc++                   
                                var PPC2 = d.code
                                var PPD2 = d.description
                                var PBGC2 = d.bgcolor
                                var PFGC2 = d.fgcolor
                                var PST2 = d.show_start
                                var PSC2 = d.show_complete
                                var PW2 = d.working
                                var PRW2 = d.readwrite   
                                var PN2 = d.notes
                                var PC2 = d.complete
                                var PIP2 = d.in_progress 
                                var PT2 = d.id                
                          task.push({code:PPC,description:PPD,bgcolor:PBGC,fgcolor:PFGC,                                           show_start:PST,show_complete:PSC,working:PW,                                                  readwrite:PRW,notes:PN,complete:PC,in_progress:PIP,                                           task_id:PT,

                                      code1:PPC1,description1:PPD1,bgcolor1:PBGC1,                                                  fgcolor1:PFGC1,show_start1:PST1,show_complete1:PSC1,                                          working1:PW1,readwrite1:PRW1,notes1:PN1,complete1:PC1,                                        in_progress1:PIP1,task_id1:PT1,

                                      code2:PPC2,description2:PPD2,bgcolor2:PBGC2,                                                  fgcolor2:PFGC2,show_start2:PST2,show_complete2:PSC2,                                          working2:PW2,readwrite2:PRW2,notes2:PN2,complete2:PC2,                                        in_progress2:PIP2,task_id2:PT2, });
                    //     console.log(name)                              
                          count=0
                          pCount++
                          rc=0
                          prev = []                   
                        }  
                         
                  //}     
                  // if(count > 0){
                  //   count--
                  // }           
              } else {
            //    console.log(d)
                if(d.code){
                         prev.push({prevCode:d.code,prevDescription:d.description,prevBGC:d.bgcolor,prevFGC:d.fgcolor,prevST:d.show_start,prevSC:d.show_complete,prevWorking:d.working,prevRW:d.readwrite,prevNotes:d.notes,prevComplete:d.complete,prevIP:d.in_progress,prevPT:d.id})
                         count++
                }
              } 
              v++
          } 

       //   console.log(prev)      
          if(prev){   
                          rc = 0                
                          for(let ppc of prev){  
                              if(rc === 0){
                                var PPC6 = ppc.prevCode
                                var PPD6 = ppc.prevDescription
                                var PBGC6 = ppc.prevBGC
                                var PFGC6 = ppc.prevFGC
                                var PST6 = ppc.prevST
                                var PSC6 = ppc.prevSC
                                var PW6 = ppc.prevWorking
                                var PRW6 = ppc.prevRW   
                                var PN6 = ppc.prevNotes
                                var PC6 = ppc.prevComplete
                                                                                                                              var PT6 = ppc.prevPT
                                var PIP6 = ppc.prevIP
                              }   
                              if(rc === 1){
                                var PPC7 = ppc.prevCode
                                var PPD7 = ppc.prevDescription
                                var PBGC7 = ppc.prevBGC
                                var PFGC7 = ppc.prevFGC
                                var PST7 = ppc.prevST
                                var PSC7 = ppc.prevSC
                                var PW7 = ppc.prevWorking
                                var PRW7 = ppc.prevRW   
                                var PN7 = ppc.prevNotes
                                var PC7 = ppc.prevComplete
                                var PIP7 = ppc.prevIP 
                                var PT7 = ppc.prevPT
                              }
                              rc++
                            }
                  if(PPC6){
                          task.push({code:PPC6,description:PPD6,bgcolor:PBGC6,fgcolor:PFGC6,                                       show_start:PST6,show_complete:PSC6,working:PW6,                                               readwrite:PRW6,notes:PN6,complete:PC6,in_progress:PIP6,                                       task_id:PT6,

                                      code1:PPC7,description1:PPD7,bgcolor1:PBGC7,                                                  fgcolor1:PFGC7,show_start1:PST7,show_complete1:PSC7,                                          working1:PW7,readwrite1:PRW7,notes1:PN7,complete1:PC7,                                        in_progress1:PIP7,task_id1:PT7,
                   });
                  }            
                  prev = []
                  PPC6=0;PPC7=0;
                  PPD6=0;PPD7=0;
                  PBGC6=0;PBGC7=0;
                  PFGC6=0;PFGC7=0;
                  PST6=0;PST7=0;
                  PSC6=0;PSC7=0;
                  PW6=0;PW7=0;
                  PRW6=0;PRW7=0;
                  PN6=0;PN7=0;
                  PC6=0;PC7=0;
                  PIP6=0;PIP7=0;
                  PT6=0;PT7=0;
          } 

      //    console.log(name)       
          i.push({date:niceDate,user:user,tasks:task}) 
          title=[]
          task=[]
          co=[]
          niceDate='' 
          user=''
          prev=[]
          count = 0 
          c++
          }           

      that.setState({ 
        JSONResult: i,
        ActivityIndicator_Loading: false,
      });  
      if(that.state.Clients.length === 0){
         that.setState({Clients:clients})   
      }
      if(that.state.ATAT.length === 0){
         that.setState({ATAT:ATAT})   
      }      
    //   console.log(that.state.JSONResult)  
       console.log(that.state.Clients)  

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
   // console.log(index)
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

    ModalClients = () => {
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

    ModalClientsDone = () => {
    Animated.timing(this.state.modalMoAnimatedValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ modalMoIsVisible: false, ActivityIndicator_Loading: false });
    });
  };

  ModalRenderClients = () => {
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
        <TouchableWithoutFeedback onPress={this.ModalClientsDone}>
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
              <Button title="Done" buttonStyle={{backgroundColor:'#71BF44'}}  onPress={this.ModalClientsDone} />
            </View>
          </View>
          <Picker style={{width: WindowWidth, backgroundColor: '#e1e1e1'}}
            selectedValue={this.state.clients}
            onValueChange={(itemValue, itemIndex) => this.pickClient(itemIndex)} >
            { this.state.Clients.map((item, key)=>(
            <Picker.Item label={item.client} value={item.id} key={key} />)
            )}
          </Picker>            
        </Animated.View>
      </View>
    );
  }; 

getLocation(){
  console.log('entered getLocation()')
 // console.log('NEXT - '+this.state.Next)
//  console.log('PREV - '+this.state.Previous)

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
      var months    = [{id:5,month:'January'},{id:6,month:'February'},{id:7,month:'March'},{id:8,month:'April'},{id:9,month:'May'},{id:10,month:'June'},{id:11,month:'July'},{id:0,month:'August'},{id:1,month:'September'},{id:2,month:'October'},{id:3,month:'November'},{id:4,month:'December'}];
      var now       = new Date();
      var thisMonth = months[now.getMonth()];       
   //   console.log(result.data)
   //   console.log(thisMonth.month);
      var smonth = ''
      if(!that.state.SMonth){
         m.push({id:thisMonth.id,month:thisMonth.month})
         smonth = thisMonth.month
      } else {
        m.push({id:that.state.MonthId,month:that.state.SMonth})
        smonth = that.state.SMonth
      }
      var f=0;
      var m2=[]
      for(let m1 of months){
         if(m1.month != smonth){
           if(f === 1){
             m.push({id:m1.id,month:m1.month})
           } else {
             m2.push({id:m1.id,month:m1.month})             
           }
         } else {
           f=1
         }
      }

      for(let m3 of m2){
        m.push({id:m3.id,month:m3.month})
      }
  //    console.log(m)

var date = new Date();
var firstDay = new Date(date.getFullYear(), date.getMonth() + that.state.MonthId, 1);
var lastDay = new Date(date.getFullYear(), date.getMonth() + that.state.MonthId + 1, 0);
var fd = firstDay.getFullYear() + '-' + (firstDay.getMonth() + 1) + '-' + (firstDay.getDate());
var ld = lastDay.getFullYear() + '-' + (lastDay.getMonth() + 1) + '-' + (lastDay.getDate());

console.log("First Day - "+fd+'  '+ 'Last Day - ' + ld);

      that.setState({Locations:result.data,
                     Months:m,
                     months:thisMonth.month,
                     mTitle:smonth,
                     StartDate:fd,
                     EndDate:ld,
                     Alert:null,})
    //  console.log(that.state.Locations)
   //   console.log(that.state.Locations.length)
//console.log(months);
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
    selectedC:0,
    selectedL:this.state.Locations[index].id,
    Next:null,
    Previous:null,
   })
   //console.log(this.state.locations)
   this.getLocation()
  }
 })
}

pickClient(index){

 this.state.Clients.map( (v,i)=>{
  if( index === i ){
    this.setState({
    clients: this.state.Clients[index].id,
    cTitle:this.state.Clients[index].client,
    ClientID:this.state.Clients[index].id,
    CClient:this.state.Clients[index].client,
    ActivityIndicator_Loading: true,
    selectedC:this.state.Clients[index].id,
    Next:null,
    Previous:null,    
   })
   //console.log('ClientID - ' + this.state.selectedC)
   this.getLocation()   
  }
 })
}

  header= () => {   
    return(
  <View>
   <View style={{backgroundColor: '#f0f0f0', flexDirection:'row'}}>
    <View style={{width:'33%'}}></View>
    <View style={{width:'33%',alignItems:'center',justifyContent:'center',paddingTop:5}}> 
          <Text>{this.state.niceDate}</Text>  
    </View> 
    {this.state.AddTask === 1 ? (  
    <View style={{width:'33%',alignItems:'center',justifyContent:'center',paddingTop:5}}> 
        <Button title=' Assign Task' titleStyle={{color:'white',fontWeight:'bold',fontSize:12 }}buttonStyle={{backgroundColor:'#71BF44',width:'100%', height:32}} icon={<MaterialCommunityIcons name="account-plus-outline" size={20} color='white' />} onPress={() => this.props.navigation.push('AddTask', {"user_id":this.state.userid,"email":this.state.email,"baseURL":this.state.baseURL,"date":this.state.date, 'activity':this.state.activity, 'SH':this.state.SH, 'SM':this.state.SM, "addPin":this.state.addPin, "notificationCount":this.state.Count,'assignTo':this.state.ATAT,'task_id':this.state.task_id,'taskSettings':this.props.navigation.state.params.taskSettings})}/>          
    </View> 
    ): null} 
   </View>  
    <View style={{flexDirection:'row',backgroundColor: '#f0f0f0'}}>
     {Platform.OS === 'android' ? (  
      <View  style={styles.Dropdown}> 
        <Picker style={{width: '35%',fontSize:15}}
          selectedValue={this.state.locations}
          onValueChange={(itemValue, itemIndex) => this.pickLocation(itemIndex)} >
          { this.state.Locations.map((item, key)=>(
          <Picker.Item label={item.location} value={item.id} key={key} />)
          )} 
        </Picker>  
        <Picker style={{width: '36%',fontSize:15}}
          selectedValue={this.state.clients}
          onValueChange={(itemValue, itemIndex) => this.pickClient(itemIndex)} >
          { this.state.Clients.map((item, key)=>(
          <Picker.Item label={item.client} value={item.id} key={key} />)
          )} 
        </Picker> 
        <View style={{alignItems:'center',paddingTop:5, width:'23%',flexDirection:'row'}}>
        <Button title='<' titleStyle={{color:'white',fontWeight:'bold',fontSize:12 }}
         buttonStyle={{backgroundColor:'#71BF44',width:'95%', height:28}} onPress={()=>{this.setState({Previous:true,Next:null,ActivityIndicator_Loading:true});this.getLocation()}}/> 

       <View style={{paddingLeft:5}}>         
        <Button title='>' titleStyle={{color:'white',fontWeight:'bold',fontSize:12 }}
         buttonStyle={{backgroundColor:'#71BF44',width:'95%', height:28}} onPress={()=>{this.setState({Next:true,Previous:null,ActivityIndicator_Loading:true});this.getLocation()}}/> 
       </View>
       </View>                   

     </View>   
):
        <View style={{flexDirection:'row', backgroundColor: '#f0f0f0',}}>  
        <View style={{width:"35%"}}>   
          <Button buttonStyle={{justifyContent: 'center',width:'100%',height:48}} type='clear' title={this.state.lTitle} titleStyle={{color:'black',fontSize:15}} onPress={this.ModalLocations} />
       </View>
       <View style={{paddingTop:15,paddingRight:10, alignItems:'center'}}>
      </View>
        <View style={{width:"36%"}}>   
          <Button buttonStyle={{justifyContent: 'center',width:'100%',height:48}} type='clear' title={this.state.cTitle} titleStyle={{color:'black',fontSize:15}} onPress={this.ModalClients} />
       </View>      
      <View style={{alignItems:'center',paddingTop:5, width:'23%',flexDirection:'row'}}>

        <Button title='<' titleStyle={{color:'white',fontWeight:'bold',fontSize:12 }}
         buttonStyle={{backgroundColor:'#71BF44',width:'95%', height:28}} onPress={()=>{this.setState({Previous:true,Next:null,ActivityIndicator_Loading:true});this.getLocation()}} /> 

       <View style={{paddingLeft:5, backgroundColor: '#f0f0f0'}}>         
        <Button title='>' titleStyle={{color:'white',fontWeight:'bold',fontSize:12 }}
         buttonStyle={{backgroundColor:'#71BF44',width:'95%', height:28}} onPress={()=>{this.setState({Next:true,Previous:null,ActivityIndicator_Loading:true});this.getLocation()}} /> 

       </View>                   
      </View>        
                 
     </View>
     }             
    </View>
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

   TaskModal(text, onPress){
   return(
    <View> 
    <TouchableOpacity onPress={onPress}>
      <View style={styles.Cbutton}>
        <Text style={{color:'white',font:20}}>{text}</Text>
      </View>
    </TouchableOpacity>
    </View>
   )
 }

  TaskModalContent(){    
   /// console.log('TaskModalContent')
   return(
    <View style={styles.stage}> 
      <Text>Update Task</Text>   
      <Text>this.state.description</Text>
      <Text>this.state.notes</Text>
      <Button title='Start' />
      <Button title='Complete' />                 
        {

        this.state.ActivityIndicator_Loading ? <View><ActivityIndicator color='#009688' size='large'style={styles.ActivityIndicatorStyle} /></View> : null
        
        }                   

   {this.TaskModal('Close', () => this.setState({ visibleModal: null}))}
    </View>       
   )
  }

  StartTask(){
  console.log('entered StartTask()')
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=task&act=in_progress&id='+this.state.task_id 
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
  if(!result.error){
  //    Alert.alert('Task Started')
      that.setState({Alert:1})
      } else {
    console.log(result.error)
    that.setState({Error: result.error})
  }
 }).catch(function (error) {
   console.log("-------- error ------- "+error);
 });
//  console.log('Rosters Data - '+ that.state.JSONResult)
}  

  CompleteTask(){
  console.log('entered CompleteTask()')
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=task&act=complete&id='+this.state.task_id 
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
  if(!result.error){
     // Alert.alert('Task Complete')
      that.setState({Alert:2})
      } else {
    console.log(result.error)
    that.setState({Error: result.error})
  }
 }).catch(function (error) {
   console.log("-------- error ------- "+error);
 });
//  console.log('Rosters Data - '+ that.state.JSONResult)
} 


AddNote() {  
      
        const note_details = new FormData();     
        note_details.append('note', this.state.comments);
        this.setState({ ActivityIndicator_Loading : true }, () =>
        { 
        //     console.log(note_details)
            console.log(this.props.navigation.state.params.baseURL+'?ct=api&api=task&act=addNote&id='+this.state.task_id);
            fetch(this.props.navigation.state.params.baseURL+'?ct=api&api=task&act=addNote&id='+this.state.task_id,
            {
                method: 'POST',
                credentials: 'same-origin',
                 headers: 
                 {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
                 },
                body: note_details
            }).then((response) => response.json()).then((res) =>
            {
              //    console.log(res)
                  if(!res.error){
                  var that=this;                  
                       
             that.setState({visibleModal:null,Show_AddNote:null,Next:null,Previous:null},()=>{that.getLocation()}) 
                                                     
                  console.log('Notes Added Successfully');                                                  
                                                        
                  } else {
                    console.log(res.error)
                  }    
                this.setState({ ActivityIndicator_Loading : false });
 
            }).catch((error) =>
            {
                console.error(error);
                
                this.setState({ ActivityIndicator_Loading : false});
            });
        });

  }

  ModalDisplayTask(){
      
    return(

          <View style={{backgroundColor:'white'}}> 
          <ScrollView> 
           <View style={{paddingLeft:5,alignItems:'flex-start'}}> 
             <Text>{this.state.description}</Text>
           </View>                                                                                             
           <View style={{paddingLeft:5,flexDirection:'row',alignItems:'center',justifyContent:'center', paddingTop:15}}> 
           {this.state.show_start === true && this.state.Alert === null && this.state.Show_AddNote === null ? (
             <View style={{paddingRight:5}}>
              <Button title=' Start' titleStyle={{fontSize:15}} onPress={()=>this.StartTask()}icon={<MaterialIcons name="play-circle-outline" size={20} color='white' />}/>
             </View> 
           ): null}  
           {this.state.show_complete === true && this.state.Alert === null && this.state.Show_AddNote === null ? (
             <View style={{paddingRight:5}}>
            <Button title=' Complete' titleStyle={{fontSize:15}} onPress={()=>this.CompleteTask()} icon={<Ionicons name="md-checkmark-circle-outline" size={20} color='white' />}/>
             </View> 
         
           ): null}  
           
             <View style={{paddingRight:5}}>   
           {this.state.Show_AddNote === null && this.state.readwrite === true ? (            
            <Button title=' Add Notes' titleStyle={{fontSize:15}} onPress={()=>this.setState(                {Show_AddNote:1})} icon={<MaterialIcons name="event-note" size={20} color='white' />}/> 
            ): null}             
            </View>             
           {this.state.Alert === 1 ? (
             <View style={{paddingRight:5}}>
                <Button title=' Task Started' titleStyle={{fontSize:15}} icon={<Ionicons name="md-checkmark-circle-outline" size={20} color='white' />}/>
             </View> 
           ): null}
           {this.state.Alert === 2 ? (
             <View style={{paddingRight:5}}>
                <Button title=' Task Complete' titleStyle={{fontSize:15}} icon={<Ionicons name="md-checkmark-circle-outline" size={20} color='white' />}/>
             </View> 
           
            ): null}            
           </View>  
             <View style={{paddingTop:10,alignItems:'center',paddingBottom:5}}>           
              {this.state.Show_AddNote === 1 ? (
              <View style={{width:'80%'}}>  
               <View style={styles.textInput}> 
                <TextInput
                  // style={styles.TextInputStyleClass}
                    underlineColorAndroid="transparent"
                    label='Comment'
                    placeholder={"Notes"}
                    numberOfLines={2}
                    multiline={true}
                    onChangeText ={comments => this.setState({ comments })}
                  />
               </View>   
               <View style={{alignItems:'center', flexDirection:'row'}}>   
           {this.state.show_start === true && this.state.Alert === null && this.state.Show_AddNote === 1 ? (
             <View style={{paddingRight:5}}>
              <Button title=' Start' titleStyle={{fontSize:15}} onPress={()=>this.StartTask()}icon={<MaterialIcons name="play-circle-outline" size={20} color='white' />}/>
             </View> 
           ): null}  
           {this.state.show_complete === true && this.state.Alert === null && this.state.Show_AddNote === 1 ? (
             <View style={{paddingRight:5}}>
            <Button title=' Complete' titleStyle={{fontSize:15}} onPress={()=>this.CompleteTask()} icon={<Ionicons name="md-checkmark-circle-outline" size={20} color='white' />}/>
             </View> 
         
           ): null}     
           {this.state.readwrite === true ? (
                <Button title=' Add Notes' titleStyle={{fontSize:15}} onPress={()=>{this.setState({visibleModal: null});this.AddNote()}} buttonStyle={{width:'80%'}} icon={<MaterialIcons name="event-note" size={20} color='white' />}/>
              ): null}
              </View> 
             </View>   
              ): null}  
            </View>

           <View style={{paddingBottom:5}}>
              <Text>{this.state.notes}</Text>
           </View>            
                     
           {this.TaskModal('Close', () => {this.setState({ visibleModal: null,Next:null,Previous:null,Show_AddNote:null});{this.state.Alert != null ?(this.getLocation()):null}})} 
           </ScrollView>               
          </View>       

    )

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
      <Text style={{color:'#71BF44',fontWeight:'bold'}}>No Task Setup</Text>
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
         {this.ModalRenderClients()} 
        </Modal>          
        <Modal isVisible={this.state.visibleModal === 1} > 
         {this.ModalDisplayTask()}         
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
                  <Text style={{color:'black',fontWeight:'bold'}}>{item.user}</Text>                                 
                   <FlatList
                    data={ item.tasks }
                   //   horizontal={this.state.Horizontal}
                        renderItem={({item,index}) => {  
                          return(
                        <View style={{flexDirection:'row',margin:4}}>
                            {item.code && item.complete === true ? (                         
                          <Button title={' '+item.code} rounded='true' type='clear' titleStyle={{color:item.fgcolor,fontSize:15}} buttonStyle={{backgroundColor: item.bgcolor,margin:4}} onPress={() =>this.setState({visibleModal:1,description:item.description,notes:item.notes,show_start:item.show_start,show_complete:item.show_complete,task_id:item.task_id,readwrite:item.readwrite})}
    icon={<Ionicons name="md-checkmark-circle-outline" size={20} color='white' />} /> 
                              ): null}
                          {item.code && item.in_progress === true ?(
                          <Button title={' '+item.code} rounded='true' type='clear' titleStyle={{color:item.fgcolor,fontSize:15}} buttonStyle={{backgroundColor: item.bgcolor,margin:4}} onPress={() =>this.setState({visibleModal:1,description:item.description,notes:item.notes,show_start:item.show_start,show_complete:item.show_complete,task_id:item.task_id,readwrite:item.readwrite})}
     icon={<Ionicons name="ios-hourglass" size={20} color='white' />} /> 
                              ): null}
                              {item.code && item.in_progress === false && item.complete === false  ?(
                              <Button title={' '+item.code} rounded='true' type='clear' titleStyle={{color:item.fgcolor,fontSize:15}} buttonStyle={{backgroundColor: item.bgcolor,margin:4}} onPress={() =>this.setState({visibleModal:1,description:item.description,notes:item.notes,show_start:item.show_start,show_complete:item.show_complete,task_id:item.task_id,readwrite:item.readwrite})}/> 
                              ): null}  
                            <Text>  </Text>
                             
                            {item.code1 && item.complete1 === true ? (                        
                            <View>
                            <Button title={' '+item.code1} rounded='true' type='clear' titleStyle={{color:item.fgcolor1,fontSize:15}} buttonStyle={{backgroundColor: item.bgcolor1,margin:4}}onPress={() =>this.setState({visibleModal:1,description:item.description1,notes:item.notes1,show_start:item.show_start1,show_complete:item.show_complete1,task_id:item.task_id1,readwrite:item.readwrite1})}
icon={<Ionicons name="md-checkmark-circle-outline" size={20} color='white' />} />             
                            </View> 
                            ):null }
                            {item.code1 && item.in_progress1 === true ?(
                            <View>
                            <Button title={' '+item.code1} rounded='true' type='clear' titleStyle={{color:item.fgcolor1,fontSize:15}} buttonStyle={{backgroundColor: item.bgcolor1,margin:4}}onPress={() =>this.setState({visibleModal:1,description:item.description1,notes:item.notes1,show_start:item.show_start1,show_complete:item.show_complete1,task_id:item.task_id1,readwrite:item.readwrite1})}
icon={<Ionicons name="ios-hourglass" size={20} color='white' />}/>
                            </View>
                            ): null}
                            {item.code1 && item.complete1 === false && item.in_progress1 === false  ?(
                            <View>  
                            <Button title={item.code1} rounded='true' type='clear' titleStyle={{color:item.fgcolor1,fontSize:15}} buttonStyle={{backgroundColor: item.bgcolor1,margin:4}}onPress={() =>this.setState({visibleModal:1,description:item.description1,notes:item.notes1,show_start:item.show_start1,show_complete:item.show_complete1,task_id:item.task_id1,readwrite:item.readwrite1})}/>
                            </View>
                            ): null}                              

                            <Text>  </Text> 
                             <View>                            
                            {item.code2 && item.complete2 === true ? ( 
                            <Button title={' '+item.code2} rounded='true' type='clear' titleStyle={{color:item.fgcolor2,fontSize:15}} buttonStyle={{backgroundColor: item.bgcolor2,margin:4}}onPress={() =>this.setState({visibleModal:1,description:item.description2,notes:item.notes2,show_start:item.show_start2,show_complete:item.show_complete2,task_id:item.task_id2,readwrite:item.readwrite2})}
icon={<Ionicons name="md-checkmark-circle-outline" size={20} color='white' />} /> 
                            ): null }
                            {item.code2 && item.in_progress2 === true ?(
                            <Button title={' '+item.code2} rounded='true' type='clear' titleStyle={{color:item.fgcolor2,fontSize:15}} buttonStyle={{backgroundColor: item.bgcolor2,margin:4}}onPress={() =>this.setState({visibleModal:1,description:item.description2,notes:item.notes2,show_start:item.show_start2,show_complete:item.show_complete2,task_id:item.task_id2,readwrite:item.readwrite2})} icon={<Ionicons name="ios-hourglass" size={20} color='white' />}/>
                            ): null}
                            {item.code2 && item.complete2 === false && item.in_progress2 === false  ?(
                            <Button title={' '+item.code2} rounded='true' type='clear' titleStyle={{color:item.fgcolor2,fontSize:15}} buttonStyle={{backgroundColor: item.bgcolor2,margin:4}}onPress={() =>this.setState({visibleModal:1,description:item.description2,notes:item.notes2,show_start:item.show_start2,show_complete:item.show_complete2,task_id:item.task_id2,readwrite:item.readwrite2})}/>
                            ): null}                            
                             </View>
                           

                            <Text> </Text>                                                                                
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
  Cbutton: {
    backgroundColor: '#71BF44',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'black',
    height:40
  },  
      TextInputStyleClass:{
    alignItems:'center',
    textAlign: 'center',
  //  width:'80%',
    //height: 150,
   // borderWidth: 0.5,
    borderRadius: 5 ,
    backgroundColor : "White",
    //flex:1,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 10,
    //flexDirection: 'row',
    color: 'black' 
    
    },
textInput: {
    justifyContent:'center',
    alignItems: 'center',
    borderRadius: 10,
  //  flexDirection: 'row',
    borderWidth: 0.5,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 10,
    backgroundColor: 'white',
    color: 'black', 
  //  width:'100%',
    height:50,
    //flex:1
  },    
 
});
