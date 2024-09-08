import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import cartReducer from "./features/cartSlice";
import cartReservationReducer from "./features/cartReservationSlice";
import sidebarReducer from "./features/sidebarSlice";
const rootReducer = combineReducers({
  user: authReducer,
  cart: cartReducer,
  cartReservation: cartReservationReducer,
  sidebar: sidebarReducer,
});

export default rootReducer;
