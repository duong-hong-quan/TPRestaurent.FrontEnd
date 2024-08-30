import React, { useEffect, useState } from "react";
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
  Calendar,
  Users,
  Clock,
  DollarSign,
  Lock,
  Unlock,
  Search,
  Phone,
} from "lucide-react";
import { getAllReservationByPhoneNumber } from "../../../api/reservationApi";
import { getAllOrderByPhoneNumber } from "../../../api/orderApi";
import {
  getCustomerInfoByPhoneNumber,
  updateCustomerInfo,
} from "../../../api/acccountApi";
import UserInfo from "../../../components/user/UserInfo";
import { formatPrice, isEmptyObject } from "../../../util/Utility";
import ReservationList from "../../../components/reservation/reservation-list/ReservationList";
import InfoModal from "../../../components/user/InfoModal";
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

export function OrderHistory() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reservationStatus, setReservationStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState("all");
  const [reservations, setReservations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const handleSearch = async () => {
    if (!phoneNumber.trim()) {
      message.error("Vui lòng nhập số điện thoại");
      return;
    }
    setLoading(true);
    try {
      const [responseReservation, responseInfo] = await Promise.all([
        getAllReservationByPhoneNumber(phoneNumber, reservationStatus, 1, 10),
        getCustomerInfoByPhoneNumber(phoneNumber),
      ]);
      if (responseReservation?.isSuccess && responseInfo?.isSuccess) {
        setReservations(responseReservation?.result?.items);
        setCustomer(responseInfo?.result);
        setIsUpdate(true);
      } else {
        setIsUpdate(false);
        setIsModalOpen(true);
        message.error("Không tìm thấy thông tin đặt chỗ");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi tìm kiếm");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    console.log(formData);
    if (isUpdate) {
      const data = await updateCustomerInfo(formData);
      if (data?.isSuccess) {
        await getCustomerInfoByPhoneNumber(formData.phoneNumber);
        message.success("Cập nhật thông tin thành công!");
      } else {
        message.error("Cập nhật thông tin thất bại!");
      }
    } else {
      const data = await addNewCustomerInfo(formData);
      if (data?.isSuccess) {
        message.success("Thêm mới thông tin thành công!");
      } else {
        message.success("Thêm mới thông tin thất bại!");
      }
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
  const fetchDataReservation = async () => {
    try {
      const response = await getAllReservationByPhoneNumber(
        phoneNumber,
        reservationStatus,
        1,
        10
      );
      if (response?.isSuccess) {
        setReservations(response?.result?.items);
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi tìm kiếm");
    }
  };
  const fetchDataOrder = async () => {
    try {
      const response = await getAllOrderByPhoneNumber(phoneNumber, 1, 10);
      if (response?.isSuccess) {
        setOrders(response?.result?.items);
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi tìm kiếm");
    }
  };
  useEffect(() => {
    fetchDataReservation();
    fetchDataOrder();
  }, [reservationStatus, orderStatus]);

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
              onClick={handleSearch}
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
        <Card className="mb-4">
          <UserInfo
            userData={customer?.customerInfo}
            handleOpenUpdate={() => setIsModalOpen(true)}
          />
        </Card>
      )}

      <Card>
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

      <InfoModal
        initialData={customer}
        isOpen={isModalOpen}
        isUpdate={isUpdate}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
