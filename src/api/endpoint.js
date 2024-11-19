export const AccountApi = {
  SEND_OTP: "/api/account/send-otp",
  LOGIN: "/api/account/login",
  VERIFY_FOR_RESERVATION: "/api/account/verify-for-reservation",
  GET_BY_PHONE: "/api/account/get-account-by-phone-number",
  CREATE_ACCOUNT: "/api/account/create-account",
  UPDATE_ACCOUNT: "/api/account/update-account",
  VERIFY_ACCOUNT_OTP: "/api/account/verify-account-otp",
  CREATE_ADDRESS: "/api/account/create-customer-info-address",
  UPDATE_ADDRESS: "/api/account/update-customer-info-address",
  DELETE_ADDRESS: "/api/account/delete-customer-info-address",
  GET_ADDRESS: "/api/account/get-customer-info-address",
  CHANGE_EMAIL_REQUEST: "/api/account/change-email-request",
  VERIFY_CHANGE_EMAIL: "/api/account/verify-change-email",
  LOAD_AVAILABLE_SHIPPER: "/api/account/load-available-shipper",
  GET_ACCOUNTS_BY_ROLE_NAME: "/api/account/get-accounts-by-role-name",
  CREATE_ACCOUNT_RESTAURANT_EMPLOYEE:
    "/api/account/create-account-restaurant-employees",
  BAN_USER: "/api/account/ban-user",
  GET_ACCOUNT_BY_PHONENUMBER_KEYWORD:
    "/api/account/get-account-by-phone-number-keyword",
  GET_ALL_ACCOUNT: "/api/account/get-all-account",
};

export const ComboApi = {
  GET_ALL: "/combo/get-all-combo/",
  GET_BY_ID: "/combo/get-combo-by-id-ver-2",
  CREATE_COMBO: "/combo/create-combo",
  UPDATE_COMBO: "/combo/update-combo",
  UPLOAD_COMBO_IMAGE: "/combo/upload-combo-image",
  DELETE_COMBO_BY_ID: "/combo/delete-combo-by-id",
};

export const ConfigurationApi = {
  GET_ALL: "/configuration/get-all-config",
  GET_ALL_CONFIG_VERSION_BY_ID: "/configuration/get-all-configuration-version",
  GET_CONFIG_BY_NAME: "/configuration/get-config-by-name",
  UPDATE_CONFIG: "/configuration/update-config",
  CREATE_CONFIG_SERVICE: "/configuration/create-config-service",
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
  ADD_TABLE_TO_RESEVATION: "/reservation/add-table-to-reservation",
  UPDATE_RESERVATION: "/reservation/update-reservation-status",
  CALCULATE_RESERVATION: "/order/calculate-reservation",
  GET_ALL_TABLE_DETAIL: "/order/get-all-table-details",
  CALCULATE_DELIVER_ORDER: "/order/calculate-deliver-order",
  UPDATE_ORDER_DETAIL_STATUS: "/order/update-order-detail-status",
  ASSIGN_ORDER_TO_SHIPPER: "/order/assign-order-for-shipper",
  GET_ALL_ORDER_BY_SHIPPER: "/order/get-all-order-by-shipper-id",
  GET_ORDER_WITH_FILTER: "/order/get-order-with-filter",
  GET_CART_COMBO_ITEM: "/order/get-cart-combo-item",
  GET_CART_DISH_ITEM: "/order/get-cart-dish-item",
  UPDATE_ORDER_STATUS: "/order/update-order-status",
  MAKE_DINE_IN_ORDER_BILL: "/order/make-dine-in-order-bill",
  GET_BEST_SELLER_DISH_AND_COMBO: "/order/get-best-seller-dishes-and-combo",
  GET_ALL_ORDER_DETAIL_BY_ACCOUNT_ID:
    "/order/get-all-order-detail-by-account-id",
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
  GET_LOYALTY_POINT_BY_CUSTOMER:
    "/transaction/get-loyalty-point-history-by-customer-id",
  GET_TRANSACTION_HISTORY_BY_CUSTOMER_ID:
    "/transaction/get-transaction-history-by-customer-id",
  GET_STORE_CREDIT_TRANSACTION_HISTORY_BY_CUSTOMER_ID:
    "/transaction/get-stored-credit-transaction-history-by-customer-id",
  GET_TRANSACTION_BY_ID: "/transaction/get-payment-by-id",
};

export const DishApi = {
  GET_ALL: "/dish/get-all-dish",
  GET_ALL_DISH_TYPE: "/dish/get-all-dish-type",
  GET_BY_ID: "/dish/get-dish-by-id",
  GET_ALL_DISH_SIZE: "/dish/get-all-dish-size",
  GET_ALL_DISH_TAG: "/dish/get-all-dish-tag",
  CREATE_DISH: "/dish/create-dish",
  UPDATE_DISH: "/dish/update-dish",
  UPDATE_DISH_IMAGE: "/dish/update-dish-image",
  DELETE_DISH: "/dish/delete-dish",
};
export const MapApi = {
  AUTO_COMPLETE: "/map/auto-complete",
};

export const OrderSessionApi = {
  GET_GROUPED_DISH: "/order-session/get-grouped-dish",
  GET_ALL_ORDER_SESSION: "/order-session/get-all-order-session",
  GET_ORDER_SESSION_BY_ID: "/order-session/get-order-session-by-id",
  UPDATE_ORDER_SESSION_STATUS: "/order-session/update-order-session-status",
};

export const DishManagementApi = {
  UPDATE_DISH_QUANTITY: "/dish-management/update-dish-quantity",
};

export const TokenApi = {
  ENABLE_NOTIFICATION: "/token/enable-notification",
  GET_ALL_TOKEN_BY_USER: "/token/get-all-token-by-user",
  LOG_OUT_ALL_DEVICE: "/token/log-out-all-device",
  DELETE_TOKEN: "/token/delete-token",
  GET_USER_TOKEN_BY_IP: "/token/get-user-token-by-ip",
};

export const NotificationApi = {
  GET_ALL_NOTIFICATION_BY_USER:
    "/notification/get-all-notification-by-account-id",
  MARK_AS_READ: "/notification/mark-as-read",
  MARK_ALL_AS_READ: "/notification/mark-all-as-read",
};
export const GroupedDishCraftApi = {
  GET_ALL: "/grouped-dish-craft/get-all-grouped-dish",
  GET_BY_ID: "/grouped-dish-craft/get-grouped-dish-by-id",
  ADD_GROUPED_DISH: "/grouped-dish-craft/add-grouped-dish",
};
export const TableApi = {
  GET_ALL: "/table/get-all-table",
  GET_BY_ID: "/table/get-table-by-id",
  CREATE_TABLE: "/table/create-table",
  UPDATE_TABLE: "/table/update-table",
  DELETE_TABLE: "/table/delete-table",
  FIND_TABLE: "/table/find-table",
  UPDATE_TABLE_COORDINATE: "/table/update-table-coordinate",
  GET_ALL_TABLE_RATING: "/table/get-all-table-rating",
  CREATE_TABLE: "/table/create-table",
};
export const StatisticApi = {
  GET_STATISTIC_FOR_NUMBER_REPORT:
    "/statistic/get-statistic-report-for-number-report",
  GET_STATISTIC_FOR_DASHBOARD_REPORT:
    "/statistic/get-statistic-report-for-dashboard-report",
};

export const InvoiceApi = {
  GENERATE_GENERAL_INVOICE: "/invoice/generate-general-invoice",
};

export const RatingApi = {
  CREATE: "/rating/create-rating",
};

export const ChatBotApi = {
  AI_RESPONSE: "chatbot/ai-response",
};
