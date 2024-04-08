import {BASE_URL} from '../../config/api';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

import {ProductType, BannerType, CarouselType} from '../../types';

export const apiSlice = createApi({
  reducerPath: 'apiSlice',
  baseQuery: fetchBaseQuery({baseUrl: BASE_URL}),
  endpoints: (builder) => ({
    getProducts: builder.query<{products: ProductType[]}, void>({
      query: () => 'products.json',
    }),
    getBanners: builder.query<{banners: BannerType[]}, void>({
      query: () => 'banners.json',
    }),
    getCarousel: builder.query<{carousel: CarouselType[]}, void>({
      query: () => 'carousel.json',
    }),
  }),
});

export const {useGetProductsQuery, useGetBannersQuery, useGetCarouselQuery} =
  apiSlice;

export default apiSlice.reducer;
