import {
  ListItem,
  Avatar,
  Checkbox,
  Typography,
} from "@material-tailwind/react";

const CustomBadge = ({ color, content }) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-semibold text-white bg-${color}-500 text-nowrap`}
  >
    {content}
  </span>
);

const OrderListItem = ({ order, isSelected, onCheckboxChange, status }) => {
  const renderColor = (status) => {
    switch (status) {
      case "Mới":
        return "red";
      case "Đã đọc":
        return "blue";
      case "Sẵn sàng phục vụ":
        return "green";
    }
  };
  return (
    <ListItem>
      <div className="w-full">
        <div className="flex">
          <div className="">
            <Checkbox checked={isSelected} onChange={onCheckboxChange} />
            <Avatar
              variant="circular"
              alt={order?.prelistOrder?.dishSizeDetail?.dish?.name}
              src={
                order?.prelistOrder?.dishSizeDetail?.dish?.image ||
                order?.prelistOrder?.combo?.image
              }
              className="mx-2"
            />
          </div>
          <div>
            <Typography variant="h6" color="blue-gray">
              {order?.prelistOrder?.combo?.name ||
                order?.prelistOrder?.dishSizeDetail?.dish?.name}
            </Typography>
            <Typography variant="small" color="gray">
              Số lượng: {order?.prelistOrder?.quantity}
            </Typography>
          </div>
        </div>
      </div>
      <CustomBadge color={renderColor(status)} content={status} />
    </ListItem>
  );
};

export default OrderListItem;
