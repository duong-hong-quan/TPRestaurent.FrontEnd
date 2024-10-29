/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
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

const OrderSessionList = ({ orderSessions }) => {
  return (
    <div className="w-full bg-white shadow-md rounded-lg p-4 overflow-hidden">
      <h2 className="text-2xl font-semibold text-blue-600 mb-2 text-center">
        PHIÊN ĐẶT MÓN MỚI
      </h2>
      <p className="text-lg text-center text-gray-700 font-semibold mb-4">
        Ghi chú: Danh sách phiên đặt món được sắp xếp từ phiên mới nhất đến cũ
        nhất
      </p>
      <div className="w-full max-h-[600px] overflow-y-auto border-gray-200 border-2  rounded-lg">
        <table className="w-full ">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border text-xl font-bold p-2">STT</th>
              <th className="border text-xl font-bold p-2">Mã đơn</th>
              <th className="border text-xl font-bold p-2">Bàn ăn</th>
              <th className="border text-xl font-bold p-2">Tạo lúc</th>
              <th className="border text-xl font-bold p-2">Số món</th>
              <th className="border text-xl font-bold p-2">
                Hình món x Số lượng
              </th>
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
                          : "text-gray-800"
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
                  <td className="border p-2 text-center">
                    <span className="font-semibold text-[#EDAA16]">
                      + {session.orderDetails.length} món
                    </span>
                  </td>

                  {/* Hình món */}
                  <td className="border p-2 text-center">
                    <div className="flex flex-wrap justify-center items-center max-w-[270px] space-x-1">
                      {session.orderDetails.map((orderDetail, idx) => (
                        <div key={idx} className="text-center mx-1">
                          <img
                            src={
                              orderDetail?.dishSizeDetail?.dish?.image ??
                              orderDetail?.combo?.image
                            }
                            alt="Dish"
                            className="w-14 h-10 rounded-md"
                          />
                          <p className="font-bold text-[#9A0E1D]">
                            x {orderDetail.quantity}
                          </p>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* </div> */}

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
