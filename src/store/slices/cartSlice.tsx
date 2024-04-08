import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {ProductType} from '../../types';

type CartItemType = {
  list: ProductType[];
  total: number;
  discount: number;
  delivery: number;
};

const initialState: CartItemType = {
  list: [],
  total: 0,
  discount: 2.88,
  delivery: 2,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<ProductType>) => {
      const inCart = state.list.find((item) => item.id === action.payload.id);

      if (inCart) {
        state.list.map((item: ProductType) => {
          if (item.id === action.payload.id) {
            if (item.quantity) {
              item.quantity += 1;
            }
          }
          return item;
        }, state);
        state.total += action.payload.price;
      } else {
        state.list.push({
          ...action.payload,
          quantity: 1,
        });
        state.total += action.payload.price;
      }
    },
    removeFromCart: (state, action: PayloadAction<ProductType>) => {
      const inCart = state.list.find((item) => item.id === action.payload.id);

      if (inCart) {
        state.list.map((item) => {
          if (item.id === action.payload.id && (item.quantity as number) > 1) {
            if (item.quantity) {
              item.quantity -= 1;
            }
          } else if (item.id === action.payload.id && item.quantity === 1) {
            state.list.splice(state.list.indexOf(item), 1);
          }
          return item;
        }, state);
        state.total -= action.payload.price;
      }
    },

    fullRemoveFromCart: (state, action) => {
      const inCart = state.list.find((item) => item.id === action.payload.id);

      if (inCart) {
        state.list.map((item) => {
          if (item.id === action.payload.id) {
            state.total -= item.price * (item.quantity as number);
            state.list.splice(state.list.indexOf(item), 1);
          }
          return item;
        }, state);
      }
    },

    resetCart: (state) => {
      state.list = [];
      state.total = 0;
    },
  },
});

export const {addToCart, removeFromCart, resetCart, fullRemoveFromCart} =
  cartSlice.actions;

export default cartSlice.reducer;
