/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";

// eslint-disable-next-line react/prop-types
const CompletedOrders = ({ orders }) => {
  const sortedOrders = orders.sort(
    (a, b) => b.orderSessionNumber - a.orderSessionNumber
  );
  return (
    <div className="w-[49%] p-4 mb-2 bg-white shadow-md rounded-lg overflow-hidden ">
      <h2 className="text-2xl font-bold uppercase text-green-600 mb-4 text-center">
        Món đã sẵn sàng <span className="text-gray-800">/ Hủy</span>
      </h2>
      <p className="text-lg text-center text-gray-700 font-semibold mb-4">
        Ghi chú: Danh sách món đã sẵn sàng được sắp xếp từ món mới nhất đến cũ
        nhất
      </p>
      <div className="space-y-2 bg-green-100 shadow-md rounded-lg p-4  overflow-y-auto max-h-[900px]">
        {sortedOrders.map((order, index) => (
          <div
            key={order?.orderDetailId}
            className={`flex items-center p-2 rounded shadow-sm ${
              order?.orderDetailStatusId === 5
                ? "bg-gray-500 text-white"
                : "bg-white"
            }`}
          >
            {/* Order Number */}
            <div
              className={`flex items-center justify-center w-8 h-8 text-lg font-bold  rounded-full
             ${
               order?.orderDetailStatusId === 5
                 ? "bg-white text-gray-700 "
                 : "bg-green-500 text-white "
             }
            `}
            >
              {index + 1}
            </div>

            {/* Order Details */}
            <div className="flex-grow flex items-center ml-2 space-x-2">
              <div
                className={`text-2xl p-2 text-center  font-bold uppercase
               ${
                 order?.orderDetailStatusId === 5
                   ? "text-white "
                   : "text-red-600"
               }
              `}
              >
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
                src={order?.dishSizeDetail?.dish?.image || order?.combo?.image}
                alt={order?.dishSizeDetail?.dish?.name || order?.combo?.name}
                className="w-14 h-10 rounded"
              />
              <div className="flex flex-col">
                <span className="font-bold">
                  {order?.dishSizeDetail?.dish?.name || order?.combo?.name}
                </span>
                <span
                  className={` text-sm  ${
                    order?.orderDetailStatusId === 5
                      ? "text-white "
                      : "text-gray-500"
                  }`}
                >
                  {order?.dishSizeDetail?.dishSize?.vietnameseName ?? "Combo"}
                </span>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center space-x-2">
              <div
                className={`mx-4 text-2xl font-bold ${
                  order?.orderDetailStatusId === 5
                    ? " text-white"
                    : "text-green-600 "
                }`}
              >
                x{order?.quantity}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedOrders;
