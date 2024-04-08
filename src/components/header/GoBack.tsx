import {TouchableOpacity} from 'react-native';
import React from 'react';

import {svg} from '../../assets/svg';

type Props = {
  onPress: () => void;
};

const GoBack: React.FC<Props> = ({onPress}): JSX.Element => {
  return (
    <TouchableOpacity
      style={{
        paddingVertical: 12,
        paddingHorizontal: 20,
      }}
      onPress={onPress}
    >
      <svg.GoBackSvg />
    </TouchableOpacity>
  );
};

export default GoBack;
