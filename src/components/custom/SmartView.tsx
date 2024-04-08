import {View} from 'react-native';
import React from 'react';
import type {PropsWithChildren} from 'react';

type Props = PropsWithChildren<{
  containerStyle?: object;
  children: React.ReactNode;
}>;

const SmartView: React.FC<Props> = ({
  children,
  containerStyle,
}): JSX.Element => {
  return <View style={{flex: 1, ...containerStyle}}>{children}</View>;
};

export default SmartView;
