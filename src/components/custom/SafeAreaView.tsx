import React from 'react';
import {SafeAreaView as SafeAreaViewRN} from 'react-native-safe-area-context';

import {theme} from '../../constants';

type Props = {
  children: React.ReactNode;
  edges?: ['top'] | ['top', 'bottom'] | ['bottom'] | ['left', 'right'];
  style?: object;
};

const SafeAreaView: React.FC<Props> = ({
  children,
  edges,
  style,
}): JSX.Element => {
  return (
    <SafeAreaViewRN
      style={{flex: 1, backgroundColor: theme.colors.pastel, ...style}}
      edges={edges}
    >
      {children}
    </SafeAreaViewRN>
  );
};

export default SafeAreaView;
