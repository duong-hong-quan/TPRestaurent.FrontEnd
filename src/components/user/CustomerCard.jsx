import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import {
  UserIcon,
  PhoneIcon,
  CalendarIcon,
  MapPinIcon,
  StarIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";

const CustomerCard = ({ customer }) => {
  return (
    <Card className="w-96 mx-auto">
      <CardBody className="text-center">
        <Typography variant="h4" color="blue-gray" className="mb-2">
          {customer.name}
        </Typography>

        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <PhoneIcon className="h-5 w-5 text-blue-500" />
            <Typography>{customer.phoneNumber}</Typography>
          </div>
          <div className="flex items-center gap-4">
            <CalendarIcon className="h-5 w-5 text-green-500" />
            <Typography>Ngày sinh: N/A</Typography>
          </div>
          <div className="flex items-center gap-4">
            <UserIcon className="h-5 w-5 text-purple-500" />
            <Typography>Giới tính: {customer.gender ? "Nam" : "Nữ"}</Typography>
          </div>
          <div className="flex items-center gap-4">
            <MapPinIcon className="h-5 w-5 text-red-500" />
            <Typography>{customer.address}</Typography>
          </div>
          <div className="flex items-center gap-4">
            <StarIcon className="h-5 w-5 text-yellow-500" />
            <Typography>Loyalty Points: {customer.loyaltyPoint}</Typography>
          </div>
          <div className="flex items-center gap-4">
            <ShieldCheckIcon
              className={`h-5 w-5 ${
                customer.isVerified ? "text-green-500" : "text-gray-500"
              } `}
            />
            <Typography>
              {customer.isVerified
                ? "Tài khoản đã xác thực"
                : "Tài khoản chưa được xác thực"}
            </Typography>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default CustomerCard;
