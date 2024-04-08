import {View, ScrollView, TouchableOpacity, Alert} from 'react-native';
import React from 'react';

import {text} from '../../text';
import {svg} from '../../assets/svg';
import {theme} from '../../constants';
import {components} from '../../components';
import {useAppNavigation, useAppDispatch} from '../../hooks';
import {
  setRefreshToken,
  setAccessToken,
  setIsFirstTime,
} from '../../store/slices/appStateSlice';
import {GoogleSignin} from 'react-native-google-signin';

const Profile = () => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();

  const renderHeader = () => {
    return (
      <components.Header
        logo={true}
        basket={true}
        title='My profile'
        backgroundColor={theme.colors.pastel}
      />
    );
  };

  const renderUserInfo = () => {
    return (
      <View style={{marginBottom: 20}}>
        <TouchableOpacity
          style={{
            marginBottom: 18,
          }}
          onPress={() => {
            navigation.navigate('EditProfile');
          }}
        >
          <components.ImageBackground
            source={{
              uri: 'https://george-fx.github.io/beloni/avatar/01.jpg',
            }}
            imageStyle={{
              borderWidth: 6,
              borderRadius: 45,
              borderColor: theme.colors.accentColor,
            }}
            style={{
              height: 90,
              width: 90,
              alignSelf: 'center',
            }}
          >
            <View
              style={{
                position: 'absolute',
                right: -10,
                bottom: 0,
              }}
            >
              <svg.EditSvg />
            </View>
          </components.ImageBackground>
        </TouchableOpacity>
        <text.H3
          style={{
            textAlign: 'center',
            marginBottom: 4,
          }}
        >
          Kristin Watson
        </text.H3>
        <text.T14
          style={{
            textAlign: 'center',
          }}
        >
          kristinwatson@mail.com
        </text.T14>
      </View>
    );
  };

  const renderProfileList = () => {
    return (
      <View>
        <components.ProfileItem
          icon={<svg.CalendarSvg />}
          title='Order history'
          onPress={() => {
            navigation.navigate('OrderHistory');
          }}
          containerStyle={{
            marginBottom: 8,
          }}
        />
        <components.ProfileItem
          icon={<svg.CreditCardSvg />}
          title='Payment method'
          onPress={() => {
            navigation.navigate('PaymentMethod');
          }}
          containerStyle={{
            marginBottom: 8,
          }}
        />
        <components.ProfileItem
          icon={<svg.MapPinSvg />}
          title='My address'
          onPress={() => {
            navigation.navigate('MyAddress');
          }}
          containerStyle={{
            marginBottom: 8,
          }}
        />
        <components.ProfileItem
          icon={<svg.GiftSvg />}
          title='My promocodes'
          onPress={() => {
            navigation.navigate('MyPromocodes');
          }}
          containerStyle={{
            marginBottom: 8,
          }}
        />
        <components.ProfileItem
          icon={<svg.HelpCircleSvg />}
          title='FAQ'
          onPress={() => {
            navigation.navigate('FAQ');
          }}
          containerStyle={{
            marginBottom: 8,
          }}
        />
        <components.ProfileItem
          icon={<svg.LogOutSvg />}
          title='Sign out'
          onPress={async () => {
            //await logoutFromGoogle();
            dispatch(setRefreshToken(null));
            dispatch(setAccessToken(null));
            dispatch(setIsFirstTime(false));
          }}
        />
      </View>
    );
  };

  const logoutFromGoogle = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      // Removing user Info
      //setUserInfo(null);
    } catch (error) {
      console.error(error);
    }
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 28,
          paddingBottom: 20,
          paddingHorizontal: 20,
        }}
      >
        {renderUserInfo()}
        {renderProfileList()}
      </ScrollView>
    );
  };

  return (
    <components.SmartView>
      {renderHeader()}
      {renderContent()}
    </components.SmartView>
  );
};

export default Profile;
