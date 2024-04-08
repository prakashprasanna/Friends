import {View, Text, ScrollView, FlatList} from 'react-native';
import React from 'react';

import {
  useGetProductsQuery,
  useGetCarouselQuery,
  useGetBannersQuery,
} from '../../store/slices/apiSlice';
import {theme} from '../../constants';
import {components} from '../../components';
import type {ProductType} from '../../types';
import {useAppNavigation} from '../../hooks';
import {BannerType} from '../../types/BannerType';

const Home: React.FC = (): JSX.Element => {
  const navigation = useAppNavigation();

  const {
    data: bannersData,
    error: bannersError,
    isLoading: bannersLoading,
  } = useGetBannersQuery();

  const {
    data: productsData,
    error: productsError,
    isLoading: productsLoading,
  } = useGetProductsQuery();

  if (bannersLoading) {
    return <components.Loader />;
  }

  const renderBanner_1 = () => {
    const banner = bannersData?.banners[0];
    return (
      <View style={{marginBottom: 40}}>
        <components.BannerItem version={1} banner={banner as BannerType} />
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <components.Header
        logo={true}
        basket={true}
        backgroundColor={theme.colors.pastel}
      />
    );
  };

  const renderFeatured = () => {
    const products = productsData?.products;

    const featured = products?.filter((item: ProductType) => item.is_featured);
    const viewAllNav = {products: featured, title: 'Featured'};
    const slice = featured?.slice(0, 5) as ProductType[];

    return (
      <View style={{marginBottom: 40}}>
        <components.BlockHeading
          title='Featured Products'
          viewAllOnPress={() => {
            navigation.navigate('Shop', viewAllNav);
          }}
          containerStyle={{
            marginHorizontal: 20,
            marginBottom: 18,
          }}
        />
        <FlatList
          data={slice}
          horizontal={true}
          keyExtractor={(item: ProductType) => item.id.toString()}
          // ItemSeparatorComponent={() => <Text>1</Text>}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingLeft: 20,
          }}
          renderItem={({item, index}) => {
            const lastItem = index === slice.length - 1;
            return (
              <components.ProductCard
                item={item}
                version={1}
                lastItem={lastItem}
              />
            );
          }}
        />
      </View>
    );
  };

  const renderBanner_2 = () => {
    const banner = bannersData?.banners[1];
    return (
      <View style={{marginBottom: 40}}>
        <components.BannerItem version={2} banner={banner as BannerType} />
      </View>
    );
  };

  const renderBestSellers = () => {
    const products = productsData?.products;
    const bestSellers = products?.filter(
      (item: ProductType) => item.is_bestseller,
    );
    const viewAllNav = {products: bestSellers, title: 'Best Sellers'};
    const slice = bestSellers?.slice(0, 5);

    // console.log('bestSellers', bestSellers);

    return (
      <View style={{marginBottom: 40}}>
        <components.BlockHeading
          title='Best Sellers'
          viewAllOnPress={() => {
            navigation.navigate('Shop', viewAllNav);
          }}
          containerStyle={{
            marginHorizontal: 20,
            marginBottom: 18,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
          }}
        >
          {slice?.map((item: ProductType, index: number) => {
            const lastItem = index === slice.length - 1;
            return (
              <components.ProductCard
                key={item.id}
                item={item}
                version={2}
                lastItem={lastItem}
              />
            );
          })}
        </View>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          backgroundColor: theme.colors.white,
        }}
      >
        {renderBanner_1()}
        {renderFeatured()}
        {renderBanner_2()}
        {renderBestSellers()}
      </ScrollView>
    );
  };

  return (
    <components.SmartView
      containerStyle={{
        backgroundColor: theme.colors.pastel,
      }}
    >
      {renderHeader()}
      {renderContent()}
    </components.SmartView>
  );
};

export default Home;
