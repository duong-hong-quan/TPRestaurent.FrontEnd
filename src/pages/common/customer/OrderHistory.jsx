import { useEffect, useState } from "react";
import {
  Button,
  Table,
  Typography,
  Card,
  message,
  Input,
  Select,
  Tag,
  Tabs,
  Space,
} from "antd";
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { formatPrice, isEmptyObject, showError } from "../../../util/Utility";
import ReservationList from "../../../components/reservation/reservation-list/ReservationList";
import { Search } from "lucide-react";
import useCallApi from "../../../api/useCallApi";
import { AccountApi, OrderApi } from "../../../api/endpoint";
import LoadingOverlay from "../../../components/loading/LoadingOverlay";

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

export function OrderHistory() {
  const location = useLocation();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reservationStatus, setReservationStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState("all");
  const [reservations, setReservations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customer, setCustomer] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const { callApi, error, loading } = useCallApi();
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const phone = searchParams.get("phoneNumber");
    if (phone) {
      setPhoneNumber(phone);
      handleSearch(phone);
    }
  }, [location.search]);

  const handleSearch = async (phone) => {
    const searchPhoneNumber = phone || phoneNumber;
    if (!searchPhoneNumber.trim()) {
      message.error("Vui lòng nhập số điện thoại");
      return;
    }
    const responseReservation = await callApi(
      `${OrderApi.GET_BY_PHONE}/1/10?phoneNumber=${searchPhoneNumber}`,
      "GET"
    );
    const responseInfo = await callApi(
      `${AccountApi.GET_BY_PHONE}?phoneNumber=${searchPhoneNumber}`,
      "GET"
    );
    if (responseReservation?.isSuccess && responseInfo?.isSuccess) {
      setReservations(responseReservation?.result?.items);
      setCustomer(responseInfo?.result);
      setIsUpdate(true);
    } else {
      setIsUpdate(false);
      setIsModalOpen(true);
      showError(error);
    }
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
      render: (text) => <a>{text.substring(0, 8)}</a>,
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => `${formatPrice(amount)}`,
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (status) => (
        <Tag
          color={status.id === 2 ? "blue" : "green"}
          icon={
            status.id === 2 ? <SyncOutlined spin /> : <CheckCircleOutlined />
          }
        >
          {status.vietnameseName}
        </Tag>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "customerInfo",
      key: "customer",
      render: (customerInfo) => customerInfo.name,
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (paymentMethod) => paymentMethod.name,
    },
    {
      title: "Delivering",
      dataIndex: "isDelivering",
      key: "isDelivering",
      render: (isDelivering) =>
        isDelivering ? (
          <Tag color="green" icon={<CheckCircleOutlined />}>
            Yes
          </Tag>
        ) : (
          <Tag color="red" icon={<CloseCircleOutlined />}>
            No
          </Tag>
        ),
    },
  ];

  useEffect(() => {
    if (phoneNumber) {
      // fetchDataReservation();
      // fetchDataOrder();
    }
  }, [reservationStatus, orderStatus]);

  const updateUrlWithPhoneNumber = (phone) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("phoneNumber", phone);
    navigate({ search: searchParams.toString() });
  };
  if (loading) {
    <LoadingOverlay isLoading={loading} />;
  }
  return (
    <div className="container mx-auto p-4">
      <Card className="w-full shadow-xl mb-4">
        <Title level={2} className="mb-4 text-center">
          Tra cứu thông tin đặt chỗ và đơn hàng
        </Title>

        <div className="w-full flex justify-between mb-4">
          <div className="flex w-full">
            <Input
              className="flex-grow-3 mr-2"
              placeholder="Số điện thoại"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              prefix={"+84"}
            />
            <Button
              className="flex-grow-1 bg-red-800"
              onClick={() => {
                handleSearch();
                updateUrlWithPhoneNumber(phoneNumber);
              }}
              loading={loading}
              type="primary"
              icon={<Search />}
            >
              Tìm kiếm
            </Button>
          </div>
        </div>
      </Card>

      {!isEmptyObject(customer) && (
        <Card className="shadow-none border-none">
          <Tabs defaultActiveKey="1">
            <TabPane tab="Lịch sử đặt chỗ" key="1">
              <Space className="mb-4">
                <Select
                  value={reservationStatus}
                  style={{ width: 200 }}
                  onChange={(value) => setReservationStatus(value)}
                >
                  <Option value="">Tất cả</Option>
                  <Option value="1">Đang chờ thanh toán</Option>
                  <Option value="2">Đã thanh toán</Option>
                  <Option value="3">Đã hủy</Option>
                </Select>
              </Space>
              {reservations.length > 0 ? (
                <ReservationList reservations={reservations} />
              ) : (
                <p>Không có dữ liệu đặt chỗ</p>
              )}
            </TabPane>
            <TabPane tab="Lịch sử đơn hàng" key="2">
              <Space className="mb-4">
                <Select
                  value={orderStatus}
                  style={{ width: 200 }}
                  onChange={(value) => setOrderStatus(value)}
                >
                  <Option value="all">Tất cả</Option>
                  <Option value="1">Đang xử lý</Option>
                  <Option value="2">Đã hoàn thành</Option>
                  <Option value="3">Đã hủy</Option>
                </Select>
              </Space>
              {orders.length > 0 ? (
                <Table columns={columns} dataSource={orders} />
              ) : (
                <p>Không có dữ liệu đơn hàng</p>
              )}
            </TabPane>
          </Tabs>
        </Card>
      )}
    </div>
  );
}
