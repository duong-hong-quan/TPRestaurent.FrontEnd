import React from "react";
import { List, Checkbox, Button, Typography } from "@material-tailwind/react";
import OrderListItem from "./OrderListItem";

const OrderList = ({
  title,
  orders,
  selectedOrders,
  onSelectAll,
  onCheckboxChange,
  onChangeStatus,
  status,
  buttonText,
}) => {
  return (
    <div className="w-full">
      <Typography variant="h5" className="mb-4">
        {title}
      </Typography>
      <div className="mb-2">
        <Checkbox
          label="Chọn tất cả"
          checked={
            selectedOrders?.length > 0 &&
            selectedOrders?.length === orders?.length
          }
          onChange={onSelectAll}
        />
      </div>
      <List>
        {orders?.map((order) => (
          <OrderListItem
            key={order.prelistOrder.prelistOrderId}
            order={order}
            isSelected={selectedOrders.includes(
              order.prelistOrder.prelistOrderId
            )}
            onCheckboxChange={() =>
              onCheckboxChange(order.prelistOrder.prelistOrderId)
            }
            status={status}
          />
        ))}
      </List>
      {buttonText && (
        <Button
          className="bg-red-900 mt-4"
          onClick={onChangeStatus}
          disabled={selectedOrders?.length === 0}
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default OrderList;
