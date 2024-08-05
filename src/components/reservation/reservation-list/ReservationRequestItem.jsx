import React, { useState } from "react";
import {
  FaCalendar,
  FaIdCard,
  FaClock,
  FaUsers,
  FaInfoCircle,
} from "react-icons/fa";

const ReservationRequestItem = ({ reservation }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex items-center mb-2 md:mb-0">
          <FaCalendar className="text-gray-500 mr-2" />
          <p className="text-gray-600 mr-2">Ngày đặt: 03/12/2002</p>
          <span className="text-gray-400">|</span>
          <FaIdCard className="text-gray-500 mx-2" />
          <p className="text-gray-600 ml-2">ID: 11111</p>
        </div>
        <p className="text-yellow-600 font-semibold bg-yellow-100 px-3 py-1 rounded-full">
          Đang đặt
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
            <p className="font-semibold">aaa</p>
            <p className="text-gray-600">aaa</p>
            <p className="text-gray-600">aaa</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-medium flex items-center justify-end">
            <FaClock className="mr-2 text-gray-500" />
            Thời gian: 30 phút
          </p>
          <p className="text-gray-600 flex items-center justify-end">
            <FaUsers className="mr-2 text-gray-500" />
            Số người: 2
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center">
        <p className="text-lg font-semibold flex items-center mb-2 md:mb-0">
          <FaInfoCircle className="mr-2 text-gray-500" />
          Ghi chú: <span className="text-gray-700 ml-2">a</span>
        </p>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="bg-red-700 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
        >
          {showDetails ? "Ẩn thông tin chi tiết" : "Chi tiết thông tin đặt bàn"}
        </button>
      </div>

      {showDetails && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Thông tin chi tiết:</h3>
          <p>
            <strong>Tên:</strong> Nguyễn Văn A
          </p>
          <p>
            <strong>Email:</strong> nguyenvana@example.com
          </p>
          <p>
            <strong>Số điện thoại:</strong> 0123456789
          </p>
          <p>
            <strong>Ngày sinh:</strong> 01/01/1990
          </p>
          <p>
            <strong>Địa chỉ:</strong> 123 Đường ABC, Quận XYZ, Thành phố HCM
          </p>
        </div>
      )}
    </div>
  );
};

export default ReservationRequestItem;
