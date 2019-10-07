import * as React from 'react';
import { Alert, Text, View, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, NetInfo, Button, FlatList, ActivityIndicator} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { Constants} from 'expo';
import FuelRefund from './FuelRefund';
import LoginUser from './LoginUser';
import Logout from './FuelRefund';
import TimesheetEntry from './TimesheetEntry';
import MyHours from './TimesheetEntry';
import MyRosters from './Rosters';
const { width } = Dimensions.get('window');
import moment from 'moment'; 
import { SQLite } from 'expo-sqlite';

const db = SQLite.openDatabase('db.db');
const ICON_SIZE = 70;
const FONT_SIZE = 18;



export default class MultiClient extends React.Component {
  static navigationOptions = {
title: "Select an Account",
headerTintColor: 'white',
headerStyle: {
backgroundColor: "#71BF44"
},
};   
constructor(props) {
  super(props);
//   this.getDashboard= this.getDashboard.bind(this);     
//   this.createSettingsDB = this.createSettingsDB.bind(this);
   this.handleConnectivityChange = this.handleConnectivityChange.bind(this);
//   this.offlineLogin = this.offlineLogin.bind(this);
   this.getItem1 = this.getItem1.bind(this);
//   this.getLoginParams = this.getLoginParams.bind(this);
this.ItemSeparatorLine = this.ItemSeparatorLine.bind(this);
this.pingUser = this.pingUser.bind(this);
   this.state = { 
     ActivityIndicator_Loading : false,
    JSONResult: "",
    isConnected: '',
    email:'',
    username:'',
    userid:'',
    baseURL:'',
    displayOffline: '0',
    firstLogin: 'false',
    date:'',
    ClientLegaName:'',
    ClientURL:'',

   }
}
componentDidMount(){
  NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    NetInfo.isConnected.fetch().done((isConnected) => {
 
      if(isConnected == true)
      {
        this.setState({isConnected : "true",
                      displayOffline : '0'})
 //       this.createSettingsDB();                     
      }
      else
      {
        this.setState({isConnected : "false",
                      displayOffline : '1'})
//        this.createSettingsDB();                     
      }
 
    });  
      console.log('isConnected DidMount - ' + this.state.isConnected)   

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
    style={{height: .5,width: "100%",backgroundColor: "white",}}
    />
  );
}

getItem1(){
  return(
<FlatList
      data={ this.props.navigation.state.params.multi }

      ItemSeparatorComponent = {this.ItemSeparatorLine}
 
          renderItem={({item}) => 
        <TouchableOpacity  activeOpacity = { 0.5 } 
                          style = { styles.TouchableOpacityStyle2 } 
                          onPress={() => this.pingUser(item)}>
                <View style={styles.iconContainer}>
                  <Text style={styles.FlatListItemStyle1}>{item.ClientLegaName}</Text>
                </View> 
        </TouchableOpacity>
        }
        keyExtractor={(item, index) => index}
        /> 
        
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
   this.setState({ ActivityIndicator_Loading : true }, () =>
   {   
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
              this.setState({ ActivityIndicator_Loading : false });                           
        }else{
         alert('error in ping');
         this.setState({ ActivityIndicator_Loading : false });
         console.log(result);
   }
}).catch(function (error) {
   console.log("-------- error ------- "+error);
   this.setState({ ActivityIndicator_Loading : false });
  // alert("result:"+error)
 });
 });
}


render() {
      const {navigate} = this.props.navigation;
    return (          
<ScrollView style={styles.scroll}>   
  <View style={styles.container}>   
  <View>
    { this.noInternet() }
  </View>        
  <View>
   { this.getItem1() }
  </View>  
                {
        
                this.state.ActivityIndicator_Loading ? <ActivityIndicator color='#009688' size='large'style={styles.ActivityIndicatorStyle} /> : null
                
                }     
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
    backgroundColor: 'white',
 //   padding: 2,
  },
  scroll: {
        justifyContent: 'center',
    backgroundColor: 'white',
 //   padding: 2,
  },  
  iconContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex:1,
    backgroundColor: 'white',
     justifyContent: 'center',
     alignItems: 'center',  
    height: 50,
    padding:10,
    borderWidth: 0.5,
    borderRadius: 10 ,   
    borderColor:'#D0D0D0',    
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
      width: '100%',
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
    backgroundColor: '#03A9F4',
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
    alignItems: 'center',
    paddingLeft: 0,
    fontSize: 18,
    height: 44,
    color:'black',
  },  
  item: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',    
    flex: 1,
    margin: 1,
    height: 40, // approximate a square
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
});