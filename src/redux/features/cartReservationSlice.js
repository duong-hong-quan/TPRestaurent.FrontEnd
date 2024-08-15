// src/features/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const cartReservationSlice = createSlice({
  name: "cartReservation",
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const { dish, size, price } = action.payload;
      const existingItem = state.find(
        (item) => item.dish.dishId === dish.dishId && item.size === size
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.push({ dish, size, price, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      const { dishId, size } = action.payload;
      return state.filter(
        (item) => !(item.dish.dishId === dishId && item.size === size)
      );
    },
    increaseQuantity: (state, action) => {
      const { dishId, size } = action.payload;
      const item = state.find(
        (item) => item.dish.dishId === dishId && item.size === size
      );
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity: (state, action) => {
      const { dishId, size } = action.payload;
      const item = state.find(
        (item) => item.dish.dishId === dishId && item.size === size
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
  },
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity } =
  cartReservationSlice.actions;
export default cartReservationSlice.reducer;
