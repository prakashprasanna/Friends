import {View, Text} from 'react-native';
import React from 'react';
import type {PropsWithChildren} from 'react';

import {theme} from '../constants';

type Props = PropsWithChildren<{
  containerStyle?: object;
}>;

const Line: React.FC<Props> = ({containerStyle}): JSX.Element => {
  return (
    <View
      style={{
        height: 1,
        width: '100%',
        backgroundColor: theme.colors.mainColor,
        ...containerStyle,
      }}
    />
  );
};

export default Line;
