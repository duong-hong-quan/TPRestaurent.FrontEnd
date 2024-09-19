import { Card, CardBody, Typography } from "@material-tailwind/react";
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserGroupIcon,
  CalendarIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import { formatDateRange, formatDateTime } from "../../util/Utility";

const ReservationInformation = ({ reservation }) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    email,
    note,
    date,
    numberOfPeople,
  } = reservation;

  return (
    <div className="w-full">
      {
        <Card className="shadow-none border-none">
          <CardBody>
            <Typography variant="h5" className="mb-4 text-center">
              Thông tin đặt bàn
            </Typography>
            <div className="mb-4 flex items-center justify-between">
              <Typography variant="h6">Họ và tên</Typography>
              <Typography variant="body1">
                {firstName} {lastName}
              </Typography>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <Typography variant="h6">Số điện thoại liên hệ</Typography>
              <Typography variant="body1">0{phoneNumber}</Typography>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <Typography variant="h6">Email</Typography>
              <Typography variant="body1">{email}</Typography>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <Typography variant="h6">Số khách</Typography>
              <Typography variant="body1">{numberOfPeople} khách</Typography>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <Typography variant="h6">Thời gian dùng bữa</Typography>
              <Typography variant="body1">
                {formatDateRange(date[0], date[1])}
              </Typography>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <Typography variant="h6">Ghi chú</Typography>
              <Typography variant="body1">{note}</Typography>
            </div>
          </CardBody>
        </Card>
      }
    </div>
  );
};

export default ReservationInformation;
