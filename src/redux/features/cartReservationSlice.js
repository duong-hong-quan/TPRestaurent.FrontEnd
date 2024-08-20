// src/features/cartReservationSlice.js
import { createSlice, createSelector } from "@reduxjs/toolkit";

const cartReservationSlice = createSlice({
  name: "cartReservation",
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const { dish, size } = action.payload;
      const existingItem = state.find(
        (item) =>
          item.dish.dishId === dish.dishId &&
          item.size.dishSizeDetailId === size.dishSizeDetailId
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.push({ dish, size, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      const { dish, size } = action.payload;
      return state.filter(
        (item) =>
          !(
            item.dish.dishId === dish.dishId &&
            item.size.dishSizeDetailId === size.dishSizeDetailId
          )
      );
    },
    increaseQuantity: (state, action) => {
      const { dish, size, quantity } = action.payload;
      console.log(quantity);
      debugger;
      const item = state.find(
        (item) =>
          item.dish.dishId === dish.dishId &&
          item.size.dishSizeDetailId === size.dishSizeDetailId
      );
      if (item) {
        if (quantity > 1) {
          item.quantity += quantity;
        } else {
          item.quantity += 1;
        }
      }
    },
    decreaseQuantity: (state, action) => {
      const { dish, size } = action.payload;
      const item = state.find(
        (item) =>
          item.dish.dishId === dish.dishId &&
          item.size.dishSizeDetailId === size.dishSizeDetailId
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    clearCart: () => {
      return [];
    },
  },
});

// Selector to get all cart items
const selectCartItems = (state) => state.cartReservation;

// Selector to calculate the total
export const getTotal = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.size.price * item.quantity, 0)
);

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartReservationSlice.actions;

export default cartReservationSlice.reducer;
