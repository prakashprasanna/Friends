import {View, Text, ScrollView} from 'react-native';
import React from 'react';

import {text} from '../text';
import {svg} from '../assets/svg';
import {theme} from '../constants';
import {components} from '../components';
import {useAppNavigation} from '../hooks';

const SignUpAccountCreated: React.FC = (): JSX.Element => {
  const navigation = useAppNavigation();

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          justifyContent: 'center',
          flexGrow: 1,
          paddingVertical: 20,
        }}
      >
        <View
          style={{
            alignSelf: 'center',
            marginBottom: 20,
          }}
        >
          <svg.LogoSvg />
        </View>
        <components.Image
          source={{
            uri: 'https://george-fx.github.io/beloni/products-02/06.png',
          }}
          style={{
            width: theme.sizes.width - 100,
            aspectRatio: 1.04,
            marginBottom: 30,
            alignSelf: 'center',
          }}
        />
        <text.H2
          style={{
            textAlign: 'center',
            marginBottom: 14,
          }}
        >
          Account Created!
        </text.H2>
        <text.T16
          style={{
            textAlign: 'center',
            marginBottom: 30,
            color: theme.colors.textColor,
          }}
        >
          Your account had beed created{'\n'}successfully.
        </text.T16>

        <components.Button
          title='shop now'
          onPress={() => {
            navigation.navigate('SignIn');
          }}
        />
      </ScrollView>
    );
  };

  return <components.SafeAreaView>{renderContent()}</components.SafeAreaView>;
};

export default SignUpAccountCreated;
