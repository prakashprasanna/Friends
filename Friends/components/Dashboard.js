import * as React from 'react';
import { Alert, AlertIOS, Text, View, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, NetInfo, TouchableHighlight, RefreshControl, TextInput, ActivityIndicator, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Octicons} from '@expo/vector-icons';
import { Constants} from 'expo';
import { SQLite } from 'expo-sqlite';
import FuelRefund from './FuelRefund';
import LoginUser from './LoginUser';
import Logout from './TimesheetEntry';
import TimesheetEntry from './TimesheetEntry';
import MyHours from './TimesheetEntry';
//import Timesheet from './TimesheetEntry';
import Rosters from './Rosters';
const { width } = Dimensions.get('window');
import moment from 'moment'; 
import {Ionicons}  from '@expo/vector-icons';
import {MaterialIcons} from '@expo/vector-icons';
import {SimpleLineIcons} from '@expo/vector-icons';
import IconBadge from 'react-native-icon-badge';
import NotificationsImage from './NotificationsImage';
import Notifications from './Notifications';
import { Header, Button, Badge } from 'react-native-elements';
import { BottomNavigation } from 'react-native-paper';
const db = SQLite.openDatabase('db.db');
const ICON_SIZE = 30;
const FONT_SIZE = 18;
import FloatingTimesheet from './FloatingTimesheet';
import Modal from 'react-native-modal';
import PinLogin from './PinLogin';
import Settings from './Settings';
import Tasks from './Tasks';
import Payslips from './Payslips';

const NotificationsRoute = () => <Text>Notifications</Text>;

export default class Dashboard extends React.Component {  

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return{
title: "Dashboard",
headerTintColor: 'white',
headerStyle: {
backgroundColor: "#71BF44"
},
headerRight: (
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
    onPress={() => navigation.push('Notifications',{"count":0,"username":params.username,"email":params.email,"baseURL":params.baseURL,"user_id":params.user_id,"addPin":params.addPin})}
  />
),
};
};    
constructor(props) {
  super(props);
   this.getDashboard= this.getDashboard.bind(this);   
   this.getTimesheets= this.getTimesheets.bind(this);   
   this.getRosters= this.getRosters.bind(this);   
   this.createSettingsDB = this.createSettingsDB.bind(this);
   this.offlineDashboard = this.offlineDashboard.bind(this);
   this.offlineLogin = this.offlineLogin.bind(this);
   this.getLoginParams = this.getLoginParams.bind(this);
   this.handleConnectivityChange = this.handleConnectivityChange.bind(this);
   this.getHS = this.getHS.bind(this);
   this.getFuelRefund = this.getFuelRefund.bind(this);
   this.noInternet = this.noInternet.bind(this);
   this.NotificationsCount = this.NotificationsCount.bind(this);
   this.getNextStartTime = this.getNextStartTime.bind(this);
   this.PinModal = this.PinModal.bind(this);
   this.PinModalContent = this.PinModalContent.bind(this);   
   this.PinUpdate = this.PinUpdate.bind(this);  
   this.offlineSync = this.offlineSync.bind(this);
   this.settings = this.settings.bind(this);
   this.getTasks = this.getTasks.bind(this)
   this.getPayslips = this.getPayslips.bind(this)
   this.getConfirmHours = this.getConfirmHours.bind(this)   
   this.state = { 
    JSONResult: "",
    isConnected: '',
    email:'',
    username:'',
    userid:'',
    baseURL:'',
    Timesheets:'',
    Rosters:'',
    HS:'',
    Frefund:'',
    Mhours:'',
    displayOffline: '0',
    firstLogin: 'false',
    date:'',
    Count:0,
    refreshing:false,
    activity:'',
    SH:'00',
    SM:'00',
    visibleModal: 1,
    pin:null,
    addPin:null,
    OfflineTimesheets:[],
    AlertCount:0,
    ActivityIndicator_Loading:true,
    password:'',
    firstName:'',
    lastName:'',
    Tasks:'',
    TaskD:[],
    Payslips:'',
    formatedDate:'',
   }
}

  _handleIndexChange = index => this.setState({ index });

  _renderScene = BottomNavigation.SceneMap({
    notifications: NotificationsRoute,
  });

componentDidMount(){
    this.getNextStartTime();
      console.log('back to dashboard')
     this.NotificationsCount();    
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    NetInfo.isConnected.fetch().done((isConnected) => {
 
      if(isConnected == true)
      {
        this.setState({isConnected : "true",
                      displayOffline : '0'})
        this.createSettingsDB();   
        this.offlineSync();                             
      }
      else
      {
        this.setState({isConnected : "false",
                      displayOffline : null})
        this.createSettingsDB();                     
      }
 
    });  
      console.log('isConnected DidMount - ' + this.state.isConnected)
    var date = moment().format("YYYY-MM-DD");
    var formatedDate = moment().format("dddd LL");
    var that = this;  
    that.setState({
          //Setting the value of the date time
          date:
            date,
          formatedDate:formatedDate,  
          visibleModal : 1,  
          username: this.props.navigation.state.params.username,
          email:this.props.navigation.state.params.email,
          baseURL:this.props.navigation.state.params.baseURL,
          userid:this.props.navigation.state.params.user_id,
          addPin:this.props.navigation.state.params.addPin,
          SH:this.props.navigation.state.params.SH,
          SM:this.props.navigation.state.params.SM,
          password:this.props.navigation.state.params.password,
        }); 
    console.log('this.props.navigation.state.params.addPin - '+this.props.navigation.state.params.addPin)  
    console.log('username - '+ this.props.navigation.state.params.username)
    console.log('email - '+this.props.navigation.state.params.email)
    console.log('baseURL - '+this.props.navigation.state.params.baseURL)
    console.log('userid - '+this.props.navigation.state.params.user_id)
    console.log('addPin - '+this.props.navigation.state.params.addPin)      
}

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = isConnected =>{
    if (isConnected == true) {
      this.setState({ isConnected : 'true',
                      displayOffline : '0'});
    } else {
      this.setState({ isConnected : 'false',
                      displayOffline : null});                      
    }
  } 

getNextStartTime(){
  console.log('entered getNextStartTime()')
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=timesheet&act=next_start_time&date='+this.state.date;
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
  if(!result.error){
   if(result.data.hs){ 
      that.setState({ 
       SH: result.data.hs,
       SM : result.data.ms,
      });
   }       
   console.log('getNextStartTime OUTPUT')
   console.log('SH - '+that.state.SH)
   console.log('SM - '+that.state.SM)
  }
 }).catch(function (error) {
   //console.log("-------- error ------- "+error);
//  alert("result:"+error)
 });
}

   PinModal = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.Mbutton}>
        <Text style={{color:'white'}}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  PinModalContent = () => (
    <View style={styles.stage}>
      <View style={{justifyContent:'center',alignItems:'center', paddingBottom:30}}>
       <Text style={{fontSize:15,fontWeight:'bold'}}>Add Pin for future logins</Text>
       <Text >4 digits only!!!</Text>
      </View> 
      <View style={{justifyContent:'center',alignItems:'center', paddingBottom:10}}>      
        <View style={styles.textInput}>
          <TextInput
              style={{
          fontSize: 25,      height: 50,
          width: '20%',
//          flex: 1,
          color: 'black'
        }}
        keyboardType={'numeric'}
        maxLength={4}
        secureTextEntry={true}
        autoCorrect={false}
        spellCheck={false}
        underlineColorAndroid='transparent'
        placeholder="Enter PIN"
        placeholderTextColor='#D0D0D0'
        onChangeText ={pin => this.setState({ pin})}
          />
        </View>     
          <View style={{ marginTop: 25 }}>
            <Button 
              title="Add PIN"
              onPress={this.PinUpdate}
              buttonStyle={{backgroundColor:"#71BF44"}}
              rounded='true'
            />            
          </View>
        </View> 
       {this.PinModal('Add Later', () => this.setState({ visibleModal: null }))}        
    </View>

  );  

NotificationsCount(){
        var count = null;
         console.log('Notifications COUNT')
            db.transaction(
      tx => {        
        tx.executeSql( 
          'select * from Notifications where error_flag="1"',[],
           (tx,res) => {  console.log('Notifications error count - ' + res.rows.length)
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
                          addPin:this.props.navigation.state.params.addPin
                      });  
                      count = res.rows.length;                  
            } else {
              this.props.navigation.setParams({ Count: res.rows.length,
                                                addPin:this.props.navigation.state.params.addPin  }); 
                  this.setState({
                          Count:0,
                          addPin:this.props.navigation.state.params.addPin 
                      });   
                   count = 0;              
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
      if(count == null){
          this.setState({
                  Count:0,
              });         
      }
}

PinUpdate() {  
        const pin_detail = new FormData();
        pin_detail.append('pin', this.state.pin);
        this.setState({ ActivityIndicator_Loading : true }, () =>
        { 
            console.log(pin_detail);
            //console.log(this.props.navigation.state.params.baseURL+'?ct=api&api=timsheet&act=add');
            fetch(this.props.navigation.state.params.baseURL+'?ct=api&api=users&act=update_details',
            {
                method: 'POST',
                credentials: 'same-origin',
                 headers: 
                 {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
                 },
                body: pin_detail
            }).then((response) => response.json()).then((res) =>
            {
                  //console.log(res)
                  if(!res.error){
                    var that = this;
                    that.setState({ addPin:that.state.pin, ActivityIndicator_Loading : false})
                        db.transaction(
                  tx => {
                                    
                      tx.executeSql(
                        'UPDATE login set pin=? where id=1',[that.state.pin],
                        (tx, res) => {
                          console.log('SQLLite login details row updated Dashboard',res.rowsAffected);
                          }
                       )
                     })  
                     if(Platform.OS === 'android'){
                            Alert.alert( 'Pin Added!!!', 'Click ok to re-login using your pin',
                          [
                            {text: 'Ok', onPress: () => that.props.navigation.push("PinLogin")},
                          ],
                          { cancelable: false }
                        );              
                     }   
                  } else {
                    alert(res.error)
                  }                
 
            }).catch((error) =>
            {
                console.error(error);
                
                this.setState({ ActivityIndicator_Loading : false});
            });
        });
  }

  offlineSync(){
     console.log('offline sync in progress')
    var syncSwitch = 'off';
    var error = '';
    var e = [];
    db.transaction(
      tx => {
        // tx.executeSql(
        //   'select * from Timesheet where error_flag="0"',[], (_, { rows }) =>console.log('offline sync Timesheet Select - ' + JSON.stringify(rows)))    
        // tx.executeSql(
        //   'select * from notifications where error_flag="1"',[], (_, { rows }) =>console.log('offline sync notifications Select - ' + JSON.stringify(rows)))                
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
                 console.log(res.rows.item(i)); 
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
                              var error=res.error
                              console.log(error)
                              console.log('SQLID - ' + sqlid)
                              var errors=[];
                              db.transaction(
                                (tx)=> {                                 
        tx.executeSql( 
          'select * from notifications  where uuid = ?',[that.state.OfflineTimesheets[i].uuid],
           (tx,res) => {  console.log('notifications UUID select count - ' + res.rows.length)
                if(res.rows.length === 0) {
                                tx.executeSql(
                                  'insert into notifications (user_id, date, total_hours, start_time, end_time, activity_code, uuid, session_id, gps_lat, gps_lng, job_id, units, source, comment, error, error_flag, screen, sh, sm, eh, em) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[user_id, temp[i].date, temp[i].total_hours, temp[i].start_time, temp[i].end_time, temp[i].activity_code, that.state.OfflineTimesheets[i].uuid, '0', temp[i].gps_lat, temp[i].gps_lng, temp[i].job_id, temp[i].units, 'App', temp[i].comment, error, '1', 'error adding timesheet entry', temp[i].sh, temp[i].sm, temp[i].eh, temp[i].em],
                                  (tx, res) => {
                                    console.log('SQLLite Notifications added Results',res.rowsAffected);
                                    syncSwitch = 'on';
                                  }
                                )
                        if(that.state.AlertCount === 0){
                               Alert.alert( 'Offline-Mode update error', 'Please visit Notifications screen',
                                [
                                  {text: 'Ok', onPress: () => this.props.navigation.push("Notifications",{"username":this.state.username,"email":this.state.email,"baseURL":this.state.baseURL,"user_id":this.state.userid, 'addPin':this.state.addPin})},
                                ],
                                { cancelable: false }
                              ); 
                              that.setState({AlertCount : 1})
                        }                                            
                            }   
                            
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
                        alert(error)

                   //           error = '1';
        
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

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.NotificationsCount().then(() => {
      this.setState({refreshing: false});
    });    
 //   this.props.navigation.setParams({ Count: 0 }); 
  }

createSettingsDB(){
   console.log('entered createSettingsDB  ' + this.state.isConnected )
    this.getLoginParams();
}

getLoginParams(){

    console.log('create settings & login tables');     
    if(this.state.isConnected == 'true') {

    db.transaction(tx => {  
              // tx.executeSql(
              //   'DROP TABLE IF EXISTS notifications', []
              // );           
              tx.executeSql(
                'DROP TABLE IF EXISTS settings', []
              );       
              console.log('settings dropped')
              tx.executeSql(
                'create table if not exists settings (id integer primary key not null, name text, value text);'
              );
              tx.executeSql(
                'DROP TABLE IF EXISTS login', []
              );      
              console.log('login dropped')

              tx.executeSql(
                'create table if not exists login (id integer primary key not null, email text, baseURL text, userid text, username text, pin text, firstname text, lastname text)',[]
              );
      tx.executeSql(
        'create table if not exists notifications (id integer primary key not null, user_id text, date text, total_hours text, start_time text, end_time text, activity_code text, uuid text, session_id text, gps_lat text, gps_lng text, job_id text, units text, source text, comment text, error text, error_flag text, screen text, sh text, sm text, eh text, em text)',[]
      );                
            });      

            db.transaction(
      tx => {
        tx.executeSql(
          'select * from login',[],
          //  (tx,res) => {  },
           (tx,res) => { console.log('login select count - ' + res.rows.length)
                 console.log('online')
                 tx.executeSql('delete from login', [])
                 tx.executeSql('insert into login (email, baseURL, userid, username, pin, firstname, lastname) values (?,?,?,?,?,?,?)',[this.props.navigation.state.params.email, this.props.navigation.state.params.baseURL, this.props.navigation.state.params.user_id, this.props.navigation.state.params.username,'','',''],(tx, res) => { console.log('Login details inserted Rows', res.rowsAffected) })                 
                                      
        }
        )      
      });  
    }     
    
            db.transaction(
      tx => {
        tx.executeSql( 
          'select * from login',[],
           (tx,res) => {  console.log('login select count - ' + res.rows.length)
           if(res.rows.length > 0) {
              console.log('this.offlineLogin')
              this.offlineLogin();
           }  else {
              alert('If you are logging in for first time make sure you login with internet') 
          }                        
        }
        )
      });


}

// (_, { rows }) =>
//           console.log(JSON.stringify(rows)),

offlineLogin(){
   console.log('offlineLogin para')
    db.transaction(
      tx => { 
        tx.executeSql('select * from login', [], 
                (tx, results) => {
          var len = results.rows.length;
          console.log('len ' + len )
          console.log('  baseURL  ' + results.rows.item(0).baseURL)
          if(len > 0){
            this.setState({
             email:results.rows.item(0).email,
             userid:results.rows.item(0).userid,
             baseURL:results.rows.item(0).baseURL,
             username:results.rows.item(0).username,
            });
          this.getDashboard();  
           } else {
            alert('If you are logging in for first time make sure you login with internet')
           }
           },
          (tx, error) => {
            alert('If you are logging in for first time make sure you login with internet')
          },
        );  
            
      }
            )      

}

offlineDashboard(){
  var that = this;
      db.transaction(
      tx => { 
        tx.executeSql('select * from settings', [], 
                (tx, results) => {
          var len = results.rows.length;
              console.log('settings len  ' + len)
          if(len > 0){
            var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
               temp.push(results.rows.item(i));
                if(temp[i].name == 'timesheets'){
                    that.setState({
                         Timesheets:temp[i].value
                    });   
                }    
                if(temp[i].name == 'rosters'){
                    that.setState({
                         Rosters:temp[i].value
                    });   
                }
                if(temp[i].name == 'fuel_refund'){
                    that.setState({
                         Frefund:temp[i].value
                    });   
                }
                if(temp[i].name == 'my_hours'){
                    that.setState({
                         Mhours:temp[i].value
                    });   
                }
                if(temp[i].name == 'tasks'){
                    that.setState({
                         Tasks:temp[i].value
                    });   
                }        
                if(temp[i].name == 'payslips'){
                    that.setState({
                         Payslips:temp[i].value
                    });   
                }                        
                if(temp[i].name == 'hs'){
                    that.setState({
                         HS:temp[i].value,
                         ActivityIndicator_Loading:false
                    });   
                }
          }    
                    console.log('that.state.timesheets  ' + that.state.Timesheets )      
                    console.log('that.state.rosters  ' + that.state.Rosters ) 
                    console.log('that.state.fuelrefund  ' + that.state.Frefund ) 
                    console.log('that.state.myhours  ' + that.state.Mhours ) 
                    console.log('that.state.HS  ' + that.state.HS )   
                    console.log('that.state.Tasks  ' + that.state.Tasks )                                                                                                       
            } else {
            alert('If you are logging in for first time make sure you login with internet')
           }
           }
        );  
            
      }
            )
}

getDashboard(){
var that = this;
var url = this.state.baseURL+'?ct=api&api=system&act=app_settings';
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
  if(!result.error){
    console.log(result.data)
    that.setState({DashboardS: result.data.dashboard,
                  TaskD:result.data.tasks})
    that.setState.activity = result.data.timesheets.activity_default;
    if(result.data.user){
       that.setState({pin:result.data.user.pin,
                      firstName:result.data.user.firstname,
                      lastName:result.data.user.lastname,
                      userid:result.data.user.id,
                      activity:result.data.timesheets.activity_default,
                      ActivityIndicator_Loading:false, })
    } else {
      that.setState({visibleModal:null})
    }  
    console.log('Payslips Indicator '+result.data.dashboard.payslips)
    if(that.state.isConnected == 'true') {
            db.transaction(
      tx => {
        tx.executeSql(
          'select * from settings',[],
           (tx,res) => {  
            tx.executeSql('delete from settings', [])          
           })
           })
      } else {
                  that.offlineDashboard();            
      }         
                db.transaction(
          tx => {
            if(result.data.user){                  
              tx.executeSql(
                'UPDATE login set pin=?, firstname=?, lastname=?, userid=? where id=1',[result.data.user.pin, result.data.user.firstname, result.data.user.lastname, result.data.user.id],
                (tx, res) => {
                  console.log('SQLLite login details row updated',res.rowsAffected);
                }
              ) 
            }                                     
              tx.executeSql('insert into settings (name, value) values ("timesheets", ?)', [result.data.dashboard.timesheets]);
              tx.executeSql('insert into settings (name, value) values ("rosters", ?)', [result.data.dashboard.rosters]);
              tx.executeSql('insert into settings (name, value) values ("payslips", ?)', [result.data.dashboard.payslips]);              
              tx.executeSql('insert into settings (name, value) values ("fuel_refund", ?)', [result.data.dashboard.fuel_refund]);
              tx.executeSql('insert into settings (name, value) values ("my_hours", ?)', [result.data.dashboard.my_hours]);
              tx.executeSql('insert into settings (name, value) values ("tasks", ?)', [result.data.dashboard.tasks]);               
              tx.executeSql('insert into settings (name, value) values ("hs", ?)', [result.data.dashboard.hs],
              (tx,res) => { console.log('Results', res.rowsAffected)
                            if(res.rowsAffected > 0){
                              that.offlineDashboard() 
                            } 
                            });           
          });
   
   console.log(result.data.dashboard);
  }
 }).catch(function (error) {
   console.log("-------- error ------- "+error);
   that.setState({ActivityIndicator_Loading:false})
 });
}


getItem1 = () => (
  <View style={styles.iconStyle}>
  <View style={styles.iconStyle1}>
    <Text style={styles.textStyle} >Rosters</Text>  
  </View>
  <View style={styles.iconStyle2}>
    <FontAwesome name="calendar" size={ICON_SIZE}  color="grey" />
  </View>
  </View>
);

getItem2 = () => (
  <View style={styles.iconStyle}>
  <View style={styles.iconStyle1}>
    <Text style={styles.textStyle} >My Hours</Text>  
  </View>
  <View style={styles.iconStyle2}>
    <FontAwesome name="hourglass-half" size={ICON_SIZE} color="grey" />
  </View>
  </View>
);

getItem3 = () => (
  <View style={styles.iconStyle}>
  <View style={styles.iconStyle1}>
    <Text style={styles.textStyle} >Fuel Refund</Text>  
  </View>
  <View style={styles.iconStyle2}>
    <FontAwesome name="filter" size={ICON_SIZE} color="grey" />
  </View>
  </View>
);

getItem4 = () => (
  <View style={styles.iconStyle}>
  <View style={styles.iconStyle1}>
    <Text style={styles.textStyle} >H & S</Text>  
  </View>
  <View style={styles.iconStyle2}>
    <FontAwesome name="medkit" size={ICON_SIZE} color="grey"/>
  </View>
  </View>
);


getItem5 = () => (
  <View style={styles.iconStyle}>
  <View style={styles.iconStyle1}>
    <Text style={styles.textStyle} >Logout</Text>  
  </View>
  <View style={styles.iconStyle2}>
    <MaterialCommunityIcons name="logout" size={ICON_SIZE} color="grey"/>
  </View>
  </View>
);

getItem6 = () => (
  <View style={styles.iconStyle}>
  <View style={styles.iconStyle1}>
    <Text style={styles.textStyle} >Settings</Text>  
  </View>
  <View style={styles.iconStyle2}>
    <MaterialCommunityIcons name="settings" size={ICON_SIZE} color="grey"/>
  </View>
  </View>
);

getItem7 = () => (
  <View style={styles.iconStyle}>
  <View style={styles.iconStyle1}>
    <Text style={styles.textStyle} >Tasks</Text>  
  </View>
  <View style={styles.iconStyle2}>
    <Octicons name="tasklist" size={ICON_SIZE} color="grey"/>
  </View>
  </View>
);

getItem8 = () => (
  <View style={styles.iconStyle}>
  <View style={styles.iconStyle1}>
    <Text style={styles.textStyle} >Payslips</Text>  
  </View>
  <View style={styles.iconStyle2}>
    <MaterialIcons name="monetization-on" size={ICON_SIZE} color="grey"/>
  </View>
  </View>
);

getItem9 = () => (
  <View style={styles.iconStyle}>
  <View style={styles.iconStyle1}>
    <Text style={styles.textStyle} >Confirm Hours</Text>  
  </View>
  <View style={styles.iconStyle2}>
    <SimpleLineIcons name="like" size={ICON_SIZE} color="grey"/>
  </View>
  </View>
);

getTasks(){
  if(this.state.Tasks > 0){
    return (
    <TouchableOpacity 
      activeOpacity = { 0.5 } 
      style = { styles.TouchableOpacityStyle2 } 
       onPress={() => this.props.navigation.push('Tasks', {"user_id":this.state.userid,"email":this.state.email,"baseURL":this.state.baseURL,"date":this.state.date, 'activity':this.state.activity, 'SH':this.state.SH, 'SM':this.state.SM, "addPin":this.state.addPin, "notificationCount":this.state.Count, 'taskSettings':this.state.TaskD})}>  
        <View style={styles.iconContainer}>
          {this.getItem7()}
        </View>
     </TouchableOpacity> 
     )
  }      
}

getPayslips(){
  if(this.state.Payslips > 0){
    return (
    <TouchableOpacity 
      activeOpacity = { 0.5 } 
      style = { styles.TouchableOpacityStyle2 } 
       onPress={() => this.props.navigation.push('Payslips', {"user_id":this.state.userid,"email":this.state.email,"baseURL":this.state.baseURL,"date":this.state.date, 'activity':this.state.activity, 'SH':this.state.SH, 'SM':this.state.SM, "addPin":this.state.addPin, "notificationCount":this.state.Count, 'taskSettings':this.state.TaskD})}>  
        <View style={styles.iconContainer}>
          {this.getItem8()}
        </View>
     </TouchableOpacity> 
     )
  }      
}

getRosters(){
  if(this.state.Rosters > 0){
    return (
    <TouchableOpacity 
      activeOpacity = { 0.5 } 
      style = { styles.TouchableOpacityStyle2 } 
       onPress={() => this.props.navigation.push('Rosters', {"user_id":this.state.userid,"email":this.state.email,"baseURL":this.state.baseURL,"date":this.state.date, 'activity':this.state.activity, 'SH':this.state.SH, 'SM':this.state.SM, "addPin":this.state.addPin, "notificationCount":this.state.Count})}>  
        <View style={styles.iconContainer}>
          {this.getItem1()}
        </View>
     </TouchableOpacity> 
     )
  }      
}
getTimesheets(){
  if(this.state.Timesheets > 0){
    return(
    <TouchableOpacity 
      activeOpacity = { 0.5 } 
      style = { styles.TouchableOpacityStyle2 } 
     onPress={() => this.props.navigation.push('TimesheetEntry', {"user_id":this.state.userid,"email":this.state.email,"baseURL":this.state.baseURL,"date":this.state.formatedDate,"username":this.state.username,"addPin":this.state.addPin,'activity':this.state.activity,'Count':this.state.Count,"formatedDate":this.state.formatedDate })}>        
        <View style={styles.iconContainer}>
          {this.getItem2()}
        </View>    
     </TouchableOpacity>
     ) 
   }
}

getFuelRefund(){
  if(this.state.Frefund > 0){
    return(
          <TouchableOpacity 
      activeOpacity = { 0.5 } 
      style = { styles.TouchableOpacityStyle2 } 
       onPress={() => this.props.navigation.push('FuelRefund', {"username":this.state.username,"email":this.state.email,"baseURL":this.state.baseURL,"addPin":this.state.addPin})}>  
        <View style={styles.iconContainer}>
          {this.getItem3()}
        </View>    
     </TouchableOpacity>     

    )
  }
}

getHS(){
  if(this.state.HS > 0){
  return(
        <TouchableOpacity
      activeOpacity = { 0.5 } 
      style = { styles.TouchableOpacityStyle2 } 
      onPress = { this.ViewScreen }>               
        <View style={styles.iconContainer}>
          {this.getItem4()}
        </View>
     </TouchableOpacity>  
  )
  }
}

settings(){
  return(
        <TouchableOpacity
      activeOpacity = { 0.5 } 
      style = { styles.TouchableOpacityStyle2 } 
      onPress = {() => this.props.navigation.push('Settings', {"username":this.state.username,"email":this.state.email,"baseURL":this.state.baseURL,"addPin":this.state.addPin, "pin":this.state.pin, "password":this.state.password, "firstName": this.state.firstName, "lastName":this.state.lastName,"user_id":this.props.navigation.state.params.user_id})}>               
        <View style={styles.iconContainer}>
          {this.getItem6()}
        </View>
     </TouchableOpacity>  
  )
}

getConfirmHours(){
  return(
        <TouchableOpacity
      activeOpacity = { 0.5 } 
      style = { styles.TouchableOpacityStyle2 } 
      onPress = {() => this.props.navigation.push('ConfirmHours', {"username":this.state.username,"email":this.state.email,"baseURL":this.state.baseURL,"addPin":this.state.addPin, "pin":this.state.pin, "password":this.state.password, "firstName": this.state.firstName, "lastName":this.state.lastName,"user_id":this.props.navigation.state.params.user_id})}>               
        <View style={styles.iconContainer}>
          {this.getItem9()}
        </View>
     </TouchableOpacity>  
  )
}

noInternet(){
  if(this.state.displayOffline == null){
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
    return (
 <View  style={styles.container}>  
<ScrollView>

  {!this.state.addPin ?  (  
    <Modal isVisible={this.state.visibleModal === 1}>
    {this.PinModalContent()}
  </Modal> 
  ) : null}
  <View>
    { this.noInternet() }
  </View> 
{

this.state.ActivityIndicator_Loading ? <ActivityIndicator color='#009688' size='large'style={styles.ActivityIndicatorStyle} /> : null

}    
 
  {this.state.displayOffline != null ? (      
  <View>
    { this.getTimesheets() }    
  </View>
  ):null}  
  {this.state.displayOffline != null ? (      
  <View>
    { this.getRosters() }
  </View>
  ):null} 
  {this.state.displayOffline != null ? (      
  <View>
    { this.getTasks() }
  </View>
  ):null}   
  {this.state.displayOffline != null ? (      
  <View>
    { this.getPayslips() }
  </View>
  ):null}    
  <View>
    { this.getConfirmHours() }    
  </View>  
  {this.state.displayOffline != null ? (      
    <View>
    { this.getFuelRefund() }
  </View>
  ):null}
  {this.state.displayOffline != null ? (      
  <View>
    { this.getHS() }    
  </View>
  ):null}
  {this.state.displayOffline != null ? (      
  <View>
    { this.settings() }    
  </View>
  ):null}  
    <TouchableOpacity
      activeOpacity = { 0.5 } 
      style = { styles.TouchableOpacityStyle2 } 
      onPress={() => navigate('Logout')}>               
        <View style={styles.iconContainer}>
          {this.getItem5()}
        </View>
     </TouchableOpacity>  
</ScrollView>     
  {this.state.displayOffline ?  (         
    <TouchableOpacity onPress={() => this.props.navigation.push('FloatingTimesheet', {"user_id":this.state.userid,"email":this.state.email,"baseURL":this.state.baseURL,"date":this.state.formatedDate, 'activity':this.state.activity, 'SH':this.state.SH, 'SM':this.state.SM, "addPin":this.state.addPin, "notificationCount":this.state.Count,"formatedDate":this.state.formatedDate})} style={styles.fab}>
      <Text style={styles.fabIcon}>+</Text>
    </TouchableOpacity> 
  ) : 
    <TouchableOpacity onPress={() => this.props.navigation.push('FloatingTimesheet', {"user_id":this.state.userid,"email":this.state.email,"baseURL":this.state.baseURL,"date":this.state.formatedDate, 'activity':this.state.activity, 'SH':this.state.SH, 'SM':this.state.SM, "addPin":this.state.addPin, "notificationCount":this.state.Count,"formatedDate":this.state.formatedDate})} style={styles.fabO}>
      <Text style={styles.fabIcon}>+</Text>
    </TouchableOpacity>   
  }
    </View>
    
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
    padding: 2,
    flex:1,
  //  flexDirection: 'row',
  },  
  iconContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'white',
     justifyContent: 'center',
     alignItems: 'center',  
    height: 70,
    padding:10,
    borderWidth: 0.5,
    borderRadius: 10 ,   
    borderColor:'#D0D0D0',    
  },
  iconStyle: {
    flexDirection: 'row',
    padding: 10,
    width:'100%'
  },
  iconStyle1: {
    flexDirection: 'row',
     justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 5,
    width:'90%'
  },   
  iconStyle2: {
    flexDirection: 'row',
     justifyContent: 'flex-start',
    alignItems: 'center',
  },  
  textStyle: {
    fontSize: FONT_SIZE,
    paddingRight:40
  },
    TextInputStyleClass:{
 
    textAlign: 'center',
    height: 50,
    borderWidth: 0.5,
    borderRadius: 10 ,
    backgroundColor : "White",
    flex:1,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 10,
    flexDirection: 'row',
    color: 'white' 
    },  
    TouchableOpacityStyle1:
   {
      paddingTop:10,
      paddingBottom:10,
      backgroundColor:'blue',
      marginBottom: 20,
      width: '50%',
    justifyContent: 'center',
    alignItems: 'center',      
 
    },  
    TouchableOpacityStyle2:
   {
      paddingTop:10,
      paddingBottom:10,
      backgroundColor:'white',
      borderColor:'#D0D0D0',
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
      width: '50%',
    justifyContent: 'center',
    alignItems: 'center',      
 
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
    TouchableOpacityStyle5:
   {
      paddingTop:10,
      paddingBottom:10,
      backgroundColor:'black',
      marginBottom: 20,
      width: '50%',
    justifyContent: 'center',
    alignItems: 'center',      
 
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
fabO: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#E8910C',
    borderRadius: 30,
    elevation: 8
  },  
  fabIcon: {
    fontSize: 40,
    color: 'white',
    resizeMode: 'contain',    
  },
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
    Mbutton: {
    backgroundColor: '#71BF44',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: '#71BF44',
  },
    stage: {
    backgroundColor: "#EFEFF4",
    paddingBottom: 20,
  //  flex: 1
  },
textInput: {
    alignItems: 'center',
    borderRadius: 5,
    flexDirection: 'row',
    borderWidth: 0.2,
  //  paddingLeft: 15,
  //  paddingRight: 15,
    marginBottom: 10,
    backgroundColor: 'white',
    color: 'black', 
  //  flex:1
  },        
});