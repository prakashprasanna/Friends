import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {responsiveHeight} from 'react-native-responsive-dimensions';

import {text} from '../../text';
import {theme} from '../../constants';
import {useAppSelector} from '../../hooks';
import {components} from '../../components';
import {useAppNavigation} from '../../hooks';

const Order = () => {
  const navigation = useAppNavigation();
  const {list} = useAppSelector((state) => state.cartSlice);
  const subtotal = useAppSelector((state) => state.cartSlice.total);

  const renderHeader = () => {
    return (
      <components.Header
        goBack={navigation.canGoBack()}
        title='Order'
        basket={true}
        backgroundColor={theme.colors.pastel}
      />
    );
  };

  const renderProducts = () => {
    return (
      <View>
        {list.map((item, index, array) => {
          const lastItem = index === array.length - 1;
          return (
            <components.OrderItem
              key={item.id}
              item={item}
              lastItem={lastItem}
            />
          );
        })}
      </View>
    );
  };

  const renderEnterPromoCode = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 14,
          marginBottom: responsiveHeight(10),
        }}
      >
        <View
          style={{
            height: 60,
            width: '66%',
            borderWidth: 1,
            borderColor: theme.colors.pastel,
            paddingHorizontal: 20,
            justifyContent: 'center',
            marginRight: 10,
          }}
        >
          <TextInput placeholder='Enter promocode' style={{flex: 1}} />
        </View>
        <TouchableOpacity
          style={{
            width: '32%',
            height: 60,
            backgroundColor: theme.colors.pastel,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              ...theme.fonts.Lato_400Regular,
              textTransform: 'uppercase',
              color: theme.colors.mainColor,
            }}
          >
            apply
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTotal = () => {
    return (
      <components.Container
        containerStyle={{
          marginBottom: 10,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 9,
          }}
        >
          <text.T14>Subtotal</text.T14>
          <text.T14>${subtotal}</text.T14>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 9,
          }}
        >
          <text.T14
            style={{
              color: theme.colors.textColor,
            }}
          >
            Delivery
          </text.T14>
          <text.T14
            style={{
              color: '#00824B',
            }}
          >
            Free
          </text.T14>
        </View>
        <components.Line
          containerStyle={{
            marginBottom: 9,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text>Total</Text>
          <Text>${subtotal}</Text>
        </View>
      </components.Container>
    );
  };

  const renderButton = () => {
    return (
      <components.Button
        title='proceed to checkout'
        onPress={() => {
          navigation.navigate('OrderSuccessful');
        }}
      />
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
      >
        {renderProducts()}
        {renderEnterPromoCode()}
        {renderTotal()}
        {renderButton()}
      </ScrollView>
    );
  };

  const renderCartIsEmpty = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: theme.colors.pastel,
          justifyContent: 'center',
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}
      >
        <components.Image
          source={{
            uri: 'https://george-fx.github.io/beloni/products-02/11.jpg',
          }}
          style={{
            width: '100%',
            aspectRatio: 1.09,
            marginBottom: 30,
          }}
        />
        <text.H2 style={{textAlign: 'center', marginBottom: 14}}>
          Your cart is empty!
        </text.H2>
        <text.T16
          style={{
            textAlign: 'center',
            marginBottom: 30,
            color: theme.colors.textColor,
          }}
        >
          Looks like you haven't made{'\n'}
          your order yet.
        </text.T16>
        <components.Button
          title='shop now'
          onPress={() => {
            navigation.navigate('Shop');
          }}
        />
      </ScrollView>
    );
  };

  return (
    <components.SmartView
      containerStyle={{
        backgroundColor:
          list.length > 0 ? theme.colors.white : theme.colors.pastel,
      }}
    >
      {renderHeader()}
      {list.length > 0 ? renderContent() : renderCartIsEmpty()}
    </components.SmartView>
  );
};

export default Order;
