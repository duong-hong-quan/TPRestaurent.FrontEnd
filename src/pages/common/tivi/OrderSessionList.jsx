/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import useCallApi from "../../../api/useCallApi";
import { OrderSessionApi } from "../../../api/endpoint";
import { formatDateTime } from "../../../util/Utility";

// Hàm tính thời gian chênh lệch theo giờ và phút
const formatRelativeTime = (date) => {
  const now = new Date();
  const diffInMilliseconds = now - new Date(date);
  const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(
    (diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
  );

  if (diffInHours < 24) {
    if (diffInHours === 0) {
      return ` ${diffInMinutes}p trước`;
    } else {
      return `${diffInHours}h ${diffInMinutes}p trước`;
    }
  } else {
    // Trả về định dạng thông thường nếu thời gian chênh lệch lớn hơn 24 giờ
    return formatDateTime(date);
  }
};

const OrderSessionList = () => {
  const [orderSessions, setOrderSessions] = useState([]);
  const { callApi, error, loading } = useCallApi();

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const selectedStatus = 1; // Chỉ lấy trạng thái '1'

  // Hàm gọi API
  const fetchData = async () => {
    const response = await callApi(
      `${OrderSessionApi.GET_ALL_ORDER_SESSION}?status=${selectedStatus}&pageNumber=${currentPage}&pageSize=${pageSize}`,
      "GET"
    );

    if (response.isSuccess) {
      // Sắp xếp các mục theo mã đơn tăng dần
      const sortedItems = response.result.items.sort(
        (a, b) =>
          a.orderSession?.orderSessionNumber -
          b.orderSession?.orderSessionNumber
      );

      setOrderSessions(sortedItems);
      setTotalPages(response.result?.totalPages);
    } else {
      console.error(response.error);
      setOrderSessions([]);
      setTotalPages(0);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]); // Gọi lại API khi trang thay đổi

  return (
    <div className="w-1/4 bg-white shadow-md rounded-lg p-4 ">
      <h2 className="text-2xl font-semibold text-blue-600 mb-4 text-center">
        PHIÊN ĐẶT MÓN MỚI
      </h2>
      <div className="w-full max-h-[1100px] overflow-y-auto">
        <table className="w-full border-collapse max-">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border text-xl font-bold p-2">STT</th>
              <th className="border text-xl font-bold p-2">Mã đơn</th>
              <th className="border text-xl font-bold p-2">Bàn ăn</th>
              <th className="border text-xl font-bold p-2">Tạo lúc</th>
              <th className="border text-xl font-bold p-2">Số món</th>
            </tr>
          </thead>
          <tbody>
            {orderSessions.length > 0 ? (
              orderSessions.map((session, index) => (
                <tr
                  key={session.orderSession.orderSessionId}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-200`}
                >
                  <td className="border p-2 text-center font-semibold">
                    {index + 1}
                  </td>
                  <td className="border text-2xl p-2 text-center text-red-600 font-bold">
                    #{session.orderSession?.orderSessionNumber}
                  </td>
                  <td className="border p-2 text-center">
                    <span
                      className={`px-2 font-semibold py-1 rounded ${
                        session.table
                          ? "bg-blue-500 text-white"
                          : " text-gray-800"
                      }`}
                    >
                      {session.table?.tableName || "SHIP"}
                    </span>
                  </td>
                  <td className="border p-2 text-center font-semibold text-gray-700">
                    {formatRelativeTime(
                      session.order?.mealTime ||
                        session.order?.reservationDate ||
                        session.order?.orderDate
                    )}
                  </td>
                  <td className="border p-2 text-center flex justify-center items-center space-x-1">
                    <span className="mr-4 font-semibold text-[#EDAA16]">
                      {session.orderDetails.length} món
                    </span>
                    <img
                      src={
                        session.table
                          ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwYEiHF5Az3bfz2eaQyY9hqHkuk7T5ulzKmE8RifcGNaReYf4OvWrhFExpcpm0JrtmbsY&usqp=CAU"
                          : "https://www.pngkey.com/png/full/135-1355135_png-file-shipping-icon-png.png"
                      }
                      alt="Icon"
                      className="w-8 h-5"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {/* <div className="flex justify-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Trang trước
        </button>
        <span className="px-4 py-1">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Trang sau
        </button>
      </div> */}
    </div>
  );
};

export default OrderSessionList;
