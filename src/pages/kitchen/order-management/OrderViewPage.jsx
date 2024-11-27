import { useEffect, useState } from "react";
import { OrderApi } from "../../../api/endpoint";
import useCallApi from "../../../api/useCallApi";
import OrderHistoryItemKitchen from "../../../components/order/order-history/OrderHistoryItemKitchen";
import dayjs from "dayjs";
import TabMananger from "../../../components/tab/TabManager";
import { OrderStatus } from "../../../util/GlobalType";
import LoadingOverlay from "../../../components/loading/LoadingOverlay";
const renderTabs = () => {
  return OrderStatus.filter((item) => item.value > 4 && item.value < 10);
};
const OrderViewPage = () => {
  const { callApi, loading, error } = useCallApi();
  const [orderList, setOrderList] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  console.log(renderTabs());
  const fetchOrder = async () => {
    try {
      const data = await callApi(`${OrderApi.GET_ORDER_WITH_FILTER}`, "POST", {
        startDate: dayjs().format("YYYY-MM-DD"),
        endDate: dayjs().format("YYYY-MM-DD"),
        pageNumber: 0,
        pageSize: 0,
        status: activeTab === 0 ? undefined : activeTab,
      });
      setOrderList(data.result?.items);
    } catch (error) {}
  };
  useEffect(() => {
    fetchOrder();
  }, [activeTab]);

  return (
    <div className=" bg-white">
      <h3 className="text-center uppercase text-red-800 font-bold text-xl">
        Đơn hàng hôm nay
      </h3>
      <LoadingOverlay isLoading={loading} />
      <TabMananger
        activeTab={activeTab}
        items={[{ label: "Tất cả", value: 0 }, ...renderTabs()]}
        setActiveTab={setActiveTab}
        enableCount={false}
        key={"tab"}
      />
      {orderList?.length > 0 ? (
        orderList?.map((order) => (
          <OrderHistoryItemKitchen key={order.orderId} order={order} />
        ))
      ) : (
        <p className="text-center text-gray-400">Không có đơn hàng nào</p>
      )}
    </div>
  );
};
export default OrderViewPage;
