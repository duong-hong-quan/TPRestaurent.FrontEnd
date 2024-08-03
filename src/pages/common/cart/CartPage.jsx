import React, { useState } from "react";
import { Table, InputNumber, Button, Empty, Input, message, Image } from "antd";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Phở Bò",
      price: 65000,
      quantity: 2,
      image:
        "https://s3-alpha-sig.figma.com/img/62f9/82bc/377a67314fcee620f0c8791bf2c0b7f2?Expires=1723420800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=DfbUwQo1s9YMArTXLgR9LxPMiEAHWlOLc5KWg2Ktoqtvg8Q8LGJECW6lj~GSwNKHKRhDBjRfyTxcHeaBjKLIkomAY17MXuGlzH4nB1QO6YBlFTuNQDvEiqe1qtjBDY6HSkcmP2KkxiSYrGRq-LQoMIBt5T5i1IxyCQCgjeKGJHT~-MzNdB25H-LHwbxW4JcMRDzes4EGou0LeSN~fgz1oufcDXduzZg4dzbYDqyVH1ABCDdnDmucPgYrZCrXPun~ff7zfI3RtHtPG23VZXhMwXm~pZsJCgve1gqbMV3p5ZlIcWkS9c9P1JX0R~RMLt4FsVj0D66VEtQv3LFZoJ7~yg__",
    },
    {
      id: 2,
      name: "Bánh Mì Thịt",
      price: 25000,
      quantity: 1,
      image:
        "https://s3-alpha-sig.figma.com/img/62f9/82bc/377a67314fcee620f0c8791bf2c0b7f2?Expires=1723420800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=DfbUwQo1s9YMArTXLgR9LxPMiEAHWlOLc5KWg2Ktoqtvg8Q8LGJECW6lj~GSwNKHKRhDBjRfyTxcHeaBjKLIkomAY17MXuGlzH4nB1QO6YBlFTuNQDvEiqe1qtjBDY6HSkcmP2KkxiSYrGRq-LQoMIBt5T5i1IxyCQCgjeKGJHT~-MzNdB25H-LHwbxW4JcMRDzes4EGou0LeSN~fgz1oufcDXduzZg4dzbYDqyVH1ABCDdnDmucPgYrZCrXPun~ff7zfI3RtHtPG23VZXhMwXm~pZsJCgve1gqbMV3p5ZlIcWkS9c9P1JX0R~RMLt4FsVj0D66VEtQv3LFZoJ7~yg__",
    },
    {
      id: 3,
      name: "Cà Phê Sữa Đá",
      price: 30000,
      quantity: 2,
      image:
        "https://s3-alpha-sig.figma.com/img/62f9/82bc/377a67314fcee620f0c8791bf2c0b7f2?Expires=1723420800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=DfbUwQo1s9YMArTXLgR9LxPMiEAHWlOLc5KWg2Ktoqtvg8Q8LGJECW6lj~GSwNKHKRhDBjRfyTxcHeaBjKLIkomAY17MXuGlzH4nB1QO6YBlFTuNQDvEiqe1qtjBDY6HSkcmP2KkxiSYrGRq-LQoMIBt5T5i1IxyCQCgjeKGJHT~-MzNdB25H-LHwbxW4JcMRDzes4EGou0LeSN~fgz1oufcDXduzZg4dzbYDqyVH1ABCDdnDmucPgYrZCrXPun~ff7zfI3RtHtPG23VZXhMwXm~pZsJCgve1gqbMV3p5ZlIcWkS9c9P1JX0R~RMLt4FsVj0D66VEtQv3LFZoJ7~yg__",
    },
  ]);

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [note, setNote] = useState("");

  const columns = [
    {
      title: "Sản phẩm",
      key: "product",
      render: (_, record) => (
        <div className="flex items-center">
          <img
            src={record.image}
            alt={record.name}
            width={60}
            height={60}
            className="object-cover rounded-md mr-4 "
          />
          <span className="font-medium">{record.name}</span>
        </div>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <span className="text-gray-600">{price.toLocaleString("vi-VN")}đ</span>
      ),
    },
    {
      title: "Số lượng",
      key: "quantity",
      render: (_, record) => (
        <div className="flex items-center">
          <Button
            icon={<MinusOutlined />}
            onClick={() => handleQuantityChange(record.id, record.quantity - 1)}
            disabled={record.quantity <= 1}
            className="border-gray-300"
          />
          <InputNumber
            min={1}
            max={10}
            value={record.quantity}
            onChange={(value) => handleQuantityChange(record.id, value)}
            className="mx-2 w-14 text-center"
          />
          <Button
            icon={<PlusOutlined />}
            onClick={() => handleQuantityChange(record.id, record.quantity + 1)}
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
          {(record.price * record.quantity).toLocaleString("vi-VN")}đ
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
          onClick={() => handleRemoveItem(record.id)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  // ... (keep the existing handleQuantityChange, handleRemoveItem, and handleApplyCoupon functions)

  const handleQuantityChange = (id, value) => {
    console.log(`Changed quantity of item ${id} to ${value}`);
    // Implement logic to update quantity
  };

  const handleRemoveItem = (id) => {
    console.log(`Removed item ${id} from cart`);
    // Implement logic to remove item
  };

  const handleApplyCoupon = () => {
    // This is a mock function. In a real application, you'd validate the coupon with your backend.
    if (coupon === "DISCOUNT10") {
      setDiscount(10);
      message.success("Mã giảm giá đã được áp dụng!");
    } else {
      setDiscount(0);
      message.error("Mã giảm giá không hợp lệ!");
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const totalAmount = subtotal * (1 - discount / 100);

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
            rowKey="id"
            className="mb-8 shadow-md rounded-lg overflow-hidden"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
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
              <span className="text-lg font-medium">
                {subtotal.toLocaleString("vi-VN")}đ
              </span>
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
              <span>{totalAmount.toLocaleString("vi-VN")}đ</span>
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
            <span className="text-gray-600">Giỏ hàng của bạn đang trống</span>
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
