import {View, Text, ScrollView} from 'react-native';
import React, {useState} from 'react';

import {text} from '../text';
import {theme} from '../constants';
import {components} from '../components';
import {useAppNavigation} from '../hooks';
import {validation} from '../utils/validation';

const ForgotPassword: React.FC = (): JSX.Element => {
  const navigation = useAppNavigation();

  const [email, setEmail] = useState('');

  const renderHeader = () => {
    return (
      <components.Header
        title='Forgot password'
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
          paddingTop: 30,
          paddingBottom: 50,
        }}
        style={{
          flexGrow: 1,
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
            Please enter your email address. You will receive a link to create a
            new password via email.
          </text.T16>
          <components.InputField
            placeholder='kristinwatson@mail.com'
            onChangeText={(text) => setEmail(text)}
            value={email}
            containerStyle={{
              marginBottom: 20,
            }}
          />
          <components.Button
            title='Send'
            onPress={() => {
              if (validation({email})) {
                navigation.navigate('NewPassword');
              }
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

export default ForgotPassword;
