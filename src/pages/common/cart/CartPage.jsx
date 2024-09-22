import { useState, useEffect } from "react";
import {
  Table,
  InputNumber,
  Button,
  Input,
  message,
  Typography,
  List,
  Card,
  Space,
  Image,
} from "antd";
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
import { Link, NavLink } from "react-router-dom";
import InfoModal from "../../../components/user/InfoModal.jsx";
import {
  addNewCustomerInfo,
  getCustomerInfoByPhoneNumber,
  updateCustomerInfo,
} from "../../../api/acccountApi.js";
import UserInfo from "../../../components/user/UserInfo.jsx";
import { createOrder } from "../../../api/orderApi.js";
import PaymentMethodSelector from "../../../components/cart/PaymentMethodSelector.jsx";
import { Minus, Plus, Trash2 } from "lucide-react";

const { TextArea } = Input;
const { Text } = Typography;

const MobileCartView = ({ cartItems, formatPrice }) => {
  const dispatch = useDispatch();

  return (
    <List
      dataSource={cartItems}
      renderItem={(item) => (
        <Card key={item.dishSizeDetailId} className="mb-4 shadow-sm">
          <Space direction="vertical" className="w-full">
            <Space align="start" className="w-full">
              <Image
                src={item.dish.image}
                alt={item.dish.name}
                width={80}
                height={80}
                className="object-cover rounded-md"
              />
              <Space direction="vertical">
                <Link to={`/product/${item.dish.dishId}`}>
                  <Text strong>{item.dish.name}</Text>
                </Link>
                <Text type="secondary">
                  Kích cỡ: {item.size?.dishSize?.name}
                </Text>
                <Text type="secondary">
                  Đơn giá: {formatPrice(item.size?.price)}
                </Text>
              </Space>
            </Space>

            <Space className="w-full justify-between mt-4">
              <Space>
                <Button
                  icon={<Minus size={16} />}
                  onClick={() =>
                    dispatch(
                      decreaseQuantity({ dish: item.dish, size: item.size })
                    )
                  }
                  disabled={item.quantity <= 1}
                  className="border-gray-300"
                />
                <InputNumber
                  min={1}
                  max={10}
                  value={item.quantity}
                  className="w-12 text-center"
                  disabled
                />
                <Button
                  icon={<Plus size={16} />}
                  onClick={() =>
                    dispatch(
                      increaseQuantity({ dish: item.dish, size: item.size })
                    )
                  }
                  disabled={item.quantity >= 10}
                  className="border-gray-300"
                />
              </Space>
              <Text strong className="text-red-600">
                {formatPrice(item.size.price * item.quantity)}
              </Text>
            </Space>

            <Button
              type="text"
              danger
              icon={<Trash2 size={16} />}
              onClick={() =>
                dispatch(removeFromCart({ dish: item.dish, size: item.size }))
              }
              className="mt-2"
            >
              Xóa
            </Button>
          </Space>
        </Card>
      )}
    />
  );
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const cartReservation = useSelector((state) => state.cartReservation);
  const [phoneNumber, setPhoneNumber] = useState("");
  const cart = useSelector((state) => state.cart);

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

  const handleChangeMethod = (data) => {
    setSelectedMethod(data);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Giỏ hàng của bạn
      </h1>
      <>
        <div className="hidden lg:block">
          <Table
            columns={columns}
            dataSource={cartItems}
            pagination={false}
            rowKey="dishSizeDetailId"
            className="mb-8 shadow-md rounded-lg overflow-hidden"
          />
        </div>
        <div className="block lg:hidden">
          <MobileCartView
            cartItems={cartItems}
            formatPrice={formatPrice}
            key={`view-cart`}
          />
        </div>
        <div>
          <CartCombosTable
            cartCombos={cart}
            formatPrice={formatPrice}
            handleDecreaseComboQuantity={handleDecreaseComboQuantity}
            handleIncreaseComboQuantity={handleIncreaseComboQuantity}
            handleRemoveCombo={handleRemoveCombo}
          />
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
        </div>
      </>
    </div>
  );
};

export default CartPage;
