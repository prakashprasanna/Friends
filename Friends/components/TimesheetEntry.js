import React, { Component } from 'react';
import { Alert, List, ListItem, FlatList, TextInput, View, StyleSheet, Image, KeyboardAvoidingView, Text, ScrollView, ActivityIndicator, TouchableOpacity, TouchableHighlight, Picker, BackHandler, Switch, NetInfo, Dimensions, Platform, RefreshControl, Animated, TouchableWithoutFeedback} from 'react-native';
import { getRegoInfo } from './FetchVehicle';
//import ReceiptUpload from './ReceiptUpload';
import DatePicker from 'react-native-datepicker';
import { Dropdown } from 'react-native-material-dropdown';
import { getUserInfo } from './Users';
import LoginUser from './LoginUser';
import { DrawerNavigator, DrawerActions, DrawerItems, SafeAreaView, createStackNavigator, createBottomTabNavigator, createDrawerNavigator,createAppContainer, createSwitchNavigator } from 'react-navigation'; 
import { Table, Rows, TableWrapper, Row, Cell } from 'react-native-table-component';
import { ImagePicker, Permissions, Location } from 'expo';
import Constants from 'expo-constants';
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
import { Header, Button, Badge } from 'react-native-elements';
import IconBadge from 'react-native-icon-badge';
import Modal from 'react-native-modal';
import { Section, TableView, Separator } from 'react-native-tableview-simple';
import Dashboard from './Dashboard';
import EditTimesheet from './EditTimesheet';
import DateTimePicker from "react-native-modal-datetime-picker";
import PinLogin from './PinLogin';
import { SQLite } from 'expo-sqlite';

const { width: WindowWidth } = Dimensions.get('window');

const { width } = Dimensions.get('window');

const db = SQLite.openDatabase('db.db');

class HeaderNavigationBar extends Component {

  constructor(props) {
    super(props);
    this.NotificationsCount = this.NotificationsCount.bind(this);
    this.state = {
      Count:0,
      email:'',
      username:'',
      userid:'',
      baseURL:'', 
      addPin:null,
    }
  }
      componentDidMount() {
               this.NotificationsCount();
               var that=this;    
                  that.setState({
                          username: this.props.navigation.state.params.username,
                          email:this.props.navigation.state.params.email,
                          baseURL:this.props.navigation.state.params.baseURL,
                          userid:this.props.navigation.state.params.user_id,
                          addPin:this.props.navigation.state.params.addPin                               

                      });               
    }


NotificationsCount(){
         console.log('Notifications COUNT')
            db.transaction(
      tx => {        
        tx.executeSql( 
          'select * from Notifications where error_flag="1"',[],
           (tx,res) => {  console.log('Timesheets error count - ' + res.rows.length)
            var temp = [];
            if(res.rows.length > 0){
                  this.setState({
                          Count:res.rows.length,
                          username: this.props.navigation.state.params.username,
                          email:this.props.navigation.state.params.email,
                          baseURL:this.props.navigation.state.params.baseURL,
                          userid:this.props.navigation.state.params.user_id,
                          addPin:this.props.navigation.state.params.addPin                               

                      });
            } else {
                  this.setState({
                          Count:0,
                          username: this.props.navigation.state.params.username,
                          email:this.props.navigation.state.params.email,
                          baseURL:this.props.navigation.state.params.baseURL,
                          userid:this.props.navigation.state.params.user_id,                          
                          addPin:this.props.navigation.state.params.addPin
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
     <View style={{paddingTop: Constants.statusBarHeight,backgroundColor: 'white',}}>
        <Header
          leftComponent={
          <TouchableHighlight>
            <Button
             type="clear"
                icon={
                    <Ionicons name="ios-menu" size={30} color='white' />
                    } 
                onPress={ () =>this.props.navigation.dispatch(DrawerActions.openDrawer()) }                             
                />
           </TouchableHighlight>

          }
          centerComponent={{ text: 'MY HOURS', style: { color: 'white',fontSize:20,fontWeight:'bold' } }}
          rightComponent={
            <View style={{ flexDirection: 'row'}}>
                <Button
                type="clear"
                icon={
                    <Ionicons name="ios-home" size={30} color='white' />
                    }       
                onPress={ () =>this.props.navigation.push('Dashboard',{"count":this.state.Count,"username":this.state.username,"email":this.state.email,"baseURL":this.state.baseURL,"user_id":this.state.user_id, "addPin": this.state.addPin, "SH":this.state.selectedEndHours, 'SM':this.state.selectedEndMinutes}) }    
                />                               
                <Button
                type="clear"
                icon={
                  <IconBadge    
                    MainElement={
                    <Ionicons name="ios-notifications-outline" size={30} color='white' />
                    }
                    BadgeElement={
                      <Text style={{color:'#FFFFFF'}}>{this.state.Count}</Text>
                    }
                    IconBadgeStyle={
                      {width:10,
                      height:20,
                      backgroundColor: 'red'}
                    }         
                    Hidden={this.state.Count==0}
                    /> 
                }         
              onPress={() => this.props.navigation.push('Notifications',{"count":this.state.Count,"username":this.state.username,"email":this.state.email,"baseURL":this.state.baseURL,"user_id":this.state.user_id, "addPin": this.state.addPin})}/>
          </View>   
          }
          backgroundColor="#71BF44"
        />
      </View>);
    }
}


class TimesheetEntry extends Component { 
    static navigationOptions = {  
         title: 'Add Timesheet',  
    };
  state = {
    image: null,
  };
  constructor(props) {
    super(props);
    this.handleTimesheetConnectivity = this.handleTimesheetConnectivity.bind(this);
    this.noInternet = this.noInternet.bind(this);
    this.state = {
    email:'',
    username:'',
    userid:'',
    baseURL:'',      
    jobs: '',
    otherJobs: '',
    activity: '',
    startTime: '',  
    endTime: '',
    totalHours: '',
    units: '',
    comments:'',
    ActivityIndicator_Loading: false,   
    Form_Loading: true,
    Offline_Loading: false,
    Jobs:[],
    OtherJobs:[],
    Activity:[],
    CommercialEquipments:[],
    RUCVehicles:[],
    CommercialVessels:[],
    show: false,    
    showRegVehicles: false,    
    showUnRegVehicles: false,    
    showEquipments: false,    
    showRUC: false,    
    showVessels: false,  
    selectedStartTime:'',
    selectedEndTime:'',
    selectedStartHours: '',
    selectedStartMinutes:'',    
    selectedEndHours: '',
    selectedEndMinutes: '',    
    Timesheets: [],  
    Timesheet:[],
    TimesheetDateSpecific:[],  
    OfflineDateSpecific:[],      
    OtherJ:[],
    tableHead: [' Activity  ','Time','Hours','Action'],
    tableData: [],
    tableDataOnline : [],   
    date : '',
    displayOffline : '0',
    isConnected : '',
    location : '',
    gps_lat : '',
    gps_lng : '',
    errorMessage : '',    
    OfflineTimesheets:[],
    visibleModal: null,
    visibleClockModal: null,
    isDateTimePickerVisible: false,
    isEndDateTimePickerVisible: false,    
    SH:'',
    SM:'',
    EH:'',
    EM:'',
    CountGetTimesheet:false,
    language: 'js',
    modalIsVisible: false,
    modalJobsIsVisible: false,
    modalOJobsIsVisible: false,
    modalAnimatedValue: new Animated.Value(0),
    modalJAnimatedValue: new Animated.Value(0),
    modalOJAnimatedValue: new Animated.Value(0),
    aTitle:'Select an Activity',
    jTitle:'Select a Job',
    ojTitle:'Select any other Job',
    button:'',
    formatedDate:'',
    unpaid:'',
      };
  this.fetchUser = this.fetchUser.bind(this);
  this.getOtherJobIds = this.getOtherJobIds.bind(this);
  this.getActivity = this.getActivity.bind(this);
  this.getTimesheets = this.getTimesheets.bind(this);
  this.HalfDay = this.HalfDay.bind(this);
  this.FullDay = this.FullDay.bind(this);
  this.getTimesheet = this.getTimesheet.bind(this);
  this.EditTimesheet = this.EditTimesheet.bind(this);
  this.createTimesheetsDBs = this.createTimesheetsDBs.bind(this);
  this.insert_timesheet = this.insert_timesheet.bind(this);
  this.insert_timsheetAPI = this.insert_timsheetAPI.bind(this);
  this.pickActivity = this.pickActivity.bind(this);
  this.pickJob = this.pickJob.bind(this);  
  this.pickOtherJob = this.pickOtherJob.bind(this);  
  this.offlineSync = this.offlineSync.bind(this);
  this.HistoryModal = this.HistoryModal.bind(this);
  this.HistoryModalContent = this.HistoryModalContent.bind(this);
  this.OfflineHistoryModal = this.OfflineHistoryModal.bind(this);
  this.OfflineHistoryModalContent = this.OfflineHistoryModalContent.bind(this);   
  this.getNextStartTime = this.getNextStartTime.bind(this);
  this.showDateTimePicker = this.showDateTimePicker.bind(this);
  this.hideDateTimePicker = this.hideDateTimePicker.bind(this);
  this.showEndDateTimePicker = this.showEndDateTimePicker.bind(this);
  this.hideEndDateTimePicker = this.hideEndDateTimePicker.bind(this);  
  this.handleDatePicked = this.handleDatePicked.bind(this);
  this.handleEndDatePicked = this.handleEndDatePicked.bind(this);
  this.EditOfflineTimesheet = this.EditOfflineTimesheet.bind(this);
  this.ModalGetTimesheet = this.ModalGetTimesheet.bind(this);
  this.EditOnlineTimesheet = this.EditOnlineTimesheet.bind(this);
  this.ModalOfflineGetTimesheet = this.ModalOfflineGetTimesheet.bind(this);
  this.delete_timesheet = this.delete_timesheet.bind(this);
  this.offlineDelete_timesheet = this.offlineDelete_timesheet.bind(this);
  this.ModalClock = this.ModalClock.bind(this);
  this.ModalClockContent = this.ModalClockContent.bind(this);
  this.ModalActivity = this.ModalActivity.bind(this);
  this.ModalActivityDone = this.ModalActivityDone.bind(this);
  this.ModalRenderActivities = this.ModalRenderActivities.bind(this);
  this.ModalJobs = this.ModalJobs.bind(this);
  this.ModalJobsDone = this.ModalJobsDone.bind(this);
  this.ModalRenderJobs = this.ModalRenderJobs.bind(this);  
  this.ModalOJobs = this.ModalOJobs.bind(this);
  this.ModalOJobsDone = this.ModalOJobsDone.bind(this);
  this.ModalRenderOJobs = this.ModalRenderOJobs.bind(this);
  this.AddStopEntry = this.AddStopEntry.bind(this);   
}

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };
 
  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  }; 

  showEndDateTimePicker = () => {
    this.setState({ isEndDateTimePickerVisible: true });
  };
 
  hideEndDateTimePicker = () => {
    this.setState({ isEndDateTimePickerVisible: false });
  };   

    handleDatePicked = time => {
    console.log("A start Time has been picked: ", time);
    console.log(moment(time).format('HH'));
    console.log(moment(time).format('mm'));
    this.setState({selectedStartHours: moment(time).format('HH'),
                   selectedStartMinutes: moment(time).format('mm'),
                   selectedStartTime:moment(time).format('HH')+':'+ moment(time).format('mm')})
    this.hideDateTimePicker();
  };

    handleEndDatePicked = time => {
    console.log("A End Time has been picked: ", time);
    console.log(moment(time).format('HH'));
    console.log(moment(time).format('mm'));
    this.setState({selectedEndHours: moment(time).format('HH'),
                   selectedEndMinutes: moment(time).format('mm'),
                   selectedEndTime:moment(time).format('HH')+':'+ moment(time).format('mm')})
    this.hideEndDateTimePicker();
  };  

  askPermissionsAsync = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    // you would probably do something to verify that permissions
    // are actually granted, but I'm skipping that for brevity
  };

  useLibraryHandler = async () => {
    await this.askPermissionsAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: false,
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri });
      this.state.photo = result.uri;
    }
  };

  useCameraHandler = async () => {
    await this.askPermissionsAsync();
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: false,
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri });
      this.state.photo = result.uri;
    }
  };  

//fetch user
 fetchUser() {
    alert('Fetching User details...')
    getUserInfo(this.state.userid)
    .then((res) => {
      this.setState({
        data: res
      })      
      if(this.state.data == '') {
        this.setState({
 
        fullname: 'User not found'
        })
      }
    else {
      this.setState({

        fullname: this.state.data.user
 
      })
      //console.log(this.state.data);
      //console.log(this.state.data.user);
      this.setState({
        error: false,
        userid: ''
      })
    }
});

}

//function to fetch fuel containers from Tanks table

componentDidMount(){
  //     this.NotificationsCount();    
 this.props.navigation.setParams({ Count: this.props.navigation.state.params.notificationCount})
  NetInfo.isConnected.addEventListener('connectionChange', this.handleTimesheetConnectivity);
    NetInfo.isConnected.fetch().done((isConnected) => {
 
      if(isConnected == true)
      {
        this.setState({isConnected : "true",
                      displayOffline : '0'})
 //        this.offlineSync();
        this.getNextStartTime();
      }
      else
      {
        this.setState({isConnected : "false",
                      displayOffline : null,
                      selectedStartHours:'00',
                      selectedStartMinutes:'00'})
                     
      }
        //console.log('timesheet screen isConnected - ' + this.state.isConnected)
      //  setInterval(()=> this.getLocation(), 10000)
        this.getLocation(); 
        this.createTimesheetsDBs();
        // var date = moment().format("YYYY-MM-DD");
        var that = this;  
      //  var date = moment(this.props.navigation.state.params.date).format("MMM Do YYYY");
        that.setState({
              //Setting the value of the date time
              date:this.props.navigation.state.params.date,
              totalHours:'',
              username: this.props.navigation.state.params.username,
              email:this.props.navigation.state.params.email,
              baseURL:this.props.navigation.state.params.baseURL,
              userid:this.props.navigation.state.params.user_id,
              addPin:this.props.navigation.state.params.addPin,
              formatedDate:this.props.navigation.state.params.formatedDate,
      //        activity:this.props.navigation.state.params.activity,
            });        
 
     });   

}

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleTimesheetConnectivity);
  }

  handleTimesheetConnectivity = isConnected =>{
    if (isConnected == true) {
      this.setState({ isConnected : 'true',
                      displayOffline : '0'});
  //    this.offlineSync();                             
    } else {
      this.setState({ isConnected : 'false',
                      displayOffline : null});                      
    }
  } 

  getLocation = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });    
    }

    let location = await Location.getCurrentPositionAsync({});
    //console.log(location)
    this.setState({ location,
                    gps_lat : location.coords.latitude,
                    gps_lng : location.coords.longitude   });

  };  

  offlineSync(){
     console.log('offline sync in progress')
    var syncSwitch = 'off';
    var error = '';
    db.transaction(
      tx => {
        tx.executeSql(
          'select * from Timesheet where error_flag="0"',[], (_, { rows }) =>console.log('offline sync Timesheet Select - ' + JSON.stringify(rows)))         
        tx.executeSql( 
          'select * from Timesheet where error_flag="0"',[],
           (tx,res) => {            
             var temp = [];
             console.log('offline sync res.rows.length - ' + res.rows.length)
           if(res.rows.length > 0) {
             var uuid = '';
              for(let i=0; i < res.rows.length; ++i){
                 console.log('For Loop for notifications')
                 temp.push(res.rows.item(i));   
                  var user_id = this.props.navigation.state.params.user_id;
                  var sqlid = res.rows.item(i).id;
                  const timesheet_details = new FormData();
                  timesheet_details.append('user_id', user_id);
                  timesheet_details.append('date', res.rows.item(i).date);
                  timesheet_details.append('total_hours', res.rows.item(i).total_hours);
                  timesheet_details.append('start_time', res.rows.item(i).start_time);
                  timesheet_details.append('end_time', res.rows.item(i).end_time);
                  timesheet_details.append('activity_code', res.rows.item(i).activity_code);
                  timesheet_details.append('uuid', res.rows.item(i).uuid);
                  timesheet_details.append('gps_lat', res.rows.item(i).gps_lat);
                  timesheet_details.append('gps_lng', res.rows.item(i).gps_lng);
                  timesheet_details.append('job_id', res.rows.item(i).job_id);
                  timesheet_details.append('units', res.rows.item(i).units);
                  timesheet_details.append('source', 'App');
                  timesheet_details.append('comment', res.rows.item(i).comment);
                  timesheet_details.append('error', '0')
                  this.setState({ ActivityIndicator_Loading : true }, () =>
                { 
                    console.log(timesheet_details);
                    console.log(this.props.navigation.state.params.baseURL+'?ct=api&api=timsheet&act=add');
                    fetch(this.props.navigation.state.params.baseURL+'?ct=api&api=timesheet&act=add',
                    {
                        method: 'POST',
                        credentials: 'same-origin',
                        headers: 
                        {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data'
                        },
                        body: timesheet_details
                    }).then((response) => response.json()).then((res) =>
                    {
                          console.log('offline sync successful')
                    //      console.log(res)
                          var that = this;
                          that.state.OfflineTimesheets[i] = res 
                          console.log(that.state.OfflineTimesheets)
                          if(!that.state.OfflineTimesheets[i].data){
                              console.log(res.error)
                              console.log('SQLID - ' + sqlid)
                              var errors=[];
                              db.transaction(
                                (tx)=> {                                 
                                tx.executeSql(
                                  'UPDATE Timesheet set error_flag=?, error=? where uuid=?',['1', res.error, that.state.OfflineTimesheets[i].uuid],
                                  (tx, res) => {
                                    console.log('SQLLite Timesheet Update Results',res.rowsAffected);
                                    syncSwitch = 'on';
                                  }
                                )                                 
                              });
                          } else {
                             console.log('offline timesheet sync successful deleting in progress')
                              db.transaction(
                                (tx)=> {                               
                                tx.executeSql( 
                                  'delete from Timesheet where uuid=?',[that.state.OfflineTimesheets[i].uuid],
                                  (tx,res) => {           
                                    console.log('offline sync successful Timesheet uuid - ' + that.state.OfflineTimesheets[i].uuid)
                                      }
                                    )  
                                })                          
                          }
                        this.setState({ ActivityIndicator_Loading : false });
        
                    }).catch((error) =>
                    {
                        console.error(error);

                              error = '1';
        
                        this.setState({ ActivityIndicator_Loading : false});
                    })
                })

              }    

          // db.transaction(
          //     tx => {        
          //       tx.executeSql(
          //         'select * from Timesheet where error_flag="0"',[], (_, { rows }) =>console.log('Error Free Timesheets : ' + JSON.stringify(rows)))                                    

          //     })                         
           } else {
             syncSwitch = 'on'
           }                      
        }
        )             
      })

  }

NotificationsCount(){
         console.log('Notifications COUNT')
            db.transaction(
      tx => {        
        tx.executeSql( 
          'select * from Timesheet where error_flag="1"',[],
           (tx,res) => {  console.log('Timesheets error count - ' + res.rows.length)
            var temp = [];
            if(res.rows.length > 0){
              this.props.navigation.setParams({ Count: res.rows.length,
                                                username: this.props.navigation.state.params.username,
                                                email:this.props.navigation.state.params.email,
                                                baseURL:this.props.navigation.state.params.baseURL,
                                                userid:this.props.navigation.state.params.user_id,
                                                addPin:this.props.navigation.state.params.addPin  }); 
                  this.setState({
                          Count:res.rows.length,
                          username: this.props.navigation.state.params.username,
                          email:this.props.navigation.state.params.email,
                          baseURL:this.props.navigation.state.params.baseURL,
                          userid:this.props.navigation.state.params.user_id,
                          addPin:this.props.navigation.state.params.addPin
                      });
            } else {
              this.props.navigation.setParams({ Count: 0 }); 
                  this.setState({
                          Count:0,
                          username: this.props.navigation.state.params.username,
                          email:this.props.navigation.state.params.email,
                          baseURL:this.props.navigation.state.params.baseURL,
                          userid:this.props.navigation.state.params.user_id,
                          addPin:this.props.navigation.state.params.addPin
                      });              
            }                                 
                    
                }                          
        )
      })    
}  

createTimesheetsDBs(){
    
    //console.log('createTimesheetsDBs');     
//(_, { rows }) =>console.log(JSON.stringify(rows)),    
    if(this.state.isConnected == 'true') {
        //console.log('online')
    db.transaction(tx => {  
      // tx.executeSql(
      //   'DROP TABLE IF EXISTS settings', []
      // );           
      tx.executeSql(
        'DROP TABLE IF EXISTS Timesheets', []
      );    
      console.log('Timesheets Dropped')
      tx.executeSql(
        'DROP TABLE IF EXISTS jobs', []
      ); 
      console.log('jobs Dropped')

      tx.executeSql(
        'DROP TABLE IF EXISTS activity', []
      ); 
      console.log('activity Dropped')

      tx.executeSql(
        'DROP TABLE IF EXISTS otherJobs', []
      ); 
      tx.executeSql(
        'DROP TABLE IF EXISTS Timesheet', []
      ); 
      // tx.executeSql( 
      //     'select * from Timesheet',[],
      //      (tx,res) => {  
            
      //       if(res.rows.length == 0){
      //             tx.executeSql(
      //               'DROP TABLE IF EXISTS Timesheet', []
      //             ); 
      //              console.log('Timesheet Dropped')                  
      //       } else {
      //            console.log('Timesheets error count during drop - ' + res.rows.length) 
      //       }
      //       })

      tx.executeSql(
        'create table if not exists Timesheets (id integer primary key not null, job_list text, other_job_list text, activity_list text, show_total_hours text, show_units text, show_start_stop text, full_day text, half_day text, activity_default text)',[]
      );  
      tx.executeSql(
        'create table if not exists jobs (id integer primary key not null, jobid text, description text)',[]
      );
      tx.executeSql(
        'create table if not exists activity (id integer primary key not null, code text, activity text)',[]
      );
      tx.executeSql(
        'create table if not exists otherJobs (id integer primary key not null, jobid text, description text)',[]
      );          
      tx.executeSql(
        'create table if not exists Timesheet (id integer primary key not null, user_id text, date text, total_hours text, start_time text, end_time text, activity_code text, uuid text, session_id text, gps_lat text, gps_lng text, job_id text, units text, source text, comment text, error text, error_flag text, screen text, sh text, sm text, eh text, em text, unpaid text)',[]
      );                 
    });

this.getTimesheets()
this.getJobIds()
this.getOtherJobIds()  
this.getTimesheet();    
this.getActivity()                              
    }  else {   
    
            db.transaction(
      tx => {       
        tx.executeSql( 
          'select * from Timesheets',[],
           (tx,res) => {  console.log('Timesheets select count - ' + res.rows.length)
                if(res.rows.length > 0) {
                      this.setState({
                              Timesheets:res.rows.item(0),
                              activity:res.rows.item(0).activity_default,
                        });   
                  } else {
              alert('If you are logging in for first time make sure you login with internet') 
          }                        
        }
        )
      })

      //       db.transaction(
      // tx => {
      //   tx.executeSql( 
      //     'select * from Timesheet  where date = ?',[this.props.navigation.state.params.date],
      //      (tx,res) => {            
      //        var temp = [];
      //      if(res.rows.length > 0) {
      //         for(let i=0; i < res.rows.length; ++i){
      //            temp.push(res.rows.item(i));
      //            this.setState({
      //                    TimesheetDateSpecific:temp,
      //               });   
      //         }
              
      //      }                      
      //   }
      //   )             
      // })

            db.transaction(
      tx => {
        tx.executeSql( 
          'select * from jobs',[],
           (tx,res) => {      
             var temp = [];
           if(res.rows.length > 0) {
              for(let i=0; i < res.rows.length; ++i){
                 temp.push(res.rows.item(i));
                 this.setState({
                         Jobs:temp,
                    });   
              }
              
           }
      })
      })


            db.transaction(
      tx => {
        tx.executeSql( 
          'select * from otherJobs',[],
           (tx,res) => {      
             var temp = [];
           if(res.rows.length > 0) {
              for(let i=0; i < res.rows.length; ++i){
                 temp.push(res.rows.item(i));
                 this.setState({
                         OtherJobs:temp,
                    });   
              }
              
           }
      })
      })

            db.transaction(
      tx => {
        tx.executeSql( 
          'select * from activity',[],
           (tx,res) => {      
             var temp = [];
           if(res.rows.length > 0) {
              temp.push({code:0,activity:'Select an Activity'})             
              for(let i=0; i < res.rows.length; ++i){
                 temp.push(res.rows.item(i));
                 this.setState({
                         Activity:temp,
                         Form_Loading:false,
                    });   
              }
              
           }
      })
      })

      }

}

getTimesheets(){
  //console.log('entered getTimesheets()')

var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=system&act=app_settings';
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
  if(!result.error){
    console.log(result.data.timesheets);

            db.transaction(
      tx => {
           tx.executeSql('insert into Timesheets (job_list, other_job_list, activity_list, show_total_hours, show_units, show_start_stop, full_day, half_day,activity_default) values (?,?,?,?,?,?,?,?,?)',[result.data.timesheets.job_list, result.data.timesheets.other_job_list, result.data.timesheets.activity_list, result.data.timesheets.show_total_hours, result.data.timesheets.show_units, result.data.timesheets.show_start_stop,result.data.timesheets.full_day, result.data.timesheets.half_day, result.data.timesheets.activity_default],(tx, res) => { console.log('getTimesheets function select', res.rowsAffected) })
      }) 

   that.setState({ 
     Timesheets: result.data.timesheets,
     activity : result.data.timesheets.activity_default,
     Form_Loading:false,
   });         
  }
 }).catch(function (error) {
   console.log("-------- error ------- "+error);
   Alert.alert( 'Oops!!!', 'Sorry, Something went wrong. Click ok to login',
    [
      {text: 'Ok', onPress: () => this.props.navigation.push("PinLogin")},
    ],
    { cancelable: false }
  );
 });
}

getTimesheet(){
  //console.log('entered getTimesheet()')
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=timesheet&act=get&user_id='+this.props.navigation.state.params.user_id+'&date='+this.props.navigation.state.params.date;
//console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
  if(!result.error){
      var temp=[];
      var c = 0;
      console.log(result.data)
   for(let t of result.data){
          // if(t.job_code == 'API Testing'){
          //    t.job_code = 'API'
          // }
          if(t.start_time && t.end_time){
             temp[c] = {title:t.job_code+'     '+t.start_time_nice+' - '+t.end_time_nice+'                '+t.total_hours+'  '+t.num_units,date:t.timesheet_day,job_code:t.job_code,start_time:t.start_time,end_time:t.end_time,total_hours:t.total_hours,num_units:t.num_units,job_comment:t.job_comment,job_id:t.job_id,id:t.id}
          }else{
             temp[c] = {title:t.job_code+'                                               '+t.total_hours+'        '+t.num_units,date:t.timesheet_day,job_code:t.job_code,start_time:t.start_time,end_time:t.end_time,total_hours:t.total_hours,num_units:t.num_units,job_comment:t.job_comment,job_id:t.job_id,id:t.id}
          }
          that.setState({ 
            TimesheetDateSpecific: temp
          });          
          c++
        }             

    console.log('TimesheetDateSpecific - ' + that.state.TimesheetDateSpecific)
        console.log(that.state.TimesheetDateSpecific)

 
  }
 }).catch(function (error) {
   console.log("-------- error ------- "+error);
   Alert.alert( 'Oops!!!', 'Sorry, Something went wrong. Click ok to login',
    [
      {text: 'Ok', onPress: () => this.props.navigation.push("PinLogin")},
    ],
    { cancelable: false }
  );
 });
}

ModalGetTimesheet(){
  console.log('entered ModalGetTimesheet()')
var that = this;
//var date =  moment(this.state.date, 'YYYY-MM-DD');  
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=timesheet&act=get&user_id='+this.props.navigation.state.params.user_id+'&date='+this.state.date;
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
  if(!result.error){
      var temp=[];
      var table=[];
      var c = 0;
      console.log(result.data)
   for(let t of result.data){
        temp.push(t.job_code)
        if(t.start_time_nice && t.end_time_nice){  
           temp.push(t.start_time_nice+' - '+t.end_time_nice)
        }else{
           temp.push('')
        }   
        temp.push(t.total_hours)
        temp.push(t.id) 
        table.push(temp);
        temp=[]
        c++
        }      
          that.setState({ 
            TimesheetDateSpecific: result.data,
            tableDataOnline:table,
            ActivityIndicator_Loading : false,
            CountGetTimesheet : false,
          }); 
          console.log(result.data)
          console.log(that.state.TimesheetDateSpecific)  
          console.log(that.state.tableDataOnline)      
 
  }
 }).catch(function (error) {
   console.log("-------- error ------- "+error);
   Alert.alert( 'Oops!!!', 'Sorry, Something went wrong',
    [
      {text: 'Ok'},
    ],
    { cancelable: false }
  );
 });
}

getJobIds(){
  //console.log('entered getJobIds()')
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=jobs&act=assigned';
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
  if(!result.error){
  //  that.setState({ 
  //    Jobs: result.data,

  //  });
    console.log(that.state.Jobs);
      if(result.data.length > 0){  
             db.transaction(
      tx => {
                var c = 0;
                 tx.executeSql('insert into jobs (jobid, description) values ("","Select Job")')
                for (let r of result.data) {
                 tx.executeSql('insert into jobs (jobid, description) values (?,?)',[r.id, r.description])
                 c++;
                } 
        tx.executeSql( 
          'select * from jobs',[],
           (tx,res) => {   //console.log('getJobIds function select')          
             var temp = [];
             //console.log('res.rows.length getJobIds function - '+res.rows.length)
           if(res.rows.length > 0) {
              for(let i=0; i < res.rows.length; ++i){
                 temp.push(res.rows.item(i));
                 that.setState({
                         Jobs:temp,
                    });   
              }
              
           }
           console.log(that.state.Jobs)
           })                  
      }); 
    } else {
                       that.setState({
                         Jobs:null,
                    });
    }         
  }
 }).catch(function (error) {
   //console.log("-------- error ------- "+error);
   Alert.alert( 'Oops!!!', 'Sorry, Something went wrong. Click ok to login',
    [
      {text: 'Ok', onPress: () => this.props.navigation.push("PinLogin")},
    ],
    { cancelable: false }
  );
 });
}

getOtherJobIds(){
  //console.log('entered getOtherJobIds()')
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=jobs&act=unassigned';
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
  if(!result.error){
  //  that.setState({ 
  //    OtherJobs: result.data,

  //   });
   //console.log(result.data);
    if(result.data.length > 0){  
               db.transaction(
      tx => {
                var c = 0;
                 tx.executeSql('insert into otherJobs (jobid, description) values ("","Select any other Job")')
                for (let r of result.data) {
                 tx.executeSql('insert into otherJobs (jobid, description) values (?,?)',[r.id, r.description])
                 c++;
                } 
        tx.executeSql( 
          'select * from otherJobs',[],
           (tx,res) => {   //console.log('otherJobs function select')          
             var temp = [];
             //console.log('res.rows.length otherJobs function - '+res.rows.length)
           if(res.rows.length > 0) {
              for(let i=0; i < res.rows.length; ++i){
                 temp.push(res.rows.item(i));
                 that.setState({
                         OtherJobs:temp,
                    });   
              }
              
           }
           console.log(that.state.OtherJobs)
           })                  
      });  
    } else {
                       that.setState({
                         OtherJobs:null,
                    });
    }
  }
 }).catch(function (error) {
   //console.log("-------- error ------- "+error);
   Alert.alert( 'Oops!!!', 'Sorry, Something went wrong. Click ok to login',
    [
      {text: 'Ok', onPress: () => this.props.navigation.push("PinLogin")},
    ],
    { cancelable: false }
  );
 });
}

getActivity(){
  //console.log('entered getActivity()')
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=jobs&act=codes';
//console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
  if(!result.error){
   that.setState({ 
     Activity: result.data,

   });
  console.log(result.data);
               db.transaction(
      tx => {
        var c = 0;
        var code = '';
        var activity ='';
          // tx.executeSql('insert into activity (code, activity) values ("","Select Activity")')
          console.log('that.props.navigation.state.params.activity ----- '+that.props.navigation.state.params.activity)
      if(that.props.navigation.state.params.activity != ''){    
        for (let r of result.data) {
          if(r.code === that.props.navigation.state.params.activity){
            code = r.code;
            activity = r.activity;
            that.setState({aTitle:activity})
          }   
        }         
        tx.executeSql('insert into activity (code, activity) values (?,?)',[code, activity])
        for (let r of result.data) {
          if(r.code != that.props.navigation.state.params.activity){
             tx.executeSql('insert into activity (code, activity) values (?,?)',[r.code, r.activity])
             console.log(r.code)
              c++;
          }  
        }
      }else{
        for (let r of result.data) {
             tx.executeSql('insert into activity (code, activity) values (?,?)',[r.code, r.activity])
             console.log(r.code)
              c++;
        }        
      }  
        tx.executeSql(
          'select * from activity',[], (_, { rows }) =>console.log(JSON.stringify(rows)))  
        
            
                
      });    
  }
 }).catch(function (error) {
   //console.log("-------- error ------- "+error);
   Alert.alert( 'Oops!!!', 'Sorry, Something went wrong. Click ok to login',
    [
      {text: 'Ok', onPress: () => this.props.navigation.push("PinLogin")},
    ],
    { cancelable: false }
  );
 });
}


getNextStartTime(){
  console.log('entered getNextStartTime()')
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=timesheet&act=next_start_time&date='+this.props.navigation.state.params.date;
//console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
  if(!result.error){
    console.log(result.data)
    console.log('Hours - '+result.data.hs)
    console.log('Minutes - '+result.data.ms)
    if(result.data.h){
         that.setState({ 
          selectedStartHours: result.data.hs,
          selectedStartMinutes : result.data.ms,
          selectedStartTime: result.data.hs+':'+result.data.ms,
          selectedEndTime:'     ',
        });      
    } else {
         that.setState({ 
          selectedStartHours: '  ',
          selectedStartMinutes : '  ',
          selectedStartTime:'',
          selectedEndTime:'',
        });        
    }  
  }
 }).catch(function (error) {
   //console.log("-------- error ------- "+error);
  //alert("result:"+error)
 });
}

//functions to allow elements to capture data
getJobs(){
  if(this.state.Timesheets.job_list > 0 && this.state.Jobs.length > 1){
     if (Platform.OS === 'android') {    
     return (
    <Picker style={{width: '100%'}} 
      selectedValue={this.state.jobs}
      onValueChange={(itemValue, itemIndex) => this.pickJob(itemIndex)} >
      { this.state.Jobs.map((item, key)=>(
      <Picker.Item label={item.description} value={item.jobid} key={key} />)
      )}
    </Picker>      
     ) 
    } else {
     return (
        <View style={{flex:1}}>
          <Button style={{width:'100%'}} type='clear' title={this.state.jTitle} titleStyle={{color:'black'}} onPress={this.ModalJobs} />
        </View>  
     )     
    }      
  }
}      

getOtherJobs(){
  if(this.state.Timesheets.other_job_list > 0 && this.state.OtherJobs.length > 1){
     if (Platform.OS === 'android') {    
     return (
    <Picker style={{width: '100%'}}
      selectedValue={this.state.otherJobs}
      onValueChange={(itemValue, itemIndex) => this.pickOtherJob(itemIndex)} >
      { this.state.OtherJobs.map((item, key)=>(        
      <Picker.Item label={item.description} value={item.jobid} key={key} />)
      )}
    </Picker>    
     )
    } else {
     return (
        <View style={{flex:1}}>
          <Button style={{width:'100%'}} type='clear' title={this.state.ojTitle} titleStyle={{color:'black'}} onPress={this.ModalOJobs} />
        </View>  
     )    
    }      
  }
}       

getActivities(){
  if(this.state.Timesheets.activity_list > 0){
     if (Platform.OS === 'android') {
     return (
    <Picker style={{width: '100%'}}
      selectedValue={this.state.activity}
      onValueChange={(itemValue, itemIndex) => this.pickActivity(itemIndex)} >
      { this.state.Activity.map((item, key)=>(
      <Picker.Item label={item.activity} value={item.code} key={key} />)
      )}
    </Picker>
     )
    } else {
     return (
        <View style={{flex:1}}>
          <Button style={{width:'100%'}} type='clear' title={this.state.aTitle} titleStyle={{color:'black'}} onPress={this.ModalActivity} />
        </View>  
     )     
    }
  }
}             

pickJob(index){

 this.state.Jobs.map( (v,i)=>{
  if( index === i ){
    this.setState({
    jobs: this.state.Jobs[index].jobid,
    jTitle:this.state.Jobs[index].description,
   })
  }
 })

}

pickOtherJob(index){

 this.state.OtherJobs.map( (v,i)=>{
  if( index === i ){
    this.setState({
    otherJobs: this.state.OtherJobs[index].jobid,
    ojTitle:this.state.OtherJobs[index].description,
   })
  }
 })

}
pickActivity(index){

 this.state.Activity.map( (v,i)=>{
  if( index === i ){
    this.setState({
    activity: this.state.Activity[index].code,
    aTitle:this.state.Activity[index].activity,
   })
  }
 })

}

getStartStop(){
 
         const { selectedStartHours, selectedStartMinutes, selectedStartTime, selectedEndTime } = this.state;
     return (    
    <View style={{justifyContent:'center', alignItems:'center'}}>          
        <Text >
          Start Time (24hr format)
        </Text>
{this.state.displayOffline ? (
      <View style={{flexDirection:'row'}}>
       <View>
        <Button  
          icon={
              <Ionicons name="ios-clock" size={30} color='white'/>
              }       
          onPress={this.showDateTimePicker} 
          type="solid"
          buttonStyle={{alignSelf:'flex-end',justifyContent: 'space-between', backgroundColor: '#71BF44',width:'55%'}}    
          title={'   '+selectedStartTime+'      '}         
          />
       </View>
       <View style={{paddingLeft:5}}>   
        <Button        
          onPress={()=>this.setState({selectedStartHours:moment().format('HH'),selectedStartMinutes:moment().format('mm'),selectedStartTime:moment().format('HH')+':'+moment().format('mm')})}
          type="solid"
          buttonStyle={{backgroundColor: '#5bc0de',width:'55%', height:48}}    
          title={'Start'}         
          />
       </View>   
      </View>            

):
      <View style={{flexDirection:'row'}}>
       <View>
        <Button  
          icon={
              <Ionicons name="ios-clock" size={30} color='white'/>
              }       
          onPress={this.showDateTimePicker} 
          type="solid"
          buttonStyle={{alignSelf:'flex-end',justifyContent: 'space-between', backgroundColor: '#E8910C',width:'55%'}}    
          title={'   '+selectedStartTime+'      '}         
          />
       </View>
       <View style={{paddingLeft:5}}>   
        <Button        
          onPress={()=>this.setState({selectedStartHours:moment().format('HH'),selectedStartMinutes:moment().format('mm'),selectedStartTime:moment().format('HH')+':'+moment().format('mm')})} 
          type="solid"
          buttonStyle={{backgroundColor: '#5bc0de',width:'55%', height:48}}    
          title={'Start'}         
          />
       </View>   
      </View>          
}                    
              <DateTimePicker
                mode='time'
                is24Hour={false}
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this.handleDatePicked}
                onCancel={this.hideDateTimePicker} 
                />
                 
        <Text >
          End Time (24hr format)
        </Text> 

{this.state.displayOffline ? (
      <View style={{flexDirection:'row'}}>
       <View>  
        <Button  
          icon={
              <Ionicons name="ios-clock" size={30} color='white'/>
              }       
          onPress={this.showEndDateTimePicker} 
          type="solid"
          buttonStyle={{alignSelf:'flex-end',justifyContent: 'space-between', backgroundColor: '#71BF44',width:'55%'}}
   //       titleStyle={{fontSize:15}}    
          title={'   '+selectedEndTime+'      '}         
          />
       </View>
       <View style={{paddingLeft:5}}>   
        <Button        
          onPress={this.AddStopEntry} 
          type="solid"
          buttonStyle={{backgroundColor: '#d9534f',width:'55%', height:48}}    
          title={'Stop'}         
          />
       </View>   
      </View>            
):
      <View style={{flexDirection:'row'}}>
       <View> 
        <Button  
          icon={
              <Ionicons name="ios-clock" size={30} color='white'/>
              }       
          onPress={this.showEndDateTimePicker} 
          type="solid"
          buttonStyle={{alignSelf:'flex-end',justifyContent: 'space-between', backgroundColor: '#E8910C',width:'55%'}}    
          title={'   '+selectedEndTime+'      '}         
          />
       </View>
       <View style={{paddingLeft:5}}>   
        <Button        
          onPress={this.AddStopEntry} 
          type="solid"
          buttonStyle={{backgroundColor: '#d9534f',width:'55%', height:48}}    
          title={'Stop'}         
          />
       </View>   
      </View>           
}
        <DateTimePicker
          mode='time'
          is24Hour={false}
          isVisible={this.state.isEndDateTimePickerVisible}
          onConfirm={this.handleEndDatePicked}
          onCancel={this.hideEndDateTimePicker} 
          />           
   </View>     
     )
}       

getStartStopAndroid(){
 
         const { selectedStartHours, selectedStartMinutes, selectedStartTime, selectedEndTime } = this.state;
     return (    
    <View style={{justifyContent:'center', alignItems:'center'}}>          
        <Text >
          Start Time (24hr format)
        </Text>
{this.state.displayOffline ? (
      <View style={{flexDirection:'row'}}>
       <View>
        <Button  
          icon={
              <Ionicons name="ios-clock" size={30} color='white'/>
              }       
          onPress={() => { this.TimePicker.open();this.setState({button:'start'})}} 
          type="solid"
          buttonStyle={{alignSelf:'flex-end',justifyContent: 'space-between', backgroundColor: '#71BF44',width:'55%'}}    
          title={'   '+selectedStartTime+'      '}         
          />
       </View>
       <View style={{paddingLeft:5}}>   
        <Button        
          onPress={()=>this.setState({selectedStartHours:moment().format('HH'),selectedStartMinutes:moment().format('mm'),selectedStartTime:moment().format('HH')+':'+moment().format('mm')})}
          type="solid"
          buttonStyle={{backgroundColor: '#5bc0de',width:'55%', height:48}}    
          title={'Start'}         
          />
       </View>   
      </View>            

):
      <View style={{flexDirection:'row'}}>
       <View>
        <Button  
          icon={
              <Ionicons name="ios-clock" size={30} color='white'/>
              }       
          onPress={() => { this.TimePicker.open();this.setState({button:'start'})}} 
          type="solid"
          buttonStyle={{alignSelf:'flex-end',justifyContent: 'space-between', backgroundColor: '#E8910C',width:'55%'}}    
          title={'   '+selectedStartTime+'      '}         
          />
       </View>
       <View style={{paddingLeft:5}}>   
        <Button        
          onPress={()=>this.setState({selectedStartHours:moment().format('HH'),selectedStartMinutes:moment().format('mm'),selectedStartTime:moment().format('HH')+':'+moment().format('mm')})} 
          type="solid"
          buttonStyle={{backgroundColor: '#5bc0de',width:'55%', height:48}}    
          title={'Start'}         
          />
       </View>   
      </View>          
}                    
        <TimePicker
          ref={ref => {
            this.TimePicker = ref;
          }}
          onCancel={() => this.onCancel()}
          onConfirm={(hour, minute) => this.onConfirm(hour, minute)}
        />                                 
        <Text >
          End Time (24hr format)
        </Text> 

{this.state.displayOffline ? (
      <View style={{flexDirection:'row'}}>
       <View>  
        <Button  
          icon={
              <Ionicons name="ios-clock" size={30} color='white'/>
              }       
          onPress={() => { this.TimePicker.open();this.setState({button:'end'})}} 
          type="solid"
          buttonStyle={{alignSelf:'flex-end',justifyContent: 'space-between', backgroundColor: '#71BF44',width:'55%'}}
   //       titleStyle={{fontSize:15}}    
          title={'   '+selectedEndTime+'      '}         
          />
       </View>
       <View style={{paddingLeft:5}}>   
        <Button        
          onPress={this.AddStopEntry} 
          type="solid"
          buttonStyle={{backgroundColor: '#d9534f',width:'55%', height:48}}    
          title={'Stop'}         
          />
       </View>   
      </View>            
):
      <View style={{flexDirection:'row'}}>
       <View> 
        <Button  
          icon={
              <Ionicons name="ios-clock" size={30} color='white'/>
              }       
          onPress={() => { this.TimePicker.open();this.setState({button:'end'})}} 
          type="solid"
          buttonStyle={{alignSelf:'flex-end',justifyContent: 'space-between', backgroundColor: '#E8910C',width:'55%'}}    
          title={'   '+selectedEndTime+'      '}         
          />
       </View>
       <View style={{paddingLeft:5}}>   
        <Button        
          onPress={this.AddStopEntry} 
          type="solid"
          buttonStyle={{backgroundColor: '#d9534f',width:'55%', height:48}}    
          title={'Stop'}         
          />
       </View>   
      </View>           
}
           
   </View>     
     )
}

  onCancel() {
    this.TimePicker.close();
  }

    onConfirm(hour, minute) {
  //  this.setState({ STime: `${hour}:${minute}` });
      if(this.state.button === 'start'){
        this.setState({selectedStartHours: hour,
                      selectedStartMinutes: minute,
                      selectedStartTime:`${hour}:${minute}`})  
      }else{
          this.setState({selectedEndHours: hour,
                        selectedEndMinutes: minute,
                        selectedEndTime:`${hour}:${minute}`})     
      } 
        this.TimePicker.close();
  } 
 
  // onConfirmEnd(hour, minute) {
  // //  this.setState({ STime: `${hour}:${minute}` });
  //   this.setState({selectedEndHours: hour,
  //                  selectedEndMinutes: minute,
  //                  selectedEndTime:`${hour}:${minute}`})    
  //   this.TimePicker.close();
  // }
 

getHalfDay(){
  if(this.state.Timesheets.half_day > 0){
     return ( 
      <View  style={{width:'50%'}}>
        <Button
          title="half-day"
          onPress={this.HalfDay}
         type='outline'    
         titleStyle={{ color: 'black' }}   
         borderColor='black'  
         buttonStyle={{ borderColor: 'black' }}    
        />
      </View>  
     )
  }
}   
getDay(){
  if(this.state.Timesheets.full_day > 0){
     return (     
       <View  style={{width:'50%'}}>  
        <Button
          title="day"
          onPress={this.FullDay}
         type='outline' 
         titleStyle={{ color: 'black' }}    
         buttonStyle={{ borderColor: 'black' }}  
        />
       </View>
     )
  }
} 
getTotalHours(){
  if(this.state.Timesheets.show_total_hours > 0){
     
     return (   
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'black'
    }}
    keyboardType={'numeric'}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    label='Total Hours'
    placeholder="Total Hours"
    value={this.state.totalHours}
    onChangeText ={totalHours => this.setState({ totalHours })}
      />
     )
  }
}      

getUnits(){
  if(this.state.Timesheets.show_units > 0){
     return (  
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'black'
    }}
    keyboardType={'numeric'}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    label='Units'
    placeholder="Units"
    value={this.state.units}
    onChangeText ={units => this.setState({ units })}
      />
     )
  }
}     

  HalfDay = () => {
      this.setState({ totalHours: this.state.Timesheets.half_day });
  };

  FullDay = () => {
      this.setState({ totalHours: this.state.Timesheets.full_day });
  };

  EditTimesheet= () => {
    this.setState({ date: this.state.Timesheet.timesheet_day,
                    jobs: this.state.Timesheet.job_id,
                    activity: this.state.Timesheet.job_code,
                    startTime: this.state.Timesheet.start_time,
                    endTime: this.state.Timesheet.end_time,
                    totalHours: this.state.Timesheet.total_hours,
                    comments: this.state.Timesheet.job_comment,
                    units: this.state.Timesheet.num_units 
                  });
  }
//create table if not exists Timesheet (id integer primary key not null, user_id text, employee_code text, date text, total_hours text, start_time text, end_time text, activity_code text, uuid text, session_id text, gps_lat text, gps_lng text, job_id text, email text, baseURL text, source text)

AddStopEntry = () => {
  console.log('AddStopEntry')
  this.setState({selectedEndHours:moment().format('HH'),
                 selectedEndMinutes:moment().format('mm'),
                 selectedEndTime:moment().format('HH')+':'+moment().format('mm')}, () => {this.insert_timesheet()})
                
};

insert_timesheet(){
        //console.log('insert_timesheet this.state.isConnected - ' + this.state.isConnected)
   if(this.state.activity === ''){
      alert('Please select an activity')
   } else {  
     //   var formatedDate = moment(this.state.formatedDate).format("YYYY-MM-DD")   
        const data = uuid();
        //console.log(data); 
        var sTime = '';
        var eTime = '';
                 console.log('this.state.selectedStartHours'+this.state.selectedStartHours)
                 console.log('this.state.selectedStartMinutes'+this.state.selectedStartMinutes)
                 console.log('this.state.selectedStartTime'+this.state.selectedStartTime)
                 console.log('this.state.selectedEndHours'+this.state.selectedEndHours)
                 console.log('this.state.selectedEndMinutes'+this.state.selectedEndMinutes)
                 console.log('this.state.selectedEndTime'+this.state.selectedEndTime)         
        if(this.state.selectedEndHours > 0){
        sTime = this.state.selectedStartHours + ':' + this.state.selectedStartMinutes + ':00'
        eTime = this.state.selectedEndHours + ':' + this.state.selectedEndMinutes + ':00'  
        }
        var hours = this.state.totalHours;
        //var date =  moment(this.state.date).format("YYYY-MM-DD");        
         
         this.setState({ startTime : sTime,
              endTime : eTime,
              SH : this.state.selectedStartHours,
              SM : this.state.selectedStartMinutes,   
              EH : this.state.selectedEndHours, 
              EM : this.state.selectedEndMinutes }, () => {console.log('this.state.startTime - ' + this.state.startTime + '  this.state.endTime - ' + this.state.endTime + 'SH - ' + this.state.SH + ' SM - ' + this.state.SM + ' EH - '+ this.state.EH + ' EM - '+this.state.EM + 'date - ' + this.state.date);

        //console.log('Timesheet date - ' + this.state.date) 
        if(this.state.isConnected == 'true'){          
           this.insert_timsheetAPI()       
      } else {       
                        alert('Timesheet entry Added - OFFLINE MODE')        
               db.transaction(
      tx => {
                 tx.executeSql('insert into Timesheet (user_id, date, total_hours, start_time, end_time, activity_code, uuid, session_id, gps_lat, gps_lng, job_id, units, source, comment, error, error_flag, screen, sh, sm, eh, em, unpaid) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[this.state.userid, this.state.date, hours, this.state.startTime, this.state.endTime, this.state.activity, 'timesheet_'+data, '0', this.state.gps_lat, this.state.gps_lng, this.state.jobs, this.state.units, 'App', this.state.comments, ' ', '0', 'error adding timesheet entry', this.state.SH, this.state.SM, this.state.EH, this.state.EM, this.state.unpaid])
                    
      })
              var endhours = this.state.selectedEndHours;
              var endminutes = this.state.selectedEndMinutes;         
              this.setState({selectedStartHours:endhours,
                              selectedStartMinutes:endminutes,
                              selectedEndHours:'00',
                              selectedEndMinutes:'00',
                              selectedStartTime:endhours+':'+endminutes,
                              selectedEndTime:'',
                              totalHours:'',
                              comments:'',unpaid:''})        
      
}
});
   }
}
//'create table if not exists Timesheet (id integer primary key not null, user_id text, date text, total_hours text, start_time text, end_time text, activity_code text, uuid text, session_id text, gps_lat text, gps_lng text, job_id text, units text, source text, comment text)'
//function to insert fuel refund details into fuel_refund table
insert_timsheetAPI() {  
        const data = uuid();
        //console.log(data); 
        //var date =  moment(this.state.date).format("YYYY-MM-DD");        
        const timesheet_details = new FormData();
        timesheet_details.append('user_id', this.props.navigation.state.params.user_id);
        timesheet_details.append('date', this.state.date);
        timesheet_details.append('total_hours', this.state.totalHours);
        timesheet_details.append('start_time', this.state.startTime);
        timesheet_details.append('end_time', this.state.endTime);
        timesheet_details.append('activity_code', this.state.activity);
        timesheet_details.append('uuid', 'timesheet_'+data);
        timesheet_details.append('gps_lat', this.state.gps_lat);
        timesheet_details.append('gps_lng', this.state.gps_lng);
        timesheet_details.append('job_id', this.state.jobs);
        timesheet_details.append('units', this.state.units);
        timesheet_details.append('source', 'App');
        timesheet_details.append('comment', this.state.comments);
        timesheet_details.append('unpaid_time', this.state.unpaid);

        this.setState({ ActivityIndicator_Loading : true }, () =>
        { 
            //console.log(timesheet_details);
            //console.log(this.props.navigation.state.params.baseURL+'?ct=api&api=timsheet&act=add');
            fetch(this.props.navigation.state.params.baseURL+'?ct=api&api=timesheet&act=add',
            {
                method: 'POST',
                credentials: 'same-origin',
                 headers: 
                 {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
                 },
                body: timesheet_details
            }).then((response) => response.json()).then((res) =>
            {
                  //console.log(res)
                  if(!res.error){
                  var that=this;
                  var endhours = that.state.selectedEndHours;
                  var endminutes = that.state.selectedEndMinutes;                    
                    that.setState({comments:'',selectedStartHours:endhours,
                                   selectedStartMinutes:endminutes,
                                   selectedEndHours:'00',
                                   selectedEndMinutes:'00',
                                   selectedStartTime:endhours+':'+endminutes,
                                   selectedEndTime:'',                                   
                                   totalHours:'',
                                   unpaid:'',
                                 })    
                  alert('Timesheet Added Successfully');                                                  
                                                          

                  } else {
                    alert(res.error)
                  }    
                this.setState({ ActivityIndicator_Loading : false });
 
            }).catch((error) =>
            {
                console.error(error);
                
                this.setState({ ActivityIndicator_Loading : false});
            });
        });

  }

delete_timesheet(data){
  this.setState({ ActivityIndicator_Loading : true});
  console.log('entered delete_timesheet() - '+ data)
    var that = this;
    var date = moment().format("YYYY-MM-DD");
    var url = this.props.navigation.state.params.baseURL+'?ct=api&api=timesheet&act=delete&id='+data;
    console.log("-----------url:"+url);
    fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
        return response.json();
      }).then(function (result) {
        console.log(result)
      if(!result.error){
          alert('Timesheet Deleted')
        if(Platform.OS === 'ios'){
          that.setState({ ActivityIndicator_Loading : false})
        } else {
          that.setState({ ActivityIndicator_Loading : false, visibleModal:null})
        }  
      }
    }).catch(function (error) {
      console.log("-------- error ------- "+error);
    });
                        
}

  noInternet(){
  if(this.state.displayOffline === null){
  return(    
        <TouchableOpacity
      activeOpacity = { 0.5 } 
      style = { styles.TouchableOpacityStyle4 } 
      >               
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>Offline Mode</Text>
    </View>
     </TouchableOpacity> 

  )
  }
}

    HistoryModal = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.Mbutton}>
        <Text style={{color:'white'}}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  HistoryModalContent(){
    const element = (data, index) => (
      <TouchableOpacity style={{paddingLeft:10}} onPress={() => this.delete_timesheet(data)}>
        <View style={{paddingLeft:5,width: 58, height: 20, backgroundColor: 'red',  borderRadius: 2, paddingRight:5}}>
          <Text style={{textAlign: 'center', color: '#fff'}}>Delete</Text>
        </View>
      </TouchableOpacity>
    ); 
    if(this.state.CountGetTimesheet){     
     this.ModalGetTimesheet(); 
    } 
  {       
   return(
    <View style={styles.stage}> 
    <Text>Timesheet Added History (CLICK TO EDIT)</Text>   
   
  <Table borderStyle={{borderWidth: 2, borderColor: '#D0D0D0'}}>
    <Row data={this.state.tableHead} style={styles.headO} flexArr={[1,1,1,1]} textStyle={styles.text}/>
  </Table>  

  <View>
   
         <View>
            <ScrollView>             

              <Table>             
                {
                  this.state.tableDataOnline.map((rowData, index) =>(
                      <TouchableOpacity  onPress={() => this.EditOnlineTimesheet(index)}>                   
                        <TableWrapper key={index} style={{flexDirection: 'row', backgroundColor: 'white'}}>                     
                          {
                            rowData.map((cellData, cellIndex) => (
                              <Cell key={cellIndex} data={cellIndex === 3 ? element(cellData, index) : cellData} textStyle={{margin: 6 }}/>
                            ))
                          }
                        </TableWrapper>
                     </TouchableOpacity>
                   )) 
                }
              </Table>
             
            </ScrollView>
                                 
         </View>          
        {

        this.state.ActivityIndicator_Loading ? <View><ActivityIndicator color='#009688' size='large'style={styles.ActivityIndicatorStyle} /></View> : null
        
        }                   

      {this.HistoryModal('Close', () => this.setState({ visibleModal: null}))}
    </View>
   </View> 
   )
  }
}

    EditOnlineTimesheet(i){
const off = this.state.TimesheetDateSpecific;

this.props.navigation.push('EditTimesheet', {"date":moment(off[i].timesheet_day).format("dddd LL"),"jobs":off[i].job_id,"activity":off[i].job_code,"totalHours":off[i].total_hours,"comments":off[i].job_comment,"units":off[i].units,"email":this.props.navigation.state.params.email,"baseURL":this.props.navigation.state.params.baseURL,"user_id":this.props.navigation.state.params.user_id,'id':off[i].id,"error":null, "uuid":off[i].uuid, "startTime":off[i].start_time, "endTime":off[i].end_time,  "unpaid":off[i].unpaid,"addPin":this.props.navigation.state.params.addPin},this.setState({ visibleModal: null }))
 
  }

offlineDelete_timesheet(data){
  this.setState({ ActivityIndicator_Loading : true})
      var id = data;
      db.transaction(
      (tx)=> {                               
      tx.executeSql( 
        'delete from Timesheet where id=?',[id])})
        alert('Offline Timesheet Deleted!!!')
        if(Platform.OS === 'android'){
          this.setState({ ActivityIndicator_Loading : false,visibleModal:null})
        }else{
          this.setState({ ActivityIndicator_Loading : false})
        }
}

 OfflineHistoryModal(text, onPress){
   return(
    <View> 
    <TouchableOpacity onPress={onPress}>
      <View style={styles.OMbutton}>
        <Text style={{color:'white'}}>{text}</Text>
      </View>
    </TouchableOpacity>
    </View>
   )
 }

ModalOfflineGetTimesheet(){
      var that=this;
    //  var date =  moment(this.state.date).format("YYYY-MM-DD");        
        const table = [];
            db.transaction(
      tx => {
        tx.executeSql( 
          'select * from Timesheet  where date = ?',[this.state.date],
           (tx,res) => {            
             var temp = [];
             var edit = [];
             var c = 0;
           if(res.rows.length > 0) {
              for(let i=0; i < res.rows.length; ++i){               
                 temp.push(res.rows.item(i).activity_code)  
                 if(res.rows.item(i).total_hours === ""){
                    temp.push(res.rows.item(i).start_time+' - '+res.rows.item(i).end_time)
                    temp.push('')
                 } else {   
                    temp.push('')
                    temp.push(res.rows.item(i).total_hours)
                 }
                 temp.push(res.rows.item(i).id)                
                table.push(temp);
                temp=[];
                edit.push(res.rows.item(i))
                that.setState({OfflineDateSpecific:edit}) 
                c=i;
              }                
              that.setState({tableData:table,Offline_Loading:false,CountGetTimesheet:false})
           } else {      
               that.setState({tableData:[],Offline_Loading:false,CountGetTimesheet:false})  
           }
          
        }

        )     
      })      
}

  OfflineHistoryModalContent(){
    const element = (data, index) => (
      <TouchableOpacity style={{paddingLeft:10}} onPress={() => this.offlineDelete_timesheet(data)}>
        <View style={{paddingLeft:5,width: 58, height: 20, backgroundColor: 'red',  borderRadius: 2, paddingRight:5}}>
          <Text style={{textAlign: 'center', color: '#fff'}}>Delete</Text>
        </View>
      </TouchableOpacity>  )  
  if(this.state.CountGetTimesheet){  
    this.ModalOfflineGetTimesheet();
  }
  {       
   return(
    <View style={styles.stage}> 
    <Text>Timesheet Offline Added History (CLICK TO EDIT)</Text>   
   
  <Table borderStyle={{borderWidth: 2, borderColor: 'black'}}>
    <Row data={this.state.tableHead} style={styles.head} flexArr={[1,1,1,1]} textStyle={styles.text}/>
  </Table>  

  <View>
   
         <View>
            <ScrollView>             

              <Table>             
                {
                  this.state.tableData.map((rowData, index) =>(
                      <TouchableOpacity  onPress={() => this.EditOfflineTimesheet(index)}>                   
                        <TableWrapper key={index} style={{flexDirection: 'row', backgroundColor: 'white'}}>                     
                          {
                            rowData.map((cellData, cellIndex) => (
                              <Cell key={cellIndex} data={cellIndex === 3 ? element(cellData, index) : cellData} textStyle={{margin: 6 }}/>
                            ))
                          }
                        </TableWrapper>          
                      </TouchableOpacity> 
                   ))
                }                
              </Table>
            
            </ScrollView>
                    {

                    this.state.Offline_Loading ? <View><ActivityIndicator color='#009688' size='large'style={styles.ActivityIndicatorStyle} /></View> : null
                    
                    }                                  
         </View>          
                  
      {this.OfflineHistoryModal('Close', () => this.setState({ visibleModal: null}))} 

    </View>
   </View> 
   )
  }
}

    EditOfflineTimesheet(i){
const off = this.state.OfflineDateSpecific;

this.props.navigation.push('EditTimesheet', {"date":moment(off[i].date).format("dddd LL"),"jobs":off[i].job_id,"activity":off[i].activity_code,"totalHours":off[i].total_hours,"comments":off[i].job_comment,"units":off[i].units,"email":this.props.navigation.state.params.email,"baseURL":this.props.navigation.state.params.baseURL,"user_id":this.props.navigation.state.params.user_id,'id':off[i].id,"error":null, "uuid":off[i].uuid, "startTime":off[i].start_time, "endTime":off[i].end_time, "addPin":this.props.navigation.state.params.addPin, "SH":off[i].sh, "SM":off[i].sm, "EH":off[i].eh, "EM":off[i].em, "unpaid":off[i].unpaid},this.setState({ visibleModal: null }))    
 
  }

   ModalClock(text, onPress){
   return(
    <View> 
    <TouchableOpacity onPress={onPress}>
      <View style={styles.Cbutton}>
        <Text style={{color:'blue'}}>{text}</Text>
      </View>
    </TouchableOpacity>
    </View>
   )
 }

    ModalClockContent(){
      return(
     <View style={styles.stage}>   
      <View style={{alignItems:'center'}}>
       <Text style={{fontSize:20, fontWeight:'bold'}}> How clock works </Text>
       <Image 
        source={require('../assets/clock.gif')}  
        style={{width: 300, height: 300 }}
        />
     </View>
     {this.ModalClock('Close', () => this.setState({ visibleClockModal: null}))}
    </View>     
      )
    }

  ModalActivity = () => {
    if (this.state.modalIsVisible) {
      return;
    }

    this.setState({ modalIsVisible: true }, () => {
      Animated.timing(this.state.modalAnimatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  ModalActivityDone = () => {
    Animated.timing(this.state.modalAnimatedValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ modalIsVisible: false });
    });
  };

  ModalRenderActivities = () => {
    if (!this.state.modalIsVisible) {
      return null;
    }

    const { modalAnimatedValue } = this.state;
    const opacity = modalAnimatedValue;
    const translateY = modalAnimatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [300, 0],
    });

    return (
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents={this.state.modalIsVisible ? 'auto' : 'none'}>
        <TouchableWithoutFeedback onPress={this.ModalActivityDone}>
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
              <Button title="Done" buttonStyle={{backgroundColor:'#71BF44'}}  onPress={this.ModalActivityDone} />
            </View>
          </View>
            <Picker style={{width: WindowWidth, backgroundColor: '#e1e1e1'}}
            selectedValue={this.state.activity}
            onValueChange={(itemValue, itemIndex) => this.pickActivity(itemIndex)} >
            { this.state.Activity.map((item, key)=>(
            <Picker.Item label={item.activity} value={item.code} key={key} />)
            )}
          </Picker>
        </Animated.View>
      </View>
    );
  };    

    ModalJobs = () => {
    if (this.state.modalJobsIsVisible) {
      return;
    }

    this.setState({ modalJobsIsVisible: true }, () => {
      Animated.timing(this.state.modalJAnimatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

    ModalJobsDone = () => {
    Animated.timing(this.state.modalJAnimatedValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ modalJobsIsVisible: false });
    });
  };

  ModalRenderJobs = () => {
    if (!this.state.modalJobsIsVisible) {
      return null;
    }

    const { modalJAnimatedValue } = this.state;
    const opacity = modalJAnimatedValue;
    const translateY = modalJAnimatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [300, 0],
    });

    return (
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents={this.state.modalJobsIsVisible ? 'auto' : 'none'}>
        <TouchableWithoutFeedback onPress={this.ModalJobsDone}>
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
              <Button title="Done" buttonStyle={{backgroundColor:'#71BF44'}}  onPress={this.ModalJobsDone} />
            </View>
          </View>
          <Picker style={{width: WindowWidth, backgroundColor: '#e1e1e1'}}
            selectedValue={this.state.jobs}
            onValueChange={(itemValue, itemIndex) => this.pickJob(itemIndex)} >
            { this.state.Jobs.map((item, key)=>(
            <Picker.Item label={item.description} value={item.jobid} key={key} />)
            )}
          </Picker>            
        </Animated.View>
      </View>
    );
  }; 


    ModalOJobs = () => {
    if (this.state.modalOJobsIsVisible) {
      return;
    }

    this.setState({ modalOJobsIsVisible: true }, () => {
      Animated.timing(this.state.modalOJAnimatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

    ModalOJobsDone = () => {
    Animated.timing(this.state.modalOJAnimatedValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ modalOJobsIsVisible: false });
    });
  };

  ModalRenderOJobs = () => {
    if (!this.state.modalOJobsIsVisible) {
      return null;
    }

    const { modalOJAnimatedValue } = this.state;
    const opacity = modalOJAnimatedValue;
    const translateY = modalOJAnimatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [300, 0],
    });

    return (
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents={this.state.modalOJobsIsVisible ? 'auto' : 'none'}>
        <TouchableWithoutFeedback onPress={this.ModalOJobsDone}>
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
              <Button title="Done" buttonStyle={{backgroundColor:'#71BF44'}}  onPress={this.ModalOJobsDone} />
            </View>
          </View>
          <Picker style={{width: WindowWidth, backgroundColor: '#e1e1e1'}}
            selectedValue={this.state.otherJobs}
            onValueChange={(itemValue, itemIndex) => this.pickOtherJob(itemIndex)} >
            { this.state.OtherJobs.map((item, key)=>(        
            <Picker.Item label={item.description} value={item.jobid} key={key} />)
            )}
          </Picker>            
        </Animated.View>
      </View>
    );
  };

    render() {      
    const { selectedHours, selectedMinutes } = this.state;
    const {navigate} = this.props.navigation
    let { image } = this.state;
if(this.state.displayOffline === null){
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
           
        <View style={{paddingBottom:10,paddingTop:10}}>
          <Button
          title=" Back to Dashboard"
          type="solid"
          rounded='true'
          buttonStyle={{backgroundColor:"#71BF44"}}
          icon={
              <Ionicons name="ios-home" size={30} color='white' />
              }       
          onPress={ () =>this.props.navigation.push('Dashboard',{"count":this.state.Count,"username":this.state.username,"email":this.state.email,"baseURL":this.state.baseURL,"user_id":this.state.user_id, "addPin": this.state.addPin, "SH":this.state.selectedEndHours, 'SM':this.state.selectedEndMinutes}) }    
          />
      </View> 
       <View style={{backgroundColor: '#E8910C', height:40,justifyContent:'center',alignItems:'center',paddingBottom:10}}>    
         <Text style={styles.offlineText}>No Internet - No Access</Text>
       </View> 
        
      <Image
        source={require("../assets/nointernet.png")}
        style={{ width: 200, height: 200 }}
        resizeMode='contain'
        PlaceholderContent={<ActivityIndicator />}
      />  
      
  </View>
  </View>
  </View>
  )
}else{

        return (<View style={{
            flex: 1,
            flexDirection: 'column',
        }}> 
        <HeaderNavigationBar {...this.props} />        
            <View style={{
                flex: 1,
                backgroundColor: 'white',
                
            }}>

<ScrollView>
  <View style={styles.container} behavior="padding"> 
  <View>
    { this.noInternet() }
  </View> 
{this.state.displayOffline ?(
   <View>
      {this.HistoryModal('Click to view the added entries', () => this.setState({ visibleModal: 1,ActivityIndicator_Loading : true, CountGetTimesheet : true }))}  
        <Modal isVisible={this.state.visibleModal === 1}>
          {this.HistoryModalContent()}
        </Modal>   
    </View>    
):
   <View>
      {this.OfflineHistoryModal('Click to view offline added entries', () => this.setState({ visibleModal: 1, Offline_Loading : true, CountGetTimesheet : true}))}  
        <Modal isVisible={this.state.visibleModal === 1}>
          {this.OfflineHistoryModalContent()}
        </Modal>  
       
    </View>    
}    
<Text style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'black'
    }}> Add Timesheet Entry  </Text> 
     <View style={{flex:1}}>
      <DatePicker
        style={{width: 300, flex: 1, color: 'white', borderStyle:'solid'}}
        date={this.state.date}
        mode="date"
        placeholder="Timesheet Entry Date"
        format="dddd LL"
    //    minDate="January 1st Tuesday"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
          customStyles={{
          dateInput: {
            marginLeft: 0, color: 'black',
          }
        }}
        onDateChange={(date) => {this.setState({date: date,formatedDate:date})}}
      />
   </View>
  {this.state.Timesheets.job_list > 0 && this.state.Jobs && this.state.Jobs.length > 1 ?  (   
         <Text>Jobs</Text>
  ) : null}    
  {this.state.Timesheets.job_list > 0 && this.state.Jobs && this.state.Jobs.length > 1 ? (   
    <View style={styles.Dropdown}>
     { this.getJobs() }
   </View>  
  ) : null}
        <Modal isVisible={this.state.modalJobsIsVisible === true}>
         {this.ModalRenderJobs()} 
        </Modal> 
  
  {this.state.Timesheets.other_job_list > 0 && this.state.OtherJobs && this.state.OtherJobs.length > 1 ? (   
         <Text>Other Jobs</Text>
  ) : null}
  {this.state.Timesheets.other_job_list > 0 && this.state.OtherJobs && this.state.OtherJobs.length > 1 ? (   
    <View style={styles.Dropdown}>
     { this.getOtherJobs() }
   </View>  
  ) : null}
        <Modal isVisible={this.state.modalOJobsIsVisible === true}>
         {this.ModalRenderOJobs()} 
        </Modal>   

  {this.state.Activity && this.state.Activity.length ? (   
         <Text>Activity</Text>
  ) : null}

  {this.state.Activity && this.state.Activity.length ? (   
    <View style={styles.Dropdown}>
     { this.getActivities() }
    </View>
  ) : null}
        <Modal isVisible={this.state.modalIsVisible === true}>
         {this.ModalRenderActivities()} 
        </Modal>  

    <Text>Comment</Text>
    <View style={styles.textInput}>
    <TextInput
        style={styles.TextInputStyleClass}
        underlineColorAndroid="transparent"
        label='Comment'
        placeholder={"Comment"}
        numberOfLines={2}
        multiline={true}
        onChangeText ={comments => this.setState({ comments })}
      />
    </View>    
        {

        this.state.Form_Loading ? <ActivityIndicator color='#009688' size='large'style={styles.ActivityIndicatorStyle} /> : null
        
        } 

   {Platform.OS === 'ios' ? (           
   <View style={{ flex:1, justifyContent:'center',alignItems:'center', paddingBottom:5}}>

     { this.getStartStop() }
  
   </View>
   ):
   <View style={{ flex:1, justifyContent:'center',alignItems:'center', paddingBottom:5}}>

     { this.getStartStop() }
  
   </View>   
   }       

   <Text>Unpaid time (minutes)</Text>
    <View style={styles.textInput}>

     <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'black'
    }}
    keyboardType={'numeric'}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    label='Unpaid Time'
    placeholder="Unpaid Time in Minutes"
    value={this.state.unpaid}
    onChangeText ={unpaid => this.setState({ unpaid })}
      />
   </View> 

   <View style={{ flex:2, flexDirection: 'row', alignItems:'center',justifyContent: 'space-between', paddingBottom:20, paddingTop:10}}>
     { this.getHalfDay() }
     { this.getDay() }
   </View>  
                        
    <Text>Total Hours</Text>
    <View style={styles.textInput}>
     { this.getTotalHours() }
   </View> 

    <Text>Units</Text>
   <View style={styles.textInput}>
     { this.getUnits() }
   </View>                           
    
   <View>

                <TouchableOpacity 
                  activeOpacity = { 0.5 } 
                  style = { styles.TouchableOpacityStyle } 
                  onPress = { this.insert_timesheet }>

                    <Text style = { styles.TextStyle }>Add Entry</Text>

                </TouchableOpacity>

                {
        
                this.state.ActivityIndicator_Loading ? <ActivityIndicator color='#009688' size='large'style={styles.ActivityIndicatorStyle} /> : null
                
                }
      </View>            
  </View>
</ScrollView>
                
            </View>
        </View>);
    }
    }
}

const TimesheetEntryStackNavigator = createStackNavigator(  
    {  
        TimesheetEntryNavigator: TimesheetEntry  
    },  
    {  
        defaultNavigationOptions: ({ navigation }) => {  
        return {  
            headerLeft: (  
                <Ionicons style={{ paddingLeft: 10 }}  name="ios-menu" onPress={() => navigation.openDrawer()} size={30} color='white' 
                />  
                
            )  
        };  
        }  
    }  
); 

class MyHours extends Component {
  static navigationOptions = ({ navigation }) => {
    return{ 
         title: 'My Hours'          
    }};    
constructor(props) {
  super(props);
   this.getListCall= this.getListCall.bind(this);   
   this.handleMyHoursConnectivity = this.handleMyHoursConnectivity.bind(this);
   this.noInternet = this.noInternet.bind(this);
   this.createMyHoursDB = this.createMyHoursDB.bind(this);
   this.getMyHoursDown = this.getMyHoursDown.bind(this);
   this.onRefresh = this.onRefresh.bind(this);
   this.getItemLayout = this.getItemLayout.bind(this);
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
      CurrentDateIndex:'',
      CurrentDate:'',
      addPin:'',
      email:'',
      username:'',
      userid:'',
      baseURL:'', 
   }
}
componentDidMount(){
 //console.log('this.props.navigation.state.params.user_id  ---  '+ this.props.navigation.state.params.email )
   NetInfo.isConnected.addEventListener('connectionChange', this.handleMyHoursConnectivity);
    NetInfo.isConnected.fetch().done((isConnected) => {
 
      if(isConnected == true)
      {
        this.setState({isConnected : "true",
                      displayOffline : '0'})
        this.createMyHoursDB();                      
      }
      else
      {
        this.setState({isConnected : "false",
                      displayOffline : null})
        this.createMyHoursDB();                      
      }
        var date = moment().format("YYYY-MM-DD");
        var that = this;  
        that.setState({
              CurrentDate:date,
            });
                  that.setState({
                          username: this.props.navigation.state.params.username,
                          email:this.props.navigation.state.params.email,
                          baseURL:this.props.navigation.state.params.baseURL,
                          userid:this.props.navigation.state.params.user_id,
                          addPin:this.props.navigation.state.params.addPin,                               
                          Count:this.props.navigation.state.params.Count,
                      });                   
    });
  
}

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleMyHoursConnectivity);
  }

  handleMyHoursConnectivity = isConnected =>{
    if (isConnected == true) {
      this.setState({ isConnected : 'true',
                      displayOffline : '0'});
    } else {
      this.setState({ isConnected : 'false',
                      displayOffline : null});                      
    }
  }

  onRefresh = () => {
    this.setState({JSONResult:[],
                   refreshing:true});
    this.getMyHoursDown();

  }  

createMyHoursDB(){

    //console.log('create My Hours tables this.state.isConnected - ' + this.state.isConnected );     
    db.transaction(tx => {      
      // tx.executeSql(
      //   'DROP TABLE IF EXISTS settings', []
      // );       
      tx.executeSql(
        'create table if not exists myHours (id integer primary key not null, date text, date_nice text, hours text, colours text);'
      );
      // tx.executeSql(
      //   'DROP TABLE IF EXISTS login', []
      // );      
      // tx.executeSql(
      //   'create table if not exists login (id integer primary key not null, email text, password text, baseURL text, userid text, username text)',[]
      // );
    });
    if(this.state.isConnected == 'true') {
       this.getListCall()        
        
    } else {     
    
            db.transaction(
      tx => {
        tx.executeSql( 
          'select * from myHours',[],
           (tx,res) => {  console.log('myHours select count - ' + res.rows.length)
           var temp = [];
           //console.log('res.rows.length createmyhours function - '+res.rows.length)
           if(res.rows.length > 0) {
              this.setState({rowLength:res.rows.length})
              for(let i=0; i < res.rows.length; ++i){
                 temp.push(res.rows.item(i));
                 this.setState({
                         JSONResult:temp
                    });   
              }
              
           }                        
        }
        )
      });
    }
}

 //this.props.navigation.state.params.baseURL+'?ct=api&api=fuel_refund&act=put'
getListCall(){
  //console.log('getlistcall function')
var that = this;
var i = [];
var c = 1;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=timesheet&act=my_hours';
//console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
  if(!result.error){
    console.log(result.data.days)
   that.setState({ 
     JSONResult: result.data.days,
     rowLength : result.data.days.length,
     CurrentDate: result.data.top_date,
   }); 
   
  console.log(result.data)
                   that.setState({
                         topDate:result.data.start_date,
                         endDate:result.data.end_date,
                    }); 
            db.transaction(
      tx => {
                var c = 0;
                for (let r of result.data.days) {
                 tx.executeSql('insert into myHours (date, date_nice, hours, colours) values (?,?,?,?)',[r.date, r.date_nice,  r.hours, r.colours])
                 if(that.state.CurrentDate == r.date){
                    that.setState({CurrentDateIndex: c})
                 }
                 c++;

                } 
        // tx.executeSql( 
        //   'select * from myHours',[],
        //    (tx,res) => {   console.log('getListCall function select')          
        //      var temp = [];
        //      //console.log('res.rows.length getlistcall function - '+res.rows.length)
        //    if(res.rows.length > 0) {
        //       for(let i=0; i < res.rows.length; ++i){
        //          temp.push(res.rows.item(i));
        //          that.setState({
        //                  JSONResult:temp,
        //             });   
        //       }
        //    }
        //    console.log(that.state.JSONResult)
        //    })                  
      });                
  }
 }).catch(function (error) {
   //console.log("-------- error ------- "+error);
  alert("result:"+error)
 });
}

 //this.props.navigation.state.params.baseURL+'?ct=api&api=fuel_refund&act=put'
getMyHoursDown(){
  console.log('getMyHoursDown function')
      console.log('onRefresh function refreshing- '+this.state.refreshing)                   

var that = this;
var i = [];
var c = 1;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=timesheet&act=my_hours&d=down&date='+this.state.topDate;
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
  if(!result.error){

   that.setState({ 
    JSONResult: result.data.days,
    rowLength : result.data.days.length,
    topDate: result.data.start_date,
    CurrentDate: result.data.top_date,
    CurrentDateIndex:0,
    refreshing: false,
   }); 
 //  (_, { rows }) =>console.log(JSON.stringify(rows)),
 console.log(result.data)
 console.log(that.state.topDays)              
  }
 }).catch(function (error) {
   //console.log("-------- error ------- "+error);
  alert("result:"+error)
 });
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

noInternet(){
  if(this.state.displayOffline == null){
    this.state.itemCount ++;
  return(    
        <TouchableOpacity
      activeOpacity = { 0.5 } 
      style = { styles.TouchableOpacityStyle4 } 
      >               
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>Offline Mode</Text>
    </View>
     </TouchableOpacity>     
  )
                       
  }
}

render() {
        const {navigate} = this.props.navigation;
if(this.state.displayOffline === null){
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
           
        <View style={{paddingBottom:10,paddingTop:10}}>
          <Button
          title=" Back to Dashboard"
          type="solid"
          rounded='true'
          buttonStyle={{backgroundColor:"#71BF44"}}
          icon={
              <Ionicons name="ios-home" size={30} color='white' />
              }       
          onPress={ () =>this.props.navigation.push('Dashboard',{"count":this.state.Count,"username":this.state.username,"email":this.state.email,"baseURL":this.state.baseURL,"user_id":this.state.user_id, "addPin": this.state.addPin, "SH":this.state.selectedEndHours, 'SM':this.state.selectedEndMinutes}) }    
          />
      </View> 
       <View style={{backgroundColor: '#E8910C', height:40,justifyContent:'center',alignItems:'center',paddingBottom:10}}>    
         <Text style={styles.offlineText}>No Internet - No Access</Text>
       </View> 
        
      <Image
        source={require("../assets/nointernet.png")}
        style={{ width: 200, height: 200 }}
        resizeMode='contain'
        PlaceholderContent={<ActivityIndicator />}
      /> 
        
  </View>
  </View>
  </View>
  )
}else{

      return (<View style={{
            flex: 1,
            flexDirection: 'column',
        }}>
        <HeaderNavigationBar {...this.props} />         
                    <View style={{
                flex: 1,
                backgroundColor: 'white',
            }}>

  {this.state.refreshing ?  (  
        <View style={{paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
  ) : null}    

  <Table borderStyle={{borderWidth: 2, borderColor: 'white'}}>
    <Row data={this.state.tableHead} style={{backgroundColor:'white'}} textStyle={styles.text}/>
  </Table>       
    <FlatList
      data={ this.state.JSONResult }
      ItemSeparatorComponent = {this.ItemSeparatorLine}
      ref={(ref) => { this.flatListRef = ref; }}
      getItemLayout={this.getItemLayout}
      initialScrollIndex={this.state.CurrentDateIndex}
          renderItem={({item}) => { 
            if(item.date == this.state.CurrentDate){
              return(
              <TouchableOpacity activeOpacity={0.9} style={{backgroundColor: 'white'}} onPress={() => navigate('TimesheetEntry', {"date":moment(item.date).format("dddd LL"),"email":this.props.navigation.state.params.email,"baseURL":this.props.navigation.state.params.baseURL,"user_id":this.props.navigation.state.params.user_id,"userid":this.props.navigation.state.params.user_id,"addPin":this.props.navigation.state.params.addPin,'activity':this.props.navigation.state.params.activity})}>
                <View style={[styles.item,{backgroundColor:'#71BF44'}]}>
                 <View style={{ flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                padding: 10,
                                height:44,
                                width:'80%'}}>
                  <Text style={{color:'white',fontWeight:'bold'}}>{item.date_nice}</Text>
                 </View> 
                 <View style={{ flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                padding: 10,
                                height:44,
                                width:'80%'}}>                 
                  <Text style={{color:'white',fontWeight:'bold'}}>{item.hours}</Text>
                 </View> 
                </View> 
              </TouchableOpacity>
              )
          } else {
            if(item.hours === 0){
            return(
              <TouchableOpacity activeOpacity={0.9} style={{backgroundColor: 'white'}} onPress={() => navigate('TimesheetEntry', {"date":moment(item.date).format("dddd LL"),"email":this.props.navigation.state.params.email,"baseURL":this.props.navigation.state.params.baseURL,"user_id":this.props.navigation.state.params.user_id,"userid":this.props.navigation.state.params.user_id,'activity':this.props.navigation.state.params.activity})}>
                <View style={[styles.item,{backgroundColor:'white'}]}>
                 <View style={{ flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                padding: 10,
                                height:44,
                                width:'80%'}}>                
                  <Text style={{color:'#D0D0D0'}}>{item.date_nice}</Text>
                 </View> 
                 <View style={{ flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                padding: 10,
                                height:44,
                                width:'80%'}}>                    
                  <Text style={{color:'#D0D0D0'}}>{item.hours}</Text>
                 </View> 
                </View> 
              </TouchableOpacity>
            )
            }else{
            return(
              <TouchableOpacity activeOpacity={0.9} style={{backgroundColor: 'white'}} onPress={() => navigate('TimesheetEntry', {"date":moment(item.date).format("dddd LL"),"email":this.props.navigation.state.params.email,"baseURL":this.props.navigation.state.params.baseURL,"user_id":this.props.navigation.state.params.user_id,"userid":this.props.navigation.state.params.user_id,'activity':this.props.navigation.state.params.activity})}>
                <View style={[styles.item,{backgroundColor:'white'}]}>
                 <View style={{ flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                padding: 10,
                                height:44,
                                width:'80%'}}>                
                  <Text style={{color:'black'}}>{item.date_nice}</Text>
                 </View> 
                 <View style={{ flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                padding: 10,
                                height:44,
                                width:'80%'}}>                    
                  <Text style={{color:'black'}}>{item.hours}</Text>
                 </View> 
                </View> 
              </TouchableOpacity>
            )              
            }  
          }
          }            
        }
        keyExtractor={(item, index) => index}
          refreshControl={
            <RefreshControl
              //refresh control used for the Pull to Refresh
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }        
        />
    <TouchableOpacity onPress={() => navigate('TimesheetEntry', {"username":this.props.navigation.state.params.username,"email":this.props.navigation.state.params.email,"baseURL":this.props.navigation.state.params.baseURL,"date":moment(this.state.CurrentDate).format("dddd LL"),'activity':this.props.navigation.state.params.activity,"Count":this.state.Count})} style={styles.fab}>
      <Text style={styles.fabIcon}>+</Text>
    </TouchableOpacity>                
  </View>
    </View>

        
        );
}
    }

}


const MyHoursStackNavigator = createStackNavigator(  
    {  
        MyHoursNavigator: MyHours  
    },  
    {  
        defaultNavigationOptions: ({ navigation }) => {  
            return {  
                headerLeft: (  
                    <Ionicons style={{ paddingLeft: 10 }}  name="ios-menu" onPress={() => navigation.openDrawer()} size={30} 
                    />  
                )  
            };  
        }  
    }  
);

 class Logout extends Component {
    constructor(props) {
    super(props);
    this.state = {
      ActivityIndicator_Loading: false,
    };
}

    render() {
      const {navigate} = this.props.navigation;
        return (
           <View style={styles.containerLogoff} behavior="padding">
             <Image style={styles.logo} source={require("../assets/Agrismart-Logo.png")} resizeMode='contain'/>
           <View>
          <Text>Thank You for using Agrismart App</Text></View>
      <Button
        buttonStyle={{backgroundColor: '#71BF44'}}
        title="Click to Login"
        onPress={() => this.props.navigation.push('PinLogin')}
      />
        
      </View>
        )
    }

}

const LogoutStackNavigator = createStackNavigator(  
    {  
        LogoutNavigator: Logout  
    },  
    {  
        defaultNavigationOptions: ({ navigation }) => {  
            return {  
                headerLeft: (  
                    <Ionicons style={{ paddingLeft: 10 }}  name="ios-menu" onPress={() => navigation.openDrawer()} size={30} color='white' 
                    />  
                )  
            };  
        }  
    }  
);

const Timesheets = createDrawerNavigator(
  {
      MyHours:{
        screen:MyHours,
        navigationOptions: {
          headerMode: 'none',
          drawerLabel: 'My Hours',
          drawerIcon: ({ tintColor }) => { return (<Ionicons name="ios-hourglass" style={{ fontSize: 24 }} />) }    
        },     
      },     
      TimesheetEntry:{
        screen:TimesheetEntry,
        navigationOptions: {
          drawerLabel: 'Timesheet Entry',
          drawerIcon: ({ tintColor }) => { return (<Ionicons name="ios-calendar" style={{ fontSize: 24 }} />) }    
        },           
      },         
      Logout:{
        screen:Logout,
        navigationOptions: {
          drawerLabel: 'Logout',
          drawerIcon: ({ tintColor }) => { return (<MaterialCommunityIcons name="logout" style={{ fontSize: 24 }} />) } 
        }          
      },
  },
  {
    hideStatusBar: true,
    drawerBackgroundColor: 'white',
    overlayColor: '#71BF44',
    contentOptions: {
      activeTintColor: '#fff',
      activeBackgroundColor: '#71BF44',
        initialRouteName:'MyHours',
        title: 'My Hours',       
    },
  }
);

export default createAppContainer(Timesheets);
//export default Timesheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  containerLogoff: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 20,
  },  
textInput: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    borderWidth: 0.5,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 10,
    backgroundColor: 'white',
    color: 'black', 
    flex:1
  },
timepicker: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    borderWidth: 0.5,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 10,
    backgroundColor: 'white',
    color: 'black', 
    width: '80%',
  },  
Dropdown: {
    alignItems: 'center',
    borderRadius: 5,
    flexDirection: 'row',
    borderWidth: 0.5,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 5,
    backgroundColor: 'white',
    color: 'black', 
    flex:2,
    height:50
  },
    TextInputStyleClass:{
 
    textAlign: 'center',
    height: 50,
  //  borderWidth: 0.5,
    borderRadius: 10 ,
    backgroundColor : "White",
    flex:2,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 10,
    flexDirection: 'row',
    color: 'black' 
    },
 
    TouchableOpacityStyle:
   {
    alignItems: 'center',
    borderRadius: 15,
    height: 50,
    borderWidth: 1,
    paddingTop: 10,
      backgroundColor:'white',
      marginBottom: 10,
    width: 180,
    color: 'black',
    },
 
    TextStyle:
    {
        textAlign: 'center',
        fontSize: 18,
        color: 'black', 
    },

    ActivityIndicatorStyle:{
      
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
    
  },
  FlatListItemStyle1: {   
    alignItems: 'flex-start',
    paddingLeft: 0,
    fontSize: 18,
    height: 44,
    color:'#d0d0d0',
  },  
  FlatListItemStyle2: {   
    alignItems: 'flex-end',
    paddingLeft: 90,
    fontSize: 18,
    height: 44,
    color:'#d0d0d0',
  },
  TimesheetItem1: {   
//    alignItems: 'center',
    paddingLeft: 0,
    fontSize: 18,
    height: 44,
    color:'#d0d0d0',
  },  
  TimesheetItem2: {   
//    alignItems: 'center',
    paddingLeft: 10,
    fontSize: 18,
    height: 44,
    color:'#d0d0d0',
  },  
  TimesheetItem3: {   
 //   alignItems: 'center',
    paddingLeft: 10,
    fontSize: 18,
    height: 44,
    color:'#d0d0d0',
  },  
  TimesheetItem4: {   
//    alignItems: 'center',
    paddingLeft: 10,
    fontSize: 18,
    height: 44,
    color:'#d0d0d0',
  },  
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#71BF44',
    borderRadius: 30,
    elevation: 8
  },
  fabIcon: {
    fontSize: 40,
    color: 'white'
  },

  item: {
    backgroundColor: 'white',
    flexDirection: 'row',
    flex: 1,
    padding: 10,
// approximate a square
  },
    head: { height: 40, backgroundColor: '#E8910C' },
    headO: { height: 40, backgroundColor: '#71BF44'},
  text: { margin: 6 },
    offlineContainer: {
    backgroundColor: '#E8910C',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
    position: 'absolute',
    top: 0,
    bottom:50,
    flexWrap: 'wrap',  
  },
  offlineText: { color: '#fff' },
modalContent: {
backgroundColor: 'white',
padding: 22,
justifyContent: 'center',
alignItems: 'center',
borderRadius: 4,
borderColor: 'rgba(0, 0, 0, 0.1)',
},
  Mbutton: {
    backgroundColor: '#71BF44',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'black',
  },
  OMbutton: {
    backgroundColor: '#E8910C',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'black',
  }, 
  Cbutton: {
    backgroundColor: 'white',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'black',
    height:5
  },     
    stage: {
    backgroundColor: "#EFEFF4",
    paddingBottom: 20,
  //  flex: 1
  },
    TouchableOpacityStyle4:
   {
      paddingTop:10,
      paddingBottom:10,
      backgroundColor:'red',
      marginBottom: 20,
      width: '50%',
    justifyContent: 'center',
    alignItems: 'center',      
 
    },   
    menuIcon:{zIndex:9,position:'absolute',top:40,left:20}
});