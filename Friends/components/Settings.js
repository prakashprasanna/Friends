import React, { PureComponent } from 'react';
import { TextInput, View, StyleSheet, Image, KeyboardAvoidingView, Text, Dimensions, NetInfo, Alert, ImageBackground, ActivityIndicator } from 'react-native';
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
import PinLogin from './PinLogin';

const { width } = Dimensions.get('window');
const db = SQLite.openDatabase('db.db');

class Settings extends PureComponent {
  static navigationOptions = {
//    header:null,
headerTintColor: 'white',
title: "Settings",
headerStyle: {
backgroundColor: "#71BF44"
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
      pin:'',
      firstName:'',
      lastName:'',
    };
      this.updateSettings = this.updateSettings.bind(this);
    }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    console.log('Settings Screen')
    var that = this;
    that.setState({email:this.props.navigation.state.params.email,
                   password:this.props.navigation.state.params.password,
                   pin:this.props.navigation.state.params.pin,
                   firstName:this.props.navigation.state.params.firstName,
                   lastName:this.props.navigation.state.params.lastName })
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

//update user settings
 updateSettings() {
var settings_details = {   
                  id: this.props.navigation.state.params.user_id,
                  email : this.state.email,  
                  password : this.state.password,  
                  pin: this.state.pin,  
                  firstname : this.state.firstName,
                  lastname : this.state.lastName,
                  };  

        this.setState({ ActivityIndicator_Loading : true }, () =>
        { 
            console.log(settings_details);
            console.log(this.props.navigation.state.params.baseURL+'?ct=api&api=users&act=update_details');
            fetch(this.props.navigation.state.params.baseURL+'?ct=api&api=users&act=update_details',
            {
                method: 'POST',
                credentials: 'same-origin',
                 headers: 
                 {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                 },
                body: JSON.stringify(settings_details)
            }).then((response) => response.json()).then((res) =>
            {
                  console.log(res)
                  if(!res.error){
                  var that=this;                 
                    // that.setState({email:'',
                    //                password:'',
                    //                pin:'',
                    //                firstName:'',
                    //                lastName:'',                                   
                    //              })    
                          db.transaction(
                    tx => {
                        tx.executeSql(
                          'UPDATE login set pin=?, firstname=?, lastname=?, email=? where id=1',[this.state.pin, this.state.firstname, this.state.lastname, this.state.email],
                          (tx, res) => {
                            console.log('SQLLite login details row updated',res.rowsAffected);
                          }
                        ) 
                      } )                    
                            Alert.alert( 'Settings Updated!!!', 'Click ok to re-login',
                          [
                            {text: 'Ok', onPress: () => that.props.navigation.push("PinLogin")},
                          ],
                          { cancelable: false }
                        );                  
                  } else {
                    alert(res.error)
                  }    
                this.setState({ ActivityIndicator_Loading : false });
 
            }).catch((error) =>
            {
                alert(JSON.stringify(settings_details))
                console.error(error);
                
                this.setState({ ActivityIndicator_Loading : false});
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
      <View behavior="padding">
        <View style={styles.textInput}>
          <TextInput
              style={{
          fontSize: 15,      height: 50,
          width: '80%',
//          flex: 1,
          color: 'black'
        }}
        autoCorrect={false}
        spellCheck={false}
        underlineColorAndroid='transparent'
        placeholder="Enter your Email"
        placeholderTextColor='black'
        value={this.state.email}
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
          value={this.state.password}
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
          keyboardType={'numeric'}
          maxLength={4}           
          autoCorrect={false}
          spellCheck={false}
          secureTextEntry={true}
          placeholder="Enter Pin"
          placeholderTextColor='black'
          onChangeText={pin => this.setState({ pin })}
          underlineColorAndroid="transparent"
          value={this.state.pin}
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
//          secureTextEntry={true}
          placeholder="Enter First Name"
          placeholderTextColor='black'
          onChangeText={firstName => this.setState({ firstName })}
          underlineColorAndroid="transparent"
          value={this.state.firstName}
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
//          secureTextEntry={true}
          placeholder="Enter Last Name"
          placeholderTextColor='black'
          onChangeText={lastName => this.setState({ lastName })}
          underlineColorAndroid="transparent"
          value={this.state.lastName}
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
              title="Update"
              onPress={this.updateSettings}
              buttonStyle={{backgroundColor:"#71BF44"}}
              rounded='true'
            />
                          

          </View>  
      ) : null}   

      </View>       

                {
        
                this.state.ActivityIndicator_Loading ? <ActivityIndicator color='#009688' size='large'style={styles.ActivityIndicatorStyle} /> : null
                
                }            
    </View>



    );
 }
}

    module.exports = Settings;

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