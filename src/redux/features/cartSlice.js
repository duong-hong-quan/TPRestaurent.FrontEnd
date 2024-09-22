// cartSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addCombo: (state, action) => {
      const newCombo = action.payload;
      const existingComboIndex = state.items.findIndex(
        (item) =>
          item.comboId === newCombo.comboId &&
          JSON.stringify(item.selectedDishes) ===
            JSON.stringify(newCombo.selectedDishes)
      );

      if (existingComboIndex !== -1) {
        state.items[existingComboIndex].quantity += 1;
      } else {
        state.items.push({ ...newCombo, quantity: 1 });
      }

      state.total = calculateTotal(state.items);
    },
    removeCombo: (state, action) => {
      const { comboId, selectedDishes } = action.payload;
      const index = state.items.findIndex(
        (item) =>
          item.comboId === comboId &&
          JSON.stringify(item.selectedDishes) === JSON.stringify(selectedDishes)
      );

      if (index !== -1) {
        state.items.splice(index, 1);
      }

      state.total = calculateTotal(state.items);
    },
    increaseComboQuantity: (state, action) => {
      const { comboId, selectedDishes } = action.payload;
      const combo = state.items.find(
        (item) =>
          item.comboId === comboId &&
          JSON.stringify(item.selectedDishes) === JSON.stringify(selectedDishes)
      );

      if (combo) {
        combo.quantity += 1;
      }

      state.total = calculateTotal(state.items);
    },
    decreaseComboQuantity: (state, action) => {
      const { comboId, selectedDishes } = action.payload;
      const combo = state.items.find(
        (item) =>
          item.comboId === comboId &&
          JSON.stringify(item.selectedDishes) === JSON.stringify(selectedDishes)
      );

      if (combo && combo.quantity > 1) {
        combo.quantity -= 1;
      }

      state.total = calculateTotal(state.items);
    },
    clearCartReservation: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const calculateTotal = (items) => {
  debugger;
  if (items.length > 0) {
    return items.reduce(
      (acc, item) => acc + item.combo.price * item.quantity,
      0
    );
  }
};
export const {
  addCombo,
  removeCombo,
  clearCartReservation,
  increaseComboQuantity,
  decreaseComboQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
