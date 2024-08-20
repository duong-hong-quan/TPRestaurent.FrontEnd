import React, { useState, useEffect } from "react";
import {
  Table,
  InputNumber,
  Button,
  Empty,
  Input,
  message,
  Typography,
} from "antd";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { formatPrice } from "../../../util/Utility";
import {
  decreaseQuantity,
  getTotal,
  increaseQuantity,
  removeFromCart,
} from "../../../redux/features/cartReservationSlice";
import {
  addCombo,
  removeCombo,
  increaseComboQuantity,
  decreaseComboQuantity,
} from "../../../redux/features/cartSlice";
import CartCombosTable from "../../../components/cart/CartCombosTable";
import { NavLink } from "react-router-dom";

const { TextArea } = Input;

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const cartReservation = useSelector((state) => state.cartReservation);
  const cart = useSelector((state) => state.cart);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [note, setNote] = useState("");
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
      render: (_, record) => <span>{record.size.dishSize.name}</span>,
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (_, record) => (
        <span className="text-gray-600">{formatPrice(record.size.price)}</span>
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
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Giỏ hàng của bạn
      </h1>
      {cartItems.length > 0 ? (
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
              <h2 className="text-xl font-semibold mb-4">Mã giảm giá</h2>
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
          <div className="flex justify-end mt-8">
            <Button
              type="primary"
              size="large"
              className="bg-red-700 hover:bg-red-600 text-lg h-12 px-8"
            >
              Đặt ngay
            </Button>
          </div>
        </>
      ) : (
        <Empty
          description={
            <span className="text-gray-600">Giỗ hàng của bạn đang trống</span>
          }
        >
          <Button type="primary" className="bg-blue-500 hover:bg-blue-600">
            Tiếp tục mua sắm
          </Button>
        </Empty>
      )}
    </div>
  );
};

export default CartPage;
