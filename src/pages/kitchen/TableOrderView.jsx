import React from "react";
import {
  Card,
  CardBody,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Badge,
} from "@material-tailwind/react";

const TableOrderView = ({ data }) => {
  const {
    tableSession,
    uncheckedPrelistOrderDetails,
    readPrelistOrderDetails,
    readyToServePrelistOrderDetails,
  } = data;

  return (
    <Card className="w-full max-w-[400px] shadow-lg">
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-4">
          Table {tableSession?.table?.tableName}
        </Typography>

        <Typography variant="h6" color="blue-gray" className="mb-2">
          Unchecked Orders
        </Typography>
        <List>
          {uncheckedPrelistOrderDetails &&
            uncheckedPrelistOrderDetails.length > 0 &&
            uncheckedPrelistOrderDetails.map((order) => (
              <ListItem key={order.prelistOrder.prelistOrderId}>
                <ListItemPrefix>
                  <Avatar
                    variant="circular"
                    alt={order.prelistOrder.dishSizeDetail.dish.name}
                    src={order.prelistOrder.dishSizeDetail.dish.image}
                  />
                </ListItemPrefix>
                <div>
                  <Typography variant="small" color="blue-gray">
                    {order.prelistOrder.dishSizeDetail.dish.name}
                  </Typography>
                  <Typography variant="small" color="gray">
                    Quantity: {order.prelistOrder.quantity}
                  </Typography>
                </div>
                <Badge color="red" content="New" />
              </ListItem>
            ))}
        </List>

        <Typography variant="h6" color="blue-gray" className="mt-4 mb-2">
          Read Orders
        </Typography>
        <List>
          {readPrelistOrderDetails &&
            readPrelistOrderDetails.length > 0 &&
            readPrelistOrderDetails.map((order) => (
              <ListItem key={order.prelistOrder.prelistOrderId}>
                <ListItemPrefix>
                  <Avatar
                    variant="circular"
                    alt={order.prelistOrder.combo.name}
                    src={order.prelistOrder.combo.image}
                  />
                </ListItemPrefix>
                <div>
                  <Typography variant="small" color="blue-gray">
                    {order.prelistOrder.combo.name}
                  </Typography>
                  <Typography variant="small" color="gray">
                    Quantity: {order.prelistOrder.quantity}
                  </Typography>
                </div>
                <Badge color="blue" content="Read" />
              </ListItem>
            ))}
        </List>

        <Typography variant="h6" color="blue-gray" className="mt-4 mb-2">
          Ready to Serve
        </Typography>
        <List>
          {readyToServePrelistOrderDetails &&
            readyToServePrelistOrderDetails.length > 0 &&
            readyToServePrelistOrderDetails.map((order) => (
              <ListItem key={order.prelistOrder.prelistOrderId}>
                <ListItemPrefix>
                  <Avatar
                    variant="circular"
                    alt={order.prelistOrder.dishSizeDetail.dish.name}
                    src={order.prelistOrder.dishSizeDetail.dish.image}
                  />
                </ListItemPrefix>
                <div>
                  <Typography variant="small" color="blue-gray">
                    {order.prelistOrder.dishSizeDetail.dish.name}
                  </Typography>
                  <Typography variant="small" color="gray">
                    Quantity: {order.prelistOrder.quantity}
                  </Typography>
                </div>
                <Badge color="green" content="Ready" />
              </ListItem>
            ))}
        </List>
      </CardBody>
    </Card>
  );
};

export default TableOrderView;
