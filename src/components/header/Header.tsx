import {View, Text, TouchableOpacity, Alert} from 'react-native';
import {useRoute} from '@react-navigation/native';
import type {PropsWithChildren} from 'react';
import React from 'react';

type Props = PropsWithChildren<{
  skip?: boolean;
  logo?: boolean;
  title?: string;
  basket?: boolean;
  search?: boolean;
  goBack?: boolean;
  backgroundColor?: string;
  skipOnPress?: () => void;
}>;

import Logo from '../Logo';
import GoBack from './GoBack';
import {svg} from '../../assets/svg';
import {theme} from '../../constants';
import {setScreen} from '../../store/slices/tabSlice';
import {useAppNavigation, useAppSelector, useAppDispatch} from '../../hooks';

const Header: React.FC<Props> = ({
  skip,
  skipOnPress,
  title,
  goBack,
  logo,
  basket,
  search,
  backgroundColor,
}) => {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();
  const route = useRoute();

  const cart = useAppSelector((state) => state.cartSlice.list);
  const total = useAppSelector((state) => state.cartSlice.total).toFixed(2);

  const basketOnPress = () => {
    if (cart.length > 0) {
      dispatch(setScreen('Cart'));
      route.name === 'Shop' && navigation.navigate('TabNavigator');
      route.name === 'Product' && navigation.navigate('TabNavigator');
    }
    if (cart.length === 0) {
      Alert.alert('Your cart is empty', 'Please add some items to your cart', [
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed'),
        },
      ]);
    }
  };

  const renderLogo = () => {
    if (logo) {
      return (
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: 0,
            height: 42,
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {}}
        >
          <Logo version={1} />
        </TouchableOpacity>
      );
    }
  };

  const renderBasket = () => {
    if (basket) {
      return (
        <TouchableOpacity
          onPress={basketOnPress}
          style={{
            right: 0,
            position: 'absolute',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              height: 22,
              position: 'absolute',
              right: 35,
              borderRadius: 11,
              paddingHorizontal: 7,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.colors.accentColor,
              zIndex: 2,
            }}
          >
            <Text
              style={{
                color: theme.colors.white,
                ...theme.fonts.Lato_700Bold,
                fontSize: 10,
              }}
            >
              {cart.length > 0 ? `$${total}` : '$0'}
            </Text>
          </View>
          <svg.BasketSvg />
        </TouchableOpacity>
      );
    }
  };

  const renderGoBack = () => {
    if (goBack) {
      return (
        <View style={{position: 'absolute', left: 0}}>
          <GoBack onPress={() => navigation.goBack()} />
        </View>
      );
    }
  };

  const renderSkipText = () => {
    if (skip) {
      return (
        <TouchableOpacity
          style={{
            right: 0,
            position: 'absolute',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
          onPress={skipOnPress}
        >
          <Text>Skip</Text>
        </TouchableOpacity>
      );
    }
  };

  const renderTitle = () => {
    if (title) {
      return (
        <Text
          style={{
            ...theme.fonts.H4,
            color: theme.colors.mainColor,
          }}
          numberOfLines={1}
        >
          {title}
        </Text>
      );
    }
  };

  const renderSearch = () => {
    if (search) {
      return (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
          }}
        >
          <View style={{marginRight: 7}}>
            <svg.SearchSvg />
          </View>
          <Text
            style={{
              ...theme.fonts.Lato_400Regular,
              color: theme.colors.textColor,
              fontSize: 14,
            }}
          >
            Search
          </Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 42,
        borderBottomColor: '#DBE9F5',
        backgroundColor: backgroundColor || theme.colors.white,
      }}
    >
      {renderLogo()}
      {renderGoBack()}
      {renderSearch()}
      {renderTitle()}
      {renderSkipText()}
      {renderBasket()}
    </View>
  );
};

export default Header;
