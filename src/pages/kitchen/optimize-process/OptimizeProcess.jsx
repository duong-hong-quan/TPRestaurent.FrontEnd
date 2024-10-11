import React, { useEffect } from "react";
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
} from "antd";
import { ClockCircleOutlined, StarFilled } from "@ant-design/icons";
import useCallApi from "../../../api/useCallApi";
import { OrderSessionApi } from "../../../api/endpoint";
import { IconButton } from "@material-tailwind/react";
import { Edit2, Eye, ThermometerSun } from "lucide-react";
import { Tabs, Statistic, Descriptions, Image } from "antd";
import ProductDetail from "../../common/product-detail/ProductDetail";
import { render } from "react-dom";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const OptimizeProcess = () => {
  const orders = Array(8).fill("#351");
  const [mutualOrderDishes, setMutualOrderDishes] = React.useState([]);
  const [singleOrderDishes, setSingleOrderDishes] = React.useState([]);
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
      title: "MÓN ĂN",
      dataIndex: "name",
      key: "name",
      render: (_, record) => <span>{record.dish?.name}</span>,
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
          <IconButton onClick={() => setSelectedDish(record)}>
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

  const orderColumns = [
    {
      title: "Phiên gọi món",
      dataIndex: ["orderSession", "orderSessionNumber"],
      key: "orderNumber",
      sorter: (a, b) =>
        a.orderSession.orderSessionNumber - b.orderSession.orderSessionNumber,
    },
    {
      title: "Size",
      dataIndex: ["quantity", "dishSize", "vietnameseName"],
      key: "size",
      render: (text) => <Tag>{text}</Tag>,
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
      sorter: (a, b) => a.quantity.quantity - b.quantity.quantity,
    },
    {
      title: "Trạng thái",
      dataIndex: ["order", "status", "vietnameseName"],
      key: "status",
      render: (text, record) => {
        const statusColors = {
          "Đang Dùng Bữa": "processing",
          "Đã Huỷ": "error",
          "Chờ Xử Lý": "warning",
          "Thành Công": "success",
          "Sẳn sàng để giao": "default",
        };
        return (
          <Tag color={statusColors[text]}>
            {record.order?.status?.vietnameseName}
          </Tag>
        );
      },
      filters: [
        { text: "Đang Dùng Bữa", value: "Đang Dùng Bữa" },
        { text: "Đã Huỷ", value: "Đã Huỷ" },
        { text: "Chờ Xử Lý", value: "Chờ Xử Lý" },
        { text: "Thành Công", value: "Thành Công" },
        { text: "Sẳn sàng để giao", value: "Sẳn sàng để giao" },
      ],
      onFilter: (value, record) =>
        record.order.status?.vietnameseName === value,
    },
    {
      title: "Đặt lúc",
      dataIndex: ["order", "orderDate"],
      key: "orderDate",
      render: (text) =>
        text !== "0001-01-01T00:00:00" ? new Date(text).toLocaleString() : "-",
      sorter: (a, b) =>
        new Date(a.order.orderDate) - new Date(b.order.orderDate),
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <IconButton onClick={() => console.log(record)}>
          <Edit2 />
        </IconButton>
      ),
    },
  ];
  console.log(selectedDish);
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
            <div>
              <h3 className="bg-[#E3B054] text-white px-4 py-2 text-center rounded-lg shadow-lg  uppercase font-bold">
                Món trùng đơn
              </h3>
              <div className="overflow-x-scroll w-full">
                <Table
                  dataSource={mutualOrderDishes}
                  columns={columns}
                  pagination={false}
                  rowKey="id"
                  size="small"
                />
              </div>
            </div>
          </div>
          <div>
            <div>
              <h3 className="bg-[#C40519] text-white px-4 py-2 text-center rounded-lg shadow-lg  uppercase font-bold">
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
        width={1000}
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
                                    ? "Yes"
                                    : "No"}
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
                                  {selectedDish?.dish?.isMainItem ? "v" : "x"}
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
                <Table
                  dataSource={selectedDish?.dishFromTableOrders}
                  columns={orderColumns}
                  rowKey={(record) =>
                    `${record.orderSession.orderSessionId}-${record.quantity.dishSize.id}`
                  }
                  scroll={{ x: 800, y: 600 }}
                  pagination={false}
                />
              ),
            },
          ]}
        />
      </Modal>
    </div>
  );
};

export default OptimizeProcess;
