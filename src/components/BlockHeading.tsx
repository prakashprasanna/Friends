import {View, TouchableOpacity, Text} from 'react-native';
import React from 'react';

import {svg} from '../assets/svg';
import {text} from '../text';
import {theme} from '../constants';

type Props = {
  title: string;
  viewAllOnPress?: () => void;
  containerStyle?: object;
};

const BlockHeading: React.FC<Props> = ({
  title,
  viewAllOnPress,
  containerStyle,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        borderBottomWidth: 2,
        borderColor: theme.colors.mainColor,
        paddingBottom: 10,
        ...containerStyle,
      }}
    >
      <text.H3>{title}</text.H3>
      {viewAllOnPress && (
        <TouchableOpacity
          onPress={viewAllOnPress}
          style={{flexDirection: 'row', alignItems: 'center'}}
        >
          <Text
            style={{
              ...theme.fonts.Lato_400Regular,
              fontSize: 16,
              lineHeight: 16 * 1.5,
              color: theme.colors.accentColor,
            }}
          >
            View all
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default BlockHeading;
