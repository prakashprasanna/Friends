import React, {useState, useRef} from 'react';
import Svg, {Path} from 'react-native-svg';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {text} from '../text';
import {theme} from '../constants';
import {useAppDispatch} from '../hooks';
import {quantityInCart} from '../utils';
import {components} from '../components';
import {useAppNavigation} from '../hooks';
import type {RootStackParamList} from '../types';
import {showMessage} from 'react-native-flash-message';
import ProductName from '../components/product/ProductName';
import ProductPrice from '../components/product/ProductPrice';
import ProductRating from '../components/product/ProductRating';
import {addToCart, removeFromCart} from '../store/slices/cartSlice';
import ProductInWishlist from '../components/product/ProductInWishlist';

type Props = NativeStackScreenProps<RootStackParamList, 'Product'>;

const Product: React.FC<Props> = ({route}): JSX.Element => {
  const {item} = route.params;
  const dispatch = useAppDispatch();
  const quantity = quantityInCart(item);
  const navigation = useAppNavigation();

  const ref = useRef<ScrollView>(null);

  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>('camel');

  const updateCurrentSlideIndex = (e: any): void => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / theme.sizes.width);
    setCurrentSlideIndex(currentIndex);
  };

  const PlusButton = () => (
    <Svg width={38} height={38} fill='none'>
      <Path
        stroke='#222'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.2}
        d='M18.955 14.917v8.166M14.898 19h8.114'
      />
    </Svg>
  );

  const MinusButton = () => (
    <Svg width={38} height={38} fill='none'>
      <Path
        stroke='#222'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.2}
        d='M14.898 19h8.114'
      />
    </Svg>
  );

  const renderHeader = () => {
    return <components.Header goBack={true} basket={true} />;
  };

  const renderCarousel = () => {
    const renderImages = () => {
      return (
        <ScrollView
          ref={ref}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={updateCurrentSlideIndex}
          style={{
            backgroundColor: theme.colors.pastel,
          }}
        >
          {item.images.map((image, index) => {
            return (
              <components.Image
                key={index}
                resizeMode='cover'
                source={{
                  uri: image,
                }}
                style={{
                  width: theme.sizes.width,
                  height: '100%',
                }}
              />
            );
          })}
        </ScrollView>
      );
    };

    const renderDots = () => {
      return (
        <View
          style={{
            height: 24,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 27,
            flexDirection: 'row',
            alignSelf: 'center',
          }}
        >
          {item.images.map((image, index, array) => {
            return (
              <View
                key={index}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 5 / 2,
                  backgroundColor: theme.colors.mainColor,
                  borderWidth: 1,
                  marginHorizontal: 4,
                  opacity: currentSlideIndex === index ? 1 : 0.2,
                }}
              />
            );
          })}
        </View>
      );
    };

    return (
      <View style={{height: 350, marginBottom: 20}}>
        {renderImages()}
        {renderDots()}
      </View>
    );
  };

  const renderNameAndLike = () => {
    return (
      <View
        style={{
          marginHorizontal: 20,
          marginBottom: 7,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <ProductName item={item} version={2} />
        <ProductInWishlist item={item} version={2} />
      </View>
    );
  };

  const renderInStock = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 20,
          marginBottom: 7,
        }}
      >
        <Text
          style={{
            ...theme.fonts.Lato_400Regular,
            fontSize: 12,
            lineHeight: 12 * 1.5,
            textTransform: 'uppercase',
            color: '#00824B',
            marginRight: 10,
          }}
        >
          in stock
        </Text>
        <ProductRating item={item} version={1} />
      </View>
    );
  };

  const renderPriceAndQuantity = () => {
    return (
      <View
        style={{
          marginHorizontal: 20,
          marginBottom: 25,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <ProductPrice item={item} version={2} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.pastel,
            borderWidth: 1,
            borderColor: '#EEEEEE',
            width: 110,
            justifyContent: 'space-between',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (quantity === 0) {
                return;
              }
              dispatch(removeFromCart(item));
            }}
          >
            <MinusButton />
          </TouchableOpacity>
          <Text
            style={{
              ...theme.fonts.Lato_400Regular,
              fontSize: 14,
              color: theme.colors.textColor,
            }}
          >
            {quantity}
          </Text>
          <TouchableOpacity onPress={() => dispatch(addToCart(item))}>
            <PlusButton />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderColor = () => {
    return (
      <View
        style={{
          marginHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          paddingBottom: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#EEEEEE',
          marginBottom: 25,
        }}
      >
        <text.H5 style={{marginRight: 14}}>Color</text.H5>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {item.colors.map((item, index, array) => {
            const lastElement = index === array.length - 1;
            const marginRight = lastElement ? 0 : 10;
            return (
              <components.ProductColor
                key={index}
                item={item}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                containerStyle={{marginRight: marginRight}}
              />
            );
          })}
        </View>
      </View>
    );
  };

  const renderSize = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 20,
          paddingBottom: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#EEEEEE',
          marginBottom: 25,
        }}
      >
        <text.H5
          style={{
            marginRight: 25,
          }}
        >
          Size
        </text.H5>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {item.sizes.map((item, index, array) => {
            const lastElement = index === array.length - 1;
            const marginRight = lastElement ? 0 : 10;
            return (
              <components.ProductSize
                key={index}
                item={item}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                containerStyle={{marginRight: marginRight}}
              />
            );
          })}
        </View>
      </View>
    );
  };

  const renderDescription = () => {
    return (
      <View
        style={{
          marginHorizontal: 20,
          marginBottom: 40,
        }}
      >
        <text.H5
          style={{
            marginBottom: 14,
          }}
        >
          Description
        </text.H5>
        <text.T16
          style={{
            color: theme.colors.textColor,
          }}
        >
          {item.description}
        </text.T16>
      </View>
    );
  };

  const renderButton = () => {
    return (
      <components.Button
        title='+ ADd to cart'
        onPress={() => {
          dispatch(
            addToCart({
              ...item,
              color: selectedColor,
              size: selectedSize,
            }),
          );
          showMessage({
            message: 'Success',
            description: `${item.name} added to cart`,
            type: 'success',
          });
        }}
        containerStyle={{
          marginHorizontal: 20,
          marginBottom: 40,
        }}
      />
    );
  };

  const renderReviews = () => {
    const reviews = item.reviews;
    const slice = item.reviews.slice(0, 3);
    const reviewsTitle = `Reviews (${item.reviews.length})`;
    return (
      <View style={{marginHorizontal: 20}}>
        <components.BlockHeading
          title={reviewsTitle}
          viewAllOnPress={() => {
            navigation.navigate('Reviews', {reviews});
          }}
          containerStyle={{
            marginBottom: 17,
          }}
        />
        {slice.map((item, index, array) => {
          const lastItem = index === array.length - 1;
          return (
            <components.ReviewItem
              item={item}
              key={item.id}
              lastItem={lastItem}
            />
          );
        })}
      </View>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}>
        {renderCarousel()}
        {renderNameAndLike()}
        {renderInStock()}
        {renderPriceAndQuantity()}
        {renderColor()}
        {renderSize()}
        {renderDescription()}
        {renderButton()}
        {renderReviews()}
      </ScrollView>
    );
  };

  return (
    <components.SafeAreaView
      style={{
        backgroundColor: theme.colors.white,
      }}
    >
      {renderHeader()}
      {renderContent()}
    </components.SafeAreaView>
  );
};

export default Product;
