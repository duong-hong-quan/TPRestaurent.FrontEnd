import { Empty, Modal } from "antd";
import TabMananger from "../../tab/TabManager";
import { values } from "lodash";
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Shield,
  Award,
  CreditCard,
  UserCheck,
  AlertCircle,
  CircleDot,
} from "lucide-react";
import { useEffect, useState } from "react";
import useCallApi from "../../../api/useCallApi";
import { OrderApi } from "../../../api/endpoint";
import ReservationList from "../../order/order-list/ReservationList";
import OrderHistoryList from "../../order/order-history/OrderHistoryList";
import { formatDate, formatPrice } from "../../../util/Utility";
const ModalUser = ({ user, onClose, open }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [reservationData, setReservationData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const { callApi, loading, error } = useCallApi();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const totalItems = 10;
  const items = [
    {
      label: "Thông tin đặt bàn",
      value: 0,
    },
    {
      label: "Lịch sử đơn hàng",
      value: 1,
    },
  ];
  const renderTab = () => {
    switch (activeTab) {
      case 0:
        if (reservationData.length > 0) {
          return <ReservationList reservations={reservationData} />;
        } else {
          return <Empty />;
        }
      case 1:
        if (orderData.length > 0) {
          return <OrderHistoryList orders={orderData} />;
        } else {
          return <Empty />;
        }
      default:
        return null;
    }
  };

  const fetchData = async () => {
    if (activeTab == 0) {
      const res = await callApi(
        `${OrderApi.GET_BY_PHONE}/${currentPage}/${totalItems}?phoneNumber=${user.phoneNumber}&orderType=1`,
        "GET"
      );
      if (res.isSuccess) {
        setReservationData(res.result.items);
        setTotalPages(res.result.totalPages);
      }
    } else {
      const res = await callApi(
        `${OrderApi.GET_BY_PHONE}/${currentPage}/${totalItems}?phoneNumber=${user.phoneNumber}&&orderType=2`,
        "GET"
      );
      if (res.isSuccess) {
        setOrderData(res.result.items);
        setTotalPages(res.result.totalPages);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, [user, currentPage, activeTab]);
  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start space-x-3 py-3 border-b border-gray-100">
      <Icon className="w-5 h-5 text-gray-400 mt-1" />
      <div className="flex-1">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-gray-800 mt-1">{value}</p>
      </div>
    </div>
  );

  return (
    <Modal
      open={open}
      footer={null}
      width={1400}
      onCancel={onClose}
      onClose={onClose}
    >
      <div className="grid grid-cols-4 gap-2">
        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <h1 className="text-2xl font-bold text-gray-800 text-center">
                  {user?.firstName} {user?.lastName}
                </h1>
                {user?.isVerified && (
                  <div className="mt-2 flex items-center text-green-600">
                    <Shield className="w-4 h-4 mr-1" />
                    <span className="text-sm">Tài khoản đã xác thực</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info List */}
            <div className="p-6 space-y-1">
              <InfoItem
                icon={UserCheck}
                label="Tên đăng nhập"
                value={user?.userName}
              />
              <InfoItem
                icon={Phone}
                label="Số điện thoại"
                value={user?.phoneNumber || "Chưa cập nhật"}
              />
              <InfoItem
                icon={Mail}
                label="Email"
                value={user?.email || "Chưa cập nhật"}
              />
              <InfoItem
                icon={Calendar}
                label="Ngày sinh"
                value={formatDate(user?.dob)}
              />
              <InfoItem
                icon={CircleDot}
                label="Giới tính"
                value={user?.gender ? "Nam" : "Nữ"}
              />
              <InfoItem
                icon={MapPin}
                label="Địa chỉ"
                value={user?.address || "Chưa cập nhật"}
              />
              <InfoItem
                icon={Award}
                label="Điểm tích lũy"
                value={`${user?.loyaltyPoint.toLocaleString()} điểm`}
              />
              <InfoItem
                icon={CreditCard}
                label="Số dư tài khoản"
                value={`${formatPrice(user?.storeCreditAmount)}`}
              />
              <InfoItem
                icon={Calendar}
                label="Ngày đăng ký"
                value={formatDate(user?.registeredDate)}
              />
              <InfoItem
                icon={AlertCircle}
                label="Trạng thái tài khoản"
                value={
                  user?.isBanned
                    ? "Đã bị khóa"
                    : user?.isDelivering
                    ? "Đang giao hàng"
                    : "Đang hoạt động"
                }
              />
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <TabMananger
            activeTab={activeTab}
            items={items}
            setActiveTab={setActiveTab}
          />
          <div className=" max-h-[954px] overflow-y-scroll">{renderTab()}</div>
        </div>
      </div>
    </Modal>
  );
};
export default ModalUser;
