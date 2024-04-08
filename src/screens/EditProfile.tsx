import React from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {svg} from '../assets/svg';
import {theme} from '../constants';
import {components} from '../components';
import {useAppNavigation} from '../hooks';

const EditProfile: React.FC = (): JSX.Element => {
  const navigation = useAppNavigation();

  const renderStatusBar = () => {
    return <components.StatusBar backgroundColor={theme.colors.white} />;
  };

  const renderHeader = () => {
    return (
      <components.Header title='Edit profile' goBack={navigation.canGoBack()} />
    );
  };

  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          marginTop: 10,
          marginBottom: 10,
          marginHorizontal: 20,
          justifyContent: 'center',
          backgroundColor: theme.colors.pastel,
        }}
      >
        <components.Image
          source={require('./../assets/images/02.png')}
          style={{
            width: '100%',
            aspectRatio: 0.72,
            position: 'absolute',
          }}
        />
        <TouchableOpacity
          style={{
            marginBottom: 34,
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
              borderRadius: 60,
              borderColor: theme.colors.accentColor,
            }}
            style={{
              height: 120,
              width: 120,
              alignSelf: 'center',
            }}
          >
            <View
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
              }}
            >
              <svg.CameraSvg />
            </View>
          </components.ImageBackground>
        </TouchableOpacity>
        <View
          style={{
            paddingHorizontal: 20,
          }}
        >
          <components.InputField
            placeholder='Kristin Watson'
            containerStyle={{
              marginBottom: 10,
            }}
          />
          <components.InputField
            placeholder='kristinwatson@mail.com'
            containerStyle={{
              marginBottom: 10,
            }}
          />
          <components.InputField
            placeholder='+17 123456789'
            containerStyle={{
              marginBottom: 10,
            }}
          />
          <components.InputField
            placeholder='Enter your address'
            containerStyle={{
              marginBottom: 19,
            }}
          />
          <components.Button
            title='save changes'
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  };

  return (
    <components.SafeAreaView
      style={{
        backgroundColor: theme.colors.white,
      }}
      edges={['bottom']}
    >
      {renderStatusBar()}
      {renderHeader()}
      {renderContent()}
    </components.SafeAreaView>
  );
};

export default EditProfile;
