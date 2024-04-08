import {Text} from 'react-native';
import React from 'react';

import {theme} from '../constants';

type Props = {
  children: React.ReactNode;
  style?: object;
  numberOfLines?: number;
};

const H1: React.FC<Props> = ({children, style, numberOfLines}): JSX.Element => {
  return (
    <Text
      style={{
        ...theme.fonts.H1,
        color: theme.colors.mainColor,
        textTransform: 'capitalize',
        ...style,
      }}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

export default H1;
