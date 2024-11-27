import { useEffect, useState } from "react";
import { OrderApi } from "../../../api/endpoint";
import useCallApi from "../../../api/useCallApi";
import ReservationList from "../../../components/order/order-list/ReservationList";
import OrderHistoryList from "../../../components/order/order-history/OrderHistoryList";
import OrderHistoryItemKitchen from "../../../components/order/order-history/OrderHistoryItemKitchen";
import dayjs from "dayjs";

const OrderViewPage = () => {
  const { callApi, loading, error } = useCallApi();
  const [orderList, setOrderList] = useState([]);
  const fetchOrder = async () => {
    try {
      const data = await callApi(`${OrderApi.GET_ORDER_WITH_FILTER}`, "POST", {
        startDate: dayjs().format("YYYY-MM-DD"),
        endDate: dayjs().format("YYYY-MM-DD"),
        pageNumber: 0,
        pageSize: 0,
      });
      setOrderList(data.result?.items);
    } catch (error) {}
  };
  useEffect(() => {
    fetchOrder();
  }, []);
  return (
    <div className=" bg-white">
      <h3 className="text-center uppercase text-red-800 font-bold text-xl">
        Đơn hàng hôm nay
      </h3>

      {orderList.length > 0 ? (
        orderList.map((order) => (
          <OrderHistoryItemKitchen key={order.orderId} order={order} />
        ))
      ) : (
        <p className="text-center text-gray-400">Không có đơn hàng nào</p>
      )}
    </div>
  );
};
export default OrderViewPage;
