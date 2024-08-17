// store.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // Array to hold combo items
  total: 0, // Total price of the cart
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addCombo: (state, action) => {
      const newCombo = action.payload;
      const existingComboIndex = state.items.findIndex(
        (item) => item.comboId === newCombo.comboId
      );

      if (existingComboIndex !== -1) {
        // Combo already in cart, increase quantity
        state.items[existingComboIndex].quantity += 1;

        // Update total
        state.total = state.items.reduce((acc, item) => {
          const comboTotal = item.price * item.quantity;
          return acc + comboTotal;
        }, 0);
      } else {
        // New combo, add to cart
        state.items.push({
          ...newCombo,
          quantity: 1, // Initialize quantity
        });

        // Update total
        state.total += newCombo.price;
      }
    },
    removeCombo: (state, action) => {
      const comboId = action.payload;
      const index = state.items.findIndex((item) => item.comboId === comboId);

      if (index !== -1) {
        // Subtract price
        state.total -= state.items[index].price * state.items[index].quantity;
        state.items.splice(index, 1);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
    increaseComboQuantity: (state, action) => {
      const comboId = action.payload;
      const combo = state.items.find((item) => item.comboId === comboId);
      if (combo) {
        combo.quantity += 1;
        state.total += combo.price;
      }
    },
    decreaseComboQuantity: (state, action) => {
      const comboId = action.payload;
      const combo = state.items.find((item) => item.comboId === comboId);
      if (combo) {
        if (combo.quantity > 1) {
          combo.quantity -= 1;
          state.total -= combo.price;
        }
      }
    },
  },
});

export const {
  addCombo,
  removeCombo,
  clearCart,
  increaseComboQuantity,
  decreaseComboQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
