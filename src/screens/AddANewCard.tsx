import React from 'react';
import {View, Text} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {components} from '../components';
import {useAppNavigation} from '../hooks';
import {theme} from '../constants';

const AddANewCard: React.FC = (): JSX.Element => {
  const navigation = useAppNavigation();

  const renderStatusBar = () => {
    return <components.StatusBar backgroundColor={theme.colors.white} />;
  };

  const renderHeader = () => {
    return (
      <components.Header
        title='Add a new card'
        goBack={navigation.canGoBack()}
      />
    );
  };

  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: theme.colors.pastel,
          marginHorizontal: 20,
          marginTop: 10,
          marginBottom: 10,
          justifyContent: 'center',
        }}
        enableOnAndroid={true}
      >
        <components.Image
          source={require('./../assets/images/02.png')}
          style={{
            width: '100%',
            aspectRatio: 0.72,
            position: 'absolute',
          }}
        />
        <View
          style={{
            paddingHorizontal: 20,
          }}
        >
          <components.Image
            source={{
              uri: 'https://george-fx.github.io/beloni/cards/03.png',
            }}
            style={{
              width: '100%',
              height: 180,
              marginBottom: 30,
            }}
          />
          <components.InputField
            placeholder='Kristin Watson'
            containerStyle={{
              marginBottom: 10,
            }}
          />
          <components.InputField
            placeholder='xxxx xxxx xxxx xxxx'
            containerStyle={{
              marginBottom: 10,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <components.InputField
              label='MM/yy'
              placeholder='12/23'
              containerStyle={{width: '47%'}}
              secureTextEntry={true}
            />
            <components.InputField
              label='cvv'
              placeholder='•••'
              containerStyle={{width: '47%'}}
              secureTextEntry={true}
            />
          </View>
          <components.Button
            title='save card'
            onPress={() => {
              navigation.navigate('PaymentMethod');
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  };

  return (
    <components.SafeAreaView
      edges={['bottom']}
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

export default AddANewCard;
