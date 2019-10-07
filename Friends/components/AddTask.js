import React, { PureComponent } from 'react';
import { TextInput, View, StyleSheet, Image, KeyboardAvoidingView, Text, Dimensions, NetInfo, Alert, ImageBackground, ActivityIndicator,Picker, Animated, TouchableWithoutFeedback,Platform} from 'react-native';
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
import DatePicker from 'react-native-datepicker';

const { width: WindowWidth } = Dimensions.get('window');

const { width } = Dimensions.get('window');

const db = SQLite.openDatabase('db.db');

class AddTask extends PureComponent {
  static navigationOptions = {
//    header:null,
headerTintColor: 'white',
title: "Assign Task",
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
      visibleModal:null,
      addPin:'',
      firstName:'',
      lastName:'',
      locations:-1, 
      Locations:[],  
      modalLoIsVisible: false,
      modalMoIsVisible: false,
      modalLoAnimatedValue: new Animated.Value(0),   
      modalMoAnimatedValue: new Animated.Value(0), 
      Code : [],
      code : 0,
      AssignTo : [],      
      assignTo :0,
      modalCAnimatedValue : new Animated.Value(0),
      modalCIsVisible : false,
      modalATIsVisible :false,
      modalATAnimatedValue : new Animated.Value(0),
      date:'',
      comments:'',
      selectedL:-1,
      selectedC:0,
      selectedA:0,
      lTitle:'Select a Location',
      cTitle:'Select a Task', 
      aTitle:'Select an Employee',
      task_id:'',

    };
      this.AssignTask = this.AssignTask.bind(this);
      this.ModalLocations = this.ModalLocations.bind(this);
      this.ModalLocationsDone = this.ModalLocationsDone.bind(this);
      this.ModalRenderLocations = this.ModalRenderLocations.bind(this);   
      this.ModalCode = this.ModalCode.bind(this);
      this.ModalCodeDone = this.ModalCodeDone.bind(this);
      this.ModalRenderCode = this.ModalRenderCode.bind(this); 
      this.ModalAssignTo = this.ModalAssignTo.bind(this);
      this.ModalAssignToDone = this.ModalAssignToDone.bind(this);
      this.ModalRenderAssignTo = this.ModalRenderAssignTo.bind(this);             
      this.getLocation = this.getLocation.bind(this);
      this.getCode = this.getCode.bind(this);
      this.getAssignTo = this.getAssignTo.bind(this);      
      this.pickLocation = this.pickLocation.bind(this);
      this.pickCode = this.pickCode.bind(this);
      this.pickAssignTo = this.pickAssignTo.bind(this);

    }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    console.log('Settings Screen')
    var that = this;
    that.setState({email:this.props.navigation.state.params.email,
                   password:this.props.navigation.state.params.password,
                   addPin:this.props.navigation.state.params.addPin,
                   firstName:this.props.navigation.state.params.firstName,
                   lastName:this.props.navigation.state.params.lastName,
                   task_id: this.props.navigation.state.params.task_id,
                   user_id: this.props.navigation.state.params.user_id,
                   AssignTo: this.props.navigation.state.params.assignTo})

   this.props.navigation.setParams({ Count: this.props.navigation.state.params.notificationCount})                   
   console.log(this.props.navigation.state.params.taskSettings)
 //   this.getLocation();
    this.getCode();
 //   this.getAssignTo();                   
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
 AssignTask() {
var assign_details = {   
                  task_id: this.state.code,
                  date : this.state.date,  
                  // location: this.state.locations,  
                  comments : this.state.comments,
                  user_id: this.state.assignTo,
                  };  

        this.setState({ ActivityIndicator_Loading : true }, () =>
        { 
            console.log(assign_details);
            console.log(this.props.navigation.state.params.baseURL+'?ct=api&api=task&act=assignTask');
            fetch(this.props.navigation.state.params.baseURL+'?ct=api&api=task&act=assignTask',
            {
                method: 'POST',
                credentials: 'same-origin',
                 headers: 
                 {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                 },
                body: JSON.stringify(assign_details)
            }).then((response) => response.json()).then((res) =>
            {
                  console.log(res)
                  if(!res.error){
                  var that=this; 
                  Alert.alert( 'Task Assigned', 'Click ok to back to tasks',
                  [
                    {text: 'Ok', onPress: () => this.props.navigation.push('Tasks', {"user_id":this.state.userid,"email":this.state.email,"baseURL":this.props.navigation.state.params.baseURL,"date":this.props.navigation.state.params.date, 'activity':this.state.activity, 'SH':this.state.SH, 'SM':this.state.SM, "addPin":this.state.addPin, "notificationCount":this.props.navigation.state.params.notificationCount, 'taskSettings':this.props.navigation.state.params.taskSettings})},
                  ],
                  { cancelable: false }
                ); 
            
                
                  } else {
                    alert(res.error)
                  }    
                this.setState({ ActivityIndicator_Loading : false });
 
            }).catch((error) =>
            {
                alert(JSON.stringify(assign_details))
                console.error(error);
                
                this.setState({ ActivityIndicator_Loading : false});
            });
        });
}

    ModalLocations = () => {
    if (this.state.modalLoIsVisible) {
      return;
    }

    this.setState({ modalLoIsVisible: true, ActivityIndicator_Loading: true }, () => {
      Animated.timing(this.state.modalLoAnimatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

    ModalLocationsDone = () => {
    Animated.timing(this.state.modalLoAnimatedValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ modalLoIsVisible: false, ActivityIndicator_Loading: false });
    });
  };

  ModalRenderLocations = () => {
    if (!this.state.modalLoIsVisible) {
      return null;
    }

    const { modalLoAnimatedValue } = this.state;
    const opacity = modalLoAnimatedValue;
    const translateY = modalLoAnimatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [300, 0],
    });

    return (
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents={this.state.modalLoIsVisible ? 'auto' : 'none'}>
        <TouchableWithoutFeedback onPress={this.ModalLocationsDone}>
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
              <Button title="Done" buttonStyle={{backgroundColor:'#71BF44'}}  onPress={this.ModalLocationsDone} />
            </View>
          </View>
          <Picker style={{width: WindowWidth, backgroundColor: '#e1e1e1'}}
            selectedValue={this.state.locations}
            onValueChange={(itemValue, itemIndex) => this.pickLocation(itemIndex)} >
            { this.state.Locations.map((item, key)=>(
            <Picker.Item label={item.location} value={item.id} key={key} />)
            )}
          </Picker>            
        </Animated.View>
      </View>
    );
  }; 

    ModalAssignTo = () => {
    if (this.state.modalATIsVisible) {
      return;
    }

    this.setState({ modalATIsVisible: true, ActivityIndicator_Loading: true }, () => {
      Animated.timing(this.state.modalATAnimatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

    ModalAssignToDone = () => {
    Animated.timing(this.state.modalATAnimatedValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ modalATIsVisible: false, ActivityIndicator_Loading: false });
    });
  };

  ModalRenderAssignTo = () => {
    if (!this.state.modalATIsVisible) {
      return null;
    }

    const { modalATAnimatedValue } = this.state;
    const opacity = modalATAnimatedValue;
    const translateY = modalATAnimatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [300, 0],
    });

    return (
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents={this.state.modalATIsVisible ? 'auto' : 'none'}>
        <TouchableWithoutFeedback onPress={this.ModalAssignToDone}>
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
              <Button title="Done" buttonStyle={{backgroundColor:'#71BF44'}}  onPress={this.ModalAssignToDone} />
            </View>
          </View>
          <Picker style={{width: WindowWidth, backgroundColor: '#e1e1e1'}}
            selectedValue={this.state.assignTo}
            onValueChange={(itemValue, itemIndex) => this.pickAssignTo(itemIndex)} >
            { this.state.AssignTo.map((item, key)=>(
            <Picker.Item label={item.client} value={item.id} key={key} />)
            )}
          </Picker>            
        </Animated.View>
      </View>
    );
  };

    ModalCode = () => {
    if (this.state.modalCIsVisible) {
      return;
    }

    this.setState({ modalCIsVisible: true, ActivityIndicator_Loading: true }, () => {
      Animated.timing(this.state.modalCAnimatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

    ModalCodeDone = () => {
    Animated.timing(this.state.modalCAnimatedValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ modalCIsVisible: false, ActivityIndicator_Loading: false });
    });
  };

  ModalRenderCode = () => {
    if (!this.state.modalCIsVisible) {
      return null;
    }

    const { modalCAnimatedValue } = this.state;
    const opacity = modalCAnimatedValue;
    const translateY = modalCAnimatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [300, 0],
    });

    return (
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents={this.state.modalCIsVisible ? 'auto' : 'none'}>
        <TouchableWithoutFeedback onPress={this.ModalCodeDone}>
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
              <Button title="Done" buttonStyle={{backgroundColor:'#71BF44'}}  onPress={this.ModalCodeDone} />
            </View>
          </View>
          <Picker style={{width: WindowWidth, backgroundColor: '#e1e1e1'}}
            selectedValue={this.state.code}
            onValueChange={(itemValue, itemIndex) => this.pickCode(itemIndex)} >
            { this.state.Code.map((item, key)=>(
            <Picker.Item label={item.code} value={item.id} key={key} />)
            )}
          </Picker>            
        </Animated.View>
      </View>
    );
  };

getLocation(){
  console.log('entered getLocation()')
 // console.log('NEXT - '+this.state.Next)
//  console.log('PREV - '+this.state.Previous)

var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=system&act=locations';
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
  if(!result.error){
      that.setState({Locations:result.data})
      console.log(that.state.Locations)
  } else {
    console.log(result.error)
    that.setState({Error: result.error})
  }
 }).catch(function (error) {
   console.log("-------- error ------- "+error);
 });
//  console.log('Rosters Data - '+ that.state.JSONResult)
}  

getCode(){
  console.log('entered getCode()')
 // console.log('NEXT - '+this.state.Next)
//  console.log('PREV - '+this.state.Previous)

var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=task&act=task_codes';
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
  if(!result.error){
      
      console.log(that.state.Code)
      var a =0;
      var code =[];
      code.push({id:0,code:'Select a Task'})
      for(let c of result.data){
        code.push({id:c.id,code:c.code})
        a++
      }
      that.setState({Code:code})
  } else {
    console.log(result.error)
    that.setState({Error: result.error})
  }
 }).catch(function (error) {
   console.log("-------- error ------- "+error);
 });
//  console.log('Rosters Data - '+ that.state.JSONResult)
}

getAssignTo(){
  console.log('entered getAssignTo()')
  var c = 1;
  var assignTo = [];
  for(let a of this.props.navigation.state.params.assignTo){
       console.log(a.id+a.client)
      assignTo.push({id:a.id, assignTo:a.client})
      c++
  }
  this.setState({AssignTo:assignTo});

// var that = this;
// var url = this.props.navigation.state.params.baseURL+'?ct=api&api=users&act=getlist';
// console.log("-----------url:"+url);
// fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
//     return response.json();
//   }).then(function (result) {
//   if(!result.error){
//       that.setState({AssignTo:result.data})
//       console.log(result.data)
//   } else {
//     console.log(result.error)
//     that.setState({Error: result.error})
//   }
//  }).catch(function (error) {
//    console.log("-------- error ------- "+error);
//  });
// //  console.log('Rosters Data - '+ that.state.JSONResult)
}

pickLocation(index){

 this.state.Locations.map( (v,i)=>{
  if( index === i ){
    this.setState({
    locations: this.state.Locations[index].id,
    lTitle:this.state.Locations[index].location,
   // ActivityIndicator_Loading: true,
    selectedC:0,
    selectedL:this.state.Locations[index].id,
   })
   //console.log(this.state.locations)
  }
 })
}

pickCode(index){

 this.state.Code.map( (v,i)=>{
  if( index === i ){
    this.setState({
    code: this.state.Code[index].id,
    cTitle:this.state.Code[index].code,
   // ActivityIndicator_Loading: true,
    selectedC:this.state.Code[index].id,
   })
   //console.log(this.state.locations)
  }
 })
}

pickAssignTo(index){

 this.state.AssignTo.map( (v,i)=>{
  if( index === i ){
    this.setState({
    assignTo: this.state.AssignTo[index].id,
    aTitle:this.state.AssignTo[index].client,
   // ActivityIndicator_Loading: true,
    selectedA:this.state.AssignTo[index].id,
   })
   //console.log(this.state.locations)
  }
 })
}

 render() {
    return(

      <View style={styles.container} behavior="padding">
 
          {Platform.OS === 'android' ? ( 
          <View>  
           <View style={styles.Dropdown}> 
            <Picker style={{width: '100%',fontSize:15}}
              selectedValue={this.state.code}
              onValueChange={(itemValue, itemIndex) => this.pickCode(itemIndex)} >
              { this.state.Code.map((item, key)=>(
              <Picker.Item label={item.code} value={item.id} key={key} />)
              )} 
            </Picker>
           </View>
           <View style={styles.Dropdown}>  
            <Picker style={{width: '100%',fontSize:15}}
              selectedValue={this.state.assignTo}
              onValueChange={(itemValue, itemIndex) => this.pickAssignTo(itemIndex)} >
              { this.state.AssignTo.map((item, key)=>(
              <Picker.Item label={item.client} value={item.id} key={key} />)
              )} 
            </Picker>
           </View>
          </View> 
          ):
       <View>     
        <Modal isVisible={this.state.modalCIsVisible === true} style={{justifyContent: 'flex-end',margin: 0}}>
         {this.ModalRenderCode()} 
        </Modal>   
        <Modal isVisible={this.state.modalATIsVisible === true} style={{justifyContent: 'flex-end',margin: 0}}>
         {this.ModalRenderAssignTo()} 
        </Modal> 
        <View style={styles.Dropdown}> 
          <View style={{flex:1}} >
          <Button style={{width:'100%'}} type='clear' title={this.state.cTitle} titleStyle={{color:'black'}} onPress={this.ModalCode} />
          </View>
        </View>  
        <View style={styles.Dropdown}>  
          <View style={{flex:1}} >                     
          <Button style={{width:'100%'}} type='clear' title={this.state.aTitle} titleStyle={{color:'black'}} onPress={this.ModalAssignTo} />
          </View>          
        </View> 
    </View>   
    }      
        <View style={styles.Dropdown}>          
            <DatePicker
              style={{width: 300, color: 'white', borderStyle:'solid'}}
              date={this.state.date}
              mode="date"
              placeholder="Date"
              format="YYYY-MM-DD"
              minDate="2019-01-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
                customStyles={{
                dateInput: {
                  marginLeft: 0, color: 'black',
                }
              }}
              onDateChange={(date) => {this.setState({date: date})}}
            />  
         </View>                         
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
      {this.state.displaySubmit ? (  
          <View style={{ marginTop: 15,borderRadius: 10, padding:2, borderColor: "#71BF44", backgroundColor:"#71BF44",
                       borderWidth: 0.5 }}>
            <Button 
              title="  Assign   "
              onPress={this.AssignTask}
              buttonStyle={{backgroundColor:"#71BF44"}}
              rounded='true'
            />
                          

          </View>  
      ) : null}   


                {
        
                this.state.ActivityIndicator_Loading ? <ActivityIndicator color='#009688' size='large'style={styles.ActivityIndicatorStyle} /> : null
                
                }            
    </View>



    );
 }
}

    module.exports = AddTask;

const styles = StyleSheet.create({
  container: {
  //  justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
    padding: 20,
    height:50,
    flex:1, 
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
   // flex:1,
    width:'100%',
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
});