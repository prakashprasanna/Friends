import {View, Text, ViewProps, TouchableOpacity} from 'react-native';
import React from 'react';

import {svg} from '../../assets/svg';
import {theme} from '../../constants';
import {ProductType} from '../../types';
import {useAppDispatch} from '../../hooks';
// import {quantityInCart} from '../../utils';
import {removeFromCart, addToCart} from '../../store/slices/cartSlice';

type Props = {
  item: ProductType;
  version: 1 | 2;
  containerStyle?: object;
  numberOfLines?: number;
};

const ProductPrice: React.FC<Props> = ({
  item,
  containerStyle,
  version,
  numberOfLines = 1,
}): JSX.Element | null => {
  const dispatch = useAppDispatch();

  if (version === 1) {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          ...containerStyle,
        }}
      >
        {item.old_price && (
          <Text
            style={{
              marginRight: 4,
              textDecorationLine: 'line-through',
              // ...theme.fonts.DMSans_400Regular,
              fontSize: 12,
              color: '#999999',
              lineHeight: 12 * 1.5,
            }}
          >
            ${item.old_price.toFixed(2)}
          </Text>
        )}
        <Text
          style={{
            ...theme.fonts.Lato_700Bold,
            fontSize: 14,
            lineHeight: 14 * 1.5,
            color: item.old_price
              ? theme.colors.accentColor
              : theme.colors.textColor,
          }}
          numberOfLines={numberOfLines}
        >
          ${item.price.toFixed(2)}
        </Text>
      </View>
    );
  }

  if (version === 2) {
    return (
      <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
        {item.old_price && (
          <Text
            style={{
              ...theme.fonts.Lato_400Regular,
              marginRight: 10,
              fontSize: 14,
              lineHeight: 16 * 1.7,
              textDecorationLine: 'line-through',
              color: theme.colors.textColor,
            }}
          >
            ${item.old_price.toFixed(1)}
          </Text>
        )}
        <Text
          style={{
            ...theme.fonts.Lato_400Regular,
            fontSize: 20,
            lineHeight: 20 * 1.4,
          }}
        >
          ${item.price}
        </Text>
      </View>
    );
  }

  return null;
};

export default ProductPrice;
