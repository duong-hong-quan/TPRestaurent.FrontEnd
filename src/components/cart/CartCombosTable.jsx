import React from "react";
import {
  Table,
  List,
  Card,
  Image,
  Button,
  Typography,
  Space,
  Divider,
} from "antd";
import { MinusOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";

const { Text } = Typography;
import { Link } from "react-router-dom";

const MobileCartCombosView = ({
  cartCombos,
  handleDecreaseComboQuantity,
  handleIncreaseComboQuantity,
  handleRemoveCombo,
  formatPrice,
  isDisabled,
}) => {
  return (
    <List
      dataSource={cartCombos.items}
      renderItem={(item) => (
        <Card className="mb-4" key={item.comboId}>
          <Space direction="vertical" className="w-full">
            <Link to={`/combo/${item.comboId}`}>
              <Text strong className="text-lg">
                {item.combo.name}
              </Text>
            </Link>

            <Divider className="my-2" />

            <Text strong>Món:</Text>
            {Object.values(item.selectedDishes)
              .flat()
              .map((dishCombo, index) => (
                <Space key={index} align="center" className="w-full">
                  <Image
                    src={dishCombo.dishSizeDetail?.dish?.image}
                    alt={dishCombo.dishSizeDetail?.dish?.name}
                    width={40}
                    height={40}
                    style={{ objectFit: "cover", borderRadius: "50%" }}
                  />
                  <Text>{dishCombo.dishSizeDetail?.dish?.name}</Text>
                </Space>
              ))}

            <Divider className="my-2" />

            <Space className="w-full justify-between">
              <Space>
                <Text>Số lượng:</Text>
                {!isDisabled && (
                  <Button
                    icon={<MinusOutlined size={16} />}
                    onClick={() =>
                      handleDecreaseComboQuantity(
                        item.comboId,
                        item.selectedDishes
                      )
                    }
                    size="small"
                  />
                )}
                <Text>{item.quantity}</Text>
                {!isDisabled && (
                  <Button
                    icon={<PlusOutlined size={16} />}
                    onClick={() =>
                      handleIncreaseComboQuantity(
                        item.comboId,
                        item.selectedDishes
                      )
                    }
                    size="small"
                  />
                )}
              </Space>
              <Text strong className="text-red-700">
                {formatPrice(item.combo.price * item.quantity)}
              </Text>
            </Space>

            {!isDisabled && (
              <Button
                danger
                icon={<DeleteOutlined size={16} />}
                onClick={() =>
                  handleRemoveCombo(item.comboId, item.selectedDishes)
                }
                className="mt-2"
              >
                Xoá
              </Button>
            )}
          </Space>
        </Card>
      )}
    />
  );
};

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
        <NavLink to={`/combo/${record.comboId}`}>
          <Text strong>{text}</Text>
        </NavLink>
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
    <div>
      <div className="hidden lg:block">
        <Table
          dataSource={cartCombos.items}
          columns={columns}
          rowKey="comboId"
          pagination={false}
          className="mb-8 bg-white shadow-md rounded-lg overflow-hidden"
        />
      </div>
      <div className="block lg:hidden">
        <MobileCartCombosView
          cartCombos={cartCombos}
          formatPrice={formatPrice}
          handleDecreaseComboQuantity={handleDecreaseComboQuantity}
          handleIncreaseComboQuantity={handleIncreaseComboQuantity}
          handleRemoveCombo={handleRemoveCombo}
          isDisabled={isDisabled}
        />
      </div>
    </div>
  );
};

export default CartCombosTable;
