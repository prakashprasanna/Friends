import {View, Text, StatusBar as StatusBarRN} from 'react-native';
import type {PropsWithChildren} from 'react';
import React from 'react';

import {statusBarHeight} from '../../utils';
import {theme} from '../../constants';

type Props = PropsWithChildren<{
  backgroundColor?: string;
  barStyle?: 'light-content' | 'dark-content';
}>;

const StatusBar: React.FC<Props> = ({
  backgroundColor,
  barStyle,
}): JSX.Element => {
  const height = statusBarHeight();

  return (
    <View
      style={{
        height: height,
        backgroundColor: backgroundColor ?? theme.colors.white,
      }}
    >
      <StatusBarRN
        backgroundColor={theme.colors.transparent}
        barStyle={barStyle ?? 'dark-content'}
        translucent={true}
      />
    </View>
  );
};

export default StatusBar;
