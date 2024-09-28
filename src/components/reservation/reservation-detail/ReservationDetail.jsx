import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { Table } from "antd";
import moment from "moment/moment";
import Momo_logo from "../../../assets/imgs/payment-icon/MoMo_Logo.png";
import VNPAY_logo from "../../../assets/imgs/payment-icon/VNpay_Logo.png";
import { PaymentMethod } from "../../../util/GlobalType";
import { formatDateTime, formatPrice } from "../../../util/Utility";

const ReservationDetail = ({ reservationData }) => {
  const { order, orderDishes, orderTables } = reservationData;

  const renderPaymentMethod = () => {
    switch (order?.paymentMethodId) {
      case PaymentMethod.MOMO:
        return (
          <div className="flex items-center">
            <img src={Momo_logo} className="h-6 w-6 mr-2" alt="Momo" />
            <span className="text-pink-600 font-semibold">Momo</span>
          </div>
        );
      case PaymentMethod.VNPAY:
        return (
          <div className="flex items-center">
            <img src={VNPAY_logo} className="h-6 w-6 mr-2" alt="VNPAY" />
            <span className="text-blue-600 font-semibold">VNPAY</span>
          </div>
        );
      default:
        return <span className="text-gray-600">Không xác định</span>;
    }
  };
  console.log(reservationData);
  const renderOrderTime = () => {
    switch (order?.orderTypeId) {
      case 1:
        return formatDateTime(order.reservationDate);
      case 2:
        return formatDateTime(order.orderDate);
      case 3:
        return formatDateTime(order.mealTime);
    }
  };
  const columns = [
    {
      title: "Tên món",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center">
          <img
            src={record.image}
            alt=""
            className="w-12 h-12 rounded-full object-cover mr-3"
          />
          <div>
            <p className="font-semibold">{text}</p>
            {record.comboDishes && (
              <ul className="text-sm text-gray-600 mt-1">
                {record.comboDishes.map((dish) => (
                  <li key={dish.dishComboId}>
                    + {dish.name} ({dish.size})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => <span className="font-medium">{quantity}</span>,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <span className="font-medium">{price.toLocaleString()} VND</span>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (note) => (
        <span className="text-gray-600">{note || "Không có ghi chú"}</span>
      ),
    },
    {
      title: "Thời gian đặt",
      dataIndex: "orderTime",
      key: "orderTime",
      render: (orderTime) => (
        <span className="text-gray-600">
          {moment(orderTime).format("DD/MM/YYYY HH:mm")}
        </span>
      ),
    },
  ];
  const calculateTotalOrder = () => {
    return orderDishes?.reduce((total, order) => {
      if (order.comboDish) {
        return total + order.comboDish.combo.price * order.quantity;
      } else {
        return total + order.dishSizeDetail.price * order.quantity;
      }
    }, 0);
  };
  const dataSource = orderDishes?.flatMap((order) => {
    if (order.comboDish) {
      return {
        key: order.orderDetailsId,
        name: order.comboDish.combo.name,
        quantity: order.quantity,
        price: order.comboDish.combo.price,
        note: order.note,
        image: order.comboDish.combo.image,
        orderTime: order.orderTime,
        comboDishes: order.comboDish.dishCombos.map((comboDish) => ({
          dishComboId: comboDish.dishComboId,
          name: comboDish.dishSizeDetail.dish.name,
          size: comboDish.dishSizeDetail.dishSize.vietnameseName,
          image: comboDish.dishSizeDetail.dish.image,
        })),
      };
    } else {
      return {
        key: order.orderDetailsId,
        name: `${order.dishSizeDetail.dish.name} (${order.dishSizeDetail.dishSize.vietnameseName})`,
        quantity: order.quantity,
        price: order.dishSizeDetail.price,
        note: order.note,
        orderTime: order.orderTime,
        image: order.dishSizeDetail.dish.image,
      };
    }
  });

  return (
    <Card className="w-full shadow-none border-none">
      <CardBody className="p-6">
        <Typography
          variant="h4"
          color="blue-gray"
          className="mb-6 text-center font-bold"
        >
          Thông Tin Đơn Hàng
        </Typography>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <Typography
              variant="h5"
              color="blue-gray"
              className="mb-4 font-semibold"
            >
              Thông Tin Đặt Bàn
            </Typography>
            <InfoItem
              label="Mã đơn đặt hàng"
              value={order?.orderId.substring(0, 8)}
            />
            <InfoItem label="Thời gian tạo" value={renderOrderTime()} />
            <InfoItem
              label="Họ và tên"
              value={`${order?.account?.lastName} ${order?.account?.firstName}`}
            />
            <InfoItem
              label="Điện thoại"
              value={`0${order?.account?.phoneNumber}`}
            />
            <InfoItem
              label="Số lượng khách"
              value={`${order?.numOfPeople} người`}
            />
            <InfoItem
              label="Loại bàn"
              value={
                orderTables && orderTables.length > 0
                  ? orderTables
                      .map(
                        (item, index) =>
                          `Bàn ${item.table?.tableSizeId} người - ${item.table?.room?.name}`
                      )
                      .join(", ")
                  : "Chưa có thông tin"
              }
            />
            <InfoItem
              label="Ghi chú"
              value={order?.note || "Không có ghi chú"}
            />
            <InfoItem
              label="Tổng giá trị đơn hàng"
              value={formatPrice(order?.totalAmount)}
            />
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <Typography
              variant="h5"
              color="blue-gray"
              className="mb-4 font-semibold"
            >
              Thông Tin Đặt Cọc
            </Typography>
            <InfoItem
              label="Số tiền đặt cọc"
              value={`${order?.deposit?.toLocaleString()} VND`}
            />
            <InfoItem
              label="Phương thức thanh toán"
              value={renderPaymentMethod()}
              isComponent
            />
            <InfoItem
              label="Đã đặt cọc lúc"
              value={moment(order?.depositDate).format("DD/MM/YYYY HH:mm")}
            />
          </div>
        </div>
        <Typography
          variant="h5"
          color="blue-gray"
          className="mb-4 font-semibold"
        >
          Chi Tiết Đơn Hàng
        </Typography>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          className="border border-gray-200 rounded-lg overflow-hidden"
        />
      </CardBody>
    </Card>
  );
};

const InfoItem = ({ label, value, isComponent = false }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
    <span className="text-gray-600 font-medium">{label}:</span>
    {isComponent ? value : <span className="font-semibold">{value}</span>}
  </div>
);

export default ReservationDetail;
