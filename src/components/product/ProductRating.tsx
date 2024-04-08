import {View, Text, ViewStyle} from 'react-native';
import React from 'react';
import type {PropsWithChildren} from 'react';

import type {ProductType} from '../../types';
import {ReviewType} from '../../types/ReviewType';

type Props = PropsWithChildren<{
  item: ProductType | ReviewType;
  version: number;
  containerStyle?: ViewStyle;
}>;

import {svg} from '../../assets/svg';
import {theme} from '../../constants';

const ProductRating: React.FC<Props> = ({
  item,
  version,
  containerStyle,
}): JSX.Element | null => {
  if (version === 1) {
    return (
      <View
        style={{
          ...containerStyle,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <svg.StarSvg />
        <Text
          style={{
            ...theme.fonts.Lato_400Regular,
            fontSize: 12,
            lineHeight: 12 * 1.7,
            marginLeft: 4,
            color: theme.colors.textColor,
          }}
        >
          {item.rating.toFixed(1)}
        </Text>
      </View>
    );
  }

  return null;
};

export default ProductRating;
