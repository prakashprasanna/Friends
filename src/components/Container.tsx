import {View, Text} from 'react-native';
import React from 'react';
import type {PropsWithChildren} from 'react';

type Props = PropsWithChildren<{
  children: React.ReactNode;
  containerStyle?: object;
}>;

import {theme} from '../constants';

const Container: React.FC<Props> = ({
  children,
  containerStyle,
}): JSX.Element => {
  return (
    <View
      style={{
        backgroundColor: '#FAF9FF',
        padding: 20,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        ...containerStyle,
      }}
    >
      {children}
    </View>
  );
};

export default Container;
