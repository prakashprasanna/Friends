import React from 'react';
import type {PropsWithChildren} from 'react';
import {TouchableOpacity} from 'react-native';

import {svg} from '../../assets/svg';

type Props = PropsWithChildren<{
  onPress: () => void;
  containerStyle?: object;
}>;

const Twitter: React.FC<Props> = ({onPress, containerStyle}): JSX.Element => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        ...containerStyle,
      }}
    >
      <svg.TwitterSvg />
    </TouchableOpacity>
  );
};

export default Twitter;
