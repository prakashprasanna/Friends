import React, { PureComponent } from 'react';
import { TextInput, View, StyleSheet, Image, KeyboardAvoidingView, Text, Dimensions, NetInfo, Alert, ImageBackground } from 'react-native';
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
import LoginUser from './LoginUser';

const { width } = Dimensions.get('window');
const db = SQLite.openDatabase('db.db');

class ForgotPassword extends PureComponent {
  static navigationOptions = {
 //   header:null,
title: "Reset Password",
headerTintColor: 'white',
headerStyle: {
backgroundColor: "#71BF44"
}
};  
  constructor(props) {
    super(props);
    this.state = {
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

//fetch user login
fetchLogin(){
var that = this;
var url = 'https://c3.timesmart.co.nz/cms/cloud-login/resetPassword?email='+this.state.email;
//console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
  if(!result.error){  
   console.log('Email Sent')
    Alert.alert( 'Email Sent!!!', 'Please check your email to reset password',
      [
        {text: 'Ok', onPress: () => that.props.navigation.navigate("LoginUser")},
      ],
      { cancelable: false }
    );    
  }
 }).catch(function (error) {
   //console.log("-------- error ------- "+error);
//  alert("result:"+error)
 });
}


  CheckTextInput = () => {
          this.fetchLogin = this.fetchLogin.bind(this);
    //Handler for the Submit onPress
    if (this.state.email != '') {
      //Check for the Name TextInput
         this.fetchLogin();
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
          width: '90%',
//          flex: 1,
          color: 'black'
        }}
        autoCorrect={false}
        spellCheck={false}
        underlineColorAndroid='transparent'
        placeholder="Enter your registered email id"
        placeholderTextColor='black'
        onChangeText ={email => this.setState({ email })}
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
              title="Send"
              onPress={this.CheckTextInput}
              buttonStyle={{backgroundColor:"#71BF44"}}
              rounded='true'
            />
          </View>  
      ) : null}   

      </View>       
    </View>



    );
 }
}

    module.exports = ForgotPassword;

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