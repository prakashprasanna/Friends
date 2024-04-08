import {View, TextInput} from 'react-native';
import React from 'react';
import type {PropsWithChildren} from 'react';

type Props = PropsWithChildren<{
  containerStyle?: object;
}>;

import {text} from '../../text';
import {theme} from '../../constants';

const inputFieldBig: React.FC<Props> = ({containerStyle}): JSX.Element => {
  return (
    <View
      style={{
        height: 130,
        backgroundColor: theme.colors.white,
        ...containerStyle,
        paddingHorizontal: 20,
        paddingVertical: 16,
      }}
    >
      <TextInput
        style={{flex: 1, ...theme.fonts.T14, verticalAlign: 'top'}}
        multiline={true}
        placeholder='Enter your comment'
      />
    </View>
  );
};

export default inputFieldBig;
