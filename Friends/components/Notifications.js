import * as React from 'react';
import { Alert, Text, View, StyleSheet, TouchableOpacity, ScrollView, Dimensions, NetInfo, FlatList, ActivityIndicator, Platform} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { Constants} from 'expo';
import FuelRefund from './FuelRefund';
import LoginUser from './LoginUser';
import Logout from './FuelRefund';
import EditTimesheet from './EditTimesheet';
import MyHours from './TimesheetEntry';
import MyRosters from './Rosters';
const { width } = Dimensions.get('window');
import moment from 'moment'; 
import { Table, Row, Rows } from 'react-native-table-component';
import { Header, Button, Badge, Image } from 'react-native-elements';
import {Ionicons}  from '@expo/vector-icons';
import FloatingTimesheet from './FloatingTimesheet';
import { SQLite } from 'expo-sqlite';

const db = SQLite.openDatabase('db.db');
const ICON_SIZE = 70;
const FONT_SIZE = 18;


export default class Notifications extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return{
title: "Notifications",
headerTintColor: 'white',
headerStyle: {
backgroundColor: "#71BF44"
},
headerRight: (
    <Button
    type="clear"
    icon={
        <Ionicons name="ios-home" size={30} color='white' />
        }       
    onPress={ () =>navigation.push('Dashboard',{"count":0,"username":params.username,"email":params.email,"baseURL":params.baseURL,"user_id":params.user_id, "addPin":params.addPin}) }    
    />
),
};
  }   
constructor(props) {
  super(props);
   this.handleConnectivityChange = this.handleConnectivityChange.bind(this);
   this.getItem1 = this.getItem1.bind(this);
   this.ItemSeparatorLine = this.ItemSeparatorLine.bind(this);
   this.displayNotifications = this.displayNotifications.bind(this);
   this.TimesheetNotifications = this.TimesheetNotifications.bind(this);
   this.getNextStartTime = this.getNextStartTime.bind(this);
   this.state = { 
    isConnected: '',
    displayOffline: '0',
    TimesheetErrors: [],
     tableHead: ['                Day', '                         Error'],    
    Count:0,
    email:'',
    username:'',
    userid:'',
    baseURL:'',
    activity:'',
    defaultActivity:'',    
    SH:'00',
    SM:'00',
    date:'',
    addPin:null,
      ActivityIndicator_Loading: false,   
   }
}
componentDidMount(){
  this.getNextStartTime();
  NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    NetInfo.isConnected.fetch().done((isConnected) => {
 
      if(isConnected == true)
      {
        this.setState({isConnected : "true",
                      displayOffline : '0'})
      }
      else
      {
        this.setState({isConnected : "false",
                      displayOffline : '1'})
      }
 
    });  
      console.log('isConnected DidMount - ' + this.state.isConnected)   
   this.TimesheetNotifications();
    var date = moment().format("YYYY-MM-DD");
    var that = this;  
    that.setState({
          //Setting the value of the date time
          date:
            date,
          addPin:this.props.navigation.state.params.addPin                               

        });    
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
                      displayOffline : '1'});                      
    }
  } 


getNextStartTime(){
  //console.log('entered getActivity()')
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=timesheet&act=next_start_time&date='+this.state.date;
//console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
  if(!result.error){
   that.setState({ 
     SH: result.data.hs,
     SM : result.data.ms,

   });    
   console.log('getNextStartTime OUTPUT')
   console.log('SH - '+that.state.SH)
   console.log('SM - '+that.state.SM)
  }
 }).catch(function (error) {
   //console.log("-------- error ------- "+error);
//  alert("result:"+error)
 });
}

createSettingsDB(){
   console.log('entered createSettingsDB  ' + this.state.isConnected )
    this.getLoginParams();
}

getLoginParams(){

    console.log('create multiClient table');     
    db.transaction(tx => {      
      // tx.executeSql(
      //   'DROP TABLE IF EXISTS settings', []
      // );       
      tx.executeSql(
        'create table if not exists multiClient (id integer primary key not null, ClientLegaName text, ClientURL text);'
      );
    });
    if(this.state.isConnected == 'true') {
            db.transaction(
      tx => {
        tx.executeSql(
          'select * from multiClient',[],
          //  (tx,res) => {  },
           (tx,res) => { console.log('multiClient select count - ' + res.rows.length)
                 console.log('online')
                 tx.executeSql('delete from multiClient', [])
                 tx.executeSql('insert into multiClient (ClientLegaName, ClientURL) values (?,?)',[this.props.navigation.state.params.ClientLegaName, this.props.navigation.state.params.ClientURL],(tx, res) => { console.log('Results', res.rowsAffected) }),
                (tx, error) => {
                  alert('If you are logging in for first time make sure you login with internet')
                }    
                                      
        }
        )      
      });  
    }     
    
            db.transaction(
      tx => {
        tx.executeSql( 
          'select * from multiClient',[],
           (tx,res) => {  console.log('multiClient select count - ' + res.rows.length)
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
        tx.executeSql('select * from multiClient', [], 
                (tx, results) => {
          var len = results.rows.length;
          console.log('len ' + len )
          console.log('  ClientLegaName  ' + results.rows.item(0).ClientLegaName)
          if(len > 0){
            this.setState({
             ClientLegaName:results.rows.item(0).ClientLegaName,
             ClientURL:results.rows.item(0).ClientURL,
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

ItemSeparatorLine = () => {
  return (
    <View
    style={{height: .5,width: "100%",backgroundColor: "#111a0b",}}
    />
  );
}

displayNotifications(){  
  return(    
      <FlatList
      data={ this.state.TimesheetErrors }

      ItemSeparatorComponent = {this.ItemSeparatorLine}
 
          renderItem={({item}) => 
        <TouchableOpacity  activeOpacity={0.9} style={{backgroundColor: 'white'}} onPress={() =>  this.setState({ ActivityIndicator_Loading : true }, () =>
   {
     this.props.navigation.push('EditTimesheet', {"date":moment(item.date).format("dddd LL"),"jobs":item.job_id,"activity":item.activity_code,"totalHours":item.total_hours,"comments":item.comment,"units":item.units,"email":this.props.navigation.state.params.email,"baseURL":this.props.navigation.state.params.baseURL,"user_id":this.props.navigation.state.params.user_id,"error":item.error, "uuid":item.uuid, "startTime":item.start_time, "endTime":item.end_time, 'default_activity':this.state.activity, "addPin":this.state.addPin, 'id':item.id, "SH":item.sh, "SM":item.sm, "EH":item.eh, "EM":item.em})
     this.setState({ ActivityIndicator_Loading : false });
     })
     }>
             <ScrollView>
                <View style={styles.item}>
                 <View style={{width:'50%'}}>
                  <Text style={styles.FlatListItemStyle1}>{item.date}</Text>
                 </View> 
                 <View style={{width:'50%'}}>
                  <Text style={styles.FlatListItemStyle2}>{item.screen}</Text>
                 </View> 
                </View> 
             </ScrollView>
        </TouchableOpacity>
        }
        keyExtractor={(item, index) => index}
        />                 
           
  )
}

TimesheetNotifications(){
         console.log('TimesheetNotifications')
            db.transaction(
      tx => {
        tx.executeSql(
          'select * from notifications where error_flag="1"',[], (_, { rows }) =>console.log(JSON.stringify(rows)))         
        tx.executeSql( 
          'select * from notifications where error_flag="1"',[],
           (tx,res) => {  console.log('Timesheets error count - ' + res.rows.length)
                var temp = [];
                if(res.rows.length > 0) {
                    for(let i=0; i < res.rows.length; ++i){
                      temp.push(res.rows.item(i));
                      console.log('Timesheet Error - ' + temp)
                      this.setState({
                              TimesheetErrors:temp,
                              username: this.props.navigation.state.params.username,
                              email:this.props.navigation.state.params.email,
                              baseURL:this.props.navigation.state.params.baseURL,
                              userid:this.props.navigation.state.params.user_id,
                              addPin:this.props.navigation.state.params.addPin,                                                             
                          });   
                       this.props.navigation.setParams({ addPin:this.props.navigation.state.params.addPin})
                       console.log('this.props.navigation.state.params.addPin - '+this.props.navigation.state.params.addPin)   
                       console.log('temp[i].error ---- '+temp[i].error) 
                    }
                    
                } else {
                      this.setState({
                              TimesheetErrors:null,
                              username: this.props.navigation.state.params.username,
                              email:this.props.navigation.state.params.email,
                              baseURL:this.props.navigation.state.params.baseURL,
                              userid:this.props.navigation.state.params.user_id,
                              addPin:this.props.navigation.state.params.addPin                               
                          });         
                      this.props.navigation.setParams({ addPin:this.props.navigation.state.params.addPin}) 
                      console.log('this.props.navigation.state.params.addPin - '+this.props.navigation.state.params.addPin)               
                }                         
        }
        )
      })    
}

getItem1(){
  console.log('process notifications')
//   if(this.state.Count == 0){
//      this.TimesheetNotifications();
//       this.setState({
//               Count:1,
//           }); 
//   }
// if(this.props.navigation.state.params.count == 0){  
//     this.TimesheetNotifications();
// this.props.navigation.state.params.count = 1;    
// }          
              
  return(    
        this.displayNotifications()      
  )    

}

noInternet(){
  if(this.state.displayOffline == '1'){
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

 pingUser(item) {
   console.log('pinguser function')
   var that = this;
   var url = item.ClientURL;
   var usern = '';
   var baseURL = '';
   var email = this.state.email;
   var password = this.state.password;
   var user_id = '';
   fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
           return response.json();          
         }).then(function (result) { 
           console.log(result);
           if(!result.error){
            that.setState({ status: result.error,
                            wholeResult: result,
                         });
                usern = result.data.user;     
                baseURL = result.data.base_url;
                user_id = result.data.user_id;              
               that.props.navigation.push("Dashboard",{"username":usern,"email":email,"baseURL":baseURL,"user_id":user_id,"password":password})
                           alert("Welcome to Agrismart");      
        }else{
         alert('error in ping');
         console.log(result);
   }
}).catch(function (error) {
   console.log("-------- error ------- "+error);
  // alert("result:"+error)
 });
}


render() {
      const {navigate} = this.props.navigation;

if(this.state.displayOffline === '1'){
  return(
  <View style={{    flex: 1,
    alignItems: 'center',
   justifyContent: 'center',
    backgroundColor: 'white',
    }}>
    <TouchableOpacity
      activeOpacity = { 0.5 } 
      style = { styles.TouchableOpacityStyle4 } 
    >               
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>No Internet - No Access</Text>
    </View>
     </TouchableOpacity>  

<Image
  source={require("../assets/nointernet.png")}
  style={{ width: 200, height: 200 }}
  resizeMode='contain'
  //PlaceholderContent={<ActivityIndicator />}
/>  
  </View>
  )
}else{
if(!this.state.TimesheetErrors){
  return(
  <View style={{    flex: 1,
    alignItems: 'center',
   justifyContent: 'center',
    backgroundColor: 'white',
    }}>
    <TouchableOpacity
      activeOpacity = { 0.5 }  
    >               
    <View>
      <Text style={{color:'#71BF44',fontWeight:'bold'}}>No Notifications</Text>
    </View>
     </TouchableOpacity>   
  </View>
  )
}else{

    return (          
  <View style={styles.container}>   
 
  <View>
    { this.noInternet() }
  </View>        
  <Table borderStyle={{borderWidth: 2, borderColor: 'black'}}>
    <Row data={this.state.tableHead} style={styles.head} flexArr={[2, 2]} textStyle={styles.text}/>
  </Table>   
   { this.getItem1() }    
  {

  this.state.ActivityIndicator_Loading ? <ActivityIndicator color='#009688' size='large'style={styles.ActivityIndicatorStyle} /> : null
  
  }     
    <TouchableOpacity onPress={() => this.props.navigation.push('FloatingTimesheet', {"user_id":this.state.userid,"email":this.state.email,"baseURL":this.state.baseURL,"date":this.state.date, 'defaultActivity':this.state.defaultActivity, 'SH':this.state.SH, 'SM':this.state.SM, 'addPin':this.state.addPin})} style={styles.fab}>
      <Text style={styles.fabIcon}>+</Text>
    </TouchableOpacity>   
  </View>  
    );
}
}
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
  //  justifyContent: 'center',
    backgroundColor: 'white',
 //   padding: 2,
  },
  scroll: {
    flex: 1,
  // justifyContent: 'center',
    backgroundColor: 'white',
 //   padding: 2,
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
      width: '50%',
    justifyContent: 'center',
    alignItems: 'center',      
 
    },  
    TouchableOpacityStyle2:
   {
      paddingTop:10,
      paddingBottom:10,
      backgroundColor:'orange',
      marginBottom: 20,
      width: '50%',
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
  fabIcon: {
    fontSize: 40,
    color: 'white'
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
  offlineText: { color: '#fff' }    ,
  FlatListItemStyle1: {   
  //  alignItems: 'center',
    paddingLeft: 3,
    fontSize: 18,
    height: 80,
    color:'black',
  },  
  FlatListItemStyle2: {   
    alignItems: 'center',
    paddingLeft: 10,
    fontSize: 18,
    height: 80,
    color:'black',
  }, 
  item: {
    backgroundColor: 'white',
    flexDirection: 'row',
   // alignItems: 'flex-start',
    justifyContent: 'center',    
  //  flex: 1,
    margin: 1,
    height: 80, // approximate a square
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
    head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 },
    bottomView: {
    width: '100%',
    height: 50,
    backgroundColor: '#EE5407',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
  },  
});