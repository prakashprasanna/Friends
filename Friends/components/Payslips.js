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
import PayslipDetails from './PayslipDetails';

const db = SQLite.openDatabase('db.db');
const ICON_SIZE = 70;
const FONT_SIZE = 18;

export default class Payslips extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return{
title: "Payslips",
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
   this.displayPayslips = this.displayPayslips.bind(this);
   this.FetchPayslips = this.FetchPayslips.bind(this);
   this.Hide = this.Hide.bind(this);
   this.HideM = this.HideM.bind(this);
   this.state = { 
    isConnected: '',
    displayOffline: '0',
    TimesheetErrors: [],
     tableHead: [' Amt Paid','  Date Paid', '         Pay Period'],    
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
    Payslips:[],
    payslips:[],
    hide:0,
    hideM:0,
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
   this.FetchPayslips(this.state.year,this.state.month);
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

Hide(year,hy){
  console.log('hide');
  if(hy != null){
     year = 0
  }
  var month = null;
 // this.setState({Payslips:[]})
 console.log('Year = '+year+'.  '+'hide year = '+hy)
 this.setState({ActivityIndicator_Loading:true})
  this.FetchPayslips(year,month)
} 

HideM(year,month,hm){
  console.log('hide month');
  if(hm != null){
 //    year = 0
     hm = 0
     month = null
  }
 // this.setState({Payslips:[]})
  console.log('Year = '+year+'.  '+'hide month = '+hm+'month = '+'.    '+month)
  this.FetchPayslips(year,month)
} 

displayPayslips(){ 

  return(  
 <View>     
{Platform.OS === 'ios' ? (    
    <View>  
      <FlatList
      data={ this.state.Payslips }

  //    ItemSeparatorComponent = {this.ItemSeparatorLine}
 
          renderItem={({item}) => 
        <TouchableOpacity  activeOpacity={0.9} style={{backgroundColor:'white'}}>
        {item.payslip_year != item.payslip_py ? (         
        <TouchableOpacity  activeOpacity={0.9} style={{height: 55,borderWidth: 0.5,borderRadius: 5 ,backgroundColor : "#EAEAEA",width:'99%',paddingLeft: 15,paddingRight: 15,marginBottom: 5, paddingTop:5,paddingBottom:5,justifyContent:'center',alignItems:'center'}} onPress={() =>  this.Hide(item.payslip_year,item.hide_year)}>

              <View style={{flexDirection:'row',width:'99%',padding:10}}>
                    <View style={{justifyContent:'center',alignItems:'center',flexDirection: 'row',width:'85%'}}><Text style={{color: 'black',fontSize:15,fontWeight:'bold'}}>{item.payslip_year}</Text></View>
                    {item.hide_year === 0 ? (
                    <View style={{justifyContent:'flex-end',alignItems:'flex-end,',flexDirection: 'row',}}><Ionicons name="ios-arrow-up" size={30} color='black' /></View>
                    ):
                    <View style={{justifyContent:'flex-end',alignItems:'flex-end,',flexDirection: 'row',}}><Ionicons name="ios-arrow-down" size={30} color='black' /></View>
                    }
              </View>

        </TouchableOpacity>
        ):null}           
        <View style={{paddingBottom:2}}></View>      
        {item.payslip_month != item.payslip_pm && item.hide_year === 0 ? ( 
        <TouchableOpacity  activeOpacity={0.9} style={{height: 55,borderWidth: 0.5,borderRadius: 5 ,backgroundColor : "#EAEAEA",width:'99%',paddingLeft: 15,paddingRight: 15,marginBottom: 5, paddingTop:5,paddingBottom:5,justifyContent:'center',alignItems:'center'}} onPress={() =>  this.HideM(item.payslip_year,item.payslip_month,item.hide_month)}>

              <View style={{flexDirection:'row',width:'99%',padding:10}}>
                    <View style={{justifyContent:'center',alignItems:'center',flexDirection: 'row',width:'85%'}}><Text style={{color: 'black',fontSize:15,fontWeight:'bold'}}>{item.payslip_month}</Text></View>
                    {item.hide_month  === 0 ? (
                    <View style={{justifyContent:'flex-end',alignItems:'flex-end,',flexDirection: 'row',}}><Ionicons name="ios-arrow-up" size={30} color='black' /></View>
                    ):
                    <View style={{justifyContent:'flex-end',alignItems:'flex-end,',flexDirection: 'row',}}><Ionicons name="ios-arrow-down" size={30} color='black' /></View>
                    }
              </View>

        </TouchableOpacity>
        ):null}   
        {item.hide_year === 0 && item.hide_month === 0 ? ( 
        <TouchableOpacity  activeOpacity={0.9} style={{backgroundColor: 'white',paddingTop:5}} onPress={() => this.props.navigation.push('PayslipDetails', {"user_id":this.props.navigation.state.params.user_id,"email":this.props.navigation.state.params.email,"baseURL":this.props.navigation.state.params.baseURL, "addPin":this.props.navigation.state.params.addPin, "notificationCount":this.props.navigation.state.params.notificationCount,'Payslip':item, 'PaymentsTotal':item.total_income})}>
             <ScrollView>
                <View style={styles.item}>
                  <View style={{width:'70%'}}>
                    <Text style={styles.FlatListItemStyle3}>{item.pay_period_start_date} - {item.pay_period_end_date}</Text>
                    <Text style={{paddingLeft:10}} >Paid on {item.pay_date}</Text>
                  </View>  
                 <View style={{width:'19%'}}>     
                   <Text style={styles.FlatListItemStyle1}>${item.net_pay_actually_paid}</Text>
                 </View>                  
                </View> 
             </ScrollView>
        </TouchableOpacity>
        ):null}
    </TouchableOpacity>
        }
        keyExtractor={(item, index) => index}
        />
 </View>     
 ):
    <View>  
      <FlatList
      data={ this.state.Payslips }

  //    ItemSeparatorComponent = {this.ItemSeparatorLine}
 
          renderItem={({item}) => 
        <TouchableOpacity  activeOpacity={0.9} style={{backgroundColor:'white'}}>
        {item.payslip_year != item.payslip_py ? (         
        <TouchableOpacity  activeOpacity={0.9} style={{height: 55,borderWidth: 0.5,borderRadius: 5 ,backgroundColor : "#EAEAEA",width:'99%',paddingLeft: 15,paddingRight: 15,marginBottom: 5, paddingTop:5,paddingBottom:5,justifyContent:'center',alignItems:'center'}} onPress={() =>  this.Hide(item.payslip_year,item.hide_year)}>

              <View style={{flexDirection:'row',width:'99%',padding:10}}>
                    <View style={{justifyContent:'center',alignItems:'center',flexDirection: 'row',width:'85%'}}><Text style={{color: 'black',fontSize:15,fontWeight:'bold'}}>{item.payslip_year}</Text></View>
                    {item.hide_year === 0 ? (
                    <View style={{justifyContent:'flex-end',alignItems:'flex-end',flexDirection: 'row'}}><Ionicons name="ios-arrow-up" size={30} color='black' /></View>
                    ):
                    <View style={{justifyContent:'flex-end',alignItems:'flex-end',flexDirection: 'row'}}><Ionicons name="ios-arrow-down" size={30} color='black' /></View>
                    }
              </View>

        </TouchableOpacity>
        ):null}           
        <View style={{paddingBottom:2}}></View>      
        {item.payslip_month != item.payslip_pm && item.hide_year === 0 ? ( 
        <TouchableOpacity  activeOpacity={0.9} style={{height: 55,borderWidth: 0.5,borderRadius: 5 ,backgroundColor : "#EAEAEA",width:'99%',paddingLeft: 15,paddingRight: 15,marginBottom: 5, paddingTop:5,paddingBottom:5,justifyContent:'center',alignItems:'center'}} onPress={() =>  this.HideM(item.payslip_year,item.payslip_month,item.hide_month)}>

              <View style={{flexDirection:'row',width:'99%',padding:10}}>
                    <View style={{justifyContent:'center',alignItems:'center',flexDirection: 'row',width:'85%'}}><Text style={{color: 'black',fontSize:15,fontWeight:'bold'}}>{item.payslip_month}</Text></View>
                    {item.hide_month  === 0 ? (
                    <View style={{justifyContent:'flex-end',alignItems:'flex-end',flexDirection: 'row'}}><Ionicons name="ios-arrow-up" size={30} color='black' /></View>
                    ):
                    <View style={{justifyContent:'flex-end',alignItems:'flex-end',flexDirection: 'row'}}><Ionicons name="ios-arrow-down" size={30} color='black' /></View>
                    }
              </View>

        </TouchableOpacity>
        ):null}   
        {item.hide_year === 0 && item.hide_month === 0 ? ( 
        <TouchableOpacity  activeOpacity={0.9} style={{backgroundColor: 'white',paddingTop:5}} onPress={() => this.props.navigation.push('PayslipDetails', {"user_id":this.props.navigation.state.params.user_id,"email":this.props.navigation.state.params.email,"baseURL":this.props.navigation.state.params.baseURL, "addPin":this.props.navigation.state.params.addPin, "notificationCount":this.props.navigation.state.params.notificationCount,'Payslip':item, 'PaymentsTotal':item.total_income})}>
             <ScrollView>
                <View style={styles.item}>
                  <View style={{width:'70%'}}>
                    <Text style={styles.FlatListItemStyle3}>{item.pay_period_start_date} - {item.pay_period_end_date}</Text>
                    <Text style={{paddingLeft:10}} >Paid on {item.pay_date}</Text>
                  </View>  
                 <View style={{width:'19%'}}>     
                   <Text style={styles.FlatListItemStyle1}>${item.net_pay_actually_paid}</Text>
                 </View>                  
                </View> 
             </ScrollView>
        </TouchableOpacity>
        ):null}
    </TouchableOpacity>
        }
        keyExtractor={(item, index) => index}
        />
 </View>     
         
}
 </View>     
  )
}

FetchPayslips(year,month){
         console.log('Fetch Payslips year & month '+year+'  &  '+month)
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=payslip&act=fetch_payslips&user_id='+this.props.navigation.state.params.user_id; 
   fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
           return response.json();          
         }).then(function (result) { 
           console.log(result);
           if(!result.error){  
          //   console.log(result.data.payslips)
             that.setState({payslips:result.data.payslips})
             var c = 0;
             var p = [];
             for(let y of that.state.payslips){
               if(y.payslip_year === year && month === null){
                   console.log(y.payslip_year+'  '+ y.hide_year)
                 if(y.hide_year === null){
                    y.hide_year = 0
                 }                  
               } else {
                if(y.payslip_year === year && y.payslip_month === month){ 
                  if(y.hide_month === null){
                      y.hide_month = 0
                      y.hide_year = 0
                  }                   
                } else {
                  if(y.payslip_year === year){
                     y.hide_year = 0
                  }
                }
               }
               p.push(y)
               c++;  
             }
             that.setState({Payslips:p,ActivityIndicator_Loading:false})
             console.log(that.state.Payslips)
           } else {
             that.setState({Payslips:[],ActivityIndicator_Loading:false})
           }        
  }).catch(function (error) {
    console.log("-------- error ------- "+error);
    // alert("result:"+error)
  });
}

getItem1(){
  console.log('Display Payslips')         
              
  return(    
        this.displayPayslips()      
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
if(this.state.Payslips.length === 0){
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
      <Text style={{color:'#71BF44',fontWeight:'bold'}}>No Payslips</Text>
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