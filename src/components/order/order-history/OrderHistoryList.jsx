import { Empty } from "antd";
import OrderHistoryItem from "./OrderHistoryItem";

const OrderHistoryList = ({ orders }) => {
  return (
    <div>
      {orders.length === 0 && (<Empty/>)}
      {orders &&
        orders.length > 0 &&
        orders?.map((order) => (
          <OrderHistoryItem key={order.orderId} order={order} />
        ))}
    </div>
  );
};
export default OrderHistoryList;
