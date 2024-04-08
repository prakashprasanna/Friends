import React from 'react';
import {Text, TouchableOpacity, TouchableOpacityProps} from 'react-native';

import {theme} from '../../constants';

type Props = {
  item: string;
  lastElement?: boolean;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  containerStyle?: object;
};

const ProductSize: React.FC<Props> = ({
  selectedSize,
  setSelectedSize,
  item,
  containerStyle,
}): JSX.Element => {
  const color =
    selectedSize === item ? theme.colors.white : theme.colors.mainColor;
  const backgroundColor =
    selectedSize === item ? theme.colors.accentColor : '#FAF9FF';
  const borderColor =
    selectedSize === item ? theme.colors.accentColor : '#EEEEEE';

  return (
    <TouchableOpacity
      style={{
        backgroundColor: backgroundColor,
        borderWidth: 1,
        borderColor: borderColor,
        width: 40,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        ...containerStyle,
      }}
      onPress={() => setSelectedSize(item)}
    >
      <Text
        style={{
          color: color,
          fontSize: 12,
          textTransform: 'uppercase',
          ...theme.fonts.Lato_700Bold,
        }}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );
};

export default ProductSize;
