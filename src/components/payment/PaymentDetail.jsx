import React from "react";
import { Table, Divider, Modal } from "antd";
import { Package, User, Calendar, Clock } from "lucide-react";
import { combineTimes, formatDateTime, formatPrice } from "../../util/Utility";
import OrderTag from "../tag/OrderTag";

const OrderDetailsView = ({ data, isHorizontal }) => {
  const { order, transaction } = data;
  const account = transaction?.order?.account;
  const dishColumns = [
    {
      title: "Món",
      dataIndex: ["dishSizeDetail", "dish", "name"] || ["comboDish", "combo","name"],
      key: "dishName" || "comboName",
      render: (text, record) => {
        if (record?.dishSizeDetail?.dish) {
          return record?.dishSizeDetail?.dish?.name;
        } else {
          return record?.comboDish?.combo?.name;
        }
      }
    },
    {
      title: "Size/ Món",
      dataIndex: ["dishSizeDetail", "dishSize", "vietnameseName"],
      key: "dishSize",
      render: (_, record) => {
        if (record?.dishSizeDetail) {
          return record?.dishSizeDetail?.dishSize?.vietnameseName;
        } else {
          return "Combo";
        }
      }
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Gía",
      dataIndex: ["dishSizeDetail", "price"],
      key: "price",
      render: (_, record) => {
        if (record?.dishSizeDetail) {
          return formatPrice(record?.dishSizeDetail?.price);
        } else {
          return formatPrice(record?.comboDish?.combo?.price);
        }
      }
    },
    {
      title: "Trạng thái",
      dataIndex: ["status", "vietnameseName"],
      key: "status",
    },
  ];

  return (
    <>
      {data && (
        <div className="w-full max-w-6xl">
          <div>
            <h3 className="text-xl text-red-900 uppercase font-bold text-center my-2">
              Chi tiết giao dịch
            </h3>
          </div>
          <div>
            {isHorizontal && (
              <>
                <div className="flex items-center mb-4">
                  <span className="flex font-bold mr-2">
                    <User size={20} className="mr-2" />
                    Khách hàng:
                  </span>
                  <span>
                    {account?.firstName} {account?.lastName} ( 0
                    {account?.phoneNumber})
                  </span>
                </div>
                <Divider />
                <div className="flex items-center">
                  <span className="font-bold flex mr-2">
                    <Calendar size={20} className="mr-2" />
                    Ngày đặt:
                  </span>
                  <span>
                    {transaction?.order?.orderTypeId === 1
                      ? formatDateTime(transaction?.order?.reservationDate)
                      : formatDateTime(transaction?.order?.orderDate)}
                  </span>
                </div>
                <Divider />
                {transaction?.order?.orderTypeId !== 2 && (
                  <>
                    <div className="flex items-center">
                      <span className="flex font-bold mr-2">
                        <Clock size={20} className="mr-2" />
                        Thời gian dùng bữa:
                      </span>
                      <span>
                        {combineTimes(
                          order?.order?.mealTime,
                          order?.order?.endTime
                        )}
                      </span>
                    </div>
                    <Divider />
                  </>
                )}

                <div className="flex items-center">
                  <span className="flex font-bold mr-2">
                    <Clock size={20} className="mr-2" />
                    Trạng thái đơn hàng:
                  </span>
                  <span>
                    <OrderTag orderStatusId={order?.order?.statusId} />
                  </span>
                </div>
                <Divider />
              </>
            )}
            {!isHorizontal && (
              <>
                <div className="flex items-center mb-4">
                  <span className="flex font-bold mr-2">
                    <User size={20} className="mr-2" />
                    Khách hàng:
                  </span>
                  <span>
                    {account?.firstName} {account?.lastName} (
                    {account?.phoneNumber})
                  </span>
                </div>
                <Divider />
                <div className="flex items-center">
                  <span className="font-bold flex mr-2">
                    <Calendar size={20} className="mr-2" />
                    Ngày đặt:
                  </span>
                  <span>
                    {transaction?.order?.orderTypeId !== 2
                      ? formatDateTime(transaction?.order?.reservationDate)
                      : formatDateTime(transaction?.order?.orderDate)}
                  </span>
                </div>
                <Divider />
                {transaction?.order?.orderTypeId !== 2 && (
                  <>
                    <div className="flex items-center">
                      <span className="flex font-bold mr-2">
                        <Clock size={20} className="mr-2" />
                        Thời gian dùng bữa:
                      </span>
                      <span>
                        {combineTimes(
                          order?.order?.mealTime,
                          order?.order?.endTime
                        )}
                      </span>
                    </div>
                    <Divider />
                  </>
                )}

                <div className="flex items-center">
                  <span className="flex font-bold mr-2">
                    <Clock size={20} className="mr-2" />
                    Trạng thái đơn hàng:
                  </span>
                  <span>
                    <OrderTag orderStatusId={order?.order?.statusId} />
                  </span>
                </div>
                <Divider />
              </>
            )}
            <Table
              dataSource={order?.orderDishes}
              columns={dishColumns}
              pagination={false}
              rowKey="orderDetailsId"
            />
            <Divider />
            <div className="flex justify-end">
              <span className="block px-2 py-2 bg-green-500  text-white rounded-xl">
                Tổng tiền: {formatPrice(order?.order?.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDetailsView;
