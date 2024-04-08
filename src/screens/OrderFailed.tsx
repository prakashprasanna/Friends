import {ScrollView} from 'react-native';
import React from 'react';

import {text} from '../text';
import {theme} from '../constants';
import {components} from '../components';

const OrderFailed: React.FC = (): JSX.Element => {
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
            uri: 'https://george-fx.github.io/beloni/products-02/10.jpg',
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
          Sorry! Your order has{'\n'}failed!
        </text.H2>
        <text.T16
          style={{
            textAlign: 'center',
            color: theme.colors.textColor,
            marginBottom: 30,
          }}
        >
          Something went wrong. Please try again{'\n'}to contimue your order.
        </text.T16>
        <components.Button
          title='try again'
          onPress={() => {
            console.log('View orders');
          }}
          containerStyle={{
            marginBottom: 10,
          }}
        />
        <components.Button
          title='go to my profile'
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

export default OrderFailed;
