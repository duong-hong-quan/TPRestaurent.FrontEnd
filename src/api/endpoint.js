export const AccountApi = {
  SEND_OTP: "/api/account/send-otp",
  LOGIN: "/api/account/login",
  VERIFY_FOR_RESERVATION: "/api/account/verify-for-reservation",
  GET_BY_PHONE: "/api/account/get-account-by-phone-number",
  CREATE_ACCOUNT: "/api/account/create-account",
  VERIFY_ACCOUNT_OTP: "/api/account/verify-account-otp",
};

export const ComboApi = {
  GET_ALL: "/combo/get-all-combo/",
  GET_BY_ID: "/combo/get-combo-by-id-ver-2",
};

export const ConfigurationApi = {
  GET_ALL: "/configuration/get-all-config",
};
export const CouponApi = {
  GET_ALL: "/coupon/get-available-coupon",
};
export const DeviceApi = {
  GET_ALL: "/device/get-all-device",
};
export const HashingApi = {
  DECODE_HASHING: "/api/hashing/decode-hashing",
};

export const OrderApi = {
  CREATE_ORDER: "/order/create-order",
  GET_BY_PHONE: "/order/get-all-order-by-phone-number",
  GET_DETAIL: "/order/get-order-detail",
  CHANGE_ORDER_STATUS: "/order/change-order-status",
  GET_ALL: "/order/get-all-order-by-status",
  SUGGEST_TABLE: "/order/suggest-table",
  ADD_TABLE_TO_RESEVATION: "/reservation/add-table-to-reservation",
  UPDATE_RESERVATION: "/reservation/update-reservation-status",
  CALCULATE_RESERVATION: "/order/calculate-reservation",
};

export const ReservationApi = {
  GET_ALL: "/reservation/get-all-reservation",
  CALCULATE_DEPOSIT: "/reservation/calculate-deposit",
  CREATE_RESERVATION: "/reservation/create-reservation",
  GET_BY_PHONE: "/reservation/get-all-reservation-by-phone-number",
  GET_DETAIL: "/reservation/get-reservation-detail",
};

export const StoreCreditApi = {
  ADD: "/store-credit/add-to-store-credit",
};

export const TableSessionApi = {
  GET_CURRENT_TABLE_SESSION: "/table-session/get-current-table-session",
  GET_DETAIL: "/table-session/get-table-session-by-id",
  UPDATE_PRELIST_ORDER_STATUS: "/table-session/update-prelist-order-status",
};

export const TransactionApi = {
  CREATE_PAYMENT: "/transaction/create-payment",
  GET_ALL: "/transaction/get-all-payment",
  UPDATE_STATUS: "/transaction/update-transaction-status",
};

export const DishApi = {
  GET_ALL: "/dish/get-all-dish/",
  GET_ALL_DISH_TYPE: "/dish/get-all-dish-type",
};
