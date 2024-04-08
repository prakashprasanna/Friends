import React from 'react';
import {TouchableOpacity} from 'react-native';

type Props = {
  item: string;
  selectedColor: string;
  lastElement?: boolean;
  setSelectedColor: (color: string) => void;
  containerStyle?: object;
};

const ProductColor: React.FC<Props> = ({
  selectedColor,
  setSelectedColor,
  item,
  containerStyle,
}): JSX.Element => {
  const backgroundColor = () => {
    switch (item) {
      case 'camel':
        return '#F8E7CD';
      case 'sandyBrown':
        return '#FFA462';
      case 'brinkPink':
        return '#FFA08A';
      case 'cadetBlue':
        return '#67A0A4';
      case 'dimGray':
        return '#6B6D7B';
      case 'squidInk':
        return '#142535';
    }
  };

  return (
    <TouchableOpacity
      style={{
        width: 30,
        height: 30,
        backgroundColor: backgroundColor(),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: selectedColor === item ? '#D05278' : backgroundColor(),
        ...containerStyle,
      }}
      onPress={() => setSelectedColor(item)}
    />
  );
};

export default ProductColor;
