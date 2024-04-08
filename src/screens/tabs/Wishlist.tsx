import {View, Text, ScrollView} from 'react-native';
import React from 'react';

import {theme} from '../../constants';
import {useAppSelector} from '../../hooks';
import {components} from '../../components';

const Wishlist = () => {
  const {list} = useAppSelector((state) => state.wishlistSlice);
  const renderHeader = () => {
    return (
      <components.Header
        logo={true}
        basket={true}
        title='Wishlist'
        backgroundColor={theme.colors.pastel}
      />
    );
  };

  const renderWishlist = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: 17,
        }}
      >
        {list.map((item, index, array) => {
          const lastItem = index === array.length - 1;
          return (
            <components.WishlistItem
              key={index}
              item={item}
              lastItem={lastItem}
            />
          );
        })}
      </ScrollView>
    );
  };

  return (
    <components.SmartView>
      {renderHeader()}
      {renderWishlist()}
    </components.SmartView>
  );
};

export default Wishlist;
