import React from 'react';
import type {PropsWithChildren} from 'react';
import {TouchableOpacity, Alert, Text} from 'react-native';

import {svg} from '../../assets/svg';
import {ProductType} from '../../types';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {addToWishlist} from '../../store/slices/wishlistSlice';
import {removeFromWishlist} from '../../store/slices/wishlistSlice';

type Props = PropsWithChildren<{
  item: ProductType;
  version: 1 | 2;
  containerStyle?: object;
}>;

import {theme} from '../../constants';

const ProductInWishlist: React.FC<Props> = ({
  item,
  version,
  containerStyle,
}): JSX.Element | null => {
  const dispatch = useAppDispatch();

  const wishlist = useAppSelector((state) => state.wishlistSlice.list);
  const itemExist = (item: ProductType) =>
    wishlist.find((i) => i.id === item.id);

  const fillColor = itemExist(item)
    ? theme.colors.accentColor
    : theme.colors.transparent;
  const strokeColor = itemExist(item)
    ? theme.colors.accentColor
    : theme.colors.textColor;

  const itemExistMessage = () => {
    return Alert.alert(
      'Product already in wishlist',
      'Are you sure you want to delete from wishlist ?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            dispatch(removeFromWishlist(item));
            console.log('OK Pressed');
          },
        },
      ],
    );
  };

  if (version === 1) {
    return (
      <TouchableOpacity
        style={{
          ...containerStyle,
        }}
        onPress={() => {
          if (itemExist(item)) {
            itemExistMessage();
          }
          if (!itemExist(item)) {
            dispatch(addToWishlist(item));
          }
        }}
      >
        <svg.HeartSvg fillColor={fillColor} strokeColor={strokeColor} />
      </TouchableOpacity>
    );
  }

  if (version === 2) {
    return (
      <TouchableOpacity
        style={{
          ...containerStyle,
        }}
        onPress={() => {
          if (itemExist(item)) {
            itemExistMessage();
          }
          if (!itemExist(item)) {
            dispatch(addToWishlist(item));
          }
        }}
      >
        <svg.LikeSvg fillColor={fillColor} strokeColor={strokeColor} />
      </TouchableOpacity>
    );
  }

  return null;
};

export default ProductInWishlist;
