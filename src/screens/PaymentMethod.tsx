import React from 'react';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {View, ScrollView, TouchableOpacity} from 'react-native';

import {text} from '../text';
import {svg} from '../assets/svg';
import {components} from '../components';
import {useAppNavigation} from '../hooks';
import {theme, cards} from '../constants';

const PaymentMethod: React.FC = (): JSX.Element => {
  const navigation = useAppNavigation();

  const renderStatusBar = () => {
    return <components.StatusBar backgroundColor={theme.colors.pastel} />;
  };

  const renderHeader = () => {
    return (
      <components.Header
        title='Payment method'
        backgroundColor={theme.colors.pastel}
        goBack={navigation.canGoBack()}
      />
    );
  };

  const renderCards = () => {
    return (
      <ScrollView
        horizontal={true}
        contentContainerStyle={{
          paddingLeft: 20,
        }}
        showsHorizontalScrollIndicator={false}
        decelerationRate={0}
        style={{
          marginBottom: 30,
        }}
      >
        {cards.map((item, index, array) => {
          const lastElement = index === array.length - 1;
          return (
            <components.Image
              key={index}
              style={{
                width: 279,
                height: 180,
                marginRight: lastElement ? 0 : 14,
              }}
              source={{
                uri: item.image,
              }}
            />
          );
        })}
      </ScrollView>
    );
  };

  const renderPaymentMethods = () => {
    return (
      <View style={{paddingHorizontal: 20}}>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: '#EEEEEE',
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <text.H5
            style={{
              marginRight: 8,
            }}
          >
            Apple Pay
          </text.H5>
          <View
            style={{
              marginRight: 'auto',
            }}
          >
            <svg.PaymentCheckSvg />
          </View>
          <svg.PaymentEditSvg />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: '#EEEEEE',
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <text.H5
            style={{
              marginRight: 8,
            }}
          >
            Pay Pal
          </text.H5>
          <View
            style={{
              marginRight: 'auto',
            }}
          >
            <svg.PaymentCheckSvg />
          </View>
          <svg.PaymentEditSvg />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: '#EEEEEE',
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <text.H5
            style={{
              marginRight: 'auto',
            }}
          >
            Payoneer
          </text.H5>
          <svg.PaymentPlusSvg />
        </TouchableOpacity>
      </View>
    );
  };

  const renderButton = () => {
    return (
      <TouchableOpacity
        style={{
          marginTop: responsiveHeight(12),
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('AddANewCard')}
      >
        <svg.AddButtonSvg />
        <text.T14
          style={{
            textAlign: 'center',
            marginTop: 10,
            color: theme.colors.textColor,
            textTransform: 'none',
          }}
        >
          Add a new card
        </text.T14>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 20,
        }}
      >
        <components.BlockHeading
          title='Cards'
          containerStyle={{
            marginHorizontal: 20,
            marginBottom: 18,
          }}
        />
        {renderCards()}
        {renderPaymentMethods()}
        {renderButton()}
      </ScrollView>
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

export default PaymentMethod;
