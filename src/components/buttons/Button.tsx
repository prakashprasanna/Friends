import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import type {PropsWithChildren} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {theme} from '../../constants';

type Props = PropsWithChildren<{
  title: string;
  onPress: () => void;
  containerStyle?: object;
  buttonStyle?: object;
  titleStyle?: object;
  icon?: string;
  iconStyle?: object;
  iconFamily?: string;
  iconName?: string;
  iconColor?: string;
  testID?: string;
}>;

const Button: React.FC<Props> = ({
  containerStyle,
  title,
  onPress,
  buttonStyle,
  titleStyle,
  icon,
  iconStyle,
  iconColor,
  iconFamily,
  iconName,
  testID,
}) => {
  return (
    <View style={containerStyle}>
      <TouchableOpacity
        style={{
          width: '100%',
          height: 60,
          backgroundColor: theme.colors.mainColor,
          flexDirection: !icon ? 'row' : undefined,
          alignItems: 'center',
          justifyContent: 'center',
          ...buttonStyle,
        }}
        onPress={onPress}
        testID={testID ? testID : undefined}
      >
        {icon && (
          <>
            <Icon
              family={iconFamily}
              name={iconName}
              color={iconColor}
              size={40}
              style={{padding: 10, ...iconStyle}}
            />
          </>
        )}
        <Text
          style={{
            textTransform: 'uppercase',
            fontSize: 14,
            textAlign: 'center',
            color: theme.colors.white,
            ...theme.fonts.Lato_400Regular,
            ...titleStyle,
          }}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Button;
