import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {PropsWithChildren} from 'react';

import {svg} from '../../assets/svg';
import {theme} from '../../constants';
import {ProductType} from '../../types';
import {quantityInCart} from '../../utils';
import {useAppDispatch} from '../../hooks';
import {components} from '..';
import ProductSale from '../product/ProductSale';
import ProductName from '../product/ProductName';
import ProductPrice from '../product/ProductPrice';
import {addToCart, removeFromCart} from '../../store/slices/cartSlice';

type Props = PropsWithChildren<{
  item: ProductType;
  lastItem?: boolean;
}>;

const OrderItem: React.FC<Props> = ({item, lastItem}): JSX.Element => {
  const dispatch = useAppDispatch();
  const quantity = quantityInCart(item);

  return (
    <View
      style={{
        height: 100,
        borderWidth: 1,
        marginBottom: lastItem ? 0 : 8,
        padding: 10,
        flexDirection: 'row',
        borderColor: '#EEEEEE',
      }}
    >
      <TouchableOpacity style={{marginRight: 10}}>
        <components.ImageBackground
          source={{uri: item.image}}
          style={{
            width: 80,
            height: '100%',
          }}
          resizeMode='contain'
          imageStyle={{
            backgroundColor: theme.colors.pastel,
          }}
        >
          <ProductSale item={item} />
        </components.ImageBackground>
      </TouchableOpacity>
      <View style={{marginRight: 'auto'}}>
        <ProductName
          item={item}
          version={1}
          style={{
            marginBottom: 7,
          }}
        />
        <ProductPrice item={item} version={1} />
      </View>
      <View
        style={{
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          onPress={() => {
            dispatch(addToCart(item));
          }}
        >
          <svg.PlusSvg />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 10,
            textAlign: 'center',
            color: theme.colors.textColor,
          }}
        >
          {quantity}
        </Text>
        <TouchableOpacity
          onPress={() => {
            dispatch(removeFromCart(item));
          }}
        >
          <svg.MinusSvg />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderItem;
