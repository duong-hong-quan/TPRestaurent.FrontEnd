import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody } from "@material-tailwind/react";
import { formatPrice, showError } from "../../../util/Utility";
import ReservationInformation from "../ReservationInformation";
import { Button, InputNumber, message, Modal, Table, Typography } from "antd";
import PaymentMethodSelector from "../../cart/PaymentMethodSelector";
import { useState } from "react";
import useCallApi from "../../../api/useCallApi";
import LoadingOverlay from "../../loading/LoadingOverlay";
import { OrderApi } from "../../../api/endpoint";
import { NavLink, useNavigate } from "react-router-dom";
import {
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "../../../redux/features/cartReservationSlice";
import {
  clearCartReservation,
  decreaseComboQuantity,
  increaseComboQuantity,
  removeCombo,
} from "../../../redux/features/cartSlice";
import Card_Logo from "../../../assets/imgs/payment-icon/Cash_Logo.png";
import MoMo_Logo from "../../../assets/imgs/payment-icon/MoMo_Logo.png";
import VNpay_Logo from "../../../assets/imgs/payment-icon/VNpay_Logo.png";
import CartCombosTable from "../../cart/CartCombosTable";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
const OrderSummary = ({ back, data, information }) => {
  const cartReservation = useSelector((state) => state.cartReservation);
  const cartCombos = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [selectedMethod, setSelectedMethod] = useState(2);
  const { callApi, error, loading } = useCallApi();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeMethod = (data) => {
    setSelectedMethod(data);
    handleClose();
  };

  const handleCheckOut = async () => {
    const updatedData = {
      ...data,
      reservationOrder: {
        ...data.reservationOrder,
        paymentMethod: selectedMethod,
      },
    };
    const response = await callApi(
      `${OrderApi.CREATE_ORDER}`,
      "POST",
      updatedData
    );
    if (response.isSuccess) {
      message.success(`Đặt thành công`);
      dispatch(clearCart());
      dispatch(clearCartReservation());
      if (selectedMethod === 3 || selectedMethod === 2) {
        if (response.result.paymentLink) {
          window.location.href = response.result.paymentLink;
          return;
        }
      }

      navigate(`/order-history?phoneNumber=${information.phoneNumber}`);
    } else {
      showError(error);
    }
  };

  if (loading) {
    return <LoadingOverlay isLoading={loading} />;
  }
  console.log("aa", selectedMethod);
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
  const columns = [
    {
      title: "Sản phẩm",
      key: "product",
      render: (_, record) => (
        <div className="flex items-center">
          <img
            src={record.dish.image}
            alt={record.dish.name}
            width={60}
            height={60}
            className="object-cover rounded-md mr-4"
          />
          <NavLink to={`/product/${record.dish.dishId}`}>
            <span className="font-medium">{record.dish.name}</span>
          </NavLink>
        </div>
      ),
    },
    {
      title: "Kích cỡ",
      dataIndex: "size",
      key: "size",
      render: (_, record) => <span>{record.size?.dishSize?.name}</span>,
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (_, record) => (
        <span className="text-gray-600">{formatPrice(record.size?.price)}</span>
      ),
    },
    {
      title: "Số lượng",
      key: "quantity",
      render: (_, record) => (
        <div className="flex items-center">
          <InputNumber
            min={1}
            max={10}
            value={record.quantity}
            className="mx-2 w-14 text-center"
            disabled
          />
        </div>
      ),
    },
    {
      title: "Thành tiền",
      key: "total",
      render: (_, record) => (
        <span className="font-semibold text-red-600">
          {formatPrice(record.size.price * record.quantity)}
        </span>
      ),
    },
  ];
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
    <div className="h-[75vh] overflow-y-scroll">
      <Typography className="text-xl text-[#333333] text-center font-bold my-2">
        KIỂM TRA THÔNG TIN ĐẶT BÀN VÀ TIẾN HÀNH ĐẶT CỌC
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 ">
        <div>
          <ReservationInformation reservation={information} />
        </div>
        <Card className="w-full max-w-md mx-auto shadow-none border-none">
          <CardBody>
            <Typography className="text-xl font-bold">
              Thông tin đặt cọc
            </Typography>
            <div className="flex justify-between my-4">
              <Typography className="text-[#333333] ">
                Số tiền đặt cọc:
              </Typography>{" "}
              <Typography className="text-base">
                {formatPrice(data.reservationOrder.deposit)}
              </Typography>
            </div>
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
            <div className="flex justify-between items-center my-4">
              <Typography className="text-[#333333] ">Hạn đặt cọc:</Typography>
              <Typography className="text-base"></Typography>
            </div>
            <p>
              Số tiền đặt cọc sẽ được trừ vào bill thanh toán sau khi dùng bữa
              tại nhà hàng!
            </p>
          </CardBody>
        </Card>
      </div>
      <div className="px-10">
        <div className="flex justify-end">
          <Button
            className="bg-red-800 my-2 text-white hover:bg-red-600"
            onClick={back}
          >
            Sửa đặt món
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={cartReservation}
          pagination={false}
          rowKey="dishSizeDetailId"
          className="mb-8 shadow-md rounded-lg overflow-hidden"
        />
        <CartCombosTable
          cartCombos={cartCombos}
          formatPrice={formatPrice}
          handleDecreaseComboQuantity={handleDecreaseComboQuantity}
          handleIncreaseComboQuantity={handleIncreaseComboQuantity}
          handleRemoveCombo={handleRemoveCombo}
          isDisabled={true}
        />
        <div className="flex justify-center w-full mt-10">
          <Button
            className="bg-red-800 my-2 text-white hover:bg-red-600"
            onClick={handleCheckOut}
          >
            Tiến hành thanh toán
          </Button>
        </div>
      </div>
      <div>
        <Modal
          open={open}
          onCancel={handleClose}
          footer={[
            <Button key="cancel" onClick={handleClose}>
              Cancel
            </Button>,
          ]}
        >
          <PaymentMethodSelector handleChange={handleChangeMethod} />
        </Modal>
      </div>
    </div>
  );
};

export default OrderSummary;
