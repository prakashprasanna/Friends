import React, {useState} from 'react';
import ParsedText from 'react-native-parsed-text';
import {View, TouchableOpacity, StatusBar, Alert} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {text} from '../../text';
import {theme} from '../../constants';
import {
  setRefreshToken,
  setAccessToken,
  setIsFirstTime,
} from '../../store/slices/appStateSlice';
import {components} from '../../components';
import {validation} from '../../utils/validation';
import {useAppNavigation, useAppDispatch} from '../../hooks';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from 'react-native-google-signin';
import LinearGradient from 'react-native-linear-gradient';
import VoiceNote from '../../components/voice/voice';
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

const SignIn: React.FC = (): JSX.Element => {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();
  const [fbUserInfo, setfbUserInfo] = useState({});
  const [fbInfoFromToken, setfbInfoFromToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [userIn, setUserInfo] = useState(null);
  const [signinInProgress, setSigninInProgress] = useState(false);

  const getInfoFromToken = (token: any) => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'id, name,  first_name, last_name',
      },
    };
    const profileRequest = new GraphRequest(
      '/me',
      {token, parameters: PROFILE_REQUEST_PARAMS},
      (error: any, result: any) => {
        if (error) {
          console.log('FBlogin info has error: ' + error);
        } else {
          setfbUserInfo(result);
          console.log('FB result:', result);
          console.log(result);
          setUserInfo(result);
        }
      },
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };

  GoogleSignin.configure({
    webClientId:
      '487165026561-bpd96f0d9c9m0b76acdh65pr0ltuvnnc.apps.googleusercontent.com',
    offlineAccess: true,
    hostedDomain: '',
    forceConsentPrompt: true,
  });

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
      <components.Header
        title={!userIn ? 'Sign in' : 'Sign in successful'}
        goBack={navigation.canGoBack()}
      />
    );
  };

  const signInViaGoogle = async () => {
    setSigninInProgress(true);

    try {
      await GoogleSignin.hasPlayServices({
        // Check if device has Google Play Services installed
        // Always resolves to true on iOS
        showPlayServicesUpdateDialog: true,
      });
      const userinfo: any = await GoogleSignin.signIn();
      console.log(userinfo);
      setUserInfo(userinfo);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play Services Not Avaislable or Outdated');
      } else {
        Alert.alert(error.message);
      }
    }
  };

  const logoutFromGoogle = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      // Removing user Info
      setUserInfo(null);
    } catch (error) {
      console.error(error);
    }
  };

  const renderGo = () => {
    return (
      <View style={{flexGrow: 1}}>
        <LinearGradient
          colors={['#000000', '#000000', '#000000']}
          style={{
            flexGrow: 1,
            //marginHorizontal: 20,
            //marginTop: 10,
            //marginBottom: 20,
            // paddingVertical: 44,
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
            }}
          >
            <components.Button
              title='Chat'
              onPress={() => {
                if (validation({email, password})) {
                  dispatch(setRefreshToken('refreshToken'));
                  dispatch(setAccessToken('accessToken'));
                }
              }}
              containerStyle={{
                marginBottom: 20,
              }}
              buttonStyle={{
                height: 160,
                width: 200,
                borderWidth: 4,
                borderColor: '#EDC967',
                borderRadius: 18,
              }}
              iconFamily='FontAwesome'
              icon='true'
              iconColor='#EDC967'
              iconName='comments'
            />
            <View style={{width: 20}} />
            <components.Button
              title='Gossip'
              onPress={() => {
                if (validation({email, password})) {
                  dispatch(setRefreshToken('refreshToken'));
                  dispatch(setAccessToken('accessToken'));
                }
              }}
              containerStyle={{
                marginBottom: 20,
              }}
              buttonStyle={{
                height: 160,
                width: 200,
                borderWidth: 4,
                borderColor: '#EDC967',
                borderRadius: 18,
              }}
              iconFamily='FontAwesome'
              icon='true'
              iconColor='#EDC967'
              iconName='group'
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
            }}
          >
            <components.Button
              title='Shopping'
              onPress={() => {
                if (validation({email, password})) {
                  dispatch(setRefreshToken('refreshToken'));
                  dispatch(setAccessToken('accessToken'));
                }
              }}
              containerStyle={{
                marginBottom: 20,
              }}
              buttonStyle={{
                height: 160,
                width: 200,
                borderWidth: 4,
                borderColor: '#EDC967',
                borderRadius: 18,
              }}
              iconFamily='FontAwesome'
              icon='true'
              iconColor='#EDC967'
              iconName='shopping-cart'
            />
            <View style={{width: 20}} />
            <components.Button
              title='Showoff'
              onPress={() => {
                if (validation({email, password})) {
                  dispatch(setRefreshToken('refreshToken'));
                  dispatch(setAccessToken('accessToken'));
                }
              }}
              containerStyle={{
                marginBottom: 20,
              }}
              buttonStyle={{
                height: 160,
                width: 200,
                borderWidth: 4,
                borderColor: '#EDC967',
                borderRadius: 18,
              }}
              iconFamily='FontAwesome'
              icon='true'
              iconColor='#EDC967'
              iconName='camera'
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
            }}
          >
            <components.Button
              title='Dating'
              onPress={() => {
                if (validation({email, password})) {
                  dispatch(setRefreshToken('refreshToken'));
                  dispatch(setAccessToken('accessToken'));
                }
              }}
              containerStyle={{
                marginBottom: 20,
              }}
              buttonStyle={{
                height: 160,
                width: 200,
                borderWidth: 4,
                borderColor: '#EDC967',
                borderRadius: 18,
              }}
              iconFamily='FontAwesome'
              icon='true'
              iconColor='#EDC967'
              iconName='heart'
            />
            <View style={{width: 20}} />
            <components.Button
              title='food'
              onPress={() => {
                if (validation({email, password})) {
                  dispatch(setRefreshToken('refreshToken'));
                  dispatch(setAccessToken('accessToken'));
                }
              }}
              containerStyle={{
                marginBottom: 20,
              }}
              buttonStyle={{
                height: 160,
                width: 200,
                borderWidth: 4,
                borderColor: '#EDC967',
                borderRadius: 18,
              }}
              iconFamily='FontAwesome'
              icon='true'
              iconColor='#EDC967'
              iconName='glass'
            />
          </View>
          {/* <VoiceNote /> */}
        </LinearGradient>
      </View>
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
          marginBottom: 20,
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
            Welcome Back!
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
          {/* <View
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
            */}
          <View
            style={{
              flexDirection: 'row',
              padding: 10,
            }}
          >
            <GoogleSigninButton
              style={{
                width: 180,
                height: 60,
                backgroundColor: '#4688f1',
                paddingRight: 5,
              }}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={() => {
                signInViaGoogle();
              }}
              disabled={signinInProgress}
            />
            <View style={{backgroundColor: '#ffffff', width: 3}} />
            <View>
              <LoginButton
                style={{width: 160, height: 60}}
                onLoginFinished={(error: any, result: any) => {
                  if (error) {
                    console.log('login has error: ' + result.error);
                  } else if (result.isCancelled) {
                    console.log('login is cancelled.');
                  } else {
                    AccessToken.getCurrentAccessToken().then((data: any) => {
                      const accessToken = data.accessToken.toString();
                      setfbInfoFromToken(accessToken);
                    });
                  }
                }}
                onLogoutFinished={() => setfbUserInfo({})}
              />
            </View>
          </View>
          <components.InputField
            placeholder='kristinwatson@mail.com'
            onChangeText={(text) => setEmail(text)}
            value={email}
            checkIcon={true}
            containerStyle={{
              marginBottom: 10,
            }}
          />
          <components.InputField
            placeholder='••••••••'
            onChangeText={(text) => setPassword(text)}
            eyeOffIcon={true}
            value={password}
            containerStyle={{
              marginBottom: 20,
            }}
            secureTextEntry={true}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 19,
            }}
          >
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() =>
                setRememberMe((rememberMeState) => !rememberMeState)
              }
            >
              <View
                style={{
                  width: 18,
                  height: 18,
                  backgroundColor: theme.colors.white,
                  borderWidth: 1,
                  borderColor: theme.colors.pastel,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {rememberMe && (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: theme.colors.accentColor,
                    }}
                  />
                )}
              </View>
              <text.T16
                style={{
                  marginLeft: 10,
                  color: theme.colors.textColor,
                }}
              >
                Remember me
              </text.T16>
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginLeft: 'auto'}}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <text.T16 style={{color: theme.colors.accentColor}}>
                Forgot password?
              </text.T16>
            </TouchableOpacity>
          </View>
          <components.Button
            title='Sign in'
            onPress={() => {
              if (validation({email, password})) {
                dispatch(setRefreshToken('refreshToken'));
                dispatch(setAccessToken('accessToken'));
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
                pattern: /Register now/,
                style: {color: theme.colors.accentColor},
                onPress: () => navigation.navigate('SignUp'),
              },
            ]}
          >
            No account? Register now.
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
      {!userIn && renderContent()}
      {userIn && renderGo()}
    </components.SafeAreaView>
  );
};

export default SignIn;
