import React, { PureComponent } from 'react';
import { TextInput, View, StyleSheet, Image, KeyboardAvoidingView, Text, Dimensions, NetInfo, Alert, ImageBackground, ActivityIndicator,Picker, Animated, TouchableWithoutFeedback,Platform,FlatList,TouchableOpacity, ScrollView} from 'react-native';
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
import { Section, TableView, Separator, Cell } from 'react-native-tableview-simple';
import { Table, Row, Rows } from 'react-native-table-component';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width: WindowWidth } = Dimensions.get('window');

const { width } = Dimensions.get('window');

const db = SQLite.openDatabase('db.db');

class ConfirmHoursDetails extends PureComponent {
  static navigationOptions = {
//    header:null,
headerTintColor: 'white',
title: "Confirm Hours",
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
      DeductionsTotal:0,
      PaymentsTotal:0,
      Payslip:[],
      advance_amounts:[],
      BonusPayments:[],
      NTAItems:[],
      ExtraTax:[],
      DeductionItems:[],
      PHead:   ['Payments','Hours','Amount'],
      DHead:   ['Deductions','Amount'],
      PAHead:  ['Pay Advance','Amount'],
      EHead:   ['Extra Payments','Amount'],
      ETHead:  ['Extra Tax','Amount'],
      NTAHead: ['Non-Taxable Allowances','Amount'],
      LBHead:  ['                             Leave Balances'],
      LBBHead: ['Annual\nLeave','Future Approved Leave','Alternate\nDays','Sick Leave'],
      LBB1Head: ['Annual Leave','Alternate Days','Sick Leave'],
      LBB2Head: ['       Alternate Days','          Sick Leave'],
      YTDHead: ['                             Year To Date '], 
      YTDDHead:['Total\nPayments','Total\nDeductions','Net Pay','Total NTA'],        
      KHead:   ['Employer KiwiSaver','%','Amount'],   
      NHead:   ['Net Pay','Amount'],
    };
      this.DisplayPayments = this.DisplayPayments.bind(this);
      this.DisplayDeductions = this.DisplayDeductions.bind(this);
      this.DisplayPA = this.DisplayPA.bind(this);
      this.DisplayEP = this.DisplayEP.bind(this);
      this.DisplayNTA = this.DisplayNTA.bind(this);
      this.EmailPayslip = this.EmailPayslip.bind(this);
    }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    console.log('Payslip Details Screen')
    var that = this;
    that.setState({email:this.props.navigation.state.params.email,
                   password:this.props.navigation.state.params.password,
                   addPin:this.props.navigation.state.params.addPin,
                   firstName:this.props.navigation.state.params.firstName,
                   lastName:this.props.navigation.state.params.lastName,
                   task_id: this.props.navigation.state.params.task_id,
                   user_id: this.props.navigation.state.params.user_id,
                   AssignTo: this.props.navigation.state.params.assignTo,
                   Payslip: this.props.navigation.state.params.Payslip,
                   advance_amounts : this.props.navigation.state.params.Payslip.advance_amounts})
console.log(this.props.navigation.state.params.Payslip);
   this.props.navigation.setParams({ Count: this.props.navigation.state.params.notificationCount})                                    
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

DisplayPayments(){  
  return(   
    <View>  
    {this.state.Payslip.remuneration_type != 'Ordinary Pay' ?(
    <View style={styles.item}>
        <View style={{width:'50%'}}>
      <Text style={styles.FlatListItemStyle1}>{this.state.Payslip.remuneration_type}</Text>
        </View>  
        <View style={{width:'20%'}}>  
        {this.state.Payslip.paid_total_hours != 0 ?(               
        <Text style={styles.FlatListItemStyle2}>{this.state.Payslip.paid_total_hours}</Text>
        ):
         <Text style={styles.FlatListItemStyle2}></Text>
        }
        </View> 
        <View style={{width:'30%',alignItems:'flex-end'}}>
        <Text style={styles.FlatListItemStyle3}>${this.state.Payslip.gross_remuneration}</Text>
        </View>                  
      </View>
    ):null}  
   {this.state.Payslip.holiday_payg != 0 ? (   
    <View style={styles.item}>
        <View style={{width:'50%'}}>
      <Text style={styles.FlatListItemStyle1}>Holiday pay - pay as you go</Text>
        </View>  
        <View style={{width:'20%'}}>                 
        <Text style={styles.FlatListItemStyle2}></Text>
        </View> 
        <View style={{width:'30%',alignItems:'flex-end'}}>
        <Text style={styles.FlatListItemStyle3}>${this.state.Payslip.holiday_payg}</Text>
        </View>                  
      </View> 
   ): null }             
     <FlatList
      data={ this.state.Payslip.payment_items }

      ItemSeparatorComponent = {this.ItemSeparatorLine}
 
          renderItem={({item}) => 
      <TouchableOpacity  activeOpacity={0.9} style={{backgroundColor: 'white'}}>
            <ScrollView>
              <View style={styles.item}>
                 <View style={{width:'50%'}}>
                <Text style={styles.FlatListItemStyle1}>{item.description}</Text>
                 </View>               
                 <View style={{width:'20%'}}>  
                  {item.hours != 0 ?(                                 
                  <Text style={styles.FlatListItemStyle2}>{item.hours}</Text>
                   ):
                  <Text style={styles.FlatListItemStyle2}></Text>
                  }  
                 </View> 
                 <View style={{width:'30%',alignItems:'flex-end'}}>
                  <Text style={styles.FlatListItemStyle3}>${item.amount}</Text>
                 </View>                  
                </View> 
           </ScrollView>
      </TouchableOpacity>
        }
        keyExtractor={(item, index) => index}
        /> 
    <View style={styles.item}>
        <View style={{width:'50%'}}>
      <Text style={[styles.FlatListItemStyle1,{fontWeight:'bold'}]}>Total Taxable Payments</Text>
        </View>  
        <View style={{width:'20%'}}>                 
        <Text style={[styles.FlatListItemStyle2,{fontWeight:'bold'}]}></Text>
        </View> 
        <View style={{width:'30%',alignItems:'flex-end'}}>
        <Text style={[styles.FlatListItemStyle3,{fontWeight:'bold'}]}>${this.state.Payslip.total_income}</Text>
        </View>                  
      </View>         
     </View>    
           
  )
}

DisplayPA(){  
  return(   
    <View>                      
     <FlatList
      data={ this.state.Payslip.advance_amounts }

      ItemSeparatorComponent = {this.ItemSeparatorLine}
 
          renderItem={({item}) => 
      <TouchableOpacity  activeOpacity={0.9} style={{backgroundColor: 'white'}}>
            <ScrollView>
              <View style={styles.item}>
                 <View style={{width:'70%'}}>
                <Text style={styles.FlatListItemStyle1}>{item.description}</Text>
                 </View>   
                 <View style={{width:'30%',alignItems:'flex-end'}}>
                  <Text style={styles.FlatListItemStyle3}>${item.amount}</Text>
                 </View>                  
                </View> 
           </ScrollView>
      </TouchableOpacity>
        }
        keyExtractor={(item, index) => index}
        /> 
    <View style={styles.item}>
        <View style={{width:'50%'}}>
      <Text style={[styles.FlatListItemStyle1,{fontWeight:'bold'}]}>Pay Advance Total</Text>
        </View>  
        <View style={{width:'20%'}}>                 
        <Text style={[styles.FlatListItemStyle2,{fontWeight:'bold'}]}></Text>
        </View> 
        <View style={{width:'30%',alignItems:'flex-end'}}>
        <Text style={[styles.FlatListItemStyle3,{fontWeight:'bold'}]}>${this.state.Payslip.pay_advance_amount}</Text>
        </View>                  
      </View>         
     </View>    
           
  )
}

DisplayEP(){  
  return(   
    <View>                      
     <FlatList
      data={ this.state.Payslip.bonus_payments }

      ItemSeparatorComponent = {this.ItemSeparatorLine}
 
          renderItem={({item}) => 
      <TouchableOpacity  activeOpacity={0.9} style={{backgroundColor: 'white'}}>
            <ScrollView>
              <View style={styles.item}>
                 <View style={{width:'70%'}}>
                <Text style={styles.FlatListItemStyle1}>{item.description}</Text>
                 </View>   
                 <View style={{width:'30%',alignItems:'flex-end'}}>
                  <Text style={styles.FlatListItemStyle3}>${item.amount}</Text>
                 </View>                  
                </View> 
           </ScrollView>
      </TouchableOpacity>
        }
        keyExtractor={(item, index) => index}
        /> 
    <View style={styles.item}>
        <View style={{width:'50%'}}>
      <Text style={[styles.FlatListItemStyle1,{fontWeight:'bold'}]}>Extra Payments Total</Text>
        </View>  
        <View style={{width:'20%'}}>                 
        <Text style={[styles.FlatListItemStyle2,{fontWeight:'bold'}]}></Text>
        </View> 
        <View style={{width:'30%',alignItems:'flex-end'}}>
        <Text style={[styles.FlatListItemStyle3,{fontWeight:'bold'}]}>${this.state.Payslip.taxable_emolument}</Text>
        </View>                  
      </View>         
     </View>    
           
  )
}

DisplayNTA(){  
  return(   
    <View>                      
     <FlatList
      data={ this.state.Payslip.nta_items }

      ItemSeparatorComponent = {this.ItemSeparatorLine}
 
          renderItem={({item}) => 
      <TouchableOpacity  activeOpacity={0.9} style={{backgroundColor: 'white'}}>
            <ScrollView>
              <View style={styles.item}>
                 <View style={{width:'70%'}}>
                <Text style={styles.FlatListItemStyle1}>{item.description}</Text>
                 </View>   
                 <View style={{width:'30%',alignItems:'flex-end'}}>
                  <Text style={styles.FlatListItemStyle3}>${item.amount}</Text>
                 </View>                  
                </View> 
           </ScrollView>
      </TouchableOpacity>
        }
        keyExtractor={(item, index) => index}
        /> 
    <View style={styles.item}>
        <View style={{width:'50%'}}>
      <Text style={[styles.FlatListItemStyle1,{fontWeight:'bold'}]}>NTA Total</Text>
        </View>  
        <View style={{width:'20%'}}>                 
        <Text style={[styles.FlatListItemStyle2,{fontWeight:'bold'}]}></Text>
        </View> 
        <View style={{width:'30%',alignItems:'flex-end'}}>
        <Text style={[styles.FlatListItemStyle3,{fontWeight:'bold'}]}>${this.state.Payslip.nta_total}</Text>
        </View>                  
      </View>         
     </View>    
           
  )
}

DisplayDeductions(){  
  return(   
    <View>  

   {this.state.Payslip.paye != 0 ? (   
    <View style={styles.item}>
        <View style={{width:'50%'}}>
      <Text style={styles.FlatListItemStyle1}>PAYE</Text>
        </View>  
        <View style={{width:'20%'}}>                 
        <Text style={styles.FlatListItemStyle2}></Text>
        </View> 
        <View style={{width:'30%',alignItems:'flex-end'}}>
        <Text style={styles.FlatListItemStyle3}>${this.state.Payslip.paye}</Text>
        </View>                  
      </View>
   ): null }      

   {this.state.Payslip.kiwisaver != 0 ? (   
    <View style={styles.item}>
        <View style={{width:'50%'}}>
      <Text style={styles.FlatListItemStyle1}>KiwiSaver ({this.state.Payslip.kiwisaver_pc}%)</Text>
        </View>  
        <View style={{width:'20%'}}>                 
        <Text style={styles.FlatListItemStyle2}></Text>
        </View> 
        <View style={{width:'30%',alignItems:'flex-end'}}>
        <Text style={styles.FlatListItemStyle3}>${this.state.Payslip.kiwisaver}</Text>
        </View>                  
      </View> 
   ): null }   

   {this.state.Payslip.student_loan != 0 ? (   
    <View style={styles.item}>
        <View style={{width:'50%'}}>
      <Text style={styles.FlatListItemStyle1}>Student Loan</Text>
        </View>  
        <View style={{width:'20%'}}>                 
        <Text style={styles.FlatListItemStyle2}></Text>
        </View> 
        <View style={{width:'30%',alignItems:'flex-end'}}>
        <Text style={styles.FlatListItemStyle3}>${this.state.Payslip.student_loan}</Text>
        </View>                  
      </View> 
   ): null }

   {this.state.Payslip.slc_deduction != 0 ? (   
    <View style={styles.item}>
        <View style={{width:'50%'}}>
      <Text style={styles.FlatListItemStyle1}>Compulsory Student Loan</Text>
        </View>  
        <View style={{width:'20%'}}>                 
        <Text style={styles.FlatListItemStyle2}></Text>
        </View> 
        <View style={{width:'30%',alignItems:'flex-end'}}>
        <Text style={styles.FlatListItemStyle3}>${this.state.Payslip.slc_deduction}</Text>
        </View>                  
      </View> 
   ): null }   

   {this.state.Payslip.slv_deduction != 0 ? (   
    <View style={styles.item}>
        <View style={{width:'50%'}}>
      <Text style={styles.FlatListItemStyle1}>Voluntary Student Loan</Text>
        </View>  
        <View style={{width:'20%'}}>                 
        <Text style={styles.FlatListItemStyle2}></Text>
        </View> 
        <View style={{width:'30%',alignItems:'flex-end'}}>
        <Text style={styles.FlatListItemStyle3}>${this.state.Payslip.slv_deduction}</Text>
        </View>                  
      </View> 
   ): null }   

   {this.state.Payslip.child_support != 0 ? (   
    <View style={styles.item}>
        <View style={{width:'50%'}}>
      <Text style={styles.FlatListItemStyle1}>Child Support</Text>
        </View>  
        <View style={{width:'20%'}}>                 
        <Text style={styles.FlatListItemStyle2}></Text>
        </View> 
        <View style={{width:'30%',alignItems:'flex-end'}}>
        <Text style={styles.FlatListItemStyle3}>${this.state.Payslip.child_support}</Text>
        </View>                  
      </View> 
   ): null } 

     <FlatList
      data={ this.state.Payslip.extra_tax }

      ItemSeparatorComponent = {this.ItemSeparatorLine}
 
          renderItem={({item}) => 
      <TouchableOpacity  activeOpacity={0.9} style={{backgroundColor: 'white'}}>
            <ScrollView>
              <View style={styles.item}>
                 <View style={{width:'70%'}}>
                <Text style={styles.FlatListItemStyle1}>{item.description}</Text>
                 </View>   
                 <View style={{width:'30%',alignItems:'flex-end'}}>
                  <Text style={styles.FlatListItemStyle3}>${item.amount}</Text>
                 </View>                  
                </View> 
           </ScrollView>
      </TouchableOpacity>
        }
        keyExtractor={(item, index) => index}
        /> 

     <FlatList
      data={ this.state.Payslip.deduction_items }

      ItemSeparatorComponent = {this.ItemSeparatorLine}
 
          renderItem={({item}) => 
      <TouchableOpacity  activeOpacity={0.9} style={{backgroundColor: 'white'}}>
            <ScrollView>
              <View style={styles.item}>
                 <View style={{width:'70%'}}>
                <Text style={styles.FlatListItemStyle1}>{item.description}</Text>
                 </View>   
                 <View style={{width:'30%',alignItems:'flex-end'}}>
                  <Text style={styles.FlatListItemStyle3}>${item.amount}</Text>
                 </View>                  
                </View> 
           </ScrollView>
      </TouchableOpacity>
        }
        keyExtractor={(item, index) => index}
        /> 
                
   {this.state.Payslip.taxable_emolument != 0 ? (   
    <View style={styles.item}>
        <View style={{width:'50%'}}>
      <Text style={styles.FlatListItemStyle1}>Taxable Extra Pay</Text>
        </View>  
        <View style={{width:'20%'}}>                 
        <Text style={styles.FlatListItemStyle2}></Text>
        </View> 
        <View style={{width:'30%',alignItems:'flex-end'}}>
        <Text style={styles.FlatListItemStyle3}>${this.state.Payslip.taxable_emolument}</Text>
        </View>                  
      </View> 
   ): null } 

      {this.state.Payslip.tax_on_emolument != 0 ? (   
    <View style={styles.item}>
        <View style={{width:'50%'}}>
      <Text style={styles.FlatListItemStyle1}>Tax on Extra Pay</Text>
        </View>  
        <View style={{width:'20%'}}>                 
        <Text style={styles.FlatListItemStyle2}></Text>
        </View> 
        <View style={{width:'30%',alignItems:'flex-end'}}>
        <Text style={styles.FlatListItemStyle3}>${this.state.Payslip.tax_on_emolument}</Text>
        </View>                  
      </View> 
   ): null } 

    <View style={styles.item}>
        <View style={{width:'50%'}}>
      <Text style={[styles.FlatListItemStyle1,{fontWeight:'bold'}]}>Total Deductions</Text>
        </View>  
        <View style={{width:'20%'}}>                 
        <Text style={[styles.FlatListItemStyle2,{fontWeight:'bold'}]}></Text>
        </View> 
        <View style={{width:'30%',alignItems:'flex-end'}}>
        <Text style={[styles.FlatListItemStyle3,{fontWeight:'bold'}]}>${this.state.Payslip.deductions_total}</Text>
        </View>                  
      </View>

     </View>    
           
  )
}


EmailPayslip(id){
  console.log('entered EmailPayslip() - '+ id)
    var that = this;
    var url = this.props.navigation.state.params.baseURL+'?ct=api&api=payslip&act=app_email&id='+id;
    console.log("-----------url:"+url);
    fetch(url,{method: 'GET', credentials: 'same-origin'}).then(function (response) {
        return response.json();
      }).then(function (result) {
        console.log(result)
      if(!result.error){
          that.setState({ ActivityIndicator_Loading : false});        
          alert('Payslip Emailed') 
      }
    }).catch(function (error) {
      console.log("-------- error ------- "+error);
    });
                        
}

 render() {
    return(

      <View style={styles.container} behavior="padding">  
      <ScrollView>  
       <View style={{flexDirection:'row'}}> 
          <View style={{alignItems:'flex-start',paddingLeft:5,paddingTop:10,width:'73%'}}>
           <View style={{flexDirection:'row'}}>
            <Text style={{fontSize:15,fontWeight:'bold'}}>Company   - </Text>
            <Text style={{fontSize:15,fontWeight:'bold'}}>{this.state.Payslip.company_name}</Text>
           </View>
           <View style={{flexDirection:'row'}}>
            <View>   
              <Text style={{fontSize:15,fontWeight:'bold'}}>Name        </Text>
            </View> 
            <View style={{flexDirection:'row',paddingLeft:9}}> 
              <Text style={{fontSize:15,fontWeight:'bold'}}>- {this.state.Payslip.full_name}</Text>
            </View>  
           </View> 
          </View>
       </View>   
       <View style={{flexDirection:'row'}}> 
          <View style={{alignItems:'flex-start',paddingLeft:5,paddingTop:10,width:'73%'}}>
           <View style={{flexDirection:'row'}}>
            <Text style={{fontSize:15,fontWeight:'bold'}}>Pay Period - </Text>
            <Text style={{fontSize:15,fontWeight:'bold'}}>{this.state.Payslip.pay_period_start_date} to {this.state.Payslip.pay_period_end_date}</Text>
           </View>
           <View style={{flexDirection:'row'}}>
            <View>   
              <Text style={{fontSize:15,fontWeight:'bold'}}>Pay Date  </Text>
            </View> 
            <View style={{flexDirection:'row',paddingLeft:9}}> 
              <Text style={{fontSize:15,fontWeight:'bold'}}>- {this.state.Payslip.pay_date}</Text>
            </View>  
           </View> 
          </View>
          <View  style={{width:'23%',paddingLeft:5,paddingTop:3}}>  
          <Button
            title=" Email"
          onPress={() => {this.EmailPayslip(this.state.Payslip.id);this.setState({ActivityIndicator_Loading:true})}}
          type='solid' 
          titleStyle={{ color: 'white',fontSize:12,fontWeight:'bold' }}    
          buttonStyle={{ backgroundColor: '#71BF44',height:30 }}  
        icon={
        <Ionicons name="ios-mail" size={15} color='white' />
        }           
          />
        </View>        
       </View> 

      {this.state.Payslip.message ? (
          <View style={{alignItems:'flex-start',paddingLeft:5,paddingTop:10,width:'90%',flexDirection:'row'}}>
            <Text style={{fontSize:15,fontWeight:'bold'}}>Comments - </Text>
            <Text style={{fontSize:15}}>{this.state.Payslip.message}</Text>
          </View>
      ):null}    

    <View style={{paddingBottom:10}}></View>         
  <Table borderStyle={{borderWidth: 2, borderColor: 'white',paddingTop:5}}>
    <Row data={this.state.PHead} style={styles.head} flexArr={[2, 1, 1]} textStyle={styles.text} />
  </Table> 
    <View style={{paddingBottom:5}}></View>   
   { this.DisplayPayments() }    
      
                {
        
                this.state.ActivityIndicator_Loading ? <ActivityIndicator color='#009688' size='large'style={styles.ActivityIndicatorStyle} /> : null
                
                }  
{this.state.Payslip.taxable_emolument != 0 ? (   
      <View style={{paddingBottom:10}}></View>  
):null}    
{this.state.Payslip.taxable_emolument != 0 ? (   
  <Table borderStyle={{borderWidth: 2, borderColor: 'white'}}>
    <Row data={this.state.EHead} style={styles.head} flexArr={[3, 1]} textStyle={styles.text}/>
  </Table> 
):null}
{this.state.Payslip.taxable_emolument != 0 ? (                       
  <View style={{paddingTop:5}}>     
  {this.DisplayEP()}
  </View>
):null}     

{this.state.Payslip.nta_total != 0 ? (    
    <View style={{paddingBottom:10}}></View>
):null}
{this.state.Payslip.nta_total != 0 ? (    
  <Table borderStyle={{borderWidth: 2, borderColor: 'white'}}>
    <Row data={this.state.NTAHead} style={styles.head} flexArr={[3, 1]} textStyle={styles.text}/>
  </Table> 
):null}
{this.state.Payslip.nta_total != 0 ? (                       
  <View style={{paddingTop:5}}>     
  {this.DisplayNTA()}
  </View>
):null} 

{ this.state.advance_amounts.length > 0 ?(   
    <View style={{paddingBottom:10}}></View>
):null}  
{ this.state.advance_amounts.length > 0 ?(   
  <Table borderStyle={{borderWidth: 2, borderColor: 'white'}}>
    <Row data={this.state.PAHead} style={styles.head} flexArr={[3, 1]} textStyle={styles.text}/>
  </Table>  
):null}  
{ this.state.advance_amounts.length > 0 ?(   
  <View style={{paddingTop:5}}>     
  {this.DisplayPA()}
  </View>
):null} 

{this.state.Payslip.deductions_total != 0 ? (  
    <View style={{paddingBottom:10}}></View>
):null}
{this.state.Payslip.deductions_total != 0 ? (  
  <Table borderStyle={{borderWidth: 2, borderColor: 'white'}}>
    <Row data={this.state.DHead} style={styles.head} flexArr={[3, 1]} textStyle={styles.text}/>
  </Table> 
):null}
{this.state.Payslip.deductions_total != 0 ? (                       
  <View style={{paddingTop:5}}>     
  {this.DisplayDeductions()}
  </View>
):null}  
   {this.state.Payslip.net_remuneration != 0 ? (   
      <View style={{paddingBottom:10}}></View>
   ): null } 
   {this.state.Payslip.net_remuneration != 0 ? (   
    <View style={styles.item1}>
        <View style={{width:'50%'}}>
      <Text style={[styles.FlatListItemStyle1,{fontWeight:'bold'}]}>Net Pay</Text>
        </View>  
        <View style={{width:'20%'}}>                 
        <Text style={[styles.FlatListItemStyle2,{fontWeight:'bold'}]}></Text>
        </View> 
        <View style={{width:'30%',alignItems:'flex-end'}}>
        <Text style={[styles.FlatListItemStyle3,{fontWeight:'bold'}]}>${this.state.Payslip.net_remuneration1}</Text>
        </View>                  
      </View> 
   ): null } 

   {this.state.Payslip.kiwisaver_emp_pc != 0 ? (   
    <View style={styles.item}>
        <View style={{width:'50%'}}>
      <Text style={styles.FlatListItemStyle1}>Employer KiwiSaver ({this.state.Payslip.kiwisaver_emp_pc}%)</Text>
        </View>  
        <View style={{width:'20%'}}>                 
        <Text style={styles.FlatListItemStyle2}></Text>
        </View> 
        <View style={{width:'30%',alignItems:'flex-end'}}>
        <Text style={styles.FlatListItemStyle3}>${this.state.Payslip.kiwisaver_employer}</Text>
        </View>                  
      </View> 
   ): null } 
{this.state.Payslip.show_leave === true ?( 
    <View style={{paddingBottom:10}}></View>
):null}  
{this.state.Payslip.show_leave === true ?( 
  <Table borderStyle={{borderWidth: 2, borderColor: 'white'}}>
    <Row data={this.state.LBHead} style={styles.head}  flexArr={[4]} textStyle={styles.text}/>
  </Table>  
):null}  
  {this.state.Payslip.show_leave === true && this.state.Payslip.show_approved_leave === true  ? (  
  <Table borderStyle={{borderWidth: 2, borderColor: 'white'}}>
    <Row data={this.state.LBBHead} style={styles.head1} flexArr={[1,1,1,1]} textStyle={styles.text}/>
  </Table>  
  ):
  <View>
  {this.state.Payslip.show_leave === true && this.state.Payslip.show_annual_leave === true ?(
  <Table borderStyle={{borderWidth: 2, borderColor: 'white'}}>
    <Row data={this.state.LBB1Head} style={styles.head2} flexArr={[1,1,1,1]} textStyle={styles.text}/>
  </Table>  
  ):
  <Table borderStyle={{borderWidth: 2, borderColor: 'white'}}>
    <Row data={this.state.LBB2Head} style={styles.head2} flexArr={[1,1,1,1]} textStyle={styles.text}/>
  </Table>  
  }
  </View>  
  }

 <View style={{paddingBottom:10}}></View>
{this.state.Payslip.show_leave === true ? (      
    <View>  
  {this.state.Payslip.show_approved_leave === true  ? (   
      <View style={{paddingTop:5,flexDirection:'row',alignItems:'center'}}>  
         <View style={{width:'25%',alignItems:'center',paddingLeft:3}}>
           <Text>{this.state.Payslip.annual_leave} Days </Text>
         </View>           
         <View style={{width:'25%',alignItems:'center'}}>
           <Text>{this.state.Payslip.future_approved_leave} Days</Text>
         </View>                     
         <View style={{width:'25%',alignItems:'center'}}>           
           <Text>{this.state.Payslip.alternate_days} Days</Text>
         </View>           
         <View style={{width:'25%',alignItems:'center'}}>
           <Text>{this.state.Payslip.sick_leave} Days</Text>
         </View> 
      </View>    
  ):
  <View>
  {this.state.Payslip.show_annual_leave === true ?(  
      <View style={{paddingTop:5,flexDirection:'row',alignItems:'center'}}>  
         <View style={{width:'33%',alignItems:'center',paddingLeft:3}}>
           <Text>{this.state.Payslip.annual_leave} Days </Text>
         </View>                              
         <View style={{width:'33%',alignItems:'center'}}>           
           <Text>{this.state.Payslip.alternate_days} Days</Text>
         </View>           
         <View style={{width:'33%',alignItems:'center'}}>
           <Text>{this.state.Payslip.sick_leave} Days</Text>
         </View>
      </View> 
  ):
      <View style={{paddingTop:5,flexDirection:'row',alignItems:'center'}}>
         <View style={{width:'50%',alignItems:'center'}}>           
           <Text>{this.state.Payslip.alternate_days} Days</Text>
         </View>           
         <View style={{width:'50%',alignItems:'center'}}>
           <Text>{this.state.Payslip.sick_leave} Days</Text>
         </View>
      </View> 
  } 
        <View style={{paddingBottom:10}}></View>
 
  </View>    
  }                          
    </View>   
): null }
    <View style={{paddingBottom:5}}></View>   

  <Table borderStyle={{borderWidth: 2, borderColor: 'white'}}>
    <Row data={this.state.YTDHead} style={styles.head} flexArr={[4]} textStyle={styles.text}/>
    <Row data={this.state.YTDDHead} style={styles.head1} flexArr={[1,1,1,1]} textStyle={styles.text}/>
  </Table>
    <View style={{paddingTop:5,flexDirection:'row',alignItems:'center',paddingBottom:20}}>  
         <View style={{width:'25%',alignItems:'center'}}>
           <Text>${this.state.Payslip.total_payments} </Text>
         </View>           
         <View style={{width:'25%',alignItems:'center'}}>
           <Text>${this.state.Payslip.total_deductions}</Text>
         </View>                     
         <View style={{width:'25%',alignItems:'center'}}>           
           <Text>${this.state.Payslip.total_netpay}</Text>
         </View>           
         <View style={{width:'25%',alignItems:'center'}}>
           <Text>${this.state.Payslip.total_nta}</Text>
         </View>           
    </View>                                                     
           
    </ScrollView>           
   </View>



    );
 }
}

    module.exports = PayslipDetails;

const styles = StyleSheet.create({
  container: {
  //  justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'white',
    // width: '100%',
    // padding: 20,
    // height:50,
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
  head: { height: 30, backgroundColor: '#EAEAEA' },
  head1: { height: 80, backgroundColor: 'white' },
  head2: { height: 40, backgroundColor: 'white' },

  text: { margin: 6,fontWeight:'bold' }, 
    item: {
    backgroundColor:'white',
    flexDirection: 'row',
   // alignItems: 'flex-start',
   // justifyContent: 'center',    
  //  flex: 1,
    margin: 1,
    height: 20, // approximate a square
  },
 item1: {
    backgroundColor:'#f1f8ff',
    flexDirection: 'row',
   // alignItems: 'flex-start',
   // justifyContent: 'center',    
  //  flex: 1,
    margin: 1,
    height: 20, // approximate a square
  },
    FlatListItemStyle1: {   
  //  alignItems: 'center',
    paddingLeft: 3,
    fontSize: 15,
    height: 30,
    color:'black',
  },  
  FlatListItemStyle2: {   
    alignItems: 'center',
    paddingLeft: 10,
    fontSize: 15,
    height: 30,
    color:'black',
  }, 
  FlatListItemStyle3: {   
    alignItems: 'center',
    paddingLeft: 10,
    fontSize: 15,
    height: 30,
    color:'black',
  },    
});