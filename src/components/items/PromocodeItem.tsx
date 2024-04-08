import React from 'react';
import type {PropsWithChildren} from 'react';
import {showMessage} from 'react-native-flash-message';
import {View, Text, TouchableOpacity} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

import {text} from '../../text';
import {svg} from '../../assets/svg';
import {theme} from '../../constants';
import {PromocodeType} from '../../types';

type Props = PropsWithChildren<{
  item: PromocodeType;
}>;

const PromocodeItem: React.FC<Props> = ({item}): JSX.Element => {
  const copyToClipboard = (code: string) => {
    Clipboard.setString(code);
  };

  return (
    <TouchableOpacity
      style={{
        width: '47.4%',
        height: 201,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        padding: 10,
      }}
      onPress={() => {
        copyToClipboard(item.code);
        showMessage({
          message: 'Success',
          description: `${item.code} copied to clipboard`,
          type: 'success',
          icon: 'success',
        });
      }}
    >
      <View style={{marginBottom: 14}}>
        <svg.TicketSvg />
      </View>

      <text.H5
        style={{
          marginBottom: 2,
        }}
        numberOfLines={1}
      >
        {item.name}
      </text.H5>
      <Text
        style={{
          ...theme.fonts.Lato_400Regular,
          fontSize: 16,
          marginBottom: 2,
          lineHeight: 16 * 1.7,
          color:
            item.discount === 50
              ? '#D05278'
              : item.discount === 15
              ? '#00824B'
              : '#EF962D',
        }}
        numberOfLines={1}
      >
        {item.discount}% off
      </Text>
      <Text
        style={{
          fontSize: 12,
          lineHeight: 12 * 1.5,
          color: theme.colors.textColor,
        }}
        numberOfLines={1}
      >
        {item.valid_till}
      </Text>
      <View
        style={{
          width: '100%',
          height: 33,
          backgroundColor: '#FAF9FF',
          marginTop: 'auto',
          paddingHorizontal: 10,
          borderWidth: 1,
          borderColor: '#EEEEEE',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            ...theme.fonts.Lato_700Bold,
            textTransform: 'uppercase',
            fontSize: 8,
            color: theme.colors.textColor,
          }}
        >
          {item.code}
        </Text>
        <svg.CopySvg />
      </View>
    </TouchableOpacity>
  );
};

export default PromocodeItem;
