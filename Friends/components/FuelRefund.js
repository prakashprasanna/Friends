import React, { Component } from 'react';
import { Alert, List, ListItem, FlatList, TextInput, View, StyleSheet, Image, KeyboardAvoidingView, Text, ScrollView, ActivityIndicator, TouchableOpacity, TouchableHighlight, Picker, BackHandler, Switch} from 'react-native';
import { getRegoInfo } from './FetchVehicle';
//import ReceiptUpload from './ReceiptUpload';
import DatePicker from 'react-native-datepicker';
import { Dropdown } from 'react-native-material-dropdown';
import { getUserInfo } from './Users';
import LoginUser from './LoginUser';
import { DrawerNavigator, DrawerActions, DrawerItems, SafeAreaView, createStackNavigator, createBottomTabNavigator, createDrawerNavigator,createAppContainer } from 'react-navigation'; 
import { Table, Row, Rows } from 'react-native-table-component';
import { ImagePicker, Permissions, Constants } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {FontAwesome} from '@expo/vector-icons';
import { NavigationActions } from 'react-navigation';
import {Button}  from 'react-native-elements';
import PinLogin from './PinLogin';

class HeaderNavigationBar extends Component {
      componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        Alert.alert(
  'Logoff',
  'Are you sure you want to close the app ?',
  [
    {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
    {text: 'Yes', onPress: () => BackHandler.exitApp()},
  ],
  { cancelable: false }
)
        return true;
    }
    render() {
        return (<View style={{
            height: 70,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
        }}>
            <TouchableHighlight style={{ marginLeft: 10, marginTop: 15 }}
                onPress={ () =>this.props.navigation.dispatch(DrawerActions.openDrawer()) }>
                <Image
                    style={{ width: 32, height: 32 }}
                    source={{uri: 'https://png.icons8.com/ios/2x/menu-filled.png'}}
                />
            </TouchableHighlight>
                          <Text> Apply or Search Fuel Refunds </Text>
        </View>);
    }
}


export class FuelRefund extends Component {
  state = {
    image: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      container: '',
      rucVehicle: '',
      comVessel: '',
      fuelamt: '',  
      fueltype: '',
      fuelliters: '',
      fueldate: '',
      comments:'',
      photo:'',
      comEquipment:'',
      regVehicle:'',
      unRegVehicle:'',
      baseURL:'',
      ActivityIndicator_Loading: false,   
      Tanks:[],
      RegVehicles:[],
      UnRegVehicles:[],
      CommercialEquipments:[],
      RUCVehicles:[],
      CommercialVessels:[],
      show: false,    
      showRegVehicles: false,    
      showUnRegVehicles: false,    
      showEquipments: false,    
      showRUC: false,    
      showVessels: false,    

      };
  this.fetchUser = this.fetchUser.bind(this);
  this.insert_fuelRefund = this.insert_fuelRefund.bind(this);
  this.getContainers= this.getContainers.bind(this);
}

  askPermissionsAsync = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    // you would probably do something to verify that permissions
    // are actually granted, but I'm skipping that for brevity
  };

  useLibraryHandler = async () => {
    await this.askPermissionsAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: false,
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri });
      this.state.photo = result.uri;
    }
  };

  useCameraHandler = async () => {
    await this.askPermissionsAsync();
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: false,
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri });
      this.state.photo = result.uri;
    }
  };  

//fetch user
 fetchUser() {
    alert('Fetching User details...')
    getUserInfo(this.state.userid)
    .then((res) => {
      this.setState({
        data: res
      })      
      if(this.state.data == '') {
        this.setState({
 
        fullname: 'User not found'
        })
      }
    else {
      this.setState({

        fullname: this.state.data.user
 
      })
      console.log(this.state.data);
      console.log(this.state.data.user);
      this.setState({
        error: false,
        userid: ''
      })
    }
});

}

//function to fetch fuel containers from Tanks table

componentDidMount(){
  this.getContainers();
  this.getRegVehicles();
  this.getUnRegVehicles();
  this.getEquipments();
  this.getRUC();
  this.getVessels();  
}
getContainers(){
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=tanks&act=getTanks';
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
  if(!result.error){
   that.setState({ 
     Tanks: result.data.tanks,

   });
   console.log(that.state.Tanks);

  }
 }).catch(function (error) {
   console.log("-------- error ------- "+error);
  alert("result:"+error)
 });
}

getRegVehicles(){
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=vehicles&act=getRegVehicles';
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
  if(!result.error){
   that.setState({ 
     RegVehicles: result.data.vehicles,

   });
   console.log(that.state.RegVehicles);

  }
 }).catch(function (error) {
   console.log("-------- error ------- "+error);
  alert("result:"+error)
 });
}

getUnRegVehicles(){
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=vehicles&act=getUnRegVehicles';
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
  if(!result.error){
   that.setState({ 
     UnRegVehicles: result.data.vehicles,

   });
   console.log(that.state.UnRegVehicles);

  }
 }).catch(function (error) {
   console.log("-------- error ------- "+error);
  alert("result:"+error)
 });
}

getEquipments(){
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=vehicles&act=getComEquip';
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
  if(!result.error){
   that.setState({ 
     CommercialEquipments: result.data.vehicles,

   });
   console.log(that.state.CommercialEquipments);

  }
 }).catch(function (error) {
   console.log("-------- error ------- "+error);
  alert("result:"+error)
 });
}

getRUC(){
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=vehicles&act=getRUCVehicles';
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
  if(!result.error){
   that.setState({ 
     RUCVehicles: result.data.vehicles,

   });
   console.log(that.state.RUCVehicles);

  }
 }).catch(function (error) {
   console.log("-------- error ------- "+error);
  alert("result:"+error)
 });
}

getVessels(){
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=vehicles&act=getComVess';
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
  if(!result.error){
   that.setState({ 
     CommercialVessels: result.data.vehicles,

   });
   console.log(that.state.CommercialVessels);

  }
 }).catch(function (error) {
   console.log("-------- error ------- "+error);
  alert("result:"+error)
 });
}

//function to insert fuel refund details into fuel_refund table
insert_fuelRefund() {
        const refund_details = new FormData();
        refund_details.append('email', this.props.navigation.state.params.email);
        refund_details.append('container', this.state.container);
        refund_details.append('unRegVehicle', this.state.unRegVehicle);
        refund_details.append('regVehicle', this.state.regVehicle);
        refund_details.append('fuel_type', this.state.fueltype);
        refund_details.append('fuel_amt', this.state.fuelamt);
        refund_details.append('fuel_liters', this.state.fuelliters);
        refund_details.append('fuel_date', this.state.date);
        refund_details.append('baseURL', this.props.navigation.state.params.baseURL);
        refund_details.append('comments', this.state.comments);
        refund_details.append('comEquipment', this.state.comEquipment);
        refund_details.append('comVessel', this.state.comVessel);   
        refund_details.append('rucVehicle', this.state.rucVehicle);   
        refund_details.append('photo', {
                      uri: this.state.photo,
                      type: 'image/jpeg', // or photo.type
                      name: 'FuelReceipt'
                    });
        this.setState({ ActivityIndicator_Loading : true }, () =>
        { 
            console.log(refund_details);
            console.log(this.props.navigation.state.params.baseURL+'?ct=api&api=fuel_refund&act=put');
            fetch(this.props.navigation.state.params.baseURL+'?ct=api&api=fuel_refund&act=put',
            {
                method: 'POST',
                credentials: 'same-origin',
                 headers: 
                 {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
                 },
                body: refund_details
            }).then((response) => response.json()).then((res) =>
            {
                  console.log(res)
                alert('Fuel Reference ID is '+res.data.refund_id);
 
                this.setState({ ActivityIndicator_Loading : false });
 
            }).catch((error) =>
            {
                console.error(error);
 
                this.setState({ ActivityIndicator_Loading : false});
            });
        });
  }

  ShowHideComponent = () => {
    if (this.state.show == true) {
      this.setState({ show: false });
    } else {
      this.setState({ show: true });
    }
  };
    ShowRegVehicles = () => {
    if (this.state.showRegVehicles == true) {
      this.setState({ showRegVehicles: false });
    } else {
      this.setState({ showRegVehicles: true });
    }
  };
    ShowUnRegVehicles = () => {
    if (this.state.showUnRegVehicles == true) {
      this.setState({ showUnRegVehicles: false });
    } else {
      this.setState({ showUnRegVehicles: true });
    }
  };
    ShowEquipments = () => {
    if (this.state.showEquipments == true) {
      this.setState({ showEquipments: false });
    } else {
      this.setState({ showEquipments: true });
    }
  };
    ShowRUC = () => {
    if (this.state.showRUC == true) {
      this.setState({ showRUC: false });
    } else {
      this.setState({ showRUC: true });
    }
  };
    ShowVessels = () => {
    if (this.state.showVessels == true) {
      this.setState({ showVessels: false });
    } else {
      this.setState({ showVessels: true });
    }
  };

    render() {      
         let fuel = [{
      'id':1, value: 'Petrol',
    }, {
      'id':2, value: 'Diesel',
    }, {
      'id':3, value: 'Gas',
    }];

  
    let { image } = this.state;
        return (<View style={{
            flex: 1,
            flexDirection: 'column',
        }}> 
        <HeaderNavigationBar {...this.props} />
            <View style={{
                flex: 1,
                backgroundColor: 'lightgreen',
                title: 'Apply Fuel Refund'
            }}>
            
<ScrollView>
  <View style={styles.container} behavior="padding"> 
<Text style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'purple'
    }}> Fuel Receipt issued for (Select any one below)  </Text> 
<View  style={{flexDirection: 'row'}}>
 <Text style={styles.textInput1}> Fuel for Container  </Text> 
 <Switch
    onValueChange={this.ShowHideComponent}
      value={this.state.show}
  />
</View>
{this.state.show ? (
    <View style={styles.Dropdown}>
     <Dropdown containerStyle={{flex:1,color:'white'}}
        label='Fuel Containers'
        data={this.state.Tanks}
        onChangeText ={container => this.setState({ container })}
        onPress={this.ShowHideComponent}
      />
     </View>  
) : null}

<View  style={{flexDirection: 'row'}}>
 <Text style={styles.textInput1}> Fuel for Registerd Vehicle  </Text> 
 <Switch
    onValueChange={this.ShowRegVehicles}
      value={this.state.showRegVehicles}
  />
</View>

{this.state.showRegVehicles ? (
     <View style={styles.Dropdown}>
     <Dropdown containerStyle={{flex:1,color:'white'}}
        label='Registered Vehicles'
        data={this.state.RegVehicles}
        onChangeText ={regVehicle => this.setState({ regVehicle })}
      />
    </View>
) : null}

<View  style={{flexDirection: 'row'}}>
 <Text style={styles.textInput1}> Fuel for Unregisterd Vehicle  </Text> 
 <Switch
    onValueChange={this.ShowUnRegVehicles}
      value={this.state.showUnRegVehicles}
  />
</View>

{this.state.showUnRegVehicles ? (
    <View style={styles.Dropdown}>
     <Dropdown containerStyle={{flex:1,color:'white'}}
        label='Unregistered Vehicles'
        data={this.state.UnRegVehicles}
        onChangeText ={unRegVehicle => this.setState({ unRegVehicle })}
      />
     </View>      
) : null}

<View  style={{flexDirection: 'row'}}>
 <Text style={styles.textInput1}> Fuel for Commercial Equipment  </Text> 
 <Switch
    onValueChange={this.ShowEquipments}
      value={this.state.showEquipments}
  />
</View>

{this.state.showEquipments ? (
    <View style={styles.Dropdown}>
     <Dropdown containerStyle={{flex:1,color:'white'}}
        label='Commercial Equipments'
        data={this.state.CommercialEquipments}
        onChangeText ={comEquipment => this.setState({ comEquipment })}
      />
     </View>  
) : null}

<View  style={{flexDirection: 'row'}}>
 <Text style={styles.textInput1}> Fuel for RUC Vehicle  </Text> 
 <Switch
    onValueChange={this.ShowRUC}
      value={this.state.showRUC}
  />
</View>

{this.state.showRUC ? (
    <View style={styles.Dropdown}>
     <Dropdown containerStyle={{flex:1,color:'white'}}
        label='RUC Vehicles'
        data={this.state.RUCVehicles}
        onChangeText ={rucVehicle => this.setState({ rucVehicle })}
      />
     </View>  
) : null}

<View  style={{flexDirection: 'row'}}>
 <Text style={styles.textInput1}> Fuel for Commercial Vessel  </Text> 
 <Switch
    onValueChange={this.ShowVessels}
      value={this.state.showVessels}
  />
</View>

{this.state.showVessels ? (
    <View style={styles.Dropdown}>
     <Dropdown containerStyle={{flex:1,color:'white'}}
        label='Commercial Vessels'
        data={this.state.CommercialVessels}
        onChangeText ={comVessel => this.setState({ comVessel })}
      />
     </View>       
) : null}

    <View style={styles.Dropdown}>
     <Dropdown containerStyle={{flex:1,color:'white'}}
        label='Type of Fuel'
        data={fuel}
        onChangeText ={fueltype => this.setState({ fueltype : fuel.id })}
      />
     </View>    

    <View style={styles.textInput}>
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'white'
    }}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    placeholder="Fuel Amt for Refund"
    onChangeText ={fuelamt => this.setState({ fuelamt })}
      />
    </View> 

        <View style={styles.textInput}>
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'white'
    }}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    placeholder="Litres of Fuel"
    onChangeText ={fuelliters => this.setState({ fuelliters })}
      />
    </View> 
   <View style={styles.textInput}>
      <DatePicker
        style={{width: 200, flex: 1, color: 'white'}}
        date={this.state.date}
        mode="date"
        placeholder="Fuel Purchase Date"
        format="YYYY-MM-DD"
        minDate="2019-01-01"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 36, color: 'white',
          }
        }}
        onDateChange={(fueldate) => {this.setState({date: fueldate})}}
      />
    </View>   
     
    <View style={styles.textInput}>
    <TextInput
        style={styles.TextInputStyleClass}
        underlineColorAndroid="transparent"
        placeholder={"Comments"}
        numberOfLines={2}
        multiline={true}
        onChangeText ={comments => this.setState({ comments })}
      />
    </View>
     <View style={{ flex: 1, alignItems: 'center', padding:20}}>    
        <Button color="#686C7E" title="Click to take Receipt Pic" onPress={this.useCameraHandler} />
        <Text>OR</Text>
        <Button color="#686C7E"
          title="Click to Upload Fuel Receipt"
          onPress={this.useLibraryHandler}
        />
      {image &&
      <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}   
    </View>      
    
    <View style={{ marginTop: 15 }}>

                <TouchableOpacity 
                  activeOpacity = { 0.5 } 
                  style = { styles.TouchableOpacityStyle } 
                  onPress = { this.insert_fuelRefund }>

                    <Text style = { styles.TextStyle }>Submit Refund</Text>

                </TouchableOpacity>

                {
        
                this.state.ActivityIndicator_Loading ? <ActivityIndicator color='#009688' size='large'style={styles.ActivityIndicatorStyle} /> : null
                
                }
      </View>      

  </View>
</ScrollView>
                
            </View>
        </View>);
    }
}

type Props = {};
export class SearchRefund extends Component {
constructor(props) {
  super(props);
   this.getListCall= this.getListCall.bind(this);
   this.GetListItem= this.GetListItem.bind(this);
   
   this.state = { 
     
    JSONResult: "",
          tableHead: ['Date', 'Rego', 'Fuel Type', 'Litres', 'Amount'],
      tableData: []
   }
}
componentDidMount(){
  this.getListCall();
}
 //this.props.navigation.state.params.baseURL+'?ct=api&api=fuel_refund&act=put'
getListCall(){
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=fuel_refund&act=get';
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
 console.log(result.data.refunds);
  if(!result.error){
   that.setState({ 
     JSONResult: result.data.refunds,
   });
  }
 }).catch(function (error) {
   console.log("-------- error ------- "+error);
  alert("result:"+error)
 });
}

   
GetListItem (receiptPhoto) {
      alert(
      <Image source={{ uri: receiptPhoto }} style={{ width: 200, height: 200 }} />);
}
 
ItemSeparatorLine = () => {
  return (
    <View
    style={{height: .5,width: "100%",backgroundColor: "#111a0b",}}
    />
  );
}
render() {
      return (<View style={{
            flex: 1,
            flexDirection: 'column',
        }}> 
        <HeaderNavigationBar {...this.props} />
                    <View style={{
                flex: 1,
                backgroundColor: 'lightgreen',
            }}>


  <Table borderStyle={{borderWidth: 2, borderColor: 'black'}}>
    <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text}/>
    <Rows data={this.state.tableData} style={styles.head} textStyle={styles.text}/>
  </Table>       
    <FlatList
      data={ this.state.JSONResult }

      ItemSeparatorComponent = {this.ItemSeparatorLine}
 
          renderItem={({item}) => 
        <TouchableOpacity activeOpacity={0.9} onPress={this.GetListItem.bind(this, item.receiptPhoto)}>
          <View style={styles.item} >
        
          <Text style={styles.FlatListItemStyle}> {item.fuel_date}  {item.rego}  {item.fuel_type} {item.fuel_liters}  {item.fuel_amt}</Text>

          </View>
      {item.receiptPhoto &&
      <Image source={{ uri: item.receiptPhoto }} style={{ width: 200, height: 200 }} />}   
        </TouchableOpacity>
        }
        keyExtractor={(item, index) => index}
        />

  </View>
    </View>

        
        );
    }

}


export class RegisteredVehicles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      regno: '',
      vin: '',
      make: '',
      model:'',
      year: '',
      tankSize: '',  
      effectiveQuater:'',
      purpose:'',
      ActivityIndicator_Loading: false,   
          JSONResult: "",
          tableHead: ['Name', 'Size', 'Effective'],
      tableData: []  
    };
  this.handleSubmit = this.handleSubmit.bind(this);
  this.getListCall= this.getListCall.bind(this);
  this.insert_registeredVehicles = this.insert_registeredVehicles.bind(this);
  
}

componentDidMount(){
  this.getListCall();
}
 //this.props.navigation.state.params.baseURL+'?ct=api&api=fuel_refund&act=put'
getListCall(){
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=vehicles&act=getReg';
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
 console.log(result.data);
  if(!result.error){
   that.setState({ 
     JSONResult: result.data.vehicles,
   });
  }
 }).catch(function (error) {
   console.log("-------- error ------- "+error);
  alert("result:"+error)
 });
}

  handleSubmit() {
    alert('Fetching your vehicle details...')
    getRegoInfo(this.state.regno)
    .then((res) => {
      this.setState({
        data: res
      })      
      if(this.state.data.idh.vehicle.make == '') {
        this.setState({
 
        make: 'Vehicle not found',
        year: 'Vehicle not found',
        vin: 'Vehicle not found',
        model: '',
 
        })
      }
    else {
      this.setState({
        regno: this.state.regno,
        make: this.state.data.idh.vehicle.make,
        model: this.state.data.idh.vehicle.model,
        vin: this.state.data.idh.vehicle.vin,
        year: this.state.data.idh.vehicle.year_of_manufacture
 
      })
      console.log(this.state.data.idh.vehicle.make);
      console.log(this.state.data.idh.vehicle.model);
      console.log(this.state.data.idh.vehicle.vin);
      console.log(this.state.data.idh.vehicle.year_of_manufacture);
      this.setState({
        error: false,
      })
    }
});

}

//function to insert registered vehicles
insert_registeredVehicles() {
        var rego_details = {         
                  rego : this.state.regno,  
                  vin : this.state.vin,
                  make : this.state.make,
                  year : this.state.year,
                  purpose : this.state.purpose,  
                  tankSize: this.state.tankSize,  
                  effectiveQuater : this.state.effectiveQuater,
                  vehicle_type : 'Registered',
                  };
        this.setState({ ActivityIndicator_Loading : true }, () =>
        { 
            console.log(rego_details);
            console.log(this.props.navigation.state.params.baseURL+'?ct=api&api=vehicles&act=put');
            fetch(this.props.navigation.state.params.baseURL+'?ct=api&api=vehicles&act=put',
            {
                method: 'POST',
                credentials: 'same-origin',
                 headers: 
                 {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                 },
                body: JSON.stringify(rego_details)
            }).then((response) => response.json()).then((res) =>
            {
                  console.log(res)
                alert('Vehicle Reference ID is '+res.data.vehicle_id);
 
                this.setState({ ActivityIndicator_Loading : false });
 
            }).catch((error) =>
            {
                console.error(error);
 
                this.setState({ ActivityIndicator_Loading : false});
            });
        });
  }

    render() {
               let quarter = [{
      value: 'March',
    }, {
      value: 'June',
    }, {
      value: 'September',
    }, {
      value: 'December',
    }];
        return (<View style={{
            flex: 1,
            flexDirection: 'column',
        }}> 
        <HeaderNavigationBar {...this.props} />
            <View style={{
                flex: 1,
                backgroundColor: 'lightgreen',
                title: 'Apply Fuel Refund'
            }}>
            
<ScrollView>
  <View style={styles.container} behavior="padding">
   <Text> Add Registered Vehicles </Text>
   <View style={styles.textInput}>
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'white'
    }}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    placeholder="Rego Number"
    onChangeText ={regno => this.setState({ regno })}
    onBlur = {this.handleSubmit}
      />
    </View>      

    <View style={styles.textInput}>
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'white'
    }}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    placeholder="Vin No"
    value={this.state.vin}
      />
    </View>        
     
    <View style={styles.textInput}>
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'white'
    }}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    placeholder="Make/Model">
      {this.state.make} / {this.state.model }
      </TextInput>
    </View>    
    <View style={styles.textInput}>
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'white'
    }}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    placeholder="Year"
    value={this.state.year}
      />
    </View>   

   <View style={styles.textInput}>
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'white'
    }}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    placeholder="Tank Size"
    onChangeText ={tankSize => this.setState({ tankSize })}
      />
    </View> 

<View style={styles.Dropdown}>
  <Dropdown containerStyle={{flex:1,color:'white'}}
    label='Effective Quarter'
    data={quarter}
    onChangeText ={effectiveQuater => this.setState({ effectiveQuater })}
  />
</View>       

    <View style={styles.textInput}>
    <TextInput
        style={styles.TextInputStyleClass}
        underlineColorAndroid="transparent"
        placeholder={"Purpose / Use"}
        numberOfLines={2}
        multiline={true}
        onChangeText ={purpose => this.setState({ purpose })}
      />
    </View>

    <View style={{ marginTop: 15 }}>

                <TouchableOpacity 
                  activeOpacity = { 0.5 } 
                  style = { styles.TouchableOpacityStyle } 
                  onPress = { this.insert_registeredVehicles }>

                    <Text style = { styles.TextStyle }>Add Vehicle</Text>

                </TouchableOpacity>

                {
        
                this.state.ActivityIndicator_Loading ? <ActivityIndicator color='#009688' size='large'style={styles.ActivityIndicatorStyle} /> : null
                
                }
      </View>      

  </View>
</ScrollView>
      <Text> Added Registered Vehicles </Text>     
    <Table borderStyle={{borderWidth: 2, borderColor: 'black'}}>
       <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text}/>
    </Table> 
        <FlatList
      data={ this.state.JSONResult }

      ItemSeparatorComponent = {this.ItemSeparatorLine}
 
          renderItem={({item}) => 
        <TouchableOpacity activeOpacity={0.9}>
          <View style={styles.item} >
        
          <Text style={styles.FlatListItemStyle}> {item.rego} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  {item.size}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   {item.effectiveQuater}&nbsp;&nbsp;&nbsp;</Text>

          </View>
        </TouchableOpacity>
        }
        keyExtractor={(item, index) => index}
        />  
                
            </View>
        </View>);
    }
}

export class UnregisteredVehicles extends Component {
  state = {
    image: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      regno: '',
      vin: '',
      make: '',
      year: '',
      tankSize: '',  
      purpose:'',
      effectiveQuater : '',    
      ActivityIndicator_Loading: false,   
      JSONResult: "",
      tableHead: ['Name', 'Size', 'Effective'],      
    };
  this.handleSubmit = this.handleSubmit.bind(this);
  this.getListCall = this.getListCall.bind(this);
  this.insert_unRegisteredVehicles = this.insert_unRegisteredVehicles.bind(this);
  
}

componentDidMount(){
  this.getListCall();
}
 //this.props.navigation.state.params.baseURL+'?ct=api&api=fuel_refund&act=put'
getListCall(){
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=vehicles&act=getUnReg';
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
 console.log(result.data);
  if(!result.error){
   that.setState({ 
     JSONResult: result.data.vehicles,
   });
  }
 }).catch(function (error) {
   console.log("-------- error ------- "+error);
  alert("result:"+error)
 });
}


  handleSubmit() {
    alert('Fetching your vehicle details...')
    getRegoInfo(this.state.regno)
    .then((res) => {
      this.setState({
        data: res
      })      
      if(this.state.data.idh.vehicle.make == '') {
        this.setState({
 
        make: 'Vehicle not found',
        year: 'Vehicle not found',
        vin: 'Vehicle not found',
        model: '',
 
        })
      }
    else {
      this.setState({
        regno: this.state.regno,
        make: this.state.data.idh.vehicle.make,
        model: this.state.data.idh.vehicle.model,
        vin: this.state.data.idh.vehicle.vin,
        year: this.state.data.idh.vehicle.year_of_manufacture
 
      })
      console.log(this.state.data.idh.vehicle.make);
      console.log(this.state.data.idh.vehicle.model);
      console.log(this.state.data.idh.vehicle.vin);
      console.log(this.state.data.idh.vehicle.year_of_manufacture);
      this.setState({
        error: false,
      })
    }
});

}

//function to insert registered vehicles
insert_unRegisteredVehicles() {
        var rego_details = {         
                  rego : this.state.regno,  
                  vin : this.state.vin,
                  make : this.state.make,
                  year : this.state.year,
                  purpose : this.state.purpose,  
                  tankSize: this.state.tankSize,  
                  effectiveQuater : this.state.effectiveQuater,
                  vehicle_type : 'Unregistered',
                  };
        this.setState({ ActivityIndicator_Loading : true }, () =>
        { 
            console.log(rego_details);
            console.log(this.props.navigation.state.params.baseURL+'?ct=api&api=vehicles&act=put');
            fetch(this.props.navigation.state.params.baseURL+'?ct=api&api=vehicles&act=put',
            {
                method: 'POST',
                credentials: 'same-origin',
                 headers: 
                 {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                 },
                body: JSON.stringify(rego_details)
            }).then((response) => response.json()).then((res) =>
            {
                  console.log(res)
                alert('Vehicle Reference ID is '+res.data.vehicle_id);
 
                this.setState({ ActivityIndicator_Loading : false });
 
            }).catch((error) =>
            {
                console.error(error);
 
                this.setState({ ActivityIndicator_Loading : false});
            });
        });
  }

    render() {
               let quarter = [{
      value: 'March',
    }, {
      value: 'June',
    }, {
      value: 'September',
    }, {
      value: 'December',
    }];
        return (<View style={{
            flex: 1,
            flexDirection: 'column',
        }}> 
        <HeaderNavigationBar {...this.props} />
            <View style={{
                flex: 1,
                backgroundColor: 'lightgreen',
                title: 'Apply Fuel Refund'
            }}>
            
<ScrollView>
  <View style={styles.container} behavior="padding">
   <Text> Add Unregistered Vehicles </Text>
   <View style={styles.textInput}>
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'white'
    }}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    placeholder="Vehicle Name"
    onChangeText ={regno => this.setState({ regno })}
  //  onBlur = {this.handleSubmit}
      />
    </View>      

    <View style={styles.textInput}>
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'white'
    }}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    placeholder="Vin No"
     onChangeText ={vin => this.setState({ vin })}      />
    </View>        
     
    <View style={styles.textInput}>
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'white'
    }}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    placeholder="Make/Model"
    onChangeText ={make => this.setState({ make })}      />
    </View>    
    <View style={styles.textInput}>
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'white'
    }}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    placeholder="Year"
     onChangeText ={year => this.setState({ year })}      />
    </View>   

   <View style={styles.textInput}>
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'white'
    }}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    placeholder="Tank Size"
    onChangeText ={tankSize => this.setState({ tankSize })}
      />
    </View> 

<View style={styles.Dropdown}>
  <Dropdown containerStyle={{flex:1,color:'white'}}
    label='Effective Quarter'
    data={quarter}
    onChangeText ={effectiveQuater => this.setState({ effectiveQuater })}
  />
</View>      

    <View style={styles.textInput}>
    <TextInput
        style={styles.TextInputStyleClass}
        underlineColorAndroid="transparent"
        placeholder={"Purpose / Use"}
        numberOfLines={2}
        multiline={true}
        onChangeText ={purpose => this.setState({ purpose })}
      />
    </View>

    <View style={{ marginTop: 15 }}>

                <TouchableOpacity 
                  activeOpacity = { 0.5 } 
                  style = { styles.TouchableOpacityStyle } 
                  onPress = { this.insert_unRegisteredVehicles }>

                    <Text style = { styles.TextStyle }>Add Unregistered Vehicle</Text>

                </TouchableOpacity>

                {
        
                this.state.ActivityIndicator_Loading ? <ActivityIndicator color='#009688' size='large'style={styles.ActivityIndicatorStyle} /> : null
                
                }
      </View>      

  </View>
</ScrollView>
      <Text> Added Unregistered Vehicles </Text>     
    <Table borderStyle={{borderWidth: 2, borderColor: 'black'}}>
       <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text}/>
    </Table> 
        <FlatList
      data={ this.state.JSONResult }

      ItemSeparatorComponent = {this.ItemSeparatorLine}
 
          renderItem={({item}) => 
        <TouchableOpacity activeOpacity={0.9}>
          <View style={styles.item} >
        
          <Text style={styles.FlatListItemStyle}> {item.rego} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  {item.size}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   {item.effectiveQuater}&nbsp;&nbsp;&nbsp;</Text>

          </View>
        </TouchableOpacity>
        }
        keyExtractor={(item, index) => index}
        />  
                
            </View>
        </View>);
    }
}

export class CommercialVehicles extends Component {
  state = {
    image: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      description: '',
      quantity: '',
      tankSize: '',  
      purpose: '',
      effectiveQuater: '',
      ActivityIndicator_Loading: false,   
          JSONResult: "",
          tableHead: ['Name', 'Size', 'Effective'],      
    };
  this.getListCall = this.getListCall.bind(this);
  this.insert_commercialEquipments = this.insert_commercialEquipments.bind(this);
  
}

componentDidMount(){
  this.getListCall();
}
 //this.props.navigation.state.params.baseURL+'?ct=api&api=fuel_refund&act=put'
getListCall(){
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=vehicles&act=getEquipments';
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
 console.log(result.data);
  if(!result.error){
   that.setState({ 
     JSONResult: result.data.vehicles,
   });
  }
 }).catch(function (error) {
   console.log("-------- error ------- "+error);
  alert("result:"+error)
 });
}

//function to insert registered vehicles
insert_commercialEquipments() {
        var rego_details = {         
                  rego : this.state.description,  
                  purpose : this.state.purpose,  
                  tankSize: this.state.tankSize,  
                  effectiveQuater : this.state.effectiveQuater,
                  quantity : this.state.quantity,
                  vehicle_type : 'Equipments',
                  };
        this.setState({ ActivityIndicator_Loading : true }, () =>
        { 
            console.log(rego_details);
            console.log(this.props.navigation.state.params.baseURL+'?ct=api&api=vehicles&act=put');
            fetch(this.props.navigation.state.params.baseURL+'?ct=api&api=vehicles&act=put',
            {
                method: 'POST',
                credentials: 'same-origin',
                 headers: 
                 {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                 },
                body: JSON.stringify(rego_details)
            }).then((response) => response.json()).then((res) =>
            {
                  console.log(res)
                alert('Vehicle Reference ID is '+res.data.vehicle_id);
 
                this.setState({ ActivityIndicator_Loading : false });
 
            }).catch((error) =>
            {
                console.error(error);
 
                this.setState({ ActivityIndicator_Loading : false});
            });
        });
  }
    render() {
               let quarter = [{
      value: 'March',
    }, {
      value: 'June',
    }, {
      value: 'September',
    }, {
      value: 'December',
    }];
        return (<View style={{
            flex: 1,
            flexDirection: 'column',
        }}> 
        <HeaderNavigationBar {...this.props} />
            <View style={{
                flex: 1,
                backgroundColor: 'lightgreen',
                title: 'Apply Fuel Refund'
            }}>
            
<ScrollView>
  <View style={styles.container} behavior="padding">
   <Text> Add Commercial Purpose Equipments </Text>
   <View style={styles.textInput}>
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'white'
    }}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    placeholder="Description"
    onChangeText ={description => this.setState({ description })}
      />
    </View>      

   <View style={styles.textInput}>
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'white'
    }}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    placeholder="Tank Size"
    onChangeText ={tankSize => this.setState({ tankSize })}
      />
    </View> 

    <View style={styles.textInput}>
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'white'
    }}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    placeholder="Quantity"
    onChangeText ={quantity => this.setState({ quantity })}
      />
    </View>         

<View style={styles.Dropdown}>
  <Dropdown containerStyle={{flex:1,color:'white'}}
    label='Effective Quarter'
    data={quarter}
    onChangeText ={effectiveQuater => this.setState({ effectiveQuater })}
  />
</View>       

    <View style={styles.textInput}>
    <TextInput
        style={styles.TextInputStyleClass}
        underlineColorAndroid="transparent"
        placeholder={"Purpose / Use"}
        numberOfLines={2}
        multiline={true}
        onChangeText ={purpose => this.setState({ purpose })}
      />
    </View>

    <View style={{ marginTop: 15 }}>

                <TouchableOpacity 
                  activeOpacity = { 0.5 } 
                  style = { styles.TouchableOpacityStyle } 
                  onPress = { this.insert_commercialEquipments }>

                    <Text style = { styles.TextStyle }>Add Commercial Equipment</Text>

                </TouchableOpacity>

                {
        
                this.state.ActivityIndicator_Loading ? <ActivityIndicator color='#009688' size='large'style={styles.ActivityIndicatorStyle} /> : null
                
                }
      </View>      

  </View>
</ScrollView>
      <Text> Added Commercial Equipments </Text>     
    <Table borderStyle={{borderWidth: 2, borderColor: 'black'}}>
       <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text}/>
    </Table> 
        <FlatList
      data={ this.state.JSONResult }

      ItemSeparatorComponent = {this.ItemSeparatorLine}
 
          renderItem={({item}) => 
        <TouchableOpacity activeOpacity={0.9}>
          <View style={styles.item} >
        
          <Text style={styles.FlatListItemStyle}> {item.rego} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  {item.size}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   {item.effectiveQuater}&nbsp;&nbsp;&nbsp;</Text>

          </View>
        </TouchableOpacity>
        }
        keyExtractor={(item, index) => index}
        />  
                
            </View>
        </View>);
    }
}

export class RUCVehicles extends Component {
  state = {
    image: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      approxFuel: '',
      regno: '',
      vin: '',
      make: '',
      year: '',
      tankSize: '',  
      purpose:'',
      effectiveQuater:'',
      ActivityIndicator_Loading: false,
          JSONResult: "",
          tableHead: ['Name', 'Size', 'Effective'],         
    };
  this.handleSubmit = this.handleSubmit.bind(this);
  this.getListCall = this.getListCall.bind(this);
  this.insert_RUCVehicles = this.insert_RUCVehicles.bind(this);
  
}

componentDidMount(){
  this.getListCall();
}
 //this.props.navigation.state.params.baseURL+'?ct=api&api=fuel_refund&act=put'
getListCall(){
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=vehicles&act=getRUC';
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
 console.log(result.data);
  if(!result.error){
   that.setState({ 
     JSONResult: result.data.vehicles,
   });
  }
 }).catch(function (error) {
   console.log("-------- error ------- "+error);
  alert("result:"+error)
 });
}


  handleSubmit() {
    alert('Fetching your vehicle details...')
    getRegoInfo(this.state.regno)
    .then((res) => {
      this.setState({
        data: res
      })      
      if(this.state.data.idh.vehicle.make == '') {
        this.setState({
 
        make: 'Vehicle not found',
        year: 'Vehicle not found',
        vin: 'Vehicle not found',
        model: '',
 
        })
      }
    else {
      this.setState({
        regno: this.state.regno,
        make: this.state.data.idh.vehicle.make,
        model: this.state.data.idh.vehicle.model,
        vin: this.state.data.idh.vehicle.vin,
        year: this.state.data.idh.vehicle.year_of_manufacture
 
      })
      console.log(this.state.data.idh.vehicle.make);
      console.log(this.state.data.idh.vehicle.model);
      console.log(this.state.data.idh.vehicle.vin);
      console.log(this.state.data.idh.vehicle.year_of_manufacture);
      this.setState({
        error: false,
      })
    }
});

}

//function to insert registered vehicles
insert_RUCVehicles() {
        var rego_details = {         
                  rego : this.state.regno,  
                  vin : this.state.vin,
                  make : this.state.make,
                  year : this.state.year,
                  purpose : this.state.purpose,  
                  tankSize: this.state.tankSize,  
                  effectiveQuater : this.state.effectiveQuater,
                  approxFuel : this.state.approxFuel,
                  vehicle_type : 'RUCVehicles',
                  };
        this.setState({ ActivityIndicator_Loading : true }, () =>
        { 
            console.log(rego_details);
            console.log(this.props.navigation.state.params.baseURL+'?ct=api&api=vehicles&act=put');
            fetch(this.props.navigation.state.params.baseURL+'?ct=api&api=vehicles&act=put',
            {
                method: 'POST',
                credentials: 'same-origin',
                 headers: 
                 {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                 },
                body: JSON.stringify(rego_details)
            }).then((response) => response.json()).then((res) =>
            {
                  console.log(res)
                alert('Vehicle Reference ID is '+res.data.vehicle_id);
 
                this.setState({ ActivityIndicator_Loading : false });
 
            }).catch((error) =>
            {
                console.error(error);
 
                this.setState({ ActivityIndicator_Loading : false});
            });
        });
  }

    render() {
               let quarter = [{
      value: 'March',
    }, {
      value: 'June',
    }, {
      value: 'September',
    }, {
      value: 'December',
    }];
        return (<View style={{
            flex: 1,
            flexDirection: 'column',
        }}> 
        <HeaderNavigationBar {...this.props} />
            <View style={{
                flex: 1,
                backgroundColor: 'lightgreen',
                title: 'Apply Fuel Refund'
            }}>
            
<ScrollView>
  <View style={styles.container} behavior="padding">
   <Text> Add RUC Vehicles </Text>
   <View style={styles.textInput}>
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'white'
    }}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    placeholder="Rego Number"
    onChangeText ={regno => this.setState({ regno })}
    onBlur = {this.handleSubmit}
      />
    </View>      

    <View style={styles.textInput}>
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'white'
    }}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    placeholder="Vin No"
    value={this.state.vin}
      />
    </View>        
     
    <View style={styles.textInput}>
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'white'
    }}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    placeholder="Make/Model">
      {this.state.make} / {this.state.model }
      </TextInput>
    </View>    
    <View style={styles.textInput}>
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'white'
    }}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    placeholder="Year"
    value={this.state.year}
      />
    </View>   

   <View style={styles.textInput}>
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'white'
    }}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    placeholder="Approximate Fuel Efficiency"
    onChangeText ={approxFuel => this.setState({ approxFuel })}
      />
    </View>     

   <View style={styles.textInput}>
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'white'
    }}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    placeholder="Tank Size"
    onChangeText ={tankSize => this.setState({ tankSize })}
      />
    </View> 

<View style={styles.Dropdown}>
  <Dropdown containerStyle={{flex:1,color:'white'}}
    label='Effective Quarter'
    data={quarter}
    onChangeText ={effectiveQuater => this.setState({ effectiveQuater })}
  />
</View>      

    <View style={styles.textInput}>
    <TextInput
        style={styles.TextInputStyleClass}
        underlineColorAndroid="transparent"
        placeholder={"Purpose / Use"}
        numberOfLines={2}
        multiline={true}
        onChangeText ={purpose => this.setState({ purpose })}
      />
    </View>

    <View style={{ marginTop: 15 }}>

                <TouchableOpacity 
                  activeOpacity = { 0.5 } 
                  style = { styles.TouchableOpacityStyle } 
                  onPress = { this.insert_RUCVehicles }>

                    <Text style = { styles.TextStyle }>Add RUC Vehicle</Text>

                </TouchableOpacity>

                {
        
                this.state.ActivityIndicator_Loading ? <ActivityIndicator color='#009688' size='large'style={styles.ActivityIndicatorStyle} /> : null
                
                }
      </View>      

  </View>
</ScrollView>
      <Text> Added RUC Vehicles </Text>     
    <Table borderStyle={{borderWidth: 2, borderColor: 'black'}}>
       <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text}/>
    </Table> 
        <FlatList
      data={ this.state.JSONResult }

      ItemSeparatorComponent = {this.ItemSeparatorLine}
 
          renderItem={({item}) => 
        <TouchableOpacity activeOpacity={0.9}>
          <View style={styles.item} >
        
          <Text style={styles.FlatListItemStyle}> {item.rego} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  {item.size}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   {item.effectiveQuater}&nbsp;&nbsp;&nbsp;</Text>

          </View>
        </TouchableOpacity>
        }
        keyExtractor={(item, index) => index}
        /> 
                
            </View>
        </View>);
    }
}

export class CommercialVessels extends Component {
  state = {
    image: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      maritimeCert: '',
      tankSize: '',  
      purpose:'',
      effectiveQuater:'',
      ActivityIndicator_Loading: false,  
          JSONResult: "",
          tableHead: ['Name', 'Size', 'Effective'],       
    };
  
  this.getListCall = this.getListCall.bind(this);
  this.insert_commercialVessels = this.insert_commercialVessels.bind(this);
  
}

componentDidMount(){
  this.getListCall();
}
 //this.props.navigation.state.params.baseURL+'?ct=api&api=fuel_refund&act=put'
getListCall(){
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=vehicles&act=getVessels';
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
 console.log(result.data);
  if(!result.error){
   that.setState({ 
     JSONResult: result.data.vehicles,
   });
  }
 }).catch(function (error) {
   console.log("-------- error ------- "+error);
  alert("result:"+error)
 });
}

//function to insert registered vehicles
insert_commercialVessels() {
        var rego_details = {         
                  rego : this.state.name,  
                  purpose : this.state.purpose,  
                  tankSize: this.state.tankSize,  
                  maritimeCert : this.state.maritimeCert,
                  effectiveQuater : this.state.effectiveQuater,
                  vehicle_type : 'Vessels',
                  };
        this.setState({ ActivityIndicator_Loading : true }, () =>
        { 
            console.log(rego_details);
            console.log(this.props.navigation.state.params.baseURL+'?ct=api&api=vehicles&act=put');
            fetch(this.props.navigation.state.params.baseURL+'?ct=api&api=vehicles&act=put',
            {
                method: 'POST',
                credentials: 'same-origin',
                 headers: 
                 {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                 },
                body: JSON.stringify(rego_details)
            }).then((response) => response.json()).then((res) =>
            {
                  console.log(res)
                alert('Vehicle Reference ID is '+res.data.vehicle_id);
 
                this.setState({ ActivityIndicator_Loading : false });
 
            }).catch((error) =>
            {
                console.error(error);
 
                this.setState({ ActivityIndicator_Loading : false});
            });
        });
  }

    render() {
               let quarter = [{
      value: 'March',
    }, {
      value: 'June',
    }, {
      value: 'September',
    }, {
      value: 'December',
    }];
        return (<View style={{
            flex: 1,
            flexDirection: 'column',
        }}> 
        <HeaderNavigationBar {...this.props} />
            <View style={{
                flex: 1,
                backgroundColor: 'lightgreen',
                title: 'Apply Fuel Refund'
            }}>
            
<ScrollView>
  <View style={styles.container} behavior="padding">
   <Text> Add Commercial Vessel </Text>
   <View style={styles.textInput}>
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'white'
    }}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    placeholder="Name of Vessel"
    onChangeText ={name => this.setState({ name })}
      />
    </View>      

   <View style={styles.textInput}>
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'white'
    }}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    placeholder="Maritime Certificate Number"
    onChangeText ={maritimeCert => this.setState({ maritimeCert })}
      />
    </View> 

    <View style={styles.textInput}>
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'white'
    }}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    placeholder="Tank Size"
    onChangeText ={tankSize => this.setState({ tankSize })}
      />
    </View>         

<View style={styles.Dropdown}>
  <Dropdown containerStyle={{flex:1,color:'white'}}
    label='Effective Quarter'
    data={quarter}
    onChangeText ={effectiveQuater => this.setState({ effectiveQuater })}
  />
</View>   

    <View style={styles.textInput}>
    <TextInput
        style={styles.TextInputStyleClass}
        underlineColorAndroid="transparent"
        placeholder={"Purpose / Use"}
        numberOfLines={2}
        multiline={true}
        onChangeText ={purpose => this.setState({ purpose })}
      />
    </View>

    <View style={{ marginTop: 15 }}>

                <TouchableOpacity 
                  activeOpacity = { 0.5 } 
                  style = { styles.TouchableOpacityStyle } 
                  onPress = { this.insert_commercialVessels }>

                    <Text style = { styles.TextStyle }>Add Commercial Vessel</Text>

                </TouchableOpacity>

                {
        
                this.state.ActivityIndicator_Loading ? <ActivityIndicator color='#009688' size='large'style={styles.ActivityIndicatorStyle} /> : null
                
                }
      </View>      

  </View>
</ScrollView>
      <Text> Added Commercial Vessels </Text>     
    <Table borderStyle={{borderWidth: 2, borderColor: 'black'}}>
       <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text}/>
    </Table> 
        <FlatList
      data={ this.state.JSONResult }

      ItemSeparatorComponent = {this.ItemSeparatorLine}
 
          renderItem={({item}) => 
        <TouchableOpacity activeOpacity={0.9}>
          <View style={styles.item} >
        
          <Text style={styles.FlatListItemStyle}> {item.rego} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  {item.size}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   {item.effectiveQuater}&nbsp;&nbsp;&nbsp;</Text>

          </View>
        </TouchableOpacity>
        }
        keyExtractor={(item, index) => index}
        /> 
                
            </View>
        </View>);
    }
}


export class FuelContainer extends Component {
  state = {
    image: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      containerSize: '',  
      purpose:'',
      effectiveQuater:'',
      ActivityIndicator_Loading: false, 
           
    JSONResult: "",
          tableHead: ['Name', 'Size', 'Effective'],
      tableData: []  
    };
        this.insert_fuelContainer = this.insert_fuelContainer.bind(this);
        this.getListCall= this.getListCall.bind(this);
}

componentDidMount(){
  this.getListCall();
}
 //this.props.navigation.state.params.baseURL+'?ct=api&api=fuel_refund&act=put'
getListCall(){
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=tanks&act=get';
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
 console.log(result.data);
  if(!result.error){
   that.setState({ 
     JSONResult: result.data.refunds,
   });
  }
 }).catch(function (error) {
   console.log("-------- error ------- "+error);
  alert("result:"+error)
 });
}


//function to insert fuel Containers
 insert_fuelContainer() {
        var container_details = { 
                  name : this.state.name,
                  containerSize : this.state.containerSize,
                  purpose : this.state.purpose,
                  effectiveQuater : this.state.effectiveQuater,
                  };
        this.setState({ ActivityIndicator_Loading : true }, () =>
        { 
            console.log(container_details);
            console.log(this.props.navigation.state.params.baseURL+'?ct=api&api=tanks&act=put');
            fetch(this.props.navigation.state.params.baseURL+'?ct=api&api=tanks&act=put',
            {
                method: 'POST',
                credentials: 'same-origin',
                 headers: 
                 {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                 },
                body: JSON.stringify(container_details)
            }).then((response) => response.json()).then((res) =>
            {
                  console.log(res)
                alert('Tank Reference ID is '+res.data.tank_id);
 
                this.setState({ ActivityIndicator_Loading : false });
 
            }).catch((error) =>
            {
                console.error(error);
 
                this.setState({ ActivityIndicator_Loading : false});
            });
        });
  }

    render() {
               let quarter = [{
      value: 'March',
    }, {
      value: 'June',
    }, {
      value: 'September',
    }, {
      value: 'December',
    }];
        return (<View style={{
            flex: 1,
            flexDirection: 'column',
        }}> 
        <HeaderNavigationBar {...this.props} />
            <View style={{
                flex: 1,
                backgroundColor: 'lightgreen',
            }}>
            
<ScrollView>
  <View style={styles.container} behavior="padding">
   <Text> Add Fuel Container </Text>
   <View style={styles.textInput}>
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'white'
    }}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    placeholder="Name of Container"
    onChangeText ={name => this.setState({ name })}
      />
    </View>      

   <View style={styles.textInput}>
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'white'
    }}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    placeholder="Container Size in Litres"
    onChangeText ={containerSize => this.setState({ containerSize })}
      />
    </View>         

<View style={styles.Dropdown}>
  <Dropdown containerStyle={{flex:1,color:'white'}}
    label='Effective Quarter'
    data={quarter}
    onChangeText ={effectiveQuater => this.setState({ effectiveQuater })}
  />
</View>      

    <View style={styles.textInput}>
    <TextInput
        style={styles.TextInputStyleClass}
        underlineColorAndroid="transparent"
        placeholder={"Purpose / Use"}
        numberOfLines={2}
        multiline={true}
        onChangeText ={purpose => this.setState({ purpose })}
      />
    </View>

    <View style={{ marginTop: 15 }}>

                <TouchableOpacity 
                  activeOpacity = { 0.5 } 
                  style = { styles.TouchableOpacityStyle } 
                  onPress = { this.insert_fuelContainer }>

                    <Text style = { styles.TextStyle }>Add Fuel Container</Text>

                </TouchableOpacity>

                {
        
                this.state.ActivityIndicator_Loading ? <ActivityIndicator color='#009688' size='large'style={styles.ActivityIndicatorStyle} /> : null
                
                }
      </View>      

  </View>

</ScrollView>
  <Text> Added Fuel Containers </Text>    
  <Table borderStyle={{borderWidth: 2, borderColor: 'black'}}>
    <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text}/>
  </Table> 
        <FlatList
      data={ this.state.JSONResult }

      ItemSeparatorComponent = {this.ItemSeparatorLine}
 
          renderItem={({item}) => 
        <TouchableOpacity activeOpacity={0.9}>
          <View style={styles.item} >
        
          <Text style={styles.FlatListItemStyle}> {item.name} &nbsp;&nbsp;&nbsp;  {item.size}&nbsp;&nbsp;&nbsp;&nbsp;  {item.effective_Quater}</Text>

          </View>
        </TouchableOpacity>
        }
        keyExtractor={(item, index) => index}
        />                
            </View>
        </View>);
    }
}

export class Setproportion extends Component {
  state = {
    image: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      container: '',
      vehicles: '',  
      proportion:'',
      effectiveQuater:'',
      ActivityIndicator_Loading: false, 
           
    JSONResult: "",
          tableHead: ['Name', 'Proportion', 'Effective'],
      Tanks: [],
      Vehicles:[],  
    };
        this.setproportion = this.setproportion.bind(this);
        this.getListCall= this.getListCall.bind(this);
}

componentDidMount(){
  this.getListCall();
  this.getContainers();
  this.getVehicles();
}
 //this.props.navigation.state.params.baseURL+'?ct=api&api=fuel_refund&act=put'
getListCall(){
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=vehicles&act=getProp';
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
 console.log(result.data);
  if(!result.error){
   that.setState({ 
     JSONResult: result.data.vehicles,
   });
  }
 }).catch(function (error) {
   console.log("-------- error ------- "+error);
  alert("result:"+error)
 });
}

// Get all Tanks
getContainers(){
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=tanks&act=getTanks';
console.log("-----------url:"+url);
fetch(url,{method: 'GET'}).then(function (response) {
    return response.json();
  }).then(function (result) {
  if(!result.error){
   that.setState({ 
     Tanks: result.data.tanks,

   });
   console.log(that.state.Tanks);

  }
 }).catch(function (error) {
   console.log("-------- error ------- "+error);
  alert("result:"+error)
 });
}

// Get all Vehicles
getVehicles(){
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=vehicles&act=getVehicles';
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
  if(!result.error){
   that.setState({ 
     Vehicles: result.data.vehicles,

   });
   console.log(that.state.Vehicles);

  }
 }).catch(function (error) {
   console.log("-------- error ------- "+error);
  alert("result:"+error)
 });
}

 //function to insert fuel Containers
 setproportion() {
        var container_details = { 
                  container : this.state.container,
                  vehicles : this.state.vehicles,
                  effectiveQuater : this.state.effectiveQuater,
                  proportion: this.state.proportion,                  
                  };
        this.setState({ ActivityIndicator_Loading : true }, () =>
        { 
            console.log(container_details);
            console.log(this.props.navigation.state.params.baseURL+'?ct=api&api=proportion&act=put');
            fetch(this.props.navigation.state.params.baseURL+'?ct=api&api=proportion&act=put',
            {
                method: 'POST',
                credentials: 'same-origin',
                 headers: 
                 {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                 },
                body: JSON.stringify(container_details)
            }).then((response) => response.json()).then((res) =>
            {
                  console.log(res)
                alert('Proportion Reference ID is '+res.data.prop_id);
 
                this.setState({ ActivityIndicator_Loading : false });
 
            }).catch((error) =>
            {
                console.error(error);
 
                this.setState({ ActivityIndicator_Loading : false});
            });
        });
  }

    render() {
               let quarter = [{
      value: 'March',
    }, {
      value: 'June',
    }, {
      value: 'September',
    }, {
      value: 'December',
    }];
        return (<View style={{
            flex: 1,
            flexDirection: 'column',
        }}> 
        <HeaderNavigationBar {...this.props} />
            <View style={{
                flex: 1,
                backgroundColor: 'lightgreen',
            }}>
            
<ScrollView>
  <View style={styles.container} behavior="padding">
<Text style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'purple'
    }}> Add/Update Proportion </Text> 
 
<View style={styles.Dropdown}>
  <Dropdown containerStyle={{flex:1,color:'white'}}
    label='Select a Container'
    data={this.state.Tanks}
    onChangeText ={container => this.setState({ container })}
  />
</View>

<View style={styles.Dropdown}>
  <Dropdown containerStyle={{flex:1,color:'white'}}
    label='Select a Vehicle'
    data={this.state.Vehicles}
    onChangeText ={vehicles => this.setState({ vehicles })}
  />
</View>
  
<View style={styles.Dropdown}>
  <Dropdown containerStyle={{flex:1,color:'white'}}
    label='Effective Quarter'
    data={quarter}
    onChangeText ={effectiveQuater => this.setState({ effectiveQuater })}
  />
</View> 

    <View style={styles.textInput}>
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'white'
    }}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    placeholder="Proportion %"
    onChangeText ={proportion => this.setState({ proportion })}
      />
    </View>       

    <View style={{ marginTop: 15 }}>

                <TouchableOpacity 
                  activeOpacity = { 0.5 } 
                  style = { styles.TouchableOpacityStyle } 
                  onPress = { this.setproportion }>

                    <Text style = { styles.TextStyle }>Set proportion</Text>

                </TouchableOpacity>

                {
        
                this.state.ActivityIndicator_Loading ? <ActivityIndicator color='#009688' size='large'style={styles.ActivityIndicatorStyle} /> : null
                
                }
      </View>      

  </View>
 

</ScrollView>



            </View>
        </View>);
    }
}

export class Report extends Component {

  constructor(props) {
    super(props);
    this.ref= 'signatureCanvas';
    this.state = {
      openingBalance: '',
      closingBalance: '',  
      signature:'',
      quarter:'',
      container:'',
      ActivityIndicator_Loading: false,
          JSONResult: "", 
    };
        this.generateReport = this.generateReport.bind(this);
                this.getContainers= this.getContainers.bind(this);
}

componentDidMount(){
  this.getContainers();
}
// Get all Tanks
getContainers(){
var that = this;
var url = this.props.navigation.state.params.baseURL+'?ct=api&api=tanks&act=getTanks';
console.log("-----------url:"+url);
fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
    return response.json();
  }).then(function (result) {
  if(!result.error){
   that.setState({ 
     Tanks: result.data.tanks,

   });
   console.log(that.state.Tanks);

  }
 }).catch(function (error) {
   console.log("-------- error ------- "+error);
  alert("result:"+error)
 });
}
 //function to generate report
 generateReport() {
        var container_details = { 
                  openingBalance : this.state.openingBalance,
                  closingBalance : this.state.closingBalance,
                  signature : this.state.signature,
                  quarter: this.state.quarter,                  
                  };
        this.setState({ ActivityIndicator_Loading : true }, () =>
        { 
            console.log(container_details);
            console.log(this.props.navigation.state.params.baseURL+'?ct=api&api=fuel_refund&act=generateReport');
            fetch(this.props.navigation.state.params.baseURL+'?ct=api&api=fuel_refund&act=generateReport',
            {
                method: 'POST',
                credentials: 'same-origin',
                 headers: 
                 {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
                 },
                body: JSON.stringify(container_details)
            }).then((response) => response.json()).then((res) =>
            {
                  console.log(res)
                alert('Report Reference ID is '+res.data.report_id);
 
                this.setState({ ActivityIndicator_Loading : false });
 
            }).catch((error) =>
            {
                console.error(error);
 
                this.setState({ ActivityIndicator_Loading : false});
            });
        });
  }

    render() {
         let quarter = [{
      value: 'March',
    }, {
      value: 'June',
    }, {
      value: 'September',
    }, {
      value: 'December',
    }];
        return (<View style={{
            flex: 1,
            flexDirection: 'column',
        }}> 
        <HeaderNavigationBar {...this.props} />
            <View style={{
                flex: 1,
                backgroundColor: 'lightgreen',
            }}>
            
<ScrollView>
  <View style={styles.container} behavior="padding">
<Text style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'purple'
    }}> Generate Fuel Refund Report </Text> 

<View style={styles.Dropdown}>
  <Dropdown containerStyle={{flex:1,color:'white'}}
    label='Select a Container'
    data={this.state.Tanks}
    onChangeText ={container => this.setState({ container })}
  />
</View>

<View style={styles.Dropdown}>
  <Dropdown containerStyle={{flex:1,color:'white'}}
    label='Select a Quarter'
    data={quarter}
    onChangeText ={quarter => this.setState({ quarter })}
  />
</View> 

    <View style={styles.textInput}>
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'white'
    }}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    placeholder="Opening Balance"
    onChangeText ={openingBalance => this.setState({ openingBalance })}
      />
    </View>   

    <View style={styles.textInput}>
      <TextInput
          style={{
      fontSize: 15,
      height: 30,
      flex: 1,
      color: 'white'
    }}
    autoCorrect={false}
    spellCheck={false}
    underlineColorAndroid='transparent'
    placeholder="Closing Balance"
    onChangeText ={closingBalance => this.setState({ closingBalance })}
      />
    </View>        


    <View style={{ marginTop: 15 }}>

                <TouchableOpacity 
                  activeOpacity = { 0.5 } 
                  style = { styles.TouchableOpacityStyle } 
                  onPress = { this.generateReport }>

                    <Text style = { styles.TextStyle }>Generate Report</Text>

                </TouchableOpacity>

                {
        
                this.state.ActivityIndicator_Loading ? <ActivityIndicator color='#009688' size='large'style={styles.ActivityIndicatorStyle} /> : null
                
                }
      </View>      

  </View>
 

</ScrollView>



            </View>
        </View>);

    }

}


// export class Logout extends Component {
//     constructor(props) {
//     super(props);
//     this.state = {
//       ActivityIndicator_Loading: false,
//     };
// }

//     render() {
//       const {navigate} = this.props.navigation;
//         return (
//            <View style={styles.containerLogoff} behavior="padding">
//              <Image style={styles.logo} source={require("../assets/Agrismart-Logo.png")} resizeMode='contain'/>
//            <View>
//           <Text>Thank You for using Agrismart App</Text></View>
//       <Button
//         buttonStyle={{backgroundColor: '#71BF44'}}
//         title="Click to Login"
//         onPress={() => this.props.navigation.push('PinLogin')}
//       />
        
//       </View>  //                 this.props.navigation.push('LoginUser')
// //                         Alert.alert(
// //   'Logoff',
// //   'Are you sure you want to close the app ?',
// //   [
// //     {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
// //     {text: 'Yes', onPress: () => NavigationActions.navigate({ routeName: 'LoginUser' })},
// //   ],
// //   { cancelable: false }
// // )
//         )
//     }

// }


const Refund = createStackNavigator({
      FuelRefund:{
        screen:FuelRefund,
        defaultNavigationOptions: {
          drawerLabel: 'Fuel Refund',
          drawerIcon: ({ tintColor }) => { return (<Ionicons name="ios-funnel" style={{ fontSize: 24 }} />) }    
        },           
      },
      SearchRefund:{
        screen:SearchRefund,
        defaultNavigationOptions: {
          drawerLabel: 'Search Refund',
          drawerIcon: ({ tintColor }) => { return (<Ionicons name="md-search" style={{ fontSize: 24 }} />) }    
        },   
             
      },
      Add_Fuel_Container:{
        screen:FuelContainer,
        defaultNavigationOptions: {
          drawerLabel: 'Add Fuel Container',
          drawerIcon: ({ tintColor }) => { return (<MaterialCommunityIcons name="fuel" style={{ fontSize: 24 }} />) }
        }        
      },       
      Add_Registered_Vehicles:{
        screen:RegisteredVehicles,
        defaultNavigationOptions: {
          drawerLabel: 'Add Registered Vehicles',
          drawerIcon: ({ tintColor }) => { return (<FontAwesome name="registered" style={{ fontSize: 24 }} />) }    
        }        
      },     
      Add_Unregistered_Vehicles:{
        screen:UnregisteredVehicles,
        defaultNavigationOptions: {
          drawerLabel: 'Add Unregistered Vehicles',
          drawerIcon: ({ tintColor }) => { return (<Ionicons name="md-car" style={{ fontSize: 24 }} />) }    
        }          
      },   
      Add_Commercial_Equipments:{
        screen:CommercialVehicles,
        defaultNavigationOptions: {
          drawerLabel: 'Add Commercial Equipments',
          drawerIcon: ({ tintColor }) => { return (<FontAwesome name="scissors" style={{ fontSize: 24 }} />) }   
        }         
      },        
      Add_RUC_Vehicles:{
        screen:RUCVehicles,
        defaultNavigationOptions: {
          drawerLabel: 'Add RUC Vehicles',
          drawerIcon: ({ tintColor }) => { return (<FontAwesome name="road" style={{ fontSize: 24 }} />) }  
        }         
      },       
      Add_Commericial_Vessel:{
        screen:CommercialVessels,
        defaultNavigationOptions: {
          drawerLabel: 'Add Commercial Vessels',
          drawerIcon: ({ tintColor }) => { return (<FontAwesome name="ship" style={{ fontSize: 24 }} />) } 
        }         
      },
      Add_proportion:{
        screen:Setproportion,
        defaultNavigationOptions: {
          drawerLabel: 'Set proportion',
          drawerIcon: ({ tintColor }) => { return (<FontAwesome name="percent" style={{ fontSize: 24 }} />) } 
        }         
      },     
      Report:{
        screen:Report,
        defaultNavigationOptions: {
          drawerLabel: 'Generate Fuel Refund Report',
          drawerIcon: ({ tintColor }) => { return (<FontAwesome name="file-pdf-o" style={{ fontSize: 24 }} />) } 
        }         
      },                              
    },{
        initialRouteName:'FuelRefund',
        title: 'Fuel Refund'
    }
)


const FuelRefunds = createAppContainer(Refund);
export default FuelRefunds;
//    module.exports = FuelRefund;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'lightgreen',
    padding: 20,
  },
  containerLogoff: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 20,
  },  
textInput: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    borderWidth: 0.5,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 10,
    backgroundColor: '#686C7E',
    color: 'white', 
    flex:1
  },
textInput1: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    borderWidth: 1,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 10,
    backgroundColor: 'white',
    color: 'black', 
    flex:1
  },  
Dropdown: {
    alignItems: 'center',
    borderRadius: 5,
    flexDirection: 'row',
    borderWidth: 0.5,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 5,
    backgroundColor: '#686C7E',
    color: 'white', 
    flex:1,
    height:50
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
 
    TouchableOpacityStyle:
   {
      paddingTop:10,
      paddingBottom:10,
      backgroundColor:'#686C7E',
      marginBottom: 20,
      width: '90%'
 
    },
 
    TextStyle:
    {
       color: '#fff',
        textAlign: 'center',
        fontSize: 18
    },

    ActivityIndicatorStyle:{
      
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
    
  },
  FlatListItemStyle: {
    alignItems: 'center',
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  item: {
    backgroundColor: 'white',
    // alignItems: 'center',
    // justifyContent: 'center',
    flex: 1,
    margin: 1,
    height: 40, // approximate a square
  },
    head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 }

});