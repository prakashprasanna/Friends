import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import PhoneInput from 'react-native-phone-input';

import {text} from '../text';
import {theme} from '../constants';
import {components} from '../components';
import {useAppNavigation} from '../hooks';

const VerifyYourPhoneNumber: React.FC = (): JSX.Element => {
  const navigation = useAppNavigation();

  const renderHeader = () => {
    return (
      <components.Header
        title='Verify your phone number'
        goBack={navigation.canGoBack()}
      />
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          backgroundColor: theme.colors.pastel,
          marginHorizontal: 20,
          paddingBottom: 50,
          paddingTop: 30,
        }}
        style={{
          marginTop: 10,
        }}
      >
        <components.Image
          source={require('./../assets/images/03.png')}
          style={{
            width: '100%',
            aspectRatio: 1.23,
            position: 'absolute',
            bottom: 0,
          }}
        />
        <View
          style={{
            paddingHorizontal: 20,
          }}
        >
          <text.T16
            style={{
              marginBottom: 30,
              color: theme.colors.textColor,
            }}
          >
            We have sent you an SMS with a code to number +17 0123456789.
          </text.T16>
          <View
            style={{
              borderWidth: 1,
              borderColor: theme.colors.pastel,
              marginBottom: 20,
              backgroundColor: theme.colors.white,
              height: 60,
              justifyContent: 'center',
            }}
          >
            <PhoneInput
              style={{
                paddingVertical: 16,
                paddingHorizontal: 25,
              }}
              initialCountry={'us'}
              textStyle={{
                ...theme.fonts.Lato_400Regular,
                fontSize: 16,
                color: theme.colors.mainColor,
              }}
            />
          </View>
          <components.Button
            title='confirm'
            onPress={() => {
              navigation.navigate('ConfirmationCode');
            }}
          />
        </View>
      </ScrollView>
    );
  };

  return (
    <components.SafeAreaView
      style={{
        backgroundColor: theme.colors.white,
      }}
    >
      {renderHeader()}
      {renderContent()}
    </components.SafeAreaView>
  );
};

export default VerifyYourPhoneNumber;
