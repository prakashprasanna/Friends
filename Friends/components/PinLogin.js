import * as React from 'react';
import { Text, View, StyleSheet, Image, Alert, Platform } from 'react-native';
import { Card } from 'react-native-paper';
import { PinInput } from 'react-native-pins';
import { PinKeyboard } from 'react-native-screen-keyboard';
import { ImagePicker, Permissions, Constants, Location } from 'expo';
import LoginUser from './LoginUser';
import Dashboard from './Dashboard';
import { SQLite } from 'expo-sqlite';

const db = SQLite.openDatabase('db.db');

export default class PinLogin extends React.Component {
  constructor(props) {
    super(props);
        this.state = {
      pinCount: 0,
      pin:'',
      cPin:'',
      email:'',
      username:'',
      userid:'',
      baseURL:'',
        }
    this.keyDown = this.keyDown.bind(this);
    this.Pin = this.Pin.bind(this);
  }

    componentDidMount() {
      this.Pin();    
    }


Pin(){

   db.transaction(
      tx => {       
      tx.executeSql(
        'create table if not exists login (id integer primary key not null, email text, baseURL text, userid text, username text, pin text, firstname text, lastname text)',[]
      );       
        tx.executeSql(
          'select * from login',[],  
               (tx,res) => {console.log('Login SQLLITE DB Rows - ' + res.rows.length)
                if(res.rows.length>0){
                  this.setState({
                        pin:res.rows.item(0).pin,
                        email:res.rows.item(0).email,
                        username:res.rows.item(0).username,
                        baseURL:res.rows.item(0).baseURL,      
                        userid:res.rows.item(0).userid,                  
                  });   
                  console.log(res.rows.item(0))                 
                } else {
                Alert.alert( 'First Time Login or Pin not Set', 'Click ok to login using your email id',
                  [
                    {text: 'Ok', onPress: () => this.props.navigation.navigate("LoginUser")},
                  ],
                  { cancelable: false }
                );                  
                  
                }
                  
                }
               )}   
   )    

}   
keyDown(key){
   console.log(key)
   var count = 0;
   if(key=='custom'){
      this.props.navigation.navigate("LoginUser")
   }
   if(key == 'back'){
     this.state.pinCount -- 
     count = this.state.pinCount
      this.setState({pinCount : count})         
   } else {
     this.state.pinCount ++
     console.log(this.state.pinCount)
     count = this.state.pinCount
      this.setState({pinCount : count})
      console.log(this.state.cPin+key)        
      this.setState({cPin : this.state.cPin+key})      

      if(this.state.pinCount === 4){
        var cPin = this.state.cPin+key
          console.log('this.state.cPin - '+cPin)
            if(this.state.pin === cPin){
              this.props.navigation.push("Dashboard",{"username":this.state.username,"email":this.state.email,"baseURL":this.state.baseURL,"user_id":this.state.userid, addPin:cPin})
            } else {
              this.keyboard.displayMessage('Your PIN is incorrect');
              var that = this;
              var url = this.state.baseURL+'index.php?ct=api&api=system&act=send_debug&error=entered pin '+cPin+', stored pin '+this.state.pin+', OS '+Platform.OS
              console.log("-----------url:"+url);
              fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response)               {
                  return response.json();
                }).then(function (result) {
              }).catch(function (error) {
                console.log("-------- error ------- "+error);
              //  alert("result:"+error)
              });
            }
                                
            this.setState({pinCount : 0,
                cPin:'',})             
      }        
   }             

}
  render() {
    return (
      <View style={styles.container}>
    <View>
      <Image  style={{marginBottom:15,marginLeft:40}} source={require("../assets/Agrismart-Logo.png")} resizeMode='contain'/>
    </View>  
    <View style={{justifyContent:'center',alignItems:'center',paddingBottom:10}}>
      <Text style={{fontWeight:'bold',fontSize:17,color:'#71BF44'}}>Please enter your PIN</Text>
    </View>  
    <View style={{justifyContent:'center',alignItems:'center',paddingTop:10,paddingBottom:250}}>
      <PinInput
          onRef={ ref => (this.pins = ref) }
          containerStyle={{ 
          height: 30,
          justifyContent: 'center',
          alignItems: 'center',
          width:'100%',
         }}
          pinActiveStyle ={{backgroundColor:'#71BF44'}}
          numberOfPins={4}
          numberOfPinsActive={this.state.pinCount}  
          pinStyle={{backgroundColor:'#D0D0D0'}}      

      />
     </View>
    <View style={{justifyContent:'center',alignItems:'center',position:'absolute',right:0,left:0,bottom:0}}>
      <PinKeyboard
          onRef={ref => (this.keyboard = ref)}
          keyDown={this.keyDown.bind(this)}
          keyboardStyle={{backgroundColor: '#E8910C',
         width:'100%',
          }}
          keyTextStyle={{color:'#71BF44'}}
          messageStyle={{backgroundColor:'red'}}
          messageTextStyle={{color:'white'}}
          keyboardCustomKeyImage={require("../assets/login.png")}
      />
    </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 8,
  },
});
