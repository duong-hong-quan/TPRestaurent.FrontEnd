import OrderHistoryItem from "./OrderHistoryItem";

const OrderHistoryList = ({ orders }) => {
  return (
    <div>
      {/* {orders.map((order) => (
        <OrderHistoryItem key={order.id} order={order} />
      ))} */}
      <OrderHistoryItem />
    </div>
  );
};
export default OrderHistoryList;
