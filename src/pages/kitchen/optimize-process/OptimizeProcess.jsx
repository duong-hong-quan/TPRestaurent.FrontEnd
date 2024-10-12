import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Card,
  Table,
  Switch,
  Tag,
  Space,
  Row,
  Col,
  Checkbox,
  Modal,
  Button,
  message,
} from "antd";
import { ClockCircleOutlined, StarFilled } from "@ant-design/icons";
import useCallApi from "../../../api/useCallApi";
import { OrderApi, OrderSessionApi } from "../../../api/endpoint";
import { IconButton } from "@material-tailwind/react";
import { Edit2, Eye, ThermometerSun } from "lucide-react";
import { Tabs, Statistic, Descriptions, Image } from "antd";
import ProductDetail from "../../common/product-detail/ProductDetail";
import { render } from "react-dom";
import { uniqueId } from "lodash";
import DishSizeBages from "../../../components/badge/DishSizeBages";
import { formatDateTime, showError } from "../../../util/Utility";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const OptimizeProcess = () => {
  const orders = Array(8).fill("#351");
  const [mutualOrderDishes, setMutualOrderDishes] = React.useState([]);
  const [singleOrderDishes, setSingleOrderDishes] = React.useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const { callApi, error, loading } = useCallApi();
  const [selectedDish, setSelectedDish] = React.useState(null);
  const fetchData = async () => {
    const result = await callApi(`${OrderSessionApi.GET_GROUPED_DISH}`, "GET");
    if (result.isSuccess) {
      setMutualOrderDishes(result.result?.mutualOrderDishes);
      setSingleOrderDishes(result.result?.singleOrderDishes);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      dataIndex: "id",
      key: "id",
      title: "STT",
      render: (text, record, index) => index + 1,
    },
    {
      title: "MÓN ĂN",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div className="flex items-center">
          <Image
            className="rounded-md "
            src={record.dish?.image}
            alt="Food"
            width={100}
            height={100}
          />
          <p className="mx-2 font-semibold uppercase">{record.dish?.name}</p>
        </div>
      ),
    },
    {
      title: "SỐ LƯỢNG",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, record) => (
        <div>
          {record.total.map((item, index) => (
            <div key={index}>
              {item.quantity} {item.dishSize.vietnameseName}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Xem chi tiết",
      dataIndex: "detail",
      key: "detail",
      render: (_, record) => (
        <div>
          <IconButton
            onClick={() => setSelectedDish(record)}
            className="cursor-pointer bg-white shadow-none  text-black hover:shadow-none hover:bg-white"
          >
            <Eye />
          </IconButton>
        </div>
      ),
    },
  ];
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
      render: (_, record) => selectedDish?.dish?.name,
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
      render: (_, record) => record.quantity.quantity,
      sorter: (a, b) => a.quantity.quantity - b.quantity.quantity,
    },

    {
      title: "Mã bàn",
      dataIndex: ["table", "tableName"],
      key: "dishFromTableOrders",
      render: (text, record) => (
        <Tag className="text-base" color={record.table ? "lime" : "gray"}>
          {record.table ? record.table?.tableName : "N/A"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: ["status"],
      key: "status",
      render: (text, record) => (
        <Tag
          className="text-base break-words text-wrap"
          color={getColor(record.orderDetail.orderDetailStatusId)}
        >
          {record.orderDetail.orderDetailStatusId
            ? record.orderDetail?.orderDetailStatus?.vietnameseName
            : "N/A"}
        </Tag>
      ),
      filters: [
        { text: "Đang chờ", value: 1 },
        { text: "Chưa đọc", value: 2 },
        { text: "Đang xử lý", value: 3 },
        { text: "Sẵn sàng phục vụ", value: 4 },
        { text: "Huỷ", value: 5 },
      ],
      onFilter: (value, record) =>
        record.orderDetail.orderDetailStatusId === value,
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
  const handleUpdateStatus = async () => {
    const response = await callApi(
      `${OrderApi.UPDATE_ORDER_DETAIL_STATUS}?isSuccessful=true`,
      "PUT",
      selectedRows
    );
    if (response.isSuccess) {
      message.success("Cập nhật trạng thái thành công");
      await fetchData();
      setSelectedDish(null);
    } else {
      showError(error);
    }
  };

  return (
    <div className="container">
      <div>
        <Card style={{ marginTop: 16 }}>
          <Title level={3}>THANH PHỤC VỤ</Title>
          <Space wrap>
            {orders.map((order, index) => (
              <Card
                key={index}
                style={{
                  width: "fit-content",
                  background: index % 2 === 0 ? "#f6ffed" : "#f0f2f5",
                }}
              >
                <div className="flex items-center">
                  <img
                    src="https://s3-alpha-sig.figma.com/img/c817/e458/5e24a4313f974e4003568eac783fb722?Expires=1728259200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=FpTXIzyP1-CCLe7~zWawnzhpkM0lVavAiY0kxVqDRxiHZi6zH7ckBAM37xxN2W~TYMoSulOb7WOZa0llcpk0Z08MnNUq96MDBh-esp-lH5-decgVFn5ue1roVC3~DhrUv7Lsvzqlp5jk3Buoghh2HaUj8f4OKVPROzqEdt1-rWar23WcFrkRLdT9dlCRZL0ZoVRpT7pejoaqcpwGD9CUoB-5plyhFYDNWOpv76JXbjxejOOMYeawjY1dXofQWvPBF7L-MrNCwAbdCNnBEW7D3nvYEvxbEL2Lc6BLaiTcsHSTawmdAGKe8oAEP3UsE7i-zf7iThlueurJaAleYOS3-g__"
                    alt="Food"
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 4,
                      marginBottom: 8,
                    }}
                    className="object-cover"
                  />
                  <Text type="success" className="mx-1">
                    {order}
                  </Text>
                </div>
              </Card>
            ))}
          </Space>
        </Card>

        <Text type="danger" style={{ display: "block", margin: "16px 0" }}>
          Note: Sau 3 phút, hệ thống sẽ tự động kiểm tra đơn và tối ưu món liên
          tục trên list.
        </Text>

        <Title level={3}>BẢNG ƯU TIÊN MÓN CẦN CHẾ BIẾN</Title>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="shadow-md rounded-md">
              <h3 className="bg-[#E3B054] text-white px-4 py-6 text-center rounded-lg shadow-lg  uppercase font-bold">
                Món trùng đơn
              </h3>
              <div className=" w-full">
                <Table
                  dataSource={mutualOrderDishes}
                  columns={columns}
                  pagination={false}
                  rowKey={uniqueId()}
                  size="small"
                  loading={loading}
                />
              </div>
            </div>
          </div>
          <div>
            <div className="shadow-md rounded-md">
              <h3 className="bg-[#C40519] text-white px-4 py-6 text-center rounded-lg shadow-lg  uppercase font-bold">
                Món lẻ đơn
              </h3>
              <div className="overflow-x-auto w-full">
                <Table
                  dataSource={singleOrderDishes}
                  columns={columns}
                  pagination={false}
                  rowKey="id"
                  size="small"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
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
                <>
                  <div className="grid">
                    <div className=" container p-10 mx-auto px-4 py-8 max-w-6xl">
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
                                  {selectedDish?.dish?.isAvailable
                                    ? "Có"
                                    : "Không"}
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
                                  {selectedDish?.dish?.isMainItem
                                    ? "Có"
                                    : "Không"}
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
                </>
              ),
            },
            {
              key: "2",
              label: "Đơn đặt",
              children: (
                <div>
                  <Table
                    dataSource={selectedDish?.dishFromTableOrders}
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
    </div>
  );
};

export default OptimizeProcess;
