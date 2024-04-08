import React, {useState} from 'react';
import ParsedText from 'react-native-parsed-text';
import {View, Text, StatusBar, TouchableOpacity} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {text} from '../../text';
import {theme} from '../../constants';
import {components} from '../../components';
import {useAppNavigation} from '../../hooks';
import {validation} from '../../utils/validation';

const SignUp: React.FC = (): JSX.Element => {
  const navigation = useAppNavigation();

  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const renderStatusBar = () => {
    return (
      <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
      />
    );
  };

  const renderHeader = () => {
    return (
      <components.Header title='Sign up' goBack={navigation.canGoBack()} />
    );
  };

  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: theme.colors.pastel,
          marginHorizontal: 20,
          marginTop: 10,
          marginBottom: 10,
          paddingVertical: 44,
          justifyContent: 'center',
        }}
      >
        <components.Image
          source={require('./../../assets/images/02.png')}
          style={{
            width: '100%',
            aspectRatio: 0.72,
            position: 'absolute',
          }}
        />
        <View style={{paddingHorizontal: 20}}>
          <text.H1
            style={{
              textAlign: 'center',
              marginBottom: 14,
            }}
          >
            Sign up
          </text.H1>
          <text.T16
            style={{
              marginBottom: 31,
              textAlign: 'center',
              color: theme.colors.textColor,
              textTransform: 'none',
            }}
          >
            Use social networks or your email
          </text.T16>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 30,
              alignSelf: 'center',
            }}
          >
            <components.Facebook
              onPress={() => {
                console.log('Facebook');
              }}
              containerStyle={{
                marginHorizontal: 5,
              }}
            />
            <components.Twitter
              onPress={() => {
                console.log('Twitter');
              }}
              containerStyle={{
                marginHorizontal: 5,
              }}
            />
            <components.Google
              onPress={() => {
                console.log('Google');
              }}
              containerStyle={{
                marginHorizontal: 5,
              }}
            />
          </View>
          <components.InputField
            placeholder='Kristin Watson'
            onChangeText={(text) => setUserName(text)}
            value={username}
            containerStyle={{
              marginBottom: 10,
            }}
          />
          <components.InputField
            placeholder='Enter your email'
            onChangeText={(text) => setEmail(text)}
            value={email}
            containerStyle={{
              marginBottom: 10,
            }}
            secureTextEntry={true}
          />
          <components.InputField
            placeholder='Enter your password'
            onChangeText={(text) => setPassword(text)}
            value={password}
            eyeOffIcon={true}
            containerStyle={{
              marginBottom: 10,
            }}
            secureTextEntry={true}
          />
          <components.InputField
            placeholder='Confirm your password'
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword}
            eyeOffIcon={true}
            containerStyle={{
              marginBottom: 20,
            }}
            secureTextEntry={true}
          />
          <components.Button
            title='Sign up'
            onPress={() => {
              if (validation({email, password})) {
                navigation.navigate('VerifyYourPhoneNumber');
              }
            }}
            containerStyle={{
              marginBottom: 20,
            }}
          />
          <ParsedText
            style={{
              ...theme.fonts.Lato_400Regular,
              fontSize: 16,
              lineHeight: 16 * 1.7,
              color: theme.colors.textColor,
            }}
            parse={[
              {
                pattern: /Sign in./,
                style: {color: theme.colors.accentColor},
                onPress: () => navigation.navigate('SignIn'),
              },
            ]}
          >
            Already have an account? Sign in.
          </ParsedText>
        </View>
      </KeyboardAwareScrollView>
    );
  };

  return (
    <components.SafeAreaView
      style={{
        backgroundColor: theme.colors.white,
      }}
    >
      {renderStatusBar()}
      {renderHeader()}
      {renderContent()}
    </components.SafeAreaView>
  );
};

export default SignUp;
