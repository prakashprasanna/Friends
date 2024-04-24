import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, Text} from 'react-native';

import {theme} from '../../constants';
import {svg} from '../../assets/svg';

type Props = {
  containerStyle?: object;
  onChangeText?: (text: string) => void;
  value?: string;
  type?: string;
  check?: boolean;
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  eyeOffIcon?: boolean;
  checkIcon?: boolean;
  icon?: JSX.Element;
  testID?: string;
};

const InputField: React.FC<Props> = ({
  placeholder,
  containerStyle,
  secureTextEntry,
  keyboardType,
  checkIcon,
  eyeOffIcon = false,
  onChangeText,
  label,
  value,
  icon,
  testID,
}): JSX.Element | null => {
  return (
    <View
      style={{
        paddingLeft: 20,
        height: 60,
        width: '100%',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: theme.colors.pastel,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        borderWidth: 1,
        ...containerStyle,
      }}
    >
      <TextInput
        style={{
          flex: 1,
          height: '100%',
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          fontSize: 16,
          color: theme.colors.mainColor,
          ...theme.fonts.Lato_400Regular,
        }}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={'#A7AFB7'}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        value={value}
        testID={testID ? testID : undefined}
      />
      {checkIcon && (
        <View style={{paddingHorizontal: 20}}>
          <svg.InputCheckSvg />
        </View>
      )}
      {eyeOffIcon && (
        <TouchableOpacity style={{paddingHorizontal: 20}}>
          <svg.EyeOffSvg />
        </TouchableOpacity>
      )}
      {icon && (
        <TouchableOpacity
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {icon}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default InputField;
