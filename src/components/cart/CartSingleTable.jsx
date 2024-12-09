import { useDispatch } from "react-redux";
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  editNote,
} from "../../redux/features/cartReservationSlice";
import { formatPrice } from "../../util/Utility";
import {
  Button,
  Card,
  Image,
  InputNumber,
  List,
  Space,
  Table,
  Typography,
  Input,
} from "antd";
import { Link, NavLink } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import {
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useState } from "react";
const { Text } = Typography;
import styled from "styled-components";

export const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    text-align: center;
    vertical-align: middle;
    border-bottom: none;
  }
  .ant-table-tbody > tr > td {
    text-align: center;
    vertical-align: middle;
    border-bottom: none;
  }
  .ant-space {
    width: 100%;
  }
`;

const MobileCartView = ({ cartItems, formatPrice, isDisabled }) => {
  const dispatch = useDispatch();
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteValue, setNoteValue] = useState("");

  const handleEditNote = (item) => {
    setEditingNoteId(item.dishSizeDetailId);
    setNoteValue(item.note || "");
  };

  const handleSaveNote = (item) => {
    dispatch(editNote({ dish: item.dish, size: item.size, note: noteValue }));
    setEditingNoteId(null);
  };

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
                <Text type="secondary">
                  Gỉam: {(item.size?.discount )}%
                </Text>
                {editingNoteId === item.dishSizeDetailId ? (
                  <Input
                    value={noteValue}
                    onChange={(e) => setNoteValue(e.target.value)}
                    onBlur={() => handleSaveNote(item)}
                    onPressEnter={() => handleSaveNote(item)}
                  />
                ) : (
                  <Text type="secondary">
                    Ghi chú: {item.note}
                    {!isDisabled && (
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEditNote(item)}
                      />
                    )}
                  </Text>
                )}
              </Space>
            </Space>

            <Space className="w-full justify-between mt-4">
              <Space>
                {!isDisabled && (
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
                )}
                <InputNumber
                  min={1}
                  max={10}
                  value={item.quantity}
                  className="w-12 text-center"
                  disabled
                />
                {!isDisabled && (
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
                )}
              </Space>
              <Text strong className="text-red-600">
                {formatPrice(item.size.price * item.quantity*(1- item.size.discount/100))}
              </Text>
            </Space>

            {!isDisabled && (
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
            )}
          </Space>
        </Card>
      )}
    />
  );
};

export const CartSingleTable = ({ cartItems, isDisabled }) => {
  const dispatch = useDispatch();
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteValue, setNoteValue] = useState("");

  const handleEditNote = (record) => {
    setEditingNoteId(record.dishSizeDetailId);
    setNoteValue(record.note || "");
  };

  const handleSaveNote = (record) => {
    dispatch(
      editNote({ dish: record.dish, size: record.size, note: noteValue })
    );
    setEditingNoteId(null);
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
        <Space className="flex justify-center">
          {!isDisabled && (
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
          )}
          <InputNumber
            min={1}
            max={10}
            value={record.quantity}
            className="mx-2 w-14 text-center"
            disabled
          />
          {!isDisabled && (
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
          )}
        </Space>
      ),
    },
    {
      title: "Giảm giá",
      key: "discount",
      render: (_, record) => (
        <span className="text-red-600">
          { record.size.discount}%
        </span>
      ),
    },
    {
      title: "Thành tiền",
      key: "total",
      render: (_, record) => (
        <span className="font-semibold text-red-600">
          {formatPrice(record.size.price * record.quantity * (1- record.size.discount / 100))}
        </span>
      ),
    },
    {
      title: "Ghi chú",
      key: "note",
      render: (_, record) => (
        <div className="flex items-center">
          {editingNoteId === record.dishSizeDetailId ? (
            <Input
              value={noteValue}
              onChange={(e) => setNoteValue(e.target.value)}
              onBlur={() => handleSaveNote(record)}
              onPressEnter={() => handleSaveNote(record)}
            />
          ) : (
            <span>
              {record.note ? record.note : "Không có"}
              {!isDisabled && (
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEditNote(record)}
                />
              )}
            </span>
          )}
        </div>
      ),
    },
    !isDisabled && {
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
  ].filter(Boolean);

  return (
    <div className="py-8">
      <>
        <div className="hidden lg:block">
          <StyledTable
            columns={columns}
            dataSource={cartItems}
            pagination={false}
            rowKey="dishSizeDetailId"
            className="mb-8 shadow-md rounded-lg overflow-hidden no-border-table"
          />
        </div>
        <div className="block lg:hidden">
          <MobileCartView
            cartItems={cartItems}
            formatPrice={formatPrice}
            key={`view-cart`}
            isDisabled={isDisabled}
          />
        </div>
      </>
    </div>
  );
};
