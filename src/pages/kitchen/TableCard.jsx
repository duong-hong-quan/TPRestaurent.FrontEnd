import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { BellIcon } from "@heroicons/react/24/solid";
const NotificationBell = ({ count }) => (
  <div className="absolute top-0 right-2 flex items-center">
    <BellIcon className="h-8 w-8 text-yellow-500" />
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
      {count}
    </span>
  </div>
);

const TableCard = ({ table, onClick }) => {
  return (
    <Card
      key={table.tableId}
      className="cursor-pointer transform transition-transform hover:scale-105"
      onClick={() => onClick(table.tableSessionId)}
    >
      <CardBody className="flex flex-col justify-center items-center p-4">
        <div className="relative w-32 h-32 rounded-full flex justify-center items-center mb-2 bg-red-100">
          <Typography variant="h4" className="font-bold text-red-900">
            {table.tableName}
          </Typography>
          <NotificationBell count={Math.floor(table.unCheckedNumberOfDishes)} />
        </div>
      </CardBody>
    </Card>
  );
};

export default TableCard;
