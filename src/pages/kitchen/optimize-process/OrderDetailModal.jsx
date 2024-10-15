import React from "react";
import {
  Modal,
  Table,
  Button,
  Tabs,
  Card,
  Statistic,
  Descriptions,
  Image,
  Tag,
  Row,
  Col,
  Checkbox,
} from "antd";
import { uniqueId } from "lodash";
import DishSizeBages from "../../../components/badge/DishSizeBages";
import { formatDateTime } from "../../../util/Utility";

const OrderDetailModal = ({
  selectedDish,
  filterMutualOrderDishes,
  selectedRows,
  setSelectedRows,
  handleUpdateStatus,
  loading,
  setSelectedDish,
}) => {
  const sizeStats = selectedDish?.total?.reduce((acc, curr) => {
    acc[curr.dishSize.name] = curr.quantity;
    return acc;
  }, {});

  const handleCheckboxChange = (e, record) => {
    if (e.target.checked) {
      setSelectedRows([...selectedRows, record.orderDetail?.orderDetailId]);
    } else {
      setSelectedRows(
        selectedRows.filter((key) => key !== record.orderDetail?.orderDetailId)
      );
    }
  };

  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      const allKeys = selectedDish.dishFromTableOrders?.map(
        (record) => record.orderDetail?.orderDetailId
      );
      setSelectedRows(allKeys);
    } else {
      setSelectedRows([]);
    }
  };

  const getColor = (status) => {
    switch (status) {
      case 1:
        return "yellow";
      case 2:
        return "blue";
      case 3:
        return "orange";
      case 4:
        return "green";
      case 5:
        return "gray";
      default:
        return "gray";
    }
  };

  const orderColumns = [
    {
      title: (
        <Checkbox
          type="checkbox"
          checked={
            selectedRows.length === selectedDish?.dishFromTableOrders?.length
          }
          onChange={handleSelectAllChange}
        />
      ),
      dataIndex: "select",
      key: "select",
      render: (_, record) => (
        <Checkbox
          type="checkbox"
          checked={selectedRows.includes(record.orderDetail?.orderDetailId)}
          onChange={(e) => handleCheckboxChange(e, record)}
        />
      ),
    },
    {
      title: "Món",
      dataIndex: ["dish", "name"],
      key: "dish",
      render: () => (
        <span className="text-lg"> {selectedDish?.dish?.name}</span>
      ),
    },
    {
      title: "Size",
      dataIndex: ["quantity", "dishSize", "vietnameseName"],
      key: "size",
      render: (_, record) => (
        <DishSizeBages dishSize={record?.quantity?.dishSize} />
      ),
      filters: [
        { text: "Nhỏ", value: "Nhỏ" },
        { text: "Vừa", value: "Vừa" },
        { text: "Lớn", value: "Lớn" },
      ],
      onFilter: (value, record) =>
        record.quantity.dishSize.vietnameseName === value,
    },
    {
      title: "Số lượng",
      dataIndex: ["quantity", "quantity"],
      key: "quantity",
      render: (_, record) => (
        <span className="text-lg">{record.quantity.quantity}</span>
      ),
      sorter: (a, b) => a.quantity.quantity - b.quantity.quantity,
    },
    {
      title: "Mã bàn",
      dataIndex: ["table", "tableName"],
      key: "dishFromTableOrders",
      render: (_, record) => (
        <Tag className="text-lg" color={record.table ? "lime" : "gray"}>
          {record.table ? record.table?.tableName : "N/A"}
        </Tag>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: ["note"],
      key: "note",
      render: (_, record) => (
        <span className=" text-lg text-wrap">{record.orderDetail.note}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: ["status"],
      key: "status",
      render: (_, record) => (
        <Tag
          className="text-base break-words text-wrap"
          color={getColor(record.orderDetail.orderDetailStatusId)}
        >
          {record.orderDetail.orderDetailStatusId
            ? record.orderDetail?.orderDetailStatus?.vietnameseName
            : "N/A"}
        </Tag>
      ),
    },
    {
      title: " Loại đơn",
      dataIndex: "orderType",
      key: "orderType",
      render: (_, record) => (
        <Tag
          color={record?.order.orderTypeId === 3 ? "red" : "blue"}
          className="break-words text-wrap"
        >
          {record.order?.orderType?.vietnameseName}
        </Tag>
      ),
      filters: [
        { text: "Đơn đặt trước", value: 1 },
        { text: "Đơn giao", value: 2 },
        { text: "Đơn tại quán", value: 3 },
      ],
      onFilter: (value, record) => record.order?.orderTypeId === value,
    },
    {
      title: "Đặt lúc",
      dataIndex: ["order", "orderDate"],
      key: "orderDate",
      render: (_, record) => {
        if (record.order.orderTypeId === 1) {
          return formatDateTime(record.order.reservationDate);
        } else if (record.order.orderTypeId === 2) {
          return formatDateTime(record.order.orderDate);
        } else {
          return formatDateTime(record.order.mealTime);
        }
      },
      sorter: (a, b) =>
        new Date(a.order.orderDate) - new Date(b.order.orderDate),
    },
  ];

  return (
    <Modal
      width={1300}
      open={selectedDish}
      onCancel={() => setSelectedDish(null)}
      footer={null}
    >
      <Tabs
        items={[
          {
            key: "1",
            label: "Thông tin món ăn",
            children: (
              <div className="grid">
                <div className="container p-10 mx-auto px-4 py-8 max-w-6xl">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    <div>
                      <Image src={selectedDish?.dish?.image} />
                    </div>
                    <div className="space-y-8">
                      <div className="flex">
                        <h1 className="text-2xl font-bold text-red-800 uppercase text-center">
                          {selectedDish?.dish.name}
                        </h1>
                      </div>
                      <Card>
                        <Descriptions column={1}>
                          <Descriptions.Item label="Mô tả">
                            {selectedDish?.dish?.description}
                          </Descriptions.Item>
                          <Descriptions.Item label="Sẵn có">
                            <Tag
                              color={
                                selectedDish?.dish?.isAvailable
                                  ? "success"
                                  : "error"
                              }
                            >
                              {selectedDish?.dish?.isAvailable ? "Có" : "Không"}
                            </Tag>
                          </Descriptions.Item>
                          <Descriptions.Item label="Món chính">
                            <Tag
                              color={
                                selectedDish?.dish?.isMainItem
                                  ? "blue"
                                  : "default"
                              }
                            >
                              {selectedDish?.dish?.isMainItem ? "Có" : "Không"}
                            </Tag>
                          </Descriptions.Item>
                        </Descriptions>
                      </Card>
                      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                        <Col span={8}>
                          <Card>
                            <Statistic
                              title="Size nhỏ"
                              value={sizeStats?.SMALL || 0}
                            />
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card>
                            <Statistic
                              title="Size vừa"
                              value={sizeStats?.MEDIUM || 0}
                            />
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card>
                            <Statistic
                              title="Size lớn"
                              value={sizeStats?.LARGE || 0}
                            />
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </div>
            ),
          },
          {
            key: "2",
            label: "Đơn đặt",
            children: (
              <div>
                <Table
                  dataSource={selectedDish?.uncheckedDishFromTableOrders}
                  columns={orderColumns}
                  rowKey={uniqueId()}
                  scroll={{ x: 800, y: 600 }}
                  pagination={false}
                />
                {selectedRows.length > 0 && (
                  <div className="flex justify-center">
                    <Button
                      onClick={handleUpdateStatus}
                      className="text-center bg-red-800 text-white"
                      loading={loading}
                    >
                      Cập nhật trạng thái
                    </Button>
                  </div>
                )}
              </div>
            ),
          },
        ]}
      />
    </Modal>
  );
};

export default OrderDetailModal;
