import React from 'react';
import {View, Text} from 'react-native';
import type {PropsWithChildren} from 'react';

import {text} from '../../text';
import Image from '../custom/Image';
import {ReviewType} from '../../types/ReviewType';
import ProductRating from '../product/ProductRating';
import {theme} from '../../constants';

type Props = PropsWithChildren<{
  item: ReviewType;
  lastItem?: boolean;
}>;

const ReviewItem: React.FC<Props> = ({item, lastItem}): JSX.Element => {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: '#EEEEEE',
        padding: 20,
        flexDirection: 'row',
        marginBottom: lastItem ? 0 : 8,
      }}
    >
      <Image
        source={{uri: item.image}}
        style={{width: 30, height: 30, marginRight: 14}}
        imageStyle={{borderRadius: 15}}
      />
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 6,
          }}
        >
          <text.H5>{item.name}</text.H5>
          <ProductRating item={item} version={1} />
        </View>
        <Text
          style={{
            marginBottom: 10,
            ...theme.fonts.Lato_400Regular,
            fontSize: 10,
            lineHeight: 10 * 1.5,
            color: '#999999',
          }}
        >
          {item.date}
        </Text>
        <text.T14
          style={{
            color: theme.colors.textColor,
          }}
        >
          {item.comment}
        </text.T14>
      </View>
    </View>
  );
};

export default ReviewItem;
