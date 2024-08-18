import React, { useState } from "react";
import { Button, Table, Tag, Typography, Card, message } from "antd";
import { Input } from "@material-tailwind/react";
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

const { Title } = Typography;

export function OrderHistory() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  // ... (giữ nguyên phần columns và các hàm khác)

  const handleSearch = async () => {
    if (!phoneNumber.trim()) {
      message.error("Vui lòng nhập số điện thoại");
      return;
    }
    setLoading(true);
    try {
      const response = await getAllReservationByPhoneNumber(
        phoneNumber,
        0,
        1,
        10
      );
      if (response?.isSuccess) {
        setReservations(response.result.items);
      } else {
        message.error("Không tìm thấy thông tin đặt chỗ");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi tìm kiếm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full shadow-xl mb-4">
        <Title level={2} className="mb-4">
          Tra cứu thông tin đặt chỗ
        </Title>

        <div className="flex items-center gap-4">
          <Input
            type="tel"
            label="Số điện thoại"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="flex-grow"
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
          />
          <Button
            onClick={handleSearch}
            loading={loading}
            className="bg-red-700 text-white px-4 py-6 rounded"
          >
            Tìm kiếm
          </Button>
        </div>
      </Card>

      {reservations.length > 0 && (
        <ReservationList reservations={reservations} />
      )}
    </div>
  );
}
