import {View, Text, ScrollView} from 'react-native';
import React, {useState} from 'react';

import {text} from '../text';
import {theme} from '../constants';
import {components} from '../components';
import {useAppNavigation} from '../hooks';
import {validation} from '../utils/validation';

const NewPassword: React.FC = (): JSX.Element => {
  const navigation = useAppNavigation();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const renderHeader = () => {
    return (
      <components.Header
        title='Reset password'
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
          flexGrow: 1,
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
            Enter new password and confirm.
          </text.T16>
          <components.InputField
            placeholder='password'
            onChangeText={(text) => setPassword(text)}
            value={password}
            eyeOffIcon={true}
            secureTextEntry={true}
            containerStyle={{
              marginBottom: 10,
            }}
          />
          <components.InputField
            placeholder='confirm password'
            eyeOffIcon={true}
            onChangeText={(text) => setConfirmPassword(text)}
            secureTextEntry={true}
            value={confirmPassword}
            containerStyle={{
              marginBottom: 20,
            }}
          />
          <components.Button
            title='Send'
            onPress={() => {
              if (validation({password, confirmPassword})) {
                console.log('success');
                navigation.navigate('ForgotPasswordSentEmail');
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

export default NewPassword;
