export const PaymentMethod = {
  VNPAY: 2,
  MOMO: 3,
  STORE_CREDIT: 5,
};
// enums/RatingPoint.js
export const ReservationStatus = {
  PENDING: 0,
  TABLE_ASSIGNED: 1,
  PAID: 2,
  DINING: 3,
  CANCELLED: 4,
};

export const OrderStatus = [
  {
    label: "Đã xếp bàn",
    value: 1,
  },
  {
    label: "Đã thanh toán cọc",
    value: 2,
  },
  {
    label: "Đang chờ thanh toán",
    value: 4,
  },
  {
    label: "Đang nấu",
    value: 5,
  },

  {
    label: "Đã lên hết món",
    value: 3,
  },
  {
    label: "Sẵn sàng giao hàng",
    value: 6,
  },
  {
    label: "Đã bàn giao cho shipper",
    value: 7,
  },
  {
    label: "Đang giao hàng",
    value: 8,
  },
  {
    label: "Hoàn thành",
    value: 9,
  },
  {
    label: "Đã hủy",
    value: 10,
  },
];

export const TransactionStatus = [
  {
    label: "Đang xử lý",
    value: "0",
  },
  {
    label: "Thất bại",
    value: "1",
  },
  {
    label: "Thành công",
    value: "2",
  },
];

export const TransactionType = [
  {
    label: "Đặt chỗ",
    value: "1",
  },
  {
    label: "Đặt món",
    value: "2",
  },
  {
    label: "Nạp vào ví",
    value: "3",
  },
  {
    label: "Hoàn vào ví",
    value: "4",
  },
];
