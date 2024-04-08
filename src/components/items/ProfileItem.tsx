import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import type {PropsWithChildren} from 'react';

type Props = PropsWithChildren<{
  title: string;
  onPress: () => void;
  icon: JSX.Element;
  containerStyle?: object;
}>;

import {text} from '../../text';
import {svg} from '../../assets/svg';

const ProfileItem: React.FC<Props> = ({
  icon,
  title,
  onPress,
  containerStyle,
}): JSX.Element => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        ...containerStyle,
      }}
      onPress={onPress}
    >
      {icon}
      <text.H5 style={{marginLeft: 14, marginRight: 'auto'}}>{title}</text.H5>
      {title !== 'Sign out' && <svg.RightArrowSvg />}
    </TouchableOpacity>
  );
};

export default ProfileItem;
