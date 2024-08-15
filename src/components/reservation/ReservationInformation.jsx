import React from "react";
import {
  Card,
  CardBody,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserGroupIcon,
  CalendarIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import { formatDateTime } from "../../util/Utility";

const ReservationInformation = ({ reservation }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardBody>
        <Typography variant="h5" className="mb-4 text-center">
          Thông tin đặt bàn
        </Typography>
        <List className="p-0">
          {[
            { icon: UserIcon, label: "Tên", value: reservation.name },
            {
              icon: PhoneIcon,
              label: "Số điện thoại",
              value: reservation.phone,
            },
            { icon: EnvelopeIcon, label: "Email", value: reservation.email },
            {
              icon: UserGroupIcon,
              label: "Số người",
              value: reservation.numberOfPeople,
            },
            { icon: CalendarIcon, label: "Thời gian", value: reservation.date },
            { icon: PencilIcon, label: "Ghi chú", value: reservation.note },
          ].map(
            (item, index) =>
              item.value && (
                <ListItem key={index} className="py-3 flex items-start">
                  <ListItemPrefix>
                    <item.icon className="h-5 w-5 text-red-500" />
                  </ListItemPrefix>
                  <div className="flex-grow">
                    <Typography variant="small" className="text-gray-600 mb-1">
                      {item.label}
                    </Typography>
                    {Array.isArray(item.value) ? (
                      item.value.map((date, dateIndex) => (
                        <Typography
                          key={dateIndex}
                          variant="small"
                          className="font-medium break-words"
                        >
                          {formatDateTime(date)}
                        </Typography>
                      ))
                    ) : (
                      <Typography
                        variant="small"
                        className="font-medium break-words"
                      >
                        {item.value}
                      </Typography>
                    )}
                  </div>
                </ListItem>
              )
          )}
        </List>
      </CardBody>
    </Card>
  );
};

export default ReservationInformation;
