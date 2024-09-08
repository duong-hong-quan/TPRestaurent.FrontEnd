import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import cartReducer from "./features/cartSlice";
import cartReservationReducer from "./features/cartReservationSlice";
const rootReducer = combineReducers({
  user: authReducer,
  cart: cartReducer,
  cartReservation: cartReservationReducer,
});

export default rootReducer;
