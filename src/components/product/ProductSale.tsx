import React from 'react';
import {View, Text} from 'react-native';
import type {PropsWithChildren} from 'react';

import {theme} from '../../constants';
import {ProductType} from '../../types';

type Props = PropsWithChildren<{
  item: ProductType;
  containerStyle?: object;
}>;

const ProductSale: React.FC<Props> = ({
  item,
  containerStyle,
}): JSX.Element | null => {
  if (item.is_sale) {
    return (
      <View
        style={{
          width: 39,
          height: 16,
          backgroundColor: '#A3D2A2',
          justifyContent: 'center',
          alignItems: 'center',
          ...containerStyle,
        }}
      >
        <Text
          style={{
            ...theme.fonts.Lato_700Bold,
            fontSize: 8,
            textTransform: 'uppercase',
            color: theme.colors.white,
            lineHeight: 8 * 1.7,
          }}
        >
          Sale
        </Text>
      </View>
    );
  }

  return null;
};

export default ProductSale;
