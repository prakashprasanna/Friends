import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import type {PropsWithChildren} from 'react';

import {ProductType} from '../../types';
import {components} from '..';
import {useAppNavigation} from '../../hooks';
import ProductSale from '../product/ProductSale';
import ProductName from '../product/ProductName';
import ProductPrice from '../product/ProductPrice';
import ProductRating from '../product/ProductRating';
import ProductInCart from '../product/ProductInCart';
import ProductInWishlist from '../product/ProductInWishlist';
import {theme} from '../../constants';

type Props = PropsWithChildren<{
  item: ProductType;
  lastItem?: boolean;
}>;

const WishlistItem: React.FC<Props> = ({item, lastItem}): JSX.Element => {
  const navigation = useAppNavigation();

  return (
    <View
      style={{
        width: '100%',
        height: 100,
        borderWidth: 1,
        padding: 10,
        borderColor: '#EEEEEE',
        flexDirection: 'row',
        marginBottom: lastItem ? 0 : 8,
      }}
    >
      <TouchableOpacity
        style={{
          marginRight: 14,
        }}
        onPress={() => navigation.navigate('Product', {item})}
      >
        <components.ImageBackground
          source={{uri: item.image}}
          style={{
            width: 80,
            height: '100%',
          }}
          resizeMode='cover'
        >
          <ProductSale
            item={item}
            containerStyle={{
              position: 'absolute',
              top: 0,
              right: 0,
            }}
          />
        </components.ImageBackground>
      </TouchableOpacity>
      <View style={{marginRight: 'auto'}}>
        <ProductName
          item={item}
          version={1}
          style={{
            marginBottom: 7,
          }}
        />
        <ProductPrice
          item={item}
          version={1}
          containerStyle={{
            marginBottom: 'auto',
          }}
        />
        <ProductRating item={item} version={1} />
      </View>
      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <ProductInWishlist
          item={item}
          containerStyle={{
            marginTop: 4,
          }}
          version={1}
        />
        <ProductInCart item={item} version={2} />
      </View>
    </View>
  );
};

export default WishlistItem;
