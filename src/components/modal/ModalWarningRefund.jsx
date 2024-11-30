import React, { useState } from "react";
import { Button, message, Modal, Select, Tag } from "antd";
import { StyledTable } from "../custom-ui/StyledTable";
import {
  formatDate,
  formatDateTime,
  formatPrice,
  showError,
} from "../../util/Utility";
import {
  CreditCard,
  DollarSign,
  ShoppingCart,
  RefreshCcw,
  X,
} from "lucide-react";
import Cash_Logo from "../../assets/imgs/payment-icon/Cash_Logo.png";
import VNpay_Logo from "../../assets/imgs/payment-icon/VNpay_Logo.png";
import MoMo_Logo from "../../assets/imgs/payment-icon/MoMo_Logo.png";
import useCallApi from "../../api/useCallApi";
import { OrderApi } from "../../api/endpoint";

const ModalWarningRefund = ({ show, handleClose, payments }) => {
  const [refundMethod, setRefundMethod] = useState("1");
  const { callApi, loading } = useCallApi();

  const statusMap = {
    0: {
      text: "Đang xử lý",
      color: "blue",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
    },
    1: {
      text: "Thất bại",
      color: "red",
      bgColor: "bg-red-100",
      textColor: "text-red-800",
    },
    2: {
      text: "Thành công",
      color: "green",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
    },
  };

  const transactionTypeMap = {
    1: {
      text: "Đặt cọc",
      color: "yellow",
      icon: <DollarSign className="text-yellow-500" />,
    },
    2: {
      text: "Đặt hàng",
      color: "red",
      icon: <ShoppingCart className="text-red-500" />,
    },
    3: {
      text: "Nạp số dư",
      color: "green",
      icon: <CreditCard className="text-green-500" />,
    },
    4: {
      text: "Hoàn tiền",
      color: "blue",
      icon: <DollarSign className="text-blue-500" />,
    },
  };

  const getMethodIcon = (method) => {
    const iconClass = "w-12 h-12 rounded-full shadow-md";
    switch (method) {
      case 1:
        return <img src={Cash_Logo} alt="Cash" className={iconClass} />;
      case 2:
        return <img src={VNpay_Logo} alt="VNPay" className={iconClass} />;
      case 3:
        return <img src={MoMo_Logo} alt="MoMo" className={iconClass} />;
      case 4:
        return <img src={Cash_Logo} alt="Cash" className={iconClass} />;
      case 5:
        return <img src={Cash_Logo} alt="Cash" className={iconClass} />;
      default:
        return null;
    }
  };

  const columns = [
    {
      title: "Payment ID",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
          {id.slice(0, 8)}
        </span>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "date",
      key: "date",
      render: (date) => (
        <span className="text-sm text-gray-700">{formatDateTime(date)}</span>
      ),
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "paidDate",
      key: "paidDate",
      render: (paidDate) => (
        <span className="text-sm text-gray-700">
          {formatDateTime(paidDate)}
        </span>
      ),
    },
    {
      title: "Loại đơn hàng",
      dataIndex: ["order", "orderType", "vietnameseName"],
      key: "orderTypeName",
      render: (orderType) => (
        <span className="text-sm font-semibold text-gray-800">{orderType}</span>
      ),
    },
    {
      title: "Tổng tiền đơn hàng",
      dataIndex: ["order", "totalAmount"],
      key: "orderTotal",
      render: (total) => (
        <span className="text-sm font-bold text-green-700">
          {formatPrice(total)}
        </span>
      ),
    },
    {
      title: "Tiền cọc",
      dataIndex: ["order", "deposit"],
      key: "deposit",
      render: (deposit) => (
        <span className="text-sm text-blue-700">{formatPrice(deposit)}</span>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <span className="text-sm font-bold text-red-700">
          {formatPrice(amount)}
        </span>
      ),
    },
    {
      title: "Giờ ăn",
      dataIndex: ["order", "mealTime"],
      key: "mealTime",
      render: (mealTime) => (
        <span className="text-sm text-gray-700">
          {formatDateTime(mealTime)}
        </span>
      ),
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethodId",
      key: "paymentMethodId",
      render: (paymentMethodId) => getMethodIcon(paymentMethodId),
    },
    {
      title: "Loại giao dịch",
      dataIndex: "transactionTypeId",
      key: "transactionTypeId",
      render: (transactionTypeId) => {
        const type = transactionTypeMap[transactionTypeId];
        return type ? (
          <div className="flex items-center gap-2">
            {type.icon}
            <span
              className={`text-sm font-medium px-2 py-1 rounded bg-${type.color}-100 text-${type.color}-800`}
            >
              {type.text}
            </span>
          </div>
        ) : null;
      },
    },
    {
      title: "Trạng thái giao dịch",
      dataIndex: "transationStatusId",
      key: "transationStatusId",
      render: (_, record) => {
        const status = statusMap[record.transationStatusId];
        return status ? (
          <span
            className={`${status.bgColor} ${status.textColor} text-xs px-2 py-1 rounded font-semibold`}
          >
            {status.text}
          </span>
        ) : null;
      },
    },
  ];

  const handleConfirmRefund = async () => {
    Modal.confirm({
      title: (
        <div className="flex items-center gap-2 text-red-600">
          <RefreshCcw className="w-5 h-5" />
          <span>Xác nhận hoàn tiền</span>
        </div>
      ),
      content: (
        <p className="text-gray-700">
          Bạn có chắc chắn muốn hoàn tiền cho đơn hàng này?
        </p>
      ),
      okText: "Xác nhận",
      cancelText: "Hủy",
      okButtonProps: {
        className: "bg-red-600 hover:bg-red-700 text-white",
      },
      onOk: async () => {
        const response = await callApi(
          OrderApi.CREATE_DUPPLICATED_ORDER_REFUND,
          "PUT",
          {
            orderId: payments[0]?.orderId,
            paymentMethod: Number(refundMethod),
          }
        );
        if (response.isSuccess) {
          message.success(
            <span className="text-green-600">Hoàn tiền thành công</span>
          );
          handleClose();
        } else {
          showError(response.messages);
        }
      },
    });
  };

  return (
    <Modal
      width={1400}
      open={show}
      onCancel={handleClose}
      footer={null}
      closeIcon={<X className="text-gray-600 hover:text-red-600" />}
      className="custom-modal"
    >
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
          <DollarSign className="text-blue-600" />
          Chi tiết thanh toán
        </h2>

        <StyledTable
          dataSource={payments}
          columns={columns}
          pagination={false}
          className="mb-6"
        />

        <div className="flex justify-center items-center gap-4">
          <Select
            value={refundMethod}
            onChange={(value) => setRefundMethod(value)}
            className="w-64"
            placeholder="Chọn phương thức hoàn tiền"
          >
            <Select.Option value="1">
              <div className="flex items-center gap-2">
                <CreditCard className="text-green-500" />
                Hoàn vào ví Thiên Phú
              </div>
            </Select.Option>
            <Select.Option value="5">
              <div className="flex items-center gap-2">
                <DollarSign className="text-blue-500" />
                Nhận tiền mặt
              </div>
            </Select.Option>
          </Select>

          <Button
            className="bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
            onClick={handleConfirmRefund}
            loading={loading}
          >
            <RefreshCcw className="w-4 h-4" />
            Xác nhận hoàn tiền
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalWarningRefund;
