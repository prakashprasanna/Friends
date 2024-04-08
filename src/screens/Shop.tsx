import React from 'react';
import {View, TouchableOpacity, FlatList} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {text} from '../text';
import {svg} from '../assets/svg';
import {theme} from '../constants';
import {ProductType} from '../types';
import {components} from '../components';
import {useAppNavigation} from '../hooks';
import type {RootStackParamList} from '../types';
import {useGetProductsQuery} from '../store/slices/apiSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'Shop'>;

const Shop: React.FC<Props> = ({route}): JSX.Element => {
  const {data, error, isLoading} = useGetProductsQuery();

  const {products, title} = route.params ?? {
    products: data,
    title: 'Shop',
  };
  const navigation = useAppNavigation();

  if (isLoading) {
    return <components.Loader />;
  }

  const renderStatusBar = () => {
    return (
      <components.StatusBar
        backgroundColor={theme.colors.pastel}
        barStyle='dark-content'
      />
    );
  };

  const renderHeader = () => {
    return (
      <components.Header
        title={title}
        backgroundColor={theme.colors.pastel}
        goBack={navigation.canGoBack()}
      />
    );
  };

  const renderOptions = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          style={{
            paddingTop: 22,
            paddingRight: 20,
            paddingBottom: 15,
            paddingLeft: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
          onPress={() => {}}
        >
          <svg.SettingsSvg />
          <text.T14 style={{marginLeft: 8, color: theme.colors.textColor}}>
            Filters
          </text.T14>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingTop: 22,
            paddingRight: 20,
            paddingBottom: 15,
            paddingLeft: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
          onPress={() => {}}
        >
          <text.T14 style={{marginRight: 7, color: theme.colors.textColor}}>
            Sorting by
          </text.T14>
          <svg.BottomArrowSvg />
        </TouchableOpacity>
      </View>
    );
  };

  const renderProducts = () => {
    const dataProducts = data?.products;
    return (
      <FlatList
        data={(products as ProductType[]) ?? (dataProducts as ProductType[])}
        renderItem={({item}) => <components.ShopItem item={item} />}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        numColumns={2}
        horizontal={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}
      />
    );
  };

  return (
    <components.SafeAreaView
      style={{
        backgroundColor: theme.colors.white,
      }}
      edges={['bottom']}
    >
      {renderStatusBar()}
      {renderHeader()}
      {renderOptions()}
      {renderProducts()}
    </components.SafeAreaView>
  );
};

export default Shop;
