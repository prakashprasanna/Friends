import {View, ScrollView} from 'react-native';
import React from 'react';

import {text} from '../text';
import {svg} from '../assets/svg';
import {components} from '../components';
import {useAppNavigation} from '../hooks';
import {theme} from '../constants';

const ForgotPasswordSentEmail: React.FC = (): JSX.Element => {
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
            uri: 'https://george-fx.github.io/beloni/products-02/05.png',
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
          Your password has{'\n'}been reset!
        </text.H2>
        <text.T16
          style={{
            textAlign: 'center',
            marginBottom: 30,
            color: theme.colors.textColor,
          }}
        >
          Qui ex aute ipsum duis. Incididunt{'\n'}adipisicing voluptate laborum
        </text.T16>

        <components.Button
          title='done'
          onPress={() => {
            navigation.navigate('SignIn');
          }}
        />
      </ScrollView>
    );
  };

  return <components.SafeAreaView>{renderContent()}</components.SafeAreaView>;
};

export default ForgotPasswordSentEmail;
