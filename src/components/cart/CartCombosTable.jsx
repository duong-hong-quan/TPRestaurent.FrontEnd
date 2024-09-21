import React from "react";
import { Table, Image, Button, Typography, Space } from "antd";
import { MinusOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";

const { Text } = Typography;

const CartCombosTable = ({
  cartCombos,
  handleDecreaseComboQuantity,
  handleIncreaseComboQuantity,
  handleRemoveCombo,
  formatPrice,
  isDisabled,
}) => {
  const columns = [
    {
      title: "Combo",
      dataIndex: ["combo", "name"],
      key: "name",
      render: (text, record) => (
        <Space direction="vertical">
          <NavLink to={`/combo/${record.comboId}`}>
            <Text strong>{text}</Text>
          </NavLink>
          <Text type="secondary">{formatPrice(record.price)}</Text>
        </Space>
      ),
    },
    {
      title: "Món",
      dataIndex: "selectedDishes",
      key: "selectedDishes",
      render: (selectedDishes) => (
        <Space direction="vertical">
          {Object.values(selectedDishes)
            .flat()
            .map((dishCombo, index) => (
              <Space key={index} align="start">
                <Image
                  src={dishCombo.dishSizeDetail?.dish?.image}
                  alt={dishCombo.dishSizeDetail?.dish?.name}
                  width={50}
                  height={50}
                  style={{ objectFit: "cover", borderRadius: "50%" }}
                />
                <Text>{dishCombo.dishSizeDetail?.dish?.name}</Text>
              </Space>
            ))}
        </Space>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, record) => (
        <Space>
          {!isDisabled && (
            <Button
              icon={<MinusOutlined />}
              onClick={() =>
                handleDecreaseComboQuantity(
                  record.comboId,
                  record.selectedDishes
                )
              }
            />
          )}
          <Text>{record.quantity}</Text>
          {!isDisabled && (
            <Button
              icon={<PlusOutlined />}
              onClick={() =>
                handleIncreaseComboQuantity(
                  record.comboId,
                  record.selectedDishes
                )
              }
            />
          )}
        </Space>
      ),
    },
    {
      title: "Thành tiền",
      key: "total",
      render: (_, record) => (
        <Text strong className="text-red-700 font-bold">
          {formatPrice(record.combo.price * record.quantity)}
        </Text>
      ),
    },
    !isDisabled && {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() =>
            handleRemoveCombo(record.comboId, record.selectedDishes)
          }
        >
          Xoá
        </Button>
      ),
    },
  ].filter(Boolean);
  return (
    <Table
      dataSource={cartCombos.items}
      columns={columns}
      rowKey="comboId"
      pagination={false}
      bordered
    />
  );
};

export default CartCombosTable;
