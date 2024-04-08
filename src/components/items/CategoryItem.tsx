import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import type {PropsWithChildren} from 'react';

import {text} from '../../text';
import {theme} from '../../constants';
import {CategoryType} from '../../types';
import {components} from '..';
import {useAppNavigation} from '../../hooks';

type Props = PropsWithChildren<{
  item: CategoryType;
}>;

const CategoryItem: React.FC<Props> = ({item}): JSX.Element => {
  const navigation = useAppNavigation();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Shop', {
          title: item.title,
        })
      }
    >
      <components.ImageBackground
        source={{uri: item.image}}
        style={{
          width: responsiveWidth(43),
          height: 200,
          marginBottom: 15,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
        resizeMode='cover'
      >
        <View
          style={{
            backgroundColor: theme.colors.white,
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          <text.H5>{item.title}</text.H5>
        </View>
      </components.ImageBackground>
    </TouchableOpacity>
  );
};

export default CategoryItem;
