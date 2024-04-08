import React, {memo} from 'react';
import {View} from 'react-native';

import {theme} from '../../constants';
import {quantityInCart} from '../../utils';
import type {ProductType} from '../../types';
import {useAppNavigation} from '../../hooks';
import {TouchableOpacity} from 'react-native';
import ProductName from '../product/ProductName';
import ProductPrice from '../product/ProductPrice';
import ProductRating from '../product/ProductRating';
import ProductInCart from '../product/ProductInCart';
import ImageBackground from '../custom/ImageBackground';
import ProductInWishlist from '../product/ProductInWishlist';
import {responsiveWidth} from 'react-native-responsive-dimensions';

type Props = {item: ProductType};

const ShopItem: React.FC<Props> = ({item}): JSX.Element => {
  const navigation = useAppNavigation();
  const quantity = quantityInCart(item);
  const blockWidth = responsiveWidth(50) - 20 - 7.5;

  return (
    <TouchableOpacity
      style={{
        width: blockWidth,
        height: 'auto',
        marginBottom: 20,
        borderRadius: 5,
      }}
      onPress={() => {
        navigation.navigate('Product', {
          item,
        });
      }}
    >
      <ImageBackground
        source={{uri: item.image}}
        style={{
          width: '100%',
          height: 200,
          padding: 10,
          marginBottom: 14,
          alignItems: 'flex-end',
        }}
        imageStyle={{
          backgroundColor: theme.colors.pastel,
        }}
        resizeMode='cover'
      >
        <ProductRating
          item={item}
          version={1}
          containerStyle={{
            marginRight: 'auto',
          }}
        />
        <View
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            alignItems: 'center',
            padding: 12,
          }}
        >
          <ProductInWishlist
            item={item}
            containerStyle={{
              marginBottom: 16,
            }}
            version={1}
          />
          <ProductInCart item={item} version={1} />
        </View>
      </ImageBackground>
      <ProductName item={item} style={{marginBottom: 3}} version={1} />
      <ProductPrice version={1} item={item} />
    </TouchableOpacity>
  );
};

export default memo(ShopItem);
