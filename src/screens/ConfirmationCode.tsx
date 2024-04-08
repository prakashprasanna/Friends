import {View, ScrollView, TextInput, Alert} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import ParsedText from 'react-native-parsed-text';

import {text} from '../text';
import {theme} from '../constants';
import {components} from '../components';
import {useAppNavigation} from '../hooks';

const ConfirmationCode: React.FC = (): JSX.Element => {
  const navigation = useAppNavigation();

  const inp1Ref = useRef<TextInput>({focus: () => {}} as TextInput);
  const inp2Ref = useRef<TextInput>({focus: () => {}} as TextInput);
  const inp3Ref = useRef<TextInput>({focus: () => {}} as TextInput);
  const inp4Ref = useRef<TextInput>({focus: () => {}} as TextInput);
  const inp5Ref = useRef<TextInput>({focus: () => {}} as TextInput);

  const [inp1, setInp1] = useState<string>('');
  const [inp2, setInp2] = useState<string>('');
  const [inp3, setInp3] = useState<string>('');
  const [inp4, setInp4] = useState<string>('');
  const [inp5, setInp5] = useState<string>('');

  const code = inp1 + inp2 + inp3 + inp4 + inp5;

  useEffect(() => {
    if (code.length === 5) {
      navigation.navigate('SignUpAccountCreated');
    }
  }, [code]);

  const renderHeader = () => {
    return (
      <components.Header
        title='Verify your phone number'
        goBack={navigation.canGoBack()}
      />
    );
  };

  const renderContent = () => {
    const inputWidth = '16%';

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
            Enter your OTP code here.
          </text.T16>
          <View
            style={{
              marginBottom: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* INPUT_01 */}
            <View
              style={{
                width: inputWidth,
                height: 50,
                backgroundColor: theme.colors.white,
                borderWidth: 1,
                borderColor: theme.colors.mainColor,
              }}
            >
              <TextInput
                ref={inp1Ref}
                maxLength={1}
                style={{
                  textAlign: 'center',
                  color: theme.colors.mainColor,
                  flex: 1,
                  fontSize: 24,
                  ...theme.fonts.Lato_400Regular,
                }}
                keyboardType='number-pad'
                onChangeText={(text) => {
                  setInp1(text);
                  if (text !== '') {
                    inp2Ref.current.focus();
                  } else if (text === '') {
                    inp1Ref.current.focus();
                  }
                }}
              />
            </View>
            {/* INPUT_02 */}
            <View
              style={{
                width: inputWidth,
                height: 50,
                backgroundColor: theme.colors.white,
                borderWidth: 1,
                borderColor: theme.colors.mainColor,
              }}
            >
              <TextInput
                ref={inp2Ref}
                maxLength={1}
                style={{
                  textAlign: 'center',
                  color: theme.colors.mainColor,
                  flex: 1,
                  fontSize: 24,
                  ...theme.fonts.Lato_400Regular,
                }}
                keyboardType='number-pad'
                onChangeText={(text) => {
                  setInp2(text);
                  if (text !== '') {
                    inp3Ref.current.focus();
                  } else if (text === '') {
                    inp1Ref.current.focus();
                  }
                }}
              />
            </View>
            {/* INPUT_03 */}
            <View
              style={{
                width: inputWidth,
                height: 50,
                backgroundColor: theme.colors.white,
                borderWidth: 1,
                borderColor: theme.colors.mainColor,
              }}
            >
              <TextInput
                ref={inp3Ref}
                maxLength={1}
                style={{
                  textAlign: 'center',
                  color: theme.colors.mainColor,
                  flex: 1,
                  fontSize: 24,
                  ...theme.fonts.Lato_400Regular,
                }}
                keyboardType='number-pad'
                onChangeText={(text) => {
                  setInp3(text);
                  if (text !== '') {
                    inp4Ref.current.focus();
                  } else if (text === '') {
                    inp2Ref.current.focus();
                  }
                }}
              />
            </View>
            {/* INPUT_04 */}
            <View
              style={{
                width: inputWidth,
                height: 50,
                backgroundColor: theme.colors.white,
                borderWidth: 1,
                borderColor: theme.colors.mainColor,
              }}
            >
              <TextInput
                ref={inp4Ref}
                maxLength={1}
                style={{
                  textAlign: 'center',
                  color: theme.colors.mainColor,
                  flex: 1,
                  fontSize: 24,
                  ...theme.fonts.Lato_400Regular,
                }}
                keyboardType='number-pad'
                onChangeText={(text) => {
                  setInp4(text);
                  if (text === '') {
                    inp3Ref.current.focus();
                  } else if (text !== '') {
                    inp5Ref.current.focus();
                  }
                }}
              />
            </View>
            {/* INPUT_05 */}
            <View
              style={{
                width: inputWidth,
                height: 50,
                backgroundColor: theme.colors.white,
                borderWidth: 1,
                borderColor: theme.colors.mainColor,
              }}
            >
              <TextInput
                ref={inp5Ref}
                maxLength={1}
                style={{
                  textAlign: 'center',
                  color: theme.colors.mainColor,
                  flex: 1,
                  fontSize: 24,
                  ...theme.fonts.Lato_400Regular,
                }}
                keyboardType='number-pad'
                onChangeText={(text) => {
                  setInp5(text);
                  if (text === '') {
                    inp4Ref.current.focus();
                  }
                }}
              />
            </View>
          </View>
          <ParsedText
            style={{
              ...theme.fonts.T16,
              color: theme.colors.textColor,
              marginBottom: 30,
            }}
            parse={[
              {
                pattern: /Resend./,
                style: {color: theme.colors.accentColor},
                onPress: () => console.log('Pressed Resend'),
              },
            ]}
          >
            Did not receive the OTP? Resend.
          </ParsedText>
          <components.Button
            title='verify'
            onPress={() => {
              if (code.length < 5) {
                return Alert.alert(
                  'Error',
                  'Please enter a valid code.',
                  [
                    {
                      text: 'OK',
                    },
                  ],
                  {cancelable: false},
                );
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

export default ConfirmationCode;
