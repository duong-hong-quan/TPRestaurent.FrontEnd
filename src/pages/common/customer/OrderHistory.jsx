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
import OrderHistoryList from "../../../components/order-history/OrderHistoryList";

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

export function OrderHistory() {
  const location = useLocation();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reservationStatus, setReservationStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [reservations, setReservations] = useState([]);
  const [orders, setOrders] = useState([]);

  const [tabSelected, setTabSelected] = useState(1);
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
      `${OrderApi.GET_BY_PHONE}/1/10?phoneNumber=${searchPhoneNumber}&status=${reservationStatus}&orderType=1`,
      "GET"
    );
    const orderResponse = await callApi(
      `${OrderApi.GET_BY_PHONE}/1/10?phoneNumber=${searchPhoneNumber}&status=${orderStatus}&orderType=2`,
      "GET"
    );

    if (responseReservation?.isSuccess && orderResponse?.isSuccess) {
      setReservations(responseReservation?.result?.items);
      setOrders(orderResponse?.result?.items);
    } else {
      showError(error);
    }
  };

  useEffect(() => {
    if (phoneNumber) {
      handleSearch(phoneNumber);
    }
  }, [reservationStatus, orderStatus, tabSelected]);

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

      <Card className="shadow-none border-none">
        <Tabs
          defaultActiveKey="1"
          onChange={(e) => setTabSelected(e)}
          value={tabSelected}
        >
          <TabPane tab="Lịch sử đặt chỗ" key="1">
            <Space className="mb-4">
              <Select
                value={reservationStatus}
                style={{ width: 200 }}
                onChange={(value) => setReservationStatus(value)}
              >
                <Option value="">Tất cả</Option>
                <Option value="1">Đã xếp bàn</Option>
                <Option value="2">Đã thanh toán cọc</Option>
                <Option value="3">Đang dùng bữa</Option>
                <Option value="9">Đã hủy</Option>
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
                <Option value="">Tất cả</Option>
                <Option value="4">Chờ xác nhận</Option>
                <Option value="5">Chưa thanh toán</Option>
                <Option value="6">Chuẩn bị giao hàng</Option>
                <Option value="7">Đang giao</Option>
                <Option value="8">Đã nhận hàng</Option>
                <Option value="9">Đã hủy</Option>
              </Select>
            </Space>
            <OrderHistoryList orders={orders} key={"orderlist"} />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}
