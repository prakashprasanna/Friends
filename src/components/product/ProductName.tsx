import React from 'react';
import {Text, TextStyle, View} from 'react-native';

import {text} from '../../text';
import {svg} from '../../assets/svg';
import {theme} from '../../constants';
import {ProductType} from '../../types';

type Props = {item: ProductType; style?: TextStyle; version: 1 | 2};

const ProductName: React.FC<Props> = ({
  item,
  style,
  version,
}): JSX.Element | null => {
  if (version === 1) {
    return (
      <Text
        style={{
          marginRight: 'auto',
          color: theme.colors.mainColor,
          ...theme.fonts.H6,
          ...style,
        }}
        numberOfLines={1}
      >
        {item.name}
      </Text>
    );
  }

  if (version === 2) {
    return (
      <text.H3 style={{marginRight: 'auto'}} numberOfLines={1}>
        {item.name}
      </text.H3>
    );
  }

  return null;
};

export default ProductName;
