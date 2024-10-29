/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";

// eslint-disable-next-line react/prop-types
const ProcessingOrders = ({ orders }) => {
  // Sort orders by orderSessionNumber
  const sortedOrders = orders.sort(
    (a, b) => a.orderSessionNumber - b.orderSessionNumber
  );
  return (
    <div className="w-[49%] p-4 mb-2 bg-white shadow-md rounded-lg overflow-hidden">
      <h2 className="text-2xl font-bold uppercase text-[#CD8400] mb-4 text-center">
        Món đang chế biến
      </h2>
      <p className="text-lg text-center text-gray-700 font-semibold mb-4">
        Ghi chú: Danh sách món đang chế biến được sắp xếp từ món cũ nhất đến mới
        nhất
      </p>
      <div className="space-y-2  bg-[#FFC682]/90 shadow-md rounded-lg p-4 overflow-y-auto max-h-[900px] ">
        {sortedOrders.map((order, index) => (
          <div
            key={order?.orderDetailId}
            className="flex items-center p-2 bg-white rounded shadow-sm"
          >
            {/* Order Number */}
            <div className="flex items-center justify-center w-8 h-8 text-lg font-bold text-white bg-[#EDAA16] rounded-full">
              {index + 1}
            </div>

            {/* Order Details */}
            <div className="flex-grow flex items-center ml-2 space-x-2">
              <div className="text-2xl p-2 text-center text-red-600 font-bold uppercase ">
                #{order?.orderSessionNumber}
              </div>
              <div
                className={` text-sm font-bold ${
                  order.tableName ? "bg-blue-500" : null
                } text-white py-1 px-2 rounded-lg`}
              >
                {order.tableName ?? (
                  <img
                    src={
                      "https://www.pngkey.com/png/full/135-1355135_png-file-shipping-icon-png.png"
                    }
                    alt="Icon"
                    className="w-8 mx-4 h-5"
                  />
                )}
              </div>
              <img
                src={
                  order?.dishSizeDetail?.dish.image
                    ? order?.dishSizeDetail?.dish.image
                    : order.combo.image
                } // Example image URL, replace with your local image
                alt={order?.dishSizeDetail?.dish.name ?? order.combo.name}
                className="w-14 h-10  rounded"
              />
              <div className="flex flex-col">
                <span className="font-bold">
                  {order?.dishSizeDetail?.dish?.name ?? order.combo.name}
                </span>
                <span className="text-gray-500 text-sm">
                  {order?.dishSizeDetail?.dishSize?.vietnameseName ?? "Combo"}
                </span>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center space-x-2">
              <div className="">
                <div className="text-sm text-gray-500 text-center">(10p)</div>
                <div className="text-[#CD8400] font-semibold text-sm flex items-center">
                  <img
                    src="https://cdn-icons-png.freepik.com/512/16601/16601855.png" // Example icon URL, replace with your local icon
                    alt="clock-icon"
                    className="w-4 h-4 mr-1"
                  />
                  9p30s
                </div>
              </div>
              <div className="text-[#9A0E1D] text-2xl font-bold px-4">
                x{order?.quantity}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessingOrders;
