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
//import ConfirmHoursDetails from './ConfirmHoursDetails';

const db = SQLite.openDatabase('db.db');
const ICON_SIZE = 70;
const FONT_SIZE = 18;

export default class ConfirmHours extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return{
title: "Confirm Hours",
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
   this.displayCOH = this.displayCOH.bind(this);
   this.FetchConfirmed = this.FetchConfirmed.bind(this);
   this.FetchUnconfirmed = this.FetchUnconfirmed.bind(this);
  //  this.Hide = this.Hide.bind(this);
  //  this.HideM = this.HideM.bind(this);
   this.state = { 
    isConnected: '',
    displayOffline: '0',
    TimesheetErrors: [],
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
    Confirmed_list:[],
    confirmed_list:[],
    Unconfirmed_list:[],
    unconfirmed_list: [],
    HideC:null,
    HideUC:null,
    year:null,
    month:null,
   }
}
componentDidMount(){
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
   this.FetchUnconfirmed(this.state.HideUC);
   this.FetchConfirmed(this.state.HideC);
    var date = moment().format("YYYY-MM-DD");
    var that = this;  
    that.setState({
          //Setting the value of the date time
          date:
            date,
          addPin:this.props.navigation.state.params.addPin,
          ActivityIndicator_Loading:true,                               

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

ItemSeparatorLine = () => {
  return (
    <View
    style={{height: .5,width: "100%",backgroundColor: "#111a0b",}}
    />
  );
}

Hide(hide){
  console.log('hide ' + this.state.HideC);
 this.setState({ActivityIndicator_Loading:true})
 if(hide === false){
   this.setState({HideC:true})
 } else {
   this.setState({HideC:false})
 }
  this.FetchUnconfirmed(this.state.HideUC)
  this.FetchConfirmed(this.state.HideC)
} 

HideM(hide){
  console.log('hideUC '+this.state.HideUC);
 this.setState({ActivityIndicator_Loading:true})
 if(hide === false){
   this.setState({HideUC:true})
 } else {
   this.setState({HideUC:false})
 }
  this.FetchUnconfirmed(this.state.HideUC)
  this.FetchConfirmed(this.state.HideC)} 

displayCOH(){ 

  return(  
 <View>     
    <View>  
      <FlatList
      data={ this.state.Unconfirmed_list } 
          renderItem={({item}) => 
        <TouchableOpacity  activeOpacity={0.9} style={{backgroundColor:'white'}}>
        {item.hide_header === true ?(
        <TouchableOpacity  activeOpacity={0.9} style={{height: 55,borderWidth: 0.5,borderRadius: 5 ,backgroundColor : "#EAEAEA",width:'99%',paddingLeft: 15,paddingRight: 15,marginBottom: 5, paddingTop:5,paddingBottom:5,justifyContent:'center',alignItems:'center'}} onPress={() =>  this.HideM(item.hide_dates)}>

              <View style={{flexDirection:'row',width:'99%',padding:10}}>
                    <View style={{justifyContent:'center',alignItems:'center',flexDirection: 'row',width:'85%'}}><Text style={{color: 'black',fontSize:15,fontWeight:'bold'}}>Unconfirmed Hours</Text></View>
                  {item.hide_dates === false ? (
                    <View style={{justifyContent:'flex-end',alignItems:'flex-end,',flexDirection: 'row',}}><Ionicons name="ios-arrow-up" size={30} color='black' /></View>
                  ):
                    <View style={{justifyContent:'flex-end',alignItems:'flex-end,',flexDirection: 'row',}}><Ionicons name="ios-arrow-down" size={30} color='black' /></View>
                  }  
              </View>

        </TouchableOpacity>
        ):null}   
        <TouchableOpacity  activeOpacity={0.9} style={{backgroundColor: 'white',paddingTop:5}} onPress={() => this.props.navigation.push('EditTimesheet', {"user_id":this.props.navigation.state.params.user_id,"email":this.props.navigation.state.params.email,"baseURL":this.props.navigation.state.params.baseURL, "addPin":this.props.navigation.state.params.addPin, "notificationCount":this.props.navigation.state.params.notificationCount,'ConfirmHours':item})}>
             <ScrollView>
                <View style={styles.item}>
                  <View style={{width:'99%'}}>
                    <Text style={styles.FlatListItemStyle3}>{item.range_nice}</Text>
                  </View>                   
                </View> 
             </ScrollView>
        </TouchableOpacity>
    </TouchableOpacity>
        }
        keyExtractor={(item, index) => index}
        />
 </View>  
        <View style={{paddingBottom:2}}></View>   
    <View>  
      <FlatList
      data={ this.state.Confirmed_list } 
          renderItem={({item}) => 
        <TouchableOpacity  activeOpacity={0.9} style={{backgroundColor:'white'}}>
        {item.hide_header === true ?(
        <TouchableOpacity  activeOpacity={0.9} style={{height: 55,borderWidth: 0.5,borderRadius: 5 ,backgroundColor : "#EAEAEA",width:'99%',paddingLeft: 15,paddingRight: 15,marginBottom: 5, paddingTop:5,paddingBottom:5,justifyContent:'center',alignItems:'center'}} onPress={() =>  this.Hide(item.hide_dates)}>

              <View style={{flexDirection:'row',width:'99%',padding:10}}>
                    <View style={{justifyContent:'center',alignItems:'center',flexDirection: 'row',width:'85%'}}><Text style={{color: 'black',fontSize:15,fontWeight:'bold'}}>Confirmed Hours</Text></View>

                  {item.hide_dates === false ? (
                    <View style={{justifyContent:'flex-end',alignItems:'flex-end,',flexDirection: 'row',}}><Ionicons name="ios-arrow-up" size={30} color='black' /></View>
                  ):
                    <View style={{justifyContent:'flex-end',alignItems:'flex-end,',flexDirection: 'row',}}><Ionicons name="ios-arrow-down" size={30} color='black' /></View>
                  }               </View>

        </TouchableOpacity>  
        ):null}   

        <View style={{paddingBottom:2}}></View>        
        <TouchableOpacity  activeOpacity={0.9} style={{backgroundColor: 'white',paddingTop:5}} onPress={() => this.props.navigation.push('EditTimesheet', {"user_id":this.props.navigation.state.params.user_id,"email":this.props.navigation.state.params.email,"baseURL":this.props.navigation.state.params.baseURL, "addPin":this.props.navigation.state.params.addPin, "notificationCount":this.props.navigation.state.params.notificationCount,'ConfirmHours':item})}>
             <ScrollView>
                <View style={styles.item}>
                  <View style={{width:'99%'}}>
                    <Text style={styles.FlatListItemStyle3}>{item.range_nice}</Text>
                  </View>                   
                </View> 
             </ScrollView>
        </TouchableOpacity>
    </TouchableOpacity>
        }
        keyExtractor={(item, index) => index}
        />
 </View>                

 </View>     
  )
}

FetchUnconfirmed(hide){
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=timesheet&act=unconfirmed_list'; 
   fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
           return response.json();          
         }).then(function (result) { 
           console.log(result);
           if(!result.error){  
          //   console.log(result.data)
             that.setState({unconfirmed_list:result.data})
             var c = 0;
             var p = [];
             var hide=0;
             for(let y of that.state.unconfirmed_list){
                 if(y.hide_header === false && c === 0){
                    y.hide_header = true
                 }
                 if(that.state.HideC === false){
                    y.hide_dates = true
                 } else {
                    y.hide_dates = false
                 }                

               p.push(y)
               c++;  
             }
             that.setState({Unconfirmed_list:p,ActivityIndicator_Loading:false})
             console.log(that.state.Unconfirmed_list)
           } else {
             that.setState({Unconfirmed_list:[],ActivityIndicator_Loading:false})
           }        
  }).catch(function (error) {
    console.log("-------- error ------- "+error);
    // alert("result:"+error)
  });
}

FetchConfirmed(hide){
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=timesheet&act=confirmed_list'; 
   fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
           return response.json();          
         }).then(function (result) { 
           console.log(result);
           if(!result.error){  
          //   console.log(result.data)
             that.setState({confirmed_list:result.data})
             var c = 0;
             var p = [];
             var hide = 0;
             for(let y of that.state.confirmed_list){
                 if(y.hide_header === false && c === 0){
                    y.hide_header = true
                 }              
                 if(that.state.HideUC === false){
                    y.hide_dates = true
                 } else {
                    y.hide_dates = false
                 } 
               p.push(y)
               c++;  
             }
             that.setState({Confirmed_list:p,ActivityIndicator_Loading:false})
             console.log(that.state.Confirmed_list)
           } else {
             that.setState({Confirmed_list:[],ActivityIndicator_Loading:false})
           }        
  }).catch(function (error) {
    console.log("-------- error ------- "+error);
    // alert("result:"+error)
  });
}

getItem1(){
  console.log('Display COH')         
              
  return(    
        this.displayCOH()      
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
if(this.state.Unconfirmed_list.length === 0 & this.state.Confirmed_list.length === 0){
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
  {

  this.state.ActivityIndicator_Loading ? <ActivityIndicator color='#009688' size='large'style={styles.ActivityIndicatorStyle} /> : null
  
  }      
      <Text style={{color:'#71BF44',fontWeight:'bold'}}>No Pay Periods to Confirm</Text>
    </View>
     </TouchableOpacity>   
  </View>
  )
}else{

    return (          
  <View style={styles.container}>    
  <View >       
   { this.getItem1() } 
  </View>    
  {

  this.state.ActivityIndicator_Loading ? <ActivityIndicator color='#009688' size='large'style={styles.ActivityIndicatorStyle} /> : null
  
  }       
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
    fontSize: 15,
    height: 44,
    color:'black',
  },  
  FlatListItemStyle2: {   
   // alignItems: 'center',
    paddingLeft: 10,
    fontSize: 15,
    height: 44,
    color:'black',
  }, 
  FlatListItemStyle3: {   
  //  alignItems: 'center',
    paddingLeft: 10,
    fontSize: 15,
    height: 20,
    color:'black',
  },  
  item: {
    backgroundColor: 'white',
    flexDirection: 'row',
   // alignItems: 'flex-start',
    justifyContent: 'center',    
  //  flex: 1,
    margin: 1,
    height: 60, // approximate a square
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
    iconStyle1: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    tintColor: '#fff'

  },
});