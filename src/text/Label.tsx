import React from 'react';
import {Text} from 'react-native';

import {theme} from '../constants';

type Props = {
  children: React.ReactNode;
};

const Label: React.FC<Props> = ({children}): JSX.Element => {
  return (
    <Text
      style={{
        fontFamily: 'DMSans-Medium',
        textTransform: 'uppercase',
        fontSize: 12,
        lineHeight: 12 * 1.7,
        color: theme.colors.textColor,
      }}
    >
      {children}
    </Text>
  );
};

export default Label;
