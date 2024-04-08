import {ScrollView} from 'react-native';
import React from 'react';

import {text} from '../text';
import {theme} from '../constants';
import {components} from '../components';

const OrderSuccessful: React.FC = (): JSX.Element => {
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
            uri: 'https://george-fx.github.io/beloni/products-02/08.jpg',
          }}
          style={{
            width: '100%',
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
          Thank you for your order!
        </text.H2>
        <text.T16
          style={{
            textAlign: 'center',
            color: theme.colors.textColor,
            marginBottom: 30,
          }}
        >
          Your order will be delivered on time.{'\n'}Thank you!
        </text.T16>
        <components.Button
          title='View orders'
          onPress={() => {
            console.log('View orders');
          }}
          containerStyle={{
            marginBottom: 10,
          }}
        />
        <components.Button
          title='Continue Shopping'
          onPress={() => {
            console.log('View orders');
          }}
          buttonStyle={{
            backgroundColor: theme.colors.white,
            borderWidth: 1,
            borderColor: '#EEEEEE',
          }}
          titleStyle={{
            color: theme.colors.mainColor,
          }}
        />
      </ScrollView>
    );
  };

  return (
    <components.SafeAreaView
      style={{
        backgroundColor: theme.colors.pastel,
      }}
    >
      {renderContent()}
    </components.SafeAreaView>
  );
};

export default OrderSuccessful;
