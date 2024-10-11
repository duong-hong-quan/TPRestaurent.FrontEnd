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
} from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import useCallApi from "../../../api/useCallApi";
import { OrderSessionApi } from "../../../api/endpoint";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const OptimizeProcess = () => {
  const orders = Array(8).fill("#351");
  const [mutualOrderDishes, setMutualOrderDishes] = React.useState([]);
  const [singleOrderDishes, setSingleOrderDishes] = React.useState([]);
  const { callApi, error, loading } = useCallApi();
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
      render: (_, record) => (
        <div className="flex">
          <div className="ml-4 flex flex-col">
            <Text className="">{record.total}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <ClockCircleOutlined /> {record.cookTime}
            </Text>
          </div>
        </div>
      ),
    },
    { title: "SỐ LƯỢNG", dataIndex: "quantity", key: "quantity" },
    {
      title: "DONE",
      key: "done",
      render: () => <Checkbox size="small" />,
    },
    {
      title: "note",
      key: "note",
      render: () => <span className="text-wrap break-words">Không ớt</span>,
    },
    {
      title: "TRẠNG THÁI",
      key: "status",
      render: () => <Tag color="warning">ĐANG CHẾ BIẾN</Tag>,
    },
  ];

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
              <div className="overflow-x-scroll w-full max-h-[calc(100% - 100px)] overflow-y-scroll">
                <Table
                  // dataSource={mutualOrderDishes}
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
              <div className="overflow-x-auto w-full">
                <Table
                  // dataSource={menuItems}
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
    </div>
  );
};

export default OptimizeProcess;
