import React from 'react';
import type {PropsWithChildren} from 'react';
import {TouchableOpacity, Alert} from 'react-native';

import Basket from '../Basket';
import {svg} from '../../assets/svg';
import {ProductType} from '../../types';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {showMessage} from 'react-native-flash-message';
import {addToCart} from '../../store/slices/cartSlice';

type Props = PropsWithChildren<{
  item: ProductType;
  containerStyle?: object;
  version: number;
}>;

const ProductInCart: React.FC<Props> = ({
  item,
  version,
  containerStyle,
}): JSX.Element | null => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cartSlice.list);
  const exist = (item: ProductType) => cart.find((i) => i.id === item.id);

  if (version === 1) {
    return (
      <TouchableOpacity
        style={{...containerStyle}}
        onPress={() => {
          if (exist(item)) {
            Alert.alert(
              'Product already in cart',
              'The product already exists in the cart, please remove the product from the cart',
              [{text: 'Ok'}],
            );
          }
          if (!exist(item)) {
            dispatch(addToCart(item));
            showMessage({
              message: 'Success',
              description: `${item.name} added to cart`,
              type: 'success',
              icon: 'success',
            });
          }
        }}
      >
        <Basket version={2} />
      </TouchableOpacity>
    );
  }

  if (version === 2) {
    return (
      <TouchableOpacity
        style={{...containerStyle}}
        onPress={() => {
          if (exist(item)) {
            Alert.alert(
              'Product already in cart',
              'The product already exists in the cart, please remove the product from the cart',
              [{text: 'Ok'}],
            );
          }
          if (!exist(item)) {
            dispatch(addToCart(item));
            showMessage({
              message: 'Success',
              description: `${item.name} added to cart`,
              type: 'success',
              icon: 'success',
            });
          }
        }}
      >
        <svg.BasketBigSvg />
      </TouchableOpacity>
    );
  }

  return null;
};

export default ProductInCart;
