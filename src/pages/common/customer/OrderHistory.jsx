import React, { useState } from "react";
import { Button, Table, Tag, Typography, Card, message, Input } from "antd";
import {
  CalendarIcon,
  UserGroupIcon,
  ClockIcon,
  CurrencyDollarIcon,
  LockClosedIcon,
  LockOpenIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import ReservationList from "../../../components/reservation/reservation-list/ReservationList";
import { getAllReservationByPhoneNumber } from "../../../api/reservationApi";
import { getAllOrderByPhoneNumber } from "../../../api/orderApi";
import { getCustomerInfoByPhoneNumber } from "../../../api/acccountApi";
import UserInfo from "../../../components/user/UserInfo";
import { isEmptyObject } from "../../../util/Utility";
import UserSidebar from "../../../components/user/UserSidebar";

const { Title } = Typography;

export function OrderHistory() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState({});
  // ... (giữ nguyên phần columns và các hàm khác)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSearch = async () => {
    if (!phoneNumber.trim()) {
      message.error("Vui lòng nhập số điện thoại");
      return;
    }
    setLoading(true);
    try {
      const [response, responseOrder, responseInfo] = await Promise.all([
        getAllReservationByPhoneNumber(phoneNumber, 1, 1, 10),
        getAllOrderByPhoneNumber(phoneNumber, 1, 10),
        getCustomerInfoByPhoneNumber(phoneNumber),
      ]);
      if (
        response?.isSuccess &&
        responseOrder?.isSuccess &&
        responseInfo?.isSuccess
      ) {
        setReservations(response?.result?.items);
        setOrders(responseOrder?.result?.items);
        setCustomer(responseInfo?.result);
      } else {
        message.error("Không tìm thấy thông tin đặt chỗ");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi tìm kiếm");
    } finally {
      setLoading(false);
    }
  };
  console.log(customer);
  return (
    <div className="container mx-auto p-4">
      <Card className="w-full shadow-xl mb-4">
        <Title level={2} className="mb-4">
          Tra cứu thông tin đặt chỗ
        </Title>

        <div className="flex items-center ">
          <Input
            label="Số điện thoại"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="flex-grow"
            prefix={"+84"}
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
          />
          <Button
            onClick={handleSearch}
            loading={loading}
            className="bg-red-700 text-white px-4 py-4 md:py-6 rounded"
          >
            Tìm kiếm
          </Button>
        </div>
      </Card>
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {!isEmptyObject(customer) && (
          <UserInfo userData={customer?.customerInfo} />
        )}{" "}
        <div className="">
          <button
            className="md:hidden bg-red-700 text-white px-4 py-2 rounded-md mb-4"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "Menu" : " Menu"}
          </button>
          {reservations.length > 0 && (
            <ReservationList reservations={reservations} />
          )}
          <div className="md:flex justify-center">
            <div className={` ${sidebarOpen ? "block" : "hidden"} md:block`}>
              {/* <UserSidebar /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
