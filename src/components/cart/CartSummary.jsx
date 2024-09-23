import React, { useState } from "react";
import { Button, Input, Modal, Switch, Typography } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  FileTextOutlined,
  TagOutlined,
  StarOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import CartCombosTable from "./CartCombosTable";
import { CartSingleTable } from "./CartSingleTable";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseComboQuantity,
  increaseComboQuantity,
  removeCombo,
} from "../../redux/features/cartSlice";
import { formatPrice } from "../../util/Utility";

import Card_Logo from "../../assets/imgs/payment-icon/Cash_Logo.png";
import MoMo_Logo from "../../assets/imgs/payment-icon/MoMo_Logo.png";
import VNpay_Logo from "../../assets/imgs/payment-icon/VNpay_Logo.png";
import PaymentMethodSelector from "./PaymentMethodSelector";
const { Title, Text } = Typography;

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center mb-2">
    {icon}
    <Text strong className="mr-2 ml-2">
      {label}:
    </Text>
    <Text>{value}</Text>
  </div>
);

const ActionItem = ({ icon, label, children }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center">
      {React.cloneElement(icon, { className: "text-red-900" })}
      <Text strong className="ml-2">
        {label}
      </Text>
    </div>
    {children}
  </div>
);

const CartSummary = ({ handleClose }) => {
  const cartReservation = useSelector((state) => state.cartReservation);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [selectedMethod, setSelectedMethod] = useState(2);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const handleChangeMethod = (data) => {
    setSelectedMethod(data);
  };
  const selectedPaymentMethodIcon = () => {
    switch (selectedMethod) {
      case 1:
        return <img src={Card_Logo} alt="" className="w-10 h-10" />;
      case 2:
        return <img src={VNpay_Logo} alt="" className="w-10 h-10" />;
      case 3:
        return <img src={MoMo_Logo} alt="" className="w-10 h-10" />;

      default:
        return null;
    }
  };
  const handleDecreaseComboQuantity = (comboId, selectedDishes) => {
    dispatch(decreaseComboQuantity({ comboId, selectedDishes }));
  };
  const handleIncreaseComboQuantity = (comboId, selectedDishes) => {
    dispatch(increaseComboQuantity({ comboId, selectedDishes }));
  };
  const handleRemoveCombo = (comboId, selectedDishes) => {
    dispatch(removeCombo({ comboId, selectedDishes }));
  };
  return (
    <div className="container my-4 p-6 bg-white">
      <Title level={3} className="uppercase text-center mb-6">
        Xác nhận đơn hàng
      </Title>
      <Title level={4} className="text-start mb-4">
        Thông tin giao hàng
      </Title>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="shadow-md rounded-md border border-collapse p-4">
          <InfoItem
            icon={<UserOutlined />}
            label="Họ tên"
            value="Nguyễn Văn A"
          />
          <InfoItem
            icon={<PhoneOutlined />}
            label="Số điện thoại"
            value="0123456789"
          />
          <InfoItem
            icon={<HomeOutlined />}
            label="Địa chỉ"
            value="123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh"
          />
          <InfoItem
            icon={<FileTextOutlined />}
            label="Ghi chú"
            value="Không giao vào buổi sáng"
          />
        </div>

        <div>
          <Title level={4} className="text-start mb-4">
            Ưu đãi và điểm thưởng
          </Title>
          <ActionItem icon={<TagOutlined />} label="Voucher">
            <div className="flex items-center">
              <Text className="mr-2">Giảm 10% hóa đơn</Text>
              <button className="bg-red-800 hover:bg-red-800 text-white px-4 py-1 rounded-md transition duration-300">
                Chọn
              </button>
            </div>
          </ActionItem>
          <ActionItem icon={<StarOutlined />} label="Tích điểm">
            <Switch />
          </ActionItem>
          <ActionItem icon={<DollarOutlined />} label="Sử dụng điểm">
            <Switch />
          </ActionItem>
          <ActionItem icon={<FileTextOutlined />} label="Ghi chú">
            <Input className="w-[25vw]" placeholder="Nhập ghi chú" />
          </ActionItem>
          <div className="flex justify-between items-center my-4">
            <Typography className="text-[#333333] ">
              Chọn phương thức thanh toán:
            </Typography>{" "}
            <div className="flex items-center">
              <span className="mx-2"> {selectedPaymentMethodIcon()}</span>
              <Button
                className="bg-red-800 text-white hover:bg-red-600"
                onClick={handleClickOpen}
              >
                Chọn
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button className="bg-red-900 text-white" onClick={handleClose}>
          Sửa giỏ hàng
        </Button>
      </div>
      <CartSingleTable
        cartItems={cartReservation}
        formatPrice={formatPrice}
        isDisabled={true}
      />
      <CartCombosTable
        cartCombos={cart}
        formatPrice={formatPrice}
        handleDecreaseComboQuantity={handleDecreaseComboQuantity}
        handleIncreaseComboQuantity={handleIncreaseComboQuantity}
        handleRemoveCombo={handleRemoveCombo}
        isDisabled={true}
      />
      <div>
        <Modal open={open} onCancel={handleModalClose} footer={null}>
          <PaymentMethodSelector handleChange={handleChangeMethod} />
          <div className="flex justify-center">
            <Button
              className="bg-red-900 text-white"
              onClick={handleModalClose}
            >
              Xác nhận
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CartSummary;
