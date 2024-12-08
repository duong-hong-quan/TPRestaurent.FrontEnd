import { Empty } from "antd";
import ReservationRequestItem from "./ReservationRequestItem";

const ReservationList = ({ reservations }) => {
  return (
    <div>
      {reservations.length === 0 && <Empty />}
      {reservations.length > 0 && reservations.map((reservation) => (
        <ReservationRequestItem reservation={reservation} />
      ))}
    </div>
  );
};

export default ReservationList;
