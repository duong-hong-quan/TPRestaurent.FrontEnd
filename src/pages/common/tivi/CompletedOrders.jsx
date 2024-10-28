/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";

// eslint-disable-next-line react/prop-types
const CompletedOrders = ({ orders }) => {
  return (
    <div className="w-1/3 bg-green-100 shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-2">Món đã sẵn sàng / Hủy</h2>
      <div className="space-y-2">
        {orders.map((order) => (
          <div
            key={order.orderDetailId}
            className="flex flex-col p-2 bg-white rounded shadow-sm"
          >
            <p className="font-medium">Mã món: {order.orderDetailId}</p>
            <p>Tên món: {order.dishSizeDetail.dish.name}</p>
            <p>Số lượng: {order.quantity}</p>
            <p className="text-green-700">
              Trạng thái: {order.orderDetailStatus.vietnameseName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedOrders;
