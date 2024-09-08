import { useState, useEffect } from "react";
import { Table, InputNumber, Button, Input, message, Typography } from "antd";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  formatPrice,
  isEmptyObject,
  mergeCartData,
} from "../../../util/Utility";
import {
  decreaseQuantity,
  getTotal,
  increaseQuantity,
  removeFromCart,
} from "../../../redux/features/cartReservationSlice";
import {
  removeCombo,
  increaseComboQuantity,
  decreaseComboQuantity,
} from "../../../redux/features/cartSlice";
import CartCombosTable from "../../../components/cart/CartCombosTable";
import { NavLink } from "react-router-dom";
import InfoModal from "../../../components/user/InfoModal.jsx";
import {
  addNewCustomerInfo,
  getCustomerInfoByPhoneNumber,
  updateCustomerInfo,
} from "../../../api/acccountApi.js";
import UserInfo from "../../../components/user/UserInfo.jsx";
import { createOrder } from "../../../api/orderApi.js";
import PaymentMethodSelector from "../../../components/cart/PaymentMethodSelector.jsx";

const { TextArea } = Input;

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const cartReservation = useSelector((state) => state.cartReservation);
  const [phoneNumber, setPhoneNumber] = useState("");
  const cart = useSelector((state) => state.cart);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [note, setNote] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [initialData, setInitialData] = useState({});
  const [selectedMethod, setSelectedMethod] = useState(1);
  const handleOpenModal = (data = null) => {
    setIsUpdate(!!data);
    setInitialData(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (formData) => {
    // Handle form submission (create or update) here
    console.log(formData);
    if (isUpdate) {
      const data = await updateCustomerInfo(formData);
      if (data?.isSuccess) {
        await handlePhone(formData.phoneNumber);
        message.success("Cập nhật thông tin thành công!");
      } else {
        message.error("Cập nhật thông tin thất bại!");
      }
    } else {
      const data = await addNewCustomerInfo(formData);
      if (data?.isSuccess) {
        message.success("Thêm mới thông tin thành công!");
      } else {
        message.success("Thêm mới thông tin thất bại!");
      }
    }
  };
  const dispatch = useDispatch();
  useEffect(() => {
    setCartItems(cartReservation);
  }, [cartReservation]);
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
          <Button
            icon={<MinusOutlined />}
            onClick={() =>
              dispatch(
                decreaseQuantity({ dish: record.dish, size: record.size })
              )
            }
            disabled={record.quantity <= 1}
            className="border-gray-300"
          />
          <InputNumber
            min={1}
            max={10}
            value={record.quantity}
            className="mx-2 w-14 text-center"
            disabled
          />
          <Button
            icon={<PlusOutlined />}
            onClick={() =>
              dispatch(
                increaseQuantity({ dish: record.dish, size: record.size })
              )
            }
            disabled={record.quantity >= 10}
            className="border-gray-300"
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
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() =>
            dispatch(removeFromCart({ dish: record.dish, size: record.size }))
          }
        >
          Xóa
        </Button>
      ),
    },
  ];

  const handleApplyCoupon = () => {
    if (coupon === "DISCOUNT10") {
      setDiscount(10);
      message.success("Mã giảm giá đã được áp dụng!");
    } else {
      setDiscount(0);
      message.error("Mã giảm giá không hợp lệ!");
    }
  };

  const cartTotal = useSelector(getTotal);

  const handleDecreaseComboQuantity = (comboId, selectedDishes) => {
    dispatch(decreaseComboQuantity({ comboId, selectedDishes }));
  };
  const handleIncreaseComboQuantity = (comboId, selectedDishes) => {
    dispatch(increaseComboQuantity({ comboId, selectedDishes }));
  };
  const handleRemoveCombo = (comboId, selectedDishes) => {
    dispatch(removeCombo({ comboId, selectedDishes }));
  };
  const handlePhone = async () => {
    const data = await getCustomerInfoByPhoneNumber(phoneNumber);
    if (data?.isSuccess) {
      if (data.result) {
        setIsUpdate(true);
        window.scrollTo(0, 0);
        setInitialData(data.result);
      }
    } else {
      setIsUpdate(false);
      setIsModalOpen(true);
    }
  };
  const handleChangeMethod = (data) => {
    setSelectedMethod(data);
  };
  const checkOut = async () => {
    // console.log(mergeCartData(cartReservation, cart));
    if (phoneNumber === "" || phoneNumber === null) {
      message.error("Vui lòng nhập số điện thoại");
    }
    const data = {
      customerId: initialData?.customerInfo?.customerId,
      paymentMethodId: selectedMethod,
      reservationId: null,
      couponId: null,
      note: null,
      isDelivering: true,
      orderDetailsDtos: mergeCartData(cartReservation, cart)
        .reservationDishDtos,
      loyalPointsToUse: 0,
      tableId: null,
    };
    console.log(data);
    const response = await createOrder(data);
    if (response?.isSuccess) {
      message.success(
        "Đặt hàng thành công! Chúng tôi đang tiến hành chuyển đến cổng thanh toán"
      );
      window.location.href = response?.result?.paymentLink;
      // const responsePayment = await createPayment({
      //   orderId: response.result?.order?.orderId,
      //   paymentMethodId: selectedMethod,
      // });
      // if (responsePayment?.isSuccess) {
      //   console.log(responsePayment);
      //   //     dispatch(clearCart());
      //   //    dispatch(clearCartReservation());
      // }

      // window.location.href = "/";
      console.log(response);
    } else {
      response.messages.forEach((item) => {
        message.error(item);
      });
    }
  };
  console.log(cartItems.length);
  return (
    <div className="container mx-auto px-4 py-8">
      {!isEmptyObject(initialData) && (
        <>
          <UserInfo
            userData={initialData.customerInfo}
            handleOpenUpdate={() => setIsModalOpen(true)}
          />
        </>
      )}
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Giỏ hàng của bạn
      </h1>
      <>
        <Table
          columns={columns}
          dataSource={cartItems}
          pagination={false}
          rowKey="dishSizeDetailId"
          className="mb-8 shadow-md rounded-lg overflow-hidden"
        />

        <div>
          <h4 className="text-center font-bold text-2xl my-10">Combo</h4>
          <CartCombosTable
            cartCombos={cart}
            formatPrice={formatPrice}
            handleDecreaseComboQuantity={handleDecreaseComboQuantity}
            handleIncreaseComboQuantity={handleIncreaseComboQuantity}
            handleRemoveCombo={handleRemoveCombo}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Số điện thoại</h2>

            <div className="flex items-center">
              <Input
                prefix={"+84"}
                placeholder="Nhập số điện thoại"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mr-2 flex-grow"
              />
              <Button
                type="primary"
                className="bg-red-700 hover:bg-red-600"
                onClick={handlePhone}
              >
                Xác nhận
              </Button>
            </div>
            <PaymentMethodSelector handleChange={handleChangeMethod} />

            <h2 className="mt-4 text-xl font-semibold mb-4">Mã giảm giá</h2>
            <div className="flex items-center">
              <Input
                placeholder="Nhập mã giảm giá"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="mr-2 flex-grow"
              />
              <Button
                onClick={handleApplyCoupon}
                type="primary"
                className="bg-red-700 hover:bg-red-600"
              >
                Áp dụng
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Ghi chú</h2>
            <TextArea
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhập ghi chú cho đơn hàng của bạn"
            />
          </div>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg">Tạm tính:</span>
            <Typography
              variant="h2"
              className="font-bold text-red-700 text-center"
            >
              {formatPrice(cartTotal + cart.total)}
            </Typography>{" "}
          </div>
          {discount > 0 && (
            <div className="flex justify-between items-center mb-4 text-green-600">
              <span className="text-lg">Giảm giá ({discount}%):</span>
              <span className="text-lg font-medium">
                -{((subtotal * discount) / 100).toLocaleString("vi-VN")}đ
              </span>
            </div>
          )}
          <div className="flex justify-between items-center text-xl font-bold text-red-600">
            <span>Tổng cộng:</span>
            <span></span>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-red-800 hover:bg-red-400 text-lg h-12 px-8 mt-4 text-white "
            onClick={checkOut}
          >
            Đặt ngay
          </button>
        </div>
      </>
      <InfoModal
        initialData={initialData}
        isOpen={isModalOpen}
        isUpdate={isUpdate}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CartPage;
