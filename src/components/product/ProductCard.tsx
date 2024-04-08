import React, {memo} from 'react';
import {TouchableOpacity, View} from 'react-native';

import {theme} from '../../constants';
import {ProductType} from '../../types';
import ProductSale from './ProductSale';
import ProductName from './ProductName';
import ProductPrice from './ProductPrice';
import ProductRating from './ProductRating';
import ProductInCart from './ProductInCart';
import {useAppNavigation} from '../../hooks';
import ProductInWishlist from './ProductInWishlist';
import ImageBackground from '../custom/ImageBackground';

type Props = {item: ProductType; version: number; lastItem?: boolean};

const ProductCard: React.FC<Props> = ({
  version,
  item,
  lastItem,
}): JSX.Element | null => {
  const navigation = useAppNavigation();

  if (version === 1) {
    return (
      <TouchableOpacity
        style={{
          width: 138,
          height: 'auto',
          marginRight: lastItem ? 20 : 14,
        }}
        onPress={() => navigation.navigate('Product', {item})}
      >
        <ImageBackground
          source={{uri: item.image}}
          style={{
            marginBottom: 14,
            width: '100%',
            height: 170,
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
              padding: 7,
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
          <ProductSale
            item={item}
            containerStyle={{
              position: 'absolute',
              right: 0,
              top: 0,
            }}
          />
        </ImageBackground>
        <ProductName
          item={item}
          version={1}
          style={{
            marginBottom: 4,
          }}
        />
        <ProductPrice item={item} version={1} />
      </TouchableOpacity>
    );
  }

  if (version === 2) {
    return (
      <TouchableOpacity
        style={{
          width: '47.4%',
          height: 'auto',
          marginBottom: 20,
        }}
        onPress={() => navigation.navigate('Product', {item})}
      >
        <ImageBackground
          source={{uri: item.image}}
          style={{
            marginBottom: 14,
            width: '100%',
            height: 170,
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
              padding: 7,
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
          <ProductSale
            item={item}
            containerStyle={{
              position: 'absolute',
              right: 0,
              top: 0,
            }}
          />
        </ImageBackground>
        <ProductName item={item} version={1} />
        <ProductPrice item={item} version={1} />
      </TouchableOpacity>
    );
  }

  return null;
};

export default memo(ProductCard);
