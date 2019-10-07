import React, { Component } from 'react';
import {
  Alert,
  List,
  ListItem,
  FlatList,
  TextInput,
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  TouchableHighlight,
  Picker,
  BackHandler,
  Switch,
  NetInfo,
  Dimensions,
  Platform,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { getRegoInfo } from './FetchVehicle';
//import ReceiptUpload from './ReceiptUpload';
import DatePicker from 'react-native-datepicker';
import { Dropdown } from 'react-native-material-dropdown';
import { getUserInfo } from './Users';
import LoginUser from './LoginUser';
import {
  DrawerNavigator,
  DrawerActions,
  DrawerItems,
  SafeAreaView,
  createStackNavigator,
  createBottomTabNavigator,
  createDrawerNavigator,
} from 'react-navigation';
import {
  Table,
  Rows,
  TableWrapper,
  Row,
  Cell,
} from 'react-native-table-component';
import { ImagePicker, Permissions, Constants, Location } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { NavigationActions } from 'react-navigation';
import TimePicker from 'react-native-simple-time-picker';
import uuid from 'uuid/v4';
import ModalDropdown from 'react-native-modal-dropdown';
import Notifications from './Notifications';
import moment from 'moment';
import { Section, TableView, Separator } from 'react-native-tableview-simple';
import Modal from 'react-native-modal';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Header, Button, Badge } from 'react-native-elements';
import PinLogin from './PinLogin';
import IconBadge from 'react-native-icon-badge';
import TimesheetEntry from './TimesheetEntry';
import { SQLite } from 'expo-sqlite';

const { width: WindowWidth } = Dimensions.get('window');

const { width } = Dimensions.get('window');

const db = SQLite.openDatabase('db.db');

export default class EditTimesheet extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: 'Edit Timesheet',
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: '#71BF44',
      },
      headerRight: (
        <View style={{ flexDirection: 'row', paddingRight: 20 }}>
          <View>
            <Button
              type="clear"
              icon={<Ionicons name="ios-home" size={30} color="white" />}
              onPress={() =>
                navigation.push('Dashboard', {
                  count: 0,
                  username: params.username,
                  email: params.email,
                  baseURL: params.baseURL,
                  user_id: params.user_id,
                  addPin: params.addPin,
                })
              }
            />
          </View>
          <View>
            <Button
              icon={
                <IconBadge
                  MainElement={
                    <Ionicons
                      name="ios-notifications-outline"
                      size={30}
                      color="white"
                    />
                  }
                  BadgeElement={
                    <Text style={{ color: '#FFFFFF' }}>{params.Count}</Text>
                  }
                  IconBadgeStyle={{
                    width: 10,
                    height: 20,
                    backgroundColor: 'red',
                  }}
                  Hidden={params.Count == 0}
                />
              }
              type="clear"
              onPress={() =>
                navigation.push('Notifications', {
                  count: 0,
                  username: params.username,
                  email: params.email,
                  baseURL: params.baseURL,
                  user_id: params.user_id,
                  addPin: params.addPin,
                  SH: params.selectedEndHours,
                  SM: params.selectedEndMinutes,
                  defaultActivity: params.defaultActivity,
                  timesheets: params.Timesheets,
                  jobsList: params.Jobs,
                  otherJobs: params.OtherJobs,
                  activityList: params.Activity,
                })
              }
            />
          </View>
        </View>
      ),
    };
  };
  state = {
    image: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      jobs: '',
      otherJobs: '',
      activity: '',
      startTime: '',
      endTime: '',
      totalHours: '',
      units: '',
      comments: '',
      ActivityIndicator_Loading: false,
      Offline_Loading: false,
      Online_Loading: false,
      Jobs: [],
      OtherJobs: [],
      Activity: [],
      CommercialEquipments: [],
      RUCVehicles: [],
      CommercialVessels: [],
      selectedStartHours: '  ',
      selectedStartMinutes: '  ',
      selectedEndHours: '  ',
      selectedEndMinutes: '  ',
      Timesheets: [],
      Timesheet: [],
      TimesheetDateSpecific: [],
      OfflineDateSpecific: [],
      OtherJ: [],
      tableHead: [' Activity  ', 'Start & End Time', 'Hours', 'Action'],
      tableErrorHead: [' Activity  ', 'Start & End Time or Hours'],
      tableData: [],
      tableDataOnline: [],
      date: '',
      displayOffline: '0',
      isConnected: '',
      location: '',
      gps_lat: '',
      gps_lng: '',
      errorMessage: '',
      userid: '',
      email: '',
      baseURL: '',
      username: '',
      addPin: '',
      OfflineTimesheets: [],
      visibleModal: null,
      ErrorEntry: '',
      id: '',
      uuid: '',
      defaultActivity: '',
      CountGetTimesheet: false,
      modalIsVisible: false,
      modalJobsIsVisible: false,
      modalOJobsIsVisible: false,
      modalAnimatedValue: new Animated.Value(0),
      modalJAnimatedValue: new Animated.Value(0),
      modalOJAnimatedValue: new Animated.Value(0),
      aTitle: 'Select a Activity',
      jTitle: 'Select a Job',
      ojTitle: 'Select any other Job',
      unpaid:'',
    };
    this.getActivity = this.getActivity.bind(this);
    this.handleEditTimesheetConnectivity = this.handleEditTimesheetConnectivity.bind(
      this
    );
    this.update_timesheet = this.update_timesheet.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.getTimesheet = this.getTimesheet.bind(this);
    this.HistoryModal = this.HistoryModal.bind(this);
    this.HistoryModalContent = this.HistoryModalContent.bind(this);
    this.insert_timesheet = this.insert_timesheet.bind(this);
    this.getNextStartTime = this.getNextStartTime.bind(this);
    this.showDateTimePicker = this.showDateTimePicker.bind(this);
    this.hideDateTimePicker = this.hideDateTimePicker.bind(this);
    this.showEndDateTimePicker = this.showEndDateTimePicker.bind(this);
    this.hideEndDateTimePicker = this.hideEndDateTimePicker.bind(this);
    this.handleDatePicked = this.handleDatePicked.bind(this);
    this.handleEndDatePicked = this.handleEndDatePicked.bind(this);
    this.NotificationsCount = this.NotificationsCount.bind(this);
    this.delete_timesheet = this.delete_timesheet.bind(this);
    this.delete_notification = this.delete_notification.bind(this);
    this.offlineDelete_timesheet = this.offlineDelete_timesheet.bind(this);
    this.offlineUpdate_timesheet = this.offlineUpdate_timesheet.bind(this);
    this.OfflineHistoryModal = this.OfflineHistoryModal.bind(this);
    this.OfflineHistoryModalContent = this.OfflineHistoryModalContent.bind(
      this
    );
    this.ModalGetTimesheet = this.ModalGetTimesheet.bind(this);
    this.EditOnlineTimesheet = this.EditOnlineTimesheet.bind(this);
    this.EditOfflineTimesheet = this.EditOfflineTimesheet.bind(this);
    this.ModalActivity = this.ModalActivity.bind(this);
    this.ModalActivityDone = this.ModalActivityDone.bind(this);
    this.ModalRenderActivities = this.ModalRenderActivities.bind(this);
    this.ModalJobs = this.ModalJobs.bind(this);
    this.ModalJobsDone = this.ModalJobsDone.bind(this);
    this.ModalRenderJobs = this.ModalRenderJobs.bind(this);
    this.ModalOJobs = this.ModalOJobs.bind(this);
    this.ModalOJobsDone = this.ModalOJobsDone.bind(this);
    this.ModalRenderOJobs = this.ModalRenderOJobs.bind(this);
  }
  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  showEndDateTimePicker = () => {
    this.setState({ isEndDateTimePickerVisible: true });
  };

  hideEndDateTimePicker = () => {
    this.setState({ isEndDateTimePickerVisible: false });
  };

  handleDatePicked = time => {
    console.log('A start Time has been picked: ', time);
    console.log(moment(time).format('HH'));
    console.log(moment(time).format('mm'));
    this.setState({
      selectedStartHours: moment(time).format('HH'),
      selectedStartMinutes: moment(time).format('mm'),
      startTime: moment(time).format('HH') + ':' + moment(time).format('mm'),
    });
    this.hideDateTimePicker();
  };

  handleEndDatePicked = time => {
    console.log('A End Time has been picked: ', time);
    console.log(moment(time).format('HH'));
    console.log(moment(time).format('mm'));
    this.setState({
      selectedEndHours: moment(time).format('HH'),
      selectedEndMinutes: moment(time).format('mm'),
      endTime: moment(time).format('HH') + ':' + moment(time).format('mm'),
    });
    this.hideEndDateTimePicker();
  };

  componentDidMount() {
    this.NotificationsCount();
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleEditTimesheetConnectivity
    );
    NetInfo.isConnected.fetch().done(isConnected => {
      if (isConnected == true) {
        this.setState({ isConnected: 'true', displayOffline: '0' });
      } else {
        this.setState({
          isConnected: 'false',
          displayOffline: null,
          selectedStartHours: this.props.navigation.state.params.SH,
          selectedStartMinutes: this.props.navigation.state.params.SM,
          selectedEndHours: this.props.navigation.state.params.EH,
          selectedEndMinutes: this.props.navigation.state.params.EM,
        });
      }
      console.log('Notifications Edit Timesheet');

      this.setState({
        totalHours: this.props.navigation.state.params.totalHours,
        jobs: this.props.navigation.state.params.jobs,
        activity: this.props.navigation.state.params.activity,
        atitle: this.props.navigation.state.params.defualtActivity,
        units: this.props.navigation.state.params.units,
        comments: this.props.navigation.state.params.comments,
        date: this.props.navigation.state.params.date,
        stateTime: this.props.navigation.state.params.startTime,
        endTime: this.props.navigation.state.params.endTime,
        selectedStartHours: this.props.navigation.state.params.SH,
        selectedStartMinutes: this.props.navigation.state.params.SM,
        selectedEndHours: this.props.navigation.state.params.EH,
        selectedEndMinutes: this.props.navigation.state.params.EM,
        id: this.props.navigation.state.params.id,
        uuid: this.props.navigation.state.params.uuid,
        unpaid:this.props.navigation.state.params.unpaid,
      });
      if (this.props.navigation.state.params.startTime != '') {
        this.setState({
          ErrorEntry:
            this.props.navigation.state.params.activity +
            '       ' +
            this.props.navigation.state.params.startTime +
            ' - ' +
            this.props.navigation.state.params.endTime +
            '    ' +
            this.props.navigation.state.params.totalHours +
            '        ' +
            this.props.navigation.state.params.units,
        });
      } else {
        this.setState({
          ErrorEntry:
            this.props.navigation.state.params.activity +
            '     ' +
            this.props.navigation.state.params.totalHours,
        });
      }
      this.getActivity();
      if (this.state.displayOffline) {
        this.getTimesheet();
      }
      this.getLocation();

      if (
        !this.props.navigation.state.params.error &&
        this.state.displayOffline
      ) {
        var SSH = moment(this.props.navigation.state.params.startTime).format(
          'HH'
        );
        var SSM = moment(this.props.navigation.state.params.startTime).format(
          'mm'
        );
        var ESH = moment(this.props.navigation.state.params.endTime).format(
          'HH'
        );
        var ESM = moment(this.props.navigation.state.params.endTime).format(
          'mm'
        );
        console.log(
          'this.props.navigation.state.params.startTime - ' +
            this.props.navigation.state.params.startTime
        );
        console.log(
          'this.props.navigation.state.params.endTime - ' +
            this.props.navigation.state.params.endTime
        );

        console.log('SSH - ' + SSH);
        console.log('SSM - ' + SSM);
        console.log('ESH - ' + ESH);
        console.log('ESM - ' + ESM);
        this.setState({
          selectedStartHours: SSH,
          selectedStartMinutes: SSM,
          selectedEndHours: ESH,
          selectedEndMinutes: ESM,
        });
      }
      //else{
      //         // if(this.state.displayOffline){
      //            this.getNextStartTime();
      //         // }

      //  }
    });
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleEditTimesheetConnectivity
    );
  }

  handleEditTimesheetConnectivity = isConnected => {
    if (isConnected == true) {
      this.setState({ isConnected: 'true', displayOffline: '0' });
    } else {
      this.setState({
        isConnected: 'false',
        displayOffline: null,
        selectedStartHours: this.props.navigation.state.params.SH,
        selectedStartMinutes: this.props.navigation.state.params.SM,
        selectedEndHours: this.props.navigation.state.params.EH,
        selectedEndMinutes: this.props.navigation.state.params.EM,
      });
    }
  };

  getLocation = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    //console.log(location)
    this.setState({
      location,
      gps_lat: location.coords.latitude,
      gps_lng: location.coords.longitude,
    });
  };

  NotificationsCount() {
    console.log('Notifications COUNT');
    db.transaction(tx => {
      tx.executeSql(
        'select * from notifications where error_flag="1"',
        [],
        (tx, res) => {
          console.log('notifications error count - ' + res.rows.length);
          var temp = [];
          if (res.rows.length > 0) {
            this.props.navigation.setParams({
              Count: res.rows.length,
              username: this.props.navigation.state.params.username,
              email: this.props.navigation.state.params.email,
              baseURL: this.props.navigation.state.params.baseURL,
              userid: this.props.navigation.state.params.user_id,
              addPin: this.props.navigation.state.params.addPin,
              Timesheets: this.props.navigation.state.params.timesheets,
              Jobs: this.props.navigation.state.params.jobsList,
              OtherJobs: this.props.navigation.state.params.otherJobs,
              Activity: this.props.navigation.state.params.activityList,
              defaultActivity: this.props.navigation.state.params
                .defaultActivity,
            });
            this.setState({
              Count: res.rows.length,
              addPin: this.props.navigation.state.params.addPin,
              username: this.props.navigation.state.params.username,
              email: this.props.navigation.state.params.email,
              baseURL: this.props.navigation.state.params.baseURL,
              userid: this.props.navigation.state.params.user_id,
            });
          } else {
            this.props.navigation.setParams({
              Count: 0,
              Timesheets: this.props.navigation.state.params.timesheets,
              Jobs: this.props.navigation.state.params.jobsList,
              OtherJobs: this.props.navigation.state.params.otherJobs,
              Activity: this.props.navigation.state.params.activityList,
              defaultActivity: this.props.navigation.state.params
                .defaultActivity,
            });
            this.setState({
              Count: 0,
              addPin: this.props.navigation.state.params.addPin,
              username: this.props.navigation.state.params.username,
              email: this.props.navigation.state.params.email,
              baseURL: this.props.navigation.state.params.baseURL,
              userid: this.props.navigation.state.params.user_id,
            });
          }
          // if(res.rows.length > 0){
          //   Alert.alert( 'Offline-Mode update error', 'Please visit Notifications screen',
          //     [
          //       {text: 'Ok', onPress: () => this.props.navigation.navigate("Notifications")},
          //     ],
          //     { cancelable: false }
          //   );
          // }
        }
      );
    });
  }

  getNextStartTime() {
    //console.log('entered getActivity()')
    var that = this;
    var url =
      this.props.navigation.state.params.baseURL +
      '?ct=api&api=timesheet&act=next_start_time&date=' +
      this.props.navigation.state.params.date;
    //console.log("-----------url:"+url);
    fetch(url, { method: 'GET', credentials: 'same-origin' })
      .then(function(response) {
        return response.json();
      })
      .then(function(result) {
        if (!result.error) {
          //  that.setState({
          //    selectedStartHours: result.data.h,
          //    selectedStartMinutes : result.data.m,
          //    selectedEndHours : '00',
          //    selectedEndMinutes : '00',
          //  });
        }
      })
      .catch(function(error) {
        //console.log("-------- error ------- "+error);
        Alert.alert(
          'Oops!!! Sorry, Something went wrong',
          'Please re-login',
          [{ text: 'Ok' }],
          { cancelable: false }
        );
      });

    //  that.setState({  selectedStartHours:that.props.navigation.state.params.SH,
    //                   selectedStartMinutes:that.props.navigation.state.params.SM,
    //                   selectedEndHours:that.props.navigation.state.params.EH,
    //                   selectedEndMinutes:that.props.navigation.state.params.EM,  })
  }

  //function to update timesheet details
  insert_timesheet() {
    var sTime = '';
    var eTime = '';
    sTime =
      this.state.selectedStartHours +
      ':' +
      this.state.selectedStartMinutes +
      ':00';
    eTime =
      this.state.selectedEndHours + ':' + this.state.selectedEndMinutes + ':00';
    this.setState({ startTime: sTime, endTime: eTime }, () => {
      console.log(
        'this.state.startTime - ' +
          this.state.startTime +
          '  this.state.endTime - ' +
          this.state.endTime
      );
      const data = uuid();
      const timesheet_details = new FormData();
      timesheet_details.append(
        'user_id',
        this.props.navigation.state.params.user_id
      );
      timesheet_details.append('date', this.state.date);
      timesheet_details.append('total_hours', this.state.totalHours);
      timesheet_details.append('start_time', this.state.startTime);
      timesheet_details.append('end_time', this.state.endTime);
      timesheet_details.append('activity_code', this.state.activity);
      timesheet_details.append('uuid', 'timesheet_' + data);
      timesheet_details.append('gps_lat', this.state.gps_lat);
      timesheet_details.append('gps_lng', this.state.gps_lng);
      timesheet_details.append('job_id', this.state.jobs);
      timesheet_details.append('units', this.state.units);
      timesheet_details.append('source', 'App');
      timesheet_details.append('comment', this.state.comments);
      timesheet_details.append('unpaid_time', this.state.unpaid);
      this.setState({ ActivityIndicator_Loading: true }, () => {
        console.log(timesheet_details);
        //console.log(this.props.navigation.state.params.baseURL+'?ct=api&api=fuel_refund&act=put');
        fetch(
          this.props.navigation.state.params.baseURL +
            '?ct=api&api=timesheet&act=add',
          {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
            },
            body: timesheet_details,
          }
        )
          .then(response => response.json())
          .then(res => {
            console.log(res);
            var that = this;
            if (!res.data) {
              alert(res.error);
              console.log(res.error + res.uuid);
              db.transaction(tx => {
                tx.executeSql(
                  'UPDATE notifications set error_flag=?, error=? where uuid=?',
                  ['1', res.error, this.props.navigation.state.params.uuid],
                  (tx, res) => {
                    console.log(
                      '(NOTIFICATIONS) - SQLLite Timesheet Update Results',
                      res.rowsAffected
                    );
                  }
                );
              });
            } else {
              db.transaction(tx => {
                tx.executeSql('delete from Timesheet where uuid=?', [
                  this.props.navigation.state.params.uuid,
                ]);
              });
              Alert.alert(
                'Offline-Mode Timesheet entry resolved',
                'Back to Notifications',
                [
                  {
                    text: 'Ok',
                    onPress: () =>
                      this.props.navigation.push('Notifications', {
                        email: this.props.navigation.state.params.email,
                        baseURL: this.props.navigation.state.params.baseURL,
                        user_id: this.props.navigation.state.params.user_id,
                        addPin: this.props.navigation.state.params.addPin,
                      }),
                  },
                ],
                { cancelable: false }
              );
              console.log('(NOTIFICATIONS) - Error timesheet resolved');
              db.transaction(tx => {
                tx.executeSql(
                  'delete from notifications where uuid=?',
                  [this.props.navigation.state.params.uuid],
                  (tx, res) => {
                    console.log(
                      '(NOTIFICATIONS) - Added Timesheet Deleted uuid - ' +
                        this.props.navigation.state.params.uuid
                    );
                  }
                );
              });
            }

            this.setState({ ActivityIndicator_Loading: false });
          })
          .catch(error => {
            console.error(error);
            Alert.alert(
              'Oops!!! Sorry, Something went wrong',
              'Please re-login',
              [{ text: 'Ok' }],
              { cancelable: false }
            );

            this.setState({ ActivityIndicator_Loading: false });
          });
      });
    });
  }

  update_timesheet() {
    if (this.state.selectedStartHours != 'Invalid date') {
      var sTime = '';
      var eTime = '';
      sTime =
        this.state.selectedStartHours +
        ':' +
        this.state.selectedStartMinutes +
        ':00';
      eTime =
        this.state.selectedEndHours +
        ':' +
        this.state.selectedEndMinutes +
        ':00';
      console.log('sTime - ' + sTime);
      console.log('eTime - ' + eTime);
    }

    const timesheet_details = new FormData();
    timesheet_details.append('id', this.props.navigation.state.params.id);
    timesheet_details.append('total_hours', this.state.totalHours);
    timesheet_details.append('start_time', sTime);
    timesheet_details.append('end_time', eTime);
    timesheet_details.append('activity_code', this.state.activity);
    timesheet_details.append('job_id', this.state.jobs);
    timesheet_details.append('units', this.state.units);
    timesheet_details.append('source', 'App');
    timesheet_details.append('comment', this.state.comments);
    timesheet_details.append('unpaid_time', this.state.unpaid);
    this.setState({ Online_Loading: true }, () => {
      console.log(timesheet_details);
      //console.log(this.props.navigation.state.params.baseURL+'?ct=api&api=fuel_refund&act=put');
      fetch(
        this.props.navigation.state.params.baseURL +
          '?ct=api&api=timesheet&act=update',
        {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          body: timesheet_details,
        }
      )
        .then(response => response.json())
        .then(res => {
          var that = this;
          console.log(res);
          if (res.error) {
            alert(res.error);
          } else {
            alert('Timesheet updated');
            that.setState({
              startTime: that.state.endTime,
              endtime: '00:00',
              selectedEndHours: '00',
              selectedEndMinutes: '00',
              comments: '',
            });
          }
          this.setState({ Online_Loading: false });
        })
        .catch(error => {
          console.error(error);
          Alert.alert(
            'Oops!!! Sorry, Something went wrong',
            'Please re-login',
            [{ text: 'Ok' }],
            { cancelable: false }
          );

          this.setState({ Online_Loading: false });
        });
    });
  }

  delete_timesheet() {
    this.setState({ Online_Loading: true });
    console.log('entered delete_timesheet()');
    var that = this;
    var date = moment().format('YYYY-MM-DD');
    var url =
      this.props.navigation.state.params.baseURL +
      '?ct=api&api=timesheet&act=delete&id=' +
      this.state.id;
    console.log('-----------url:' + url);
    fetch(url, { method: 'GET', credentials: 'same-origin' })
      .then(function(response) {
        return response.json();
      })
      .then(function(result) {
        console.log(result);
        if (!result.error) {
          alert('Timesheet Deleted!!!');
          if (Platform.OS === 'android') {
            that.setState({ Online_Loading: false, visibleModal: null });
          } else {
            that.setState({ Online_Loading: false });
          }
        }
      })
      .catch(function(error) {
        //console.log("-------- error ------- "+error);
        Alert.alert(
          'Oops!!! Sorry, Something went wrong',
          'Please re-login',
          [{ text: 'Ok' }],
          { cancelable: false }
        );
      });
  }

  delete_notification() {
    this.setState({ ActivityIndicator_Loading: true });
    db.transaction(tx => {
      tx.executeSql(
        'delete from notifications where id=?',
        [this.state.id],
        (tx, res) => {
          tx.executeSql('delete from Timesheet where uuid=?', [
            this.state.uuid,
          ]);
          this.setState({ ActivityIndicator_Loading: false });
          console.log(
            'Notification delete successful notifications id - ' + this.state.id
          );
          Alert.alert(
            'Error Timesheet Deleted',
            'back to Notifications screen',
            [
              {
                text: 'Ok',
                onPress: () =>
                  this.props.navigation.push('Notifications', {
                    username: this.state.username,
                    email: this.state.email,
                    baseURL: this.state.baseURL,
                    user_id: this.state.userid,
                    addPin: this.state.addPin,
                  }),
              },
            ],
            { cancelable: false }
          );
        }
      );
    });
    //  this.setState({ ActivityIndicator_Loading : false})
  }

  offlineUpdate_timesheet() {
    this.setState({ Offline_Loading: true });
    var id = this.state.id;
    var sTime = '';
    var eTime = '';
    sTime =
      this.state.selectedStartHours +
      ':' +
      this.state.selectedStartMinutes +
      ':00';
    eTime =
      this.state.selectedEndHours + ':' + this.state.selectedEndMinutes + ':00';
    var sh = this.state.selectedStartHours;
    var sm = this.state.selectedStartMinutes;
    var eh = this.state.selectedEndHours;
    var em = this.state.selectedEndMinutes;

    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Timesheet set job_id=?, activity_code=?, total_hours=?, comment=?, units=?, start_time=?, end_time=?, sh=?, sm=?, eh=?, em=?  where id=?',
        [
          this.state.jobs,
          this.state.activity,
          this.state.totalHours,
          this.state.comments,
          this.state.units,
          sTime,
          eTime,
          sh,
          sm,
          eh,
          em,
          id,
        ],
        (tx, res) => {
          console.log(
            '(OFFLINE UDPATE) - SQLLite Timesheet Update Results',
            res.rowsAffected
          );
          this.setState({ Offline_Loading: false });
          Alert.alert(
            'Offline Timesheet Updated',
            'back to dashboard',
            [
              {
                text: 'Ok',
                onPress: () =>
                  this.props.navigation.navigate('Dashboard', {
                    count: 0,
                    username: this.state.username,
                    email: this.state.email,
                    baseURL: this.state.baseURL,
                    user_id: this.state.user_id,
                    addPin: this.state.addPin,
                  }),
              },
            ],
            { cancelable: false }
          );
        }
      );
    });
    //  tx.executeSql('insert into Timesheet (user_id, date, total_hours, start_time, end_time, activity_code, uuid, session_id, gps_lat, gps_lng, job_id, units, source, comment, error, error_flag, screen, sh, sm, eh, em) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[this.state.userid, this.state.date, this.state.totalHours, this.state.startTime, this.state.endTime, this.state.activity, 'timesheet_'+data, '0', this.state.gps_lat, this.state.gps_lng, this.state.jobs, this.state.units, 'App', this.state.comments, ' ', '0', 'error adding timesheet entry', this.state.SH, this.state.SM, this.state.EH, this.state.EM])
  }

  offlineDelete_timesheet(data) {
    this.setState({ ActivityIndicator_Loading: true });
    var id = data;
    db.transaction(tx => {
      tx.executeSql('delete from Timesheet where id=?', [id]);
    });
    alert('Offline Timesheet Deleted!!!');
    if (Platform.OS === 'android') {
      this.setState({ ActivityIndicator_Loading: false, visibleModal: null });
    } else {
      this.setState({ ActivityIndicator_Loading: false });
    }
  }

  getActivity() {
    //console.log('entered getActivity()')
    var that = this;
    var url =
      this.props.navigation.state.params.baseURL + '?ct=api&api=jobs&act=codes';
    //console.log("-----------url:"+url);
    fetch(url, { method: 'GET', credentials: 'same-origin' })
      .then(function(response) {
        return response.json();
      })
      .then(function(result) {
        if (!result.error) {
          that.setState({
            Activity: result.data,
          });
          //  //console.log(that.state.Activity);
          //          db.transaction(
          // tx => {
          //   tx.executeSql(
          //     'select * from activity',[],
          //      (tx,res) => {   console.log('activity function select')
          //        var temp = [];
          //        //console.log('res.rows.length activity function - '+res.rows.length)
          //      if(res.rows.length > 0) {
          //         for(let i=0; i < res.rows.length; ++i){
          //            temp.push(res.rows.item(i));
          //            that.setState({
          //                    Activity:temp,
          //               });
          //         }

          //      }
          //      //console.log('that.state.Activity - '+that.state.Activity)
          //      })
          // });
        }
      })
      .catch(function(error) {
        //console.log("-------- error ------- "+error);
        // Alert.alert( 'Oops!!! Sorry, Something went wrong', 'Please re-login',
        //   [
        //     {text: 'Ok'},
        //   ],
        //   { cancelable: false }
        // );
      });
  }

  getTimesheet() {
    //console.log('entered getTimesheet()')
    var that = this;
    var url =
      this.props.navigation.state.params.baseURL +
      '?ct=api&api=timesheet&act=get&user_id=' +
      this.props.navigation.state.params.user_id +
      '&date=' +
      this.props.navigation.state.params.date;
    //console.log("-----------url:"+url);
    fetch(url, { method: 'GET', credentials: 'same-origin' })
      .then(function(response) {
        return response.json();
      })
      .then(function(result) {
        if (!result.error) {
          var temp = [];
          var c = 0;
          console.log(result.data);
          for (let t of result.data) {
            if (t.start_time && t.end_time) {
              temp[c] = {
                title:
                  t.job_code +
                  '      ' +
                  t.start_time_nice +
                  ' - ' +
                  t.end_time_nice +
                  '                  ' +
                  t.total_hours +
                  '    ' +
                  t.num_units,
              };
            } else {
              temp[c] = {
                title:
                  t.job_code +
                  '  ' +
                  '                                            ' +
                  t.total_hours +
                  '      ' +
                  t.num_units,
              };
            }
            that.setState({
              TimesheetDateSpecific: temp,
            });
            c++;
          }

          console.log(that.state.TimesheetDateSpecific);
        }
      })
      .catch(function(error) {
        //console.log("-------- error ------- "+error);
        Alert.alert(
          'Oops!!! Sorry, Something went wrong',
          'Please re-login',
          [{ text: 'Ok' }],
          { cancelable: false }
        );
      });
  }

  ModalGetTimesheet() {
    console.log('entered ModalGetTimesheet()');
    var that = this;
    var url =
      this.props.navigation.state.params.baseURL +
      '?ct=api&api=timesheet&act=get&user_id=' +
      this.props.navigation.state.params.user_id +
      '&date=' +
      this.state.date;
    console.log('-----------url:' + url);
    fetch(url, { method: 'GET', credentials: 'same-origin' })
      .then(function(response) {
        return response.json();
      })
      .then(function(result) {
        if (!result.error) {
          var temp = [];
          var table = [];
          var c = 0;
          console.log(result.data);
          for (let t of result.data) {
            temp.push(t.job_code);
            if (t.start_time_nice && t.end_time_nice) {
              temp.push(t.start_time_nice + ' - ' + t.end_time_nice);
            } else {
              temp.push('');
            }
            temp.push(t.total_hours);
            temp.push(t.id);
            table.push(temp);
            temp = [];
            c++;
          }
          that.setState({
            TimesheetDateSpecific: result.data,
            tableDataOnline: table,
            ActivityIndicator_Loading: false,
            CountGetTimesheet: false,
          });
          console.log(result.data);
          console.log(that.state.TimesheetDateSpecific);
          console.log(that.state.tableDataOnline);
        }
      })
      .catch(function(error) {
        console.log('-------- error ------- ' + error);
        Alert.alert(
          'Oops!!!',
          'Sorry, Something went wrong',
          [{ text: 'Ok' }],
          { cancelable: false }
        );
      });
  }

  getStartStop() {
    const { selectedStartHours, selectedStartMinutes } = this.state;

    if (this.props.navigation.state.params.error) {
      if (this.state.selectedEndHours != '  ') {
        return (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text>Start Time</Text>
            <Text>(Click to change time)</Text>
              <Button
                icon={<Ionicons name="ios-clock" size={30} color="white" />}
                onPress={this.showDateTimePicker}
                type="solid"
                buttonStyle={{
                  alignSelf:'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#71BF44',
                  width: '55%',
                }}
                title={
                  '   ' +
                  selectedStartHours +
                  ':' +
                  selectedStartMinutes +
                  '      '
                }
              />
            <DateTimePicker
              mode="time"
              is24Hour={false}
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={this.handleDatePicked}
              onCancel={this.hideDateTimePicker}
            />

            <Text>End Time</Text>
            <Text>(Click to change time)</Text>
              <Button
                icon={<Ionicons name="ios-clock" size={30} color="white" />}
                onPress={this.showEndDateTimePicker}
                type="solid"
                buttonStyle={{
                  alignSelf:'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#71BF44',
                  width: '55%',
                }}
                title={
                  '   ' +
                  this.state.selectedEndHours +
                  ':' +
                  this.state.selectedEndMinutes +
                  '      '
                }
              />
            <DateTimePicker
              mode="time"
              is24Hour={false}
              isVisible={this.state.isEndDateTimePickerVisible}
              onConfirm={this.handleEndDatePicked}
              onCancel={this.hideEndDateTimePicker}
            />
          </View>
        );
      }
    } else {
      if (
        this.props.navigation.state.params.totalHours === '' ||
        (selectedStartHours != 'Invalid date' && this.state.displayOffline)
      ) {
        return (
          <View style={{ alignItems: 'center' }}>
            <Text>Start Time</Text>
            <Text>(Click to change time)</Text>
            {this.state.displayOffline ? (
                <Button
                  icon={<Ionicons name="ios-clock" size={30} color="white" />}
                  onPress={this.showDateTimePicker}
                  type="solid"
                  buttonStyle={{
                    alignSelf:'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#71BF44',
                    width: '55%',
                  }}
                  title={
                    '   ' +
                    selectedStartHours +
                    ':' +
                    selectedStartMinutes +
                    '      '
                  }
                />
            ) : (
                <Button
                  icon={<Ionicons name="ios-clock" size={30} color="white" />}
                  onPress={this.showDateTimePicker}
                  type="solid"
                  buttonStyle={{
                    alignSelf:'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#E8910C',
                    width: '55%',
                  }}
                  title={
                    '   ' +
                    selectedStartHours +
                    ':' +
                    selectedStartMinutes +
                    '      '
                  }
                />
            )}
            <DateTimePicker
              mode="time"
              is24Hour={false}
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={this.handleDatePicked}
              onCancel={this.hideDateTimePicker}
            />

            <Text>End Time</Text>
            <Text>(Click to change time)</Text>
            {this.state.displayOffline ? (
                <Button
                  icon={<Ionicons name="ios-clock" size={30} color="white" />}
                  onPress={this.showEndDateTimePicker}
                  type="solid"
                  buttonStyle={{
                    alignSelf:'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#71BF44',
                    width: '55%',
                  }}
                  title={
                    '   ' +
                    this.state.selectedEndHours +
                    ':' +
                    this.state.selectedEndMinutes +
                    '      '
                  }
                />
            ) : (
                <Button
                  icon={<Ionicons name="ios-clock" size={30} color="white" />}
                  onPress={this.showEndDateTimePicker}
                  type="solid"
                  buttonStyle={{
                    alignSelf:'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#E8910C',
                    width: '55%',
                  }}
                  title={
                    '   ' +
                    this.state.selectedEndHours +
                    ':' +
                    this.state.selectedEndMinutes +
                    '      '
                  }
                />
            )}
            <DateTimePicker
              mode="time"
              is24Hour={false}
              isVisible={this.state.isEndDateTimePickerVisible}
              onConfirm={this.handleEndDatePicked}
              onCancel={this.hideEndDateTimePicker}
            />
          </View>
        );
      }
    }
  }

  //functions to allow elements to capture data
  getJobs() {
    var job = 'Non-Billable';
    if (this.props.navigation.state.params.jobs != 0) {
      return (
        <TextInput
          style={{
            fontSize: 15,
            height: 30,
            flex: 1,
            color: 'black',
          }}
          autoCorrect={false}
          spellCheck={false}
          underlineColorAndroid="transparent"
          label="Job"
          placeholder="Job"
          value={this.props.navigation.state.params.jobs}
          onChangeText={jobs => this.setState({ jobs })}
        />
      );
    } else {
      return (
        <TextInput
          style={{
            fontSize: 15,
            height: 30,
            flex: 1,
            color: 'black',
          }}
          autoCorrect={false}
          spellCheck={false}
          underlineColorAndroid="transparent"
          label="Job"
          placeholder="Job"
          value={job}
          onChangeText={jobs => this.setState({ jobs })}
        />
      );
    }
  }

  getActivities() {
    if (this.state.Activity) {
      if (Platform.OS === 'android') {
        return (
          <Picker
            style={{ width: '90%' }}
            selectedValue={this.state.activity}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ activity: itemValue })
            }>
            {this.state.Activity.map((item, key) => (
              <Picker.Item label={item.activity} value={item.code} key={key} />
            ))}
          </Picker>
        );
      } else {
        return (
          <View style={{ flex: 1 }}>
            <Button
              style={{ width: '100%' }}
              type="clear"
              title={this.state.activity}
              titleStyle={{ color: 'black' }}
              onPress={this.ModalActivity}
            />
          </View>
        );
      }
    }
  }

  getHalfDay() {
    if (this.state.Timesheets.half_day > 0) {
      return (
        <View style={{ width: '50%' }}>
          <Button title="half-day" onPress={this.HalfDay} color="black" />
        </View>
      );
    }
  }
  getDay() {
    if (this.state.Timesheets.full_day > 0) {
      return (
        <View style={{ width: '50%' }}>
          <Button title="day" onPress={this.FullDay} color="black" />
        </View>
      );
    }
  }
  getTotalHours() {
    if (this.props.navigation.state.params.totalHours != '') {
      return (
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TextInput
            style={{
              fontSize: 15,
              height: 30,
              flex: 1,
              color: 'black',
            }}
            keyboardType={'numeric'}
            autoCorrect={false}
            spellCheck={false}
            underlineColorAndroid="transparent"
            label="Total Hours"
            placeholder="Total Hours"
            value={this.state.totalHours}
            onChangeText={totalHours => this.setState({ totalHours })}
          />
        </View>
      );
    }
  }

  getUnits() {
    if (this.props.navigation.state.params.units) {
      return (
        <TextInput
          style={{
            fontSize: 15,
            height: 30,
            flex: 1,
            color: 'black',
          }}
          keyboardType={'numeric'}
          autoCorrect={false}
          spellCheck={false}
          underlineColorAndroid="transparent"
          label="Units"
          placeholder="Units"
          value={this.state.units}
          onChangeText={units => this.setState({ units })}
        />
      );
    }
  }

  noInternet() {
    if (this.state.displayOffline == null) {
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.TouchableOpacityStyle4}>
          <View style={styles.offlineContainer}>
            <Text style={styles.offlineText}>Offline Mode</Text>
          </View>
        </TouchableOpacity>
      );
    }
  }

  HalfDay = () => {
    this.setState({ totalHours: this.state.Timesheets.half_day });
  };

  FullDay = () => {
    this.setState({ totalHours: this.state.Timesheets.full_day });
  };

  HistoryModal = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.Mbutton}>
        <Text style={{ color: 'white' }}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  HistoryModalContent() {
    const element = (data, index) => (
      <TouchableOpacity
        style={{ paddingLeft: 10 }}
        onPress={() => this.delete_timesheet(data)}>
        <View
          style={{
            paddingLeft: 5,
            width: 58,
            height: 20,
            backgroundColor: 'red',
            borderRadius: 2,
            paddingRight: 5,
          }}>
          <Text style={{ textAlign: 'center', color: '#fff' }}>Delete</Text>
        </View>
      </TouchableOpacity>
    );
    if (this.state.CountGetTimesheet) {
      this.ModalGetTimesheet();
    }
    {
      return (
        <View style={styles.stage}>
          <Text>Timesheet Added History</Text>

          <Table borderStyle={{ borderWidth: 2, borderColor: '#D0D0D0' }}>
            <Row
              data={this.state.tableHead}
              style={styles.headO}
              flexArr={[1, 1, 1, 1]}
              textStyle={styles.text}
            />
          </Table>

          <View>
            <View>
              <ScrollView>
                <Table>
                  {this.state.tableDataOnline.map((rowData, index) => (
                    <TouchableOpacity
                      onPress={() => this.EditOnlineTimesheet(index)}>
                      <TableWrapper
                        key={index}
                        style={{
                          flexDirection: 'row',
                          backgroundColor: 'white',
                        }}>
                        {rowData.map((cellData, cellIndex) => (
                          <Cell
                            key={cellIndex}
                            data={
                              cellIndex === 3
                                ? element(cellData, index)
                                : cellData
                            }
                            textStyle={{ margin: 6 }}
                          />
                        ))}
                      </TableWrapper>
                    </TouchableOpacity>
                  ))}
                </Table>
              </ScrollView>
            </View>
            {this.state.ActivityIndicator_Loading ? (
              <View>
                <ActivityIndicator
                  color="#009688"
                  size="large"
                  style={styles.ActivityIndicatorStyle}
                />
              </View>
            ) : null}

            {this.HistoryModal('Close', () =>
              this.setState({ visibleModal: null })
            )}
          </View>
        </View>
      );
    }
  }

  OfflineHistoryModal(text, onPress) {
    return (
      <View>
        <TouchableOpacity onPress={onPress}>
          <View style={styles.OMbutton}>
            <Text style={{ color: 'white' }}>{text}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  OfflineHistoryModalContent() {
    const element = (data, index) => (
      <TouchableOpacity
        style={{ paddingLeft: 10 }}
        onPress={() => this.offlineDelete_timesheet(data)}>
        <View
          style={{
            paddingLeft: 5,
            width: 58,
            height: 20,
            backgroundColor: 'red',
            borderRadius: 2,
            paddingRight: 5,
          }}>
          <Text style={{ textAlign: 'center', color: '#fff' }}>Delete</Text>
        </View>
      </TouchableOpacity>
    );
    var that = this;
    const table = [];
    db.transaction(tx => {
      tx.executeSql(
        'select * from Timesheet  where date = ?',
        [this.state.date],
        (tx, res) => {
          var temp = [];
          var edit = [];

          if (res.rows.length > 0) {
            for (let i = 0; i < res.rows.length; ++i) {
              temp.push(res.rows.item(i).activity_code);
              if (res.rows.item(i).total_hours === '') {
                temp.push(
                  res.rows.item(i).start_time +
                    ' - ' +
                    res.rows.item(i).end_time
                );
                temp.push('');
              } else {
                temp.push('');
                temp.push(res.rows.item(i).total_hours);
              }
              temp.push(res.rows.item(i).id);
              //  table.push(res.rows.item(i).activity_code+','+res.rows.item(i).start_time+' - '+res.rows.item(i).end_time+','+res.rows.item(i).total_hours+','+res.rows.item(i).units)
              table.push(temp);
              temp = [];
              edit.push(res.rows.item(i));
              that.setState({ OfflineDateSpecific: edit });
            }
            that.setState({
              tableData: table,
              ActivityIndicator_Loading: false,
            });
          } else {
            that.setState({ tableData: [], ActivityIndicator_Loading: false });
          }
        }
      );
      // if(this.state.tableData.length > 0){
      //     this.setState({ActivityIndicator_Loading : true })
      // }
    });

    {
      return (
        <View style={styles.stage}>
          <Text>Timesheet Offline Added History</Text>

          <Table borderStyle={{ borderWidth: 2, borderColor: 'black' }}>
            <Row
              data={this.state.tableHead}
              style={styles.head}
              flexArr={[1, 1, 1, 1]}
              textStyle={styles.text}
            />
          </Table>

          <View>
            <View>
              <ScrollView>
                <Table>
                  {this.state.tableData.map((rowData, index) => (
                    <TouchableOpacity
                      onPress={() => this.EditOfflineTimesheet(index)}>
                      <TableWrapper
                        key={index}
                        style={{
                          flexDirection: 'row',
                          backgroundColor: 'white',
                        }}>
                        {rowData.map((cellData, cellIndex) => (
                          <Cell
                            key={cellIndex}
                            data={
                              cellIndex === 3
                                ? element(cellData, index)
                                : cellData
                            }
                            textStyle={{ margin: 6 }}
                          />
                        ))}
                      </TableWrapper>
                    </TouchableOpacity>
                  ))}
                </Table>
              </ScrollView>
            </View>
            {this.state.ActivityIndicator_Loading ? (
              <View>
                <ActivityIndicator
                  color="#009688"
                  size="large"
                  style={styles.ActivityIndicatorStyle}
                />
              </View>
            ) : null}

            {this.OfflineHistoryModal('Close', () =>
              this.setState({ visibleModal: null })
            )}
          </View>
        </View>
      );
    }
  }

  onlineButtons() {
    if (this.props.navigation.state.params.error) {
      return (
        <View style={{ flexDirection: 'row', paddingTop: 10 }}>
          <View style={{ padding: 3 }}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.TouchableOpacityStyle}
              onPress={this.insert_timesheet}>
              <Text style={styles.TextStyle}>Add Entry</Text>
            </TouchableOpacity>
          </View>
          <View style={{ padding: 3 }}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.DeleteStyle}
              onPress={this.delete_notification}>
              <Text style={styles.TextStyle}>Delete</Text>
            </TouchableOpacity>
          </View>
          {this.state.ActivityIndicator_Loading ? (
            <ActivityIndicator
              color="#009688"
              size="large"
              style={styles.ActivityIndicatorStyle}
            />
          ) : null}
        </View>
      );
    } else {
      return (
        <View style={{ flexDirection: 'row', paddingTop: 10 }}>
          <View style={{ padding: 3 }}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.TouchableOpacityStyle}
              onPress={this.update_timesheet}>
              <Text style={styles.TextStyle}>Update</Text>
            </TouchableOpacity>
          </View>

          {this.state.Online_Loading ? (
            <ActivityIndicator
              color="#009688"
              size="large"
              style={styles.ActivityIndicatorStyle}
            />
          ) : null}
        </View>
      );
    }
  }

  offlineButtons() {
    return (
      <View style={{ flexDirection: 'row', paddingTop: 10 }}>
        <View style={{ padding: 3 }}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.TouchableOpacityStyle}
            onPress={this.offlineUpdate_timesheet}>
            <Text style={styles.TextStyle}>Update</Text>
          </TouchableOpacity>
        </View>
        {this.state.Offline_Loading ? (
          <ActivityIndicator
            color="#009688"
            size="large"
            style={styles.ActivityIndicatorStyle}
          />
        ) : null}
      </View>
    );
  }

  EditOnlineTimesheet(i) {
    const off = this.state.TimesheetDateSpecific;

    this.props.navigation.push(
      'EditTimesheet',
      {
        date: off[i].timesheet_day,
        jobs: off[i].job_id,
        activity: off[i].job_code,
        totalHours: off[i].total_hours,
        comments: off[i].job_comment,
        units: off[i].units,
        email: this.props.navigation.state.params.email,
        baseURL: this.props.navigation.state.params.baseURL,
        user_id: this.props.navigation.state.params.user_id,
        id: off[i].id,
        error: null,
        uuid: off[i].uuid,
        startTime: off[i].start_time,
        endTime: off[i].end_time,
        addPin: this.props.navigation.state.params.addPin,
      },
      this.setState({ visibleModal: null })
    );
  }

  EditOfflineTimesheet(i) {
    const off = this.state.OfflineDateSpecific;

    this.props.navigation.push(
      'EditTimesheet',
      {
        date: off[i].date,
        jobs: off[i].job_id,
        activity: off[i].activity_code,
        totalHours: off[i].total_hours,
        comments: off[i].job_comment,
        units: off[i].units,
        email: this.props.navigation.state.params.email,
        baseURL: this.props.navigation.state.params.baseURL,
        user_id: this.props.navigation.state.params.user_id,
        id: off[i].id,
        error: null,
        uuid: off[i].uuid,
        startTime: off[i].start_time,
        endTime: off[i].end_time,
        addPin: this.props.navigation.state.params.addPin,
        SH: off[i].sh,
        SM: off[i].sm,
        EH: off[i].eh,
        EM: off[i].em,
        unpaid:off[i].unpaid,
      },
      this.setState({ visibleModal: null })
    );
  }

  ModalActivity = () => {
    if (this.state.modalIsVisible) {
      return;
    }

    this.setState({ modalIsVisible: true }, () => {
      Animated.timing(this.state.modalAnimatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  ModalActivityDone = () => {
    Animated.timing(this.state.modalAnimatedValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ modalIsVisible: false });
    });
  };

  ModalRenderActivities = () => {
    if (!this.state.modalIsVisible) {
      return null;
    }

    const { modalAnimatedValue } = this.state;
    const opacity = modalAnimatedValue;
    const translateY = modalAnimatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [300, 0],
    });

    return (
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents={this.state.modalIsVisible ? 'auto' : 'none'}>
        <TouchableWithoutFeedback onPress={this.ModalActivityDone}>
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
              <Button
                title="Done"
                buttonStyle={{ backgroundColor: '#71BF44' }}
                onPress={this.ModalActivityDone}
              />
            </View>
          </View>
          <Picker
            style={{ width: WindowWidth, backgroundColor: '#e1e1e1' }}
            selectedValue={this.state.activity}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ activity: itemValue })
            }>
            {this.state.Activity.map((item, key) => (
              <Picker.Item label={item.activity} value={item.code} key={key} />
            ))}
          </Picker>
        </Animated.View>
      </View>
    );
  };

  ModalJobs = () => {
    if (this.state.modalJobsIsVisible) {
      return;
    }

    this.setState({ modalJobsIsVisible: true }, () => {
      Animated.timing(this.state.modalJAnimatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  ModalJobsDone = () => {
    Animated.timing(this.state.modalJAnimatedValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ modalJobsIsVisible: false });
    });
  };

  ModalRenderJobs = () => {
    if (!this.state.modalJobsIsVisible) {
      return null;
    }

    const { modalJAnimatedValue } = this.state;
    const opacity = modalJAnimatedValue;
    const translateY = modalJAnimatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [300, 0],
    });

    return (
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents={this.state.modalJobsIsVisible ? 'auto' : 'none'}>
        <TouchableWithoutFeedback onPress={this.ModalJobsDone}>
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
              <Button
                title="Done"
                buttonStyle={{ backgroundColor: '#71BF44' }}
                onPress={this.ModalJobsDone}
              />
            </View>
          </View>
          <Picker
            style={{ width: WindowWidth, backgroundColor: '#e1e1e1' }}
            selectedValue={this.state.jobs}
            onValueChange={(itemValue, itemIndex) => this.pickJob(itemIndex)}>
            {this.state.Jobs.map((item, key) => (
              <Picker.Item
                label={item.description}
                value={item.jobid}
                key={key}
              />
            ))}
          </Picker>
        </Animated.View>
      </View>
    );
  };

  ModalOJobs = () => {
    if (this.state.modalOJobsIsVisible) {
      return;
    }

    this.setState({ modalOJobsIsVisible: true }, () => {
      Animated.timing(this.state.modalOJAnimatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  ModalOJobsDone = () => {
    Animated.timing(this.state.modalOJAnimatedValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ modalOJobsIsVisible: false });
    });
  };

  ModalRenderOJobs = () => {
    if (!this.state.modalOJobsIsVisible) {
      return null;
    }

    const { modalOJAnimatedValue } = this.state;
    const opacity = modalOJAnimatedValue;
    const translateY = modalOJAnimatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [300, 0],
    });

    return (
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents={this.state.modalOJobsIsVisible ? 'auto' : 'none'}>
        <TouchableWithoutFeedback onPress={this.ModalOJobsDone}>
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
              <Button
                title="Done"
                buttonStyle={{ backgroundColor: '#71BF44' }}
                onPress={this.ModalOJobsDone}
              />
            </View>
          </View>
          <Picker
            style={{ width: WindowWidth, backgroundColor: '#e1e1e1' }}
            selectedValue={this.state.otherJobs}
            onValueChange={(itemValue, itemIndex) =>
              this.pickOtherJob(itemIndex)
            }>
            {this.state.OtherJobs.map((item, key) => (
              <Picker.Item
                label={item.description}
                value={item.jobid}
                key={key}
              />
            ))}
          </Picker>
        </Animated.View>
      </View>
    );
  };

  render() {
    const { selectedHours, selectedMinutes } = this.state;
    const { navigate } = this.props.navigation;
    return (
      <ScrollView>
        <View style={styles.container}>{this.noInternet()}</View>
        <TableView>
          {this.props.navigation.state.params.error ? (
            <Section
              header="Error timesheet entry"
              sectionTintColor="red"
              headerTextColor="white">
              <Table borderStyle={{ borderWidth: 2, borderColor: 'white' }}>
                <Row
                  data={this.state.tableErrorHead}
                  flexArr={[1, 3]}
                  style={{ backgroundColor: 'white' }}
                  textStyle={styles.text}
                />
              </Table>
              <View style={{ height: 10, paddingLeft: 5, paddingBottom: 10 }}>
                <Text
                  style={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}>
                  {this.state.ErrorEntry}
                </Text>
              </View>
              <View style={{ paddingTop: 10 }}>
                {this.HistoryModal('Click for Timesheet History', () =>
                  this.setState({ visibleModal: 1, CountGetTimesheet: true })
                )}
              </View>
              <Modal isVisible={this.state.visibleModal === 1}>
                {this.HistoryModalContent()}
              </Modal>
            </Section>
          ) : this.state.displayOffline ? (
            <Section
              header="Timesheet History"
              sectionTintColor="#EFEFF4"
              headerTextColor="black">
              {this.HistoryModal('Click for Timesheet History', () =>
                this.setState({ visibleModal: 1, CountGetTimesheet: true })
              )}
              <Modal isVisible={this.state.visibleModal === 1}>
                {this.HistoryModalContent()}
              </Modal>
            </Section>
          ) : (
            <Section
              header="Timesheet History"
              sectionTintColor="#EFEFF4"
              headerTextColor="black">
              {this.OfflineHistoryModal('Click for Timesheet History', () =>
                this.setState({ visibleModal: 1 })
              )}
              <Modal isVisible={this.state.visibleModal === 1}>
                {this.OfflineHistoryModalContent()}
              </Modal>
            </Section>
          )}
          <Section>
            <View style={styles.container}>
              <Text
                style={{
                  fontSize: 15,
                  height: 30,
                  flex: 1,
                  color: 'black',
                }}>
                {' '}
                Edit Timesheet Entry{' '}
              </Text>

              {this.props.navigation.state.params.error ? (
                <Text>Error</Text>
              ) : null}
              {this.props.navigation.state.params.error ? (
                <View style={styles.TextInputStyleError}>
                  <TextInput
                    style={styles.TextInputStyleError}
                    underlineColorAndroid="transparent"
                    label="Error"
                    placeholder={'Error'}
                    numberOfLines={4}
                    multiline={true}
                    value={this.props.navigation.state.params.error}
                  />
                </View>
              ) : null}

              <DatePicker
                style={{ width: 300, flex: 1, color: 'white', borderStyle:'solid' }}
                date={this.props.navigation.state.params.date}
                mode="date"
                placeholder="Timesheet Entry Date"
                format="dddd LL"
               // minDate="2019-01-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                // iconComponent={
                //   <FontAwesome
                //   size={30}
                //   name='calendar'
                //   />
                //   }
                customStyles={{
                  dateInput: {
                    marginLeft: 0,
                    color: 'black',
                  },
                }}
                onDateChange={date => {
                  this.setState({ date: date });
                }}
              />
              <Text>Job</Text>
              <View style={styles.Dropdown}>{this.getJobs()}</View>

              <Text>Activity</Text>
              <View style={styles.Dropdown}>{this.getActivities()}</View>
              <Modal isVisible={this.state.modalIsVisible === true}>
                {this.ModalRenderActivities()}
              </Modal>

              <Text>Comment</Text>
              <View style={styles.textInput}>
                <TextInput
                  style={styles.TextInputStyleClass}
                  underlineColorAndroid="transparent"
                  label="Comment"
                  placeholder={'Comment'}
                  numberOfLines={2}
                  multiline={true}
                  value={this.state.comments}
                  onChangeText={comments => this.setState({ comments })}
                />
              </View>

              <View style={{ flex: 1, alignItems: 'center' , paddingBottom:5 }}>
                {this.getStartStop()}
              </View>

              <Text>Unpaid time (minutes)</Text>
                <View style={styles.textInput}>

                <TextInput
                      style={{
                  fontSize: 15,
                  height: 30,
                  flex: 1,
                  color: 'black'
                }}
                keyboardType={'numeric'}
                autoCorrect={false}
                spellCheck={false}
                underlineColorAndroid='transparent'
                label='Unpaid Time'
                placeholder="Unpaid Time in Minutes"
                value={this.state.unpaid}
                onChangeText ={unpaid => this.setState({ unpaid })}
                  />
              </View> 

              {this.props.navigation.state.params.totalHours != '' ? (
                <Text>Total Hours</Text>
              ) : null}
              {this.props.navigation.state.params.totalHours != '' ? (
                <View style={styles.textInput}>{this.getTotalHours()}</View>
              ) : null}

              {this.state.displayOffline ? (
                <View>{this.onlineButtons()}</View>
              ) : (
                <View>{this.offlineButtons()}</View>
              )}
            </View>
          </Section>
        </TableView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
    padding: 20,
    flex:1,  
  },
  containerLogoff: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'lightgreen',
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
    backgroundColor: 'white',
    color: 'black',
    flex: 1,
  },
  timepicker: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    borderWidth: 0.5,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 10,
    backgroundColor: 'white',
    color: 'black',
    width: '100%',
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
    flex: 2,
    height: 50,
  },
  TextInputStyleClass: {
    textAlign: 'center',
    height: 50,
    // borderWidth: 0.5,
    borderRadius: 10,
    backgroundColor: 'White',
    flex: 2,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 10,
    flexDirection: 'row',
    color: 'black',
  },
  TextInputStyleError: {
    textAlign: 'center',
    height: 80,
    borderWidth: 0.5,
    borderRadius: 10,
    backgroundColor: 'red',
    flex: 2,
    paddingLeft: 0,
    paddingRight: 15,
    marginBottom: 10,
    flexDirection: 'row',
    color: 'white',
  },

  TouchableOpacityStyle: {
    alignItems: 'center',
    borderRadius: 15,
    height: 50,
    borderWidth: 1,
    paddingTop: 10,
    backgroundColor: 'white',
    marginBottom: 10,
    width: 150,
    color: 'black',
  },
  DeleteStyle: {
    alignItems: 'center',
    borderRadius: 15,
    height: 50,
    borderWidth: 1,
    paddingTop: 10,
    backgroundColor: 'red',
    marginBottom: 10,
    width: 150,
    color: 'black',
  },

  TextStyle: {
    textAlign: 'center',
    fontSize: 18,
    color: 'black',
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
  ActivityIndicatorStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  TimeSuccessEntry1: {
    alignItems: 'center',
    paddingLeft: 5,
    fontSize: 18,
    height: 44,
    color: '#d0d0d0',
  },
  TimeSuccessEntry2: {
    alignItems: 'center',
    paddingLeft: 5,
    fontSize: 18,
    height: 44,
    color: '#d0d0d0',
  },
  TimeSuccessEntry3: {
    alignItems: 'center',
    paddingLeft: 5,
    fontSize: 18,
    height: 44,
    color: '#d0d0d0',
  },
  TimeSuccessEntry4: {
    alignItems: 'center',
    paddingLeft: 5,
    fontSize: 18,
    height: 44,
    color: '#d0d0d0',
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
    elevation: 8,
  },
  fabIcon: {
    fontSize: 40,
    color: 'white',
  },

  item: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'flex-start',
    //   justifyContent: 'center',
    flex: 1,
    margin: 1,
    height: 40, // approximate a square
  },
  head: { height: 40, backgroundColor: '#E8910C' },
  headO: { height: 40, backgroundColor: '#71BF44' },
  text: { margin: 6 },
  offlineContainer: {
    backgroundColor: '#E8910C',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
    position: 'absolute',
    top: 0,
    bottom: 50,
    flexWrap: 'wrap',
  },
  offlineText: { color: '#fff' },
  Mbutton: {
    backgroundColor: '#71BF44',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: '#71BF44',
  },
  OMbutton: {
    backgroundColor: '#E8910C',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'black',
  },
  stage: {
    backgroundColor: '#EFEFF4',
    paddingBottom: 20,
    //  flex: 1
  },
});
