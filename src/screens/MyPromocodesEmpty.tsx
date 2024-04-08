import {View, Text, ScrollView} from 'react-native';
import React from 'react';

import {text} from '../text';
import {theme} from '../constants';
import {components} from '../components';
import {useAppNavigation} from '../hooks';

const MyPromocodesEmpty: React.FC = (): JSX.Element => {
  const navigation = useAppNavigation();

  const renderHeader = () => {
    return (
      <components.Header
        backgroundColor={theme.colors.pastel}
        title='Add a promocode'
        goBack={navigation.canGoBack()}
      />
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}
      >
        <components.Image
          source={{
            uri: 'https://george-fx.github.io/beloni/products-02/15.jpg',
          }}
          style={{
            width: '100%',
            alignSelf: 'center',
            aspectRatio: 1.05,
            marginBottom: 30,
          }}
        />
        <text.H2
          style={{
            textAlign: 'center',
            marginBottom: 14,
          }}
        >
          Your don’t have{'\n'}promocodes yet!
        </text.H2>
        <text.T16
          style={{
            color: theme.colors.textColor,
            textAlign: 'center',
            marginBottom: 30,
          }}
        >
          Qui ex aute ipsum duis. Incididunt{'\n'}adipisicing voluptate laborum
        </text.T16>
        <components.InputField
          placeholder='Discount2022'
          containerStyle={{
            marginBottom: 20,
          }}
        />
        <components.Button
          title='Add a  promocode'
          onPress={() => {
            navigation.navigate('MyPromocodes');
          }}
        />
      </ScrollView>
    );
  };

  return (
    <components.SafeAreaView>
      {renderHeader()}
      {renderContent()}
    </components.SafeAreaView>
  );
};

export default MyPromocodesEmpty;
