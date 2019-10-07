import React, { PureComponent } from 'react';
import { TextInput, View, StyleSheet, Image, KeyboardAvoidingView, Text, Dimensions, NetInfo, Alert, ImageBackground, ActivityIndicator, Platform } from 'react-native';
import { StackNavigator } from 'react-navigation';
import  Dashboard  from './Dashboard';
import FuelRefund from './FuelRefund';
import { SQLite } from 'expo-sqlite';
// You can import from local files
import { getUserInfo } from './Users';
import MultiClient from './MultiClient';
import Modal from 'react-native-modal';
import Logoff from './FuelRefund';
import DateTimePicker from "react-native-modal-datetime-picker";
import {Button} from "react-native-elements";
import ForgotPassword from './ForgotPassword';

const { width } = Dimensions.get('window');
const db = SQLite.openDatabase('db.db');

class LoginUser extends PureComponent {
  static navigationOptions = {
    header:null,
title: "Client Login",
headerStyle: {
backgroundColor: "#73C6B6"
}
};  
  constructor(props) {
    super(props);
    this.state = {
      ActivityIndicator_Loading: false,   
      email: '',
      password: '',
      username: '',
      baseURL: '',
      isConnected: false,
      displaySubmit:'1',
      user_id:'',
    visibleModal: 1,
    };
      this.fetchLogin = this.fetchLogin.bind(this);
      this.offlineLogin = this.offlineLogin.bind(this);
      this.TimesheetNotifications = this.TimesheetNotifications.bind(this);
    }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    console.log('login modal')
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = isConnected => {
    if (isConnected) {
      console.log(isConnected == true);
      this.setState({ isConnected : false,
                      displaySubmit : '1' });
    } else {
      this.setState({ isConnected : true,
                      displaySubmit : null });
    }
  };  

  offlineLogin(){
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM login',
        [],
        (tx, results) => {
          var len = results.rows.length;
          if(len > 0){
            this.setState({
             email:results.rows.item(0).email,
             password:results.rows.item(0).password,
            });
          }
           this.props.navigation.push("Dashboard")
             alert("Login Successful"); 
        }
      )      
     }
    )    
  }

TimesheetNotifications(){
         console.log('TimesheetNotifications')
            db.transaction(
      tx => {        
        tx.executeSql( 
          'select * from Timesheet where error_flag="1"',[],
           (tx,res) => {  console.log('Timesheets error count - ' + res.rows.length)
            var temp = [];
                  this.setState({
                          Count:res.rows.length,
                      });   
              if(res.rows.length > 0){
                Alert.alert( 'Offline-Mode update error', 'Please visit Notifications screen',
                  [
                    {text: 'Ok', onPress: () => this.props.navigation.navigate("Notifications",{"username":this.state.username,"email":this.state.email,"baseURL":this.state.baseURL,"user_id":this.state.user_id,"password":this.state.password})},
                  ],
                  { cancelable: false }
                );
              }                          
                    
                }                          
        )
      })    
}  

//fetch user login
 fetchLogin() {
   var that = this;
   var url = 'https://c3.timesmart.co.nz/cms/cloud-login/apiLogin';
   var user = { Email: this.state.email, Password: this.state.password };
   console.log(user); 
   var usern = '';
   var status = 'error';
   var baseURL = '';
   var email = this.state.email;
   var password = this.state.password;
   var user_id = '';
   var multi = [];
   var c=0;
   this.setState({ ActivityIndicator_Loading : true }, () =>
   {
   fetch(url,{
         method: 'POST',
         credentials: 'same-origin',
         headers: {
                  'Content-Type': 'application/json',
                  },
                 
         body: JSON.stringify(user)
         
         
         }).then(function (response) {
           return response.json();          
         }).then(function (result) { 
           console.log(result);
           if(!result.error){
            that.setState({ status: result.error,
                            wholeResult: result,
                         });
           
            if(!result.multi){
                console.log(result.data)
                usern = result.data.user;     
                status = 'successful'; 
                baseURL = result.data.base_url;
                user_id = result.data.user_id;      
            that.setState({ baseURL: baseURL,
                            username: usern,
                            email: email,
                            user_id: user_id,
                            password: password,
                         });                        
               that.props.navigation.push("Dashboard",{"username":usern,"email":email,"baseURL":baseURL,"user_id":user_id,"password":password})
                           that.TimesheetNotifications();
            } else {
                  for(let m of result.multi){
                      multi[c] = m;
                      c++;
                  }               
                      console.log(multi);              
               that.props.navigation.push("MultiClient",{"multi":multi})
                           alert("Multi Client Login Successful");                 
            }
             that.setState({ ActivityIndicator_Loading : false });
 
        }else{
          that.setState({ ActivityIndicator_Loading : false });
         alert('Incorrect Login Details');
         console.log(result);
   }
}).catch(function (error) {
   console.log("-------- error ------- "+error);
    that.setState({ ActivityIndicator_Loading : false });
 
  // alert("result:"+error)
 });
});
}

  CheckTextInput = () => {
          this.fetchLogin = this.fetchLogin.bind(this);
    //Handler for the Submit onPress
    if (this.state.email != '') {
      //Check for the Name TextInput
      if (this.state.password != '') {
        //Check for the Email TextInput
        //this.props.navigation.push("Profile")}
        this.setState({ visibleModal: null })
         this.fetchLogin();
      } else {
        alert('Please Enter Password');
      }
    } else {
      alert('Please Enter email');
    }
  };

 render() {
    return(
      <View style={styles.stage}>
  <Image  style={{marginBottom:15,marginRight:20}} source={require("../assets/Agrismart-Logo.png")} resizeMode='contain'/>
      <View behavior="padding">
        <View style={styles.textInput}>
          <TextInput
              style={{
          fontSize: 15,      height: 50,
          width: '70%',
      //    flex: 1,
          color: 'black'
        }}
        autoCorrect={false}
        spellCheck={false}
        underlineColorAndroid='transparent'
        placeholder="Enter your Email"
        placeholderTextColor='black'
        textContentType="emailAddress"
        onChangeText ={email => this.setState({ email })}
          />
        </View>
        <View style={styles.textInput}>
          <TextInput
                      style={{
          fontSize: 15,
          height: 50,
          flex: 1,
          color: 'black'
          }}
          autoCorrect={false}
          spellCheck={false}
          secureTextEntry={true}
          placeholder="Enter Password"
          placeholderTextColor='black'
          onChangeText={password => this.setState({ password })}
          underlineColorAndroid="transparent"
          />
          </View>
      {this.state.isConnected ? (         
          <View style={{ marginTop: 15 }}>
            <Button 
              title="Submit"
              onPress={this.offlineLogin}
              buttonStyle={{backgroundColor:"#71BF44"}}
              rounded='true'
            />            
          </View>
      ) : null}   
      {this.state.displaySubmit ? (  
          <View style={{ marginTop: 15,borderRadius: 10, padding:2, borderColor: "#71BF44", backgroundColor:"#71BF44",
                       borderWidth: 0.5 }}>
            <Button 
              title="Submit"
              onPress={this.CheckTextInput}
              buttonStyle={{backgroundColor:"#71BF44"}}
              rounded='true'
            />
                          

          </View>  
      ) : null}   

      </View>  
            <Button 
              title="Forgot Password ?"
              buttonStyle={{backgroundColor:"white"}}
              rounded='true'
              type='clear'
              titleStyle={{color:'#71BF44',fontSize:12}}
              onPress={() => this.props.navigation.navigate('ForgotPassword')}
            />      

                {
        
                this.state.ActivityIndicator_Loading ? <ActivityIndicator color='#009688' size='large'style={styles.ActivityIndicatorStyle} /> : null
                
                }            
    </View>



    );
 }
}

    module.exports = LoginUser;

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 0,
  },
 logo: {
    flexGrow:1,
    height:null,
    width:null,
    alignItems: 'center',
    justifyContent:'center',
  },
textInput: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    borderWidth: 0.5,
    paddingLeft: 15,
    paddingRight: 20,
    marginBottom: 10,
    backgroundColor: 'white',
  },
    offlineContainer: {
    backgroundColor: '#E8910C',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
    position: 'absolute',
    top: 30
  },
  offlineText: { color: '#fff' },
      stage: {
    borderWidth: 0.5,
    paddingLeft: 15,     
    borderRadius: 8,   
    borderColor: '#D0D0D0',
       flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    height:'50%',
    width:null,
    backgroundColor:'white'
  }  
});