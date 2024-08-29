import React, { useEffect, useState } from "react";
import {
  FaCalendar,
  FaIdCard,
  FaClock,
  FaUsers,
  FaInfoCircle,
} from "react-icons/fa";
import {
  calculateDuration,
  calculateTimeDifference,
  formatDate,
  getKeyByValue,
} from "../../../util/Utility";
import ReservationDetail from "../reservation-detail/ReservationDetail";
import { getReservationById } from "../../../api/reservationApi";
import { ReservationRequestStatus } from "../../../util/GlobalType";

const ReservationRequestItem = ({ reservation }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [reservationId, setCurrentReservationId] = useState(null);
  const timeDifference = calculateTimeDifference(
    reservation.reservationDate,
    reservation.endTime
  );

  // Format the time difference for display
  const timeDifferenceString = `${timeDifference.hours} giờ ${timeDifference.minutes} phút`;
  const [reservationData, setReservationData] = useState({});
  const handleChange = async (id) => {
    setShowDetails(!showDetails);
    const response = await getReservationById(id);
    if (response?.isSuccess) {
      setReservationData(response?.result);
      setCurrentReservationId(id);
    }
  };
  useEffect(() => {
    if (showDetails) {
    }
  }, [showDetails, reservationId]);
  const statusKey = getKeyByValue(
    ReservationRequestStatus,
    reservation.statusId
  );
  const handlePayment = async () => {
    // Call API to process payment
  };
  console.log(reservation);
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex items-center mb-2 md:mb-0">
          <FaCalendar className="text-gray-500 mr-2" />
          <p className="text-gray-600 mr-2">
            Ngày đặt: {formatDate(reservation.reservationDate)}
          </p>
          <span className="text-gray-400">|</span>
          <FaIdCard className="text-gray-500 mx-2" />
          <p className="text-gray-600 ml-2">
            ID: {reservation.reservationId.substring(0, 8)}
          </p>
        </div>
        <p className="text-yellow-600 font-semibold bg-yellow-100 px-3 py-1 rounded-full">
          {statusKey}
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex items-center mb-2 md:mb-0">
          <img
            src="/path/to/default-avatar.png"
            alt="User Avatar"
            className="w-16 h-16 object-cover rounded-full mr-4"
          />
          <div>
            <p className="font-semibold">
              Tên: {reservation?.customerInfo?.name}
            </p>
            <p className="text-gray-600">
              0{reservation?.customerInfo?.phoneNumber}
            </p>
            <p className="text-gray-600">
              {reservation?.customerInfo?.gender ? "Nam" : "Nữ"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-medium flex items-center justify-end">
            <FaClock className="mr-2 text-gray-500" />
            Thời gian: {timeDifferenceString}
          </p>
          <p className="text-gray-600 flex items-center justify-end">
            <FaUsers className="mr-2 text-gray-500" />
            Số người: {reservation.numberOfPeople}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center">
        <p className="text-lg font-semibold flex items-center mb-2 md:mb-0">
          <FaInfoCircle className="mr-2 text-gray-500" />
          Ghi chú:{" "}
          <span className="text-gray-700 ml-2">{reservation.note}</span>
        </p>
        <div className="flex">
          {reservation?.statusId === 0 && (
            <button className="bg-red-600 mx-2 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
              Thanh toán ngay
            </button>
          )}

          <button
            onClick={() => handleChange(reservation.reservationId)}
            className="bg-gray-700 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
          >
            {showDetails
              ? "Ẩn thông tin chi tiết"
              : "Chi tiết thông tin đặt bàn"}
          </button>
        </div>
      </div>

      {showDetails && <ReservationDetail reservationData={reservationData} />}
    </div>
  );
};

export default ReservationRequestItem;
