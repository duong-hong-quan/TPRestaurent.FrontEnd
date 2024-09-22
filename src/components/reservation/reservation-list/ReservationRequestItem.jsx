import { useEffect, useState } from "react";
import {
  FaCalendar,
  FaIdCard,
  FaClock,
  FaUsers,
  FaAngleDown,
  FaAngleUp,
  FaInfoCircle,
} from "react-icons/fa";
import {
  calculateTimeDifference,
  formatDate,
  formatDateTime,
  getKeyByValue,
} from "../../../util/Utility";
import ReservationDetail from "../reservation-detail/ReservationDetail";
import { ReservationStatus } from "../../../util/GlobalType";
import { createPayment } from "../../../api/transactionApi";
import useCallApi from "../../../api/useCallApi";
import { OrderApi } from "../../../api/endpoint";
import moment from "moment/moment";
import LoadingOverlay from "../../loading/LoadingOverlay";

const ReservationRequestItem = ({ reservation }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [reservationId, setCurrentReservationId] = useState(null);
  // Format reservationDate and endTime
  const formattedDate = moment(reservation.reservationDate).format(
    "DD/MM/YYYY"
  );
  const formattedStartTime = moment(reservation.reservationDate).format(
    "HH:mm"
  );
  const formattedEndTime = moment(reservation.endTime).format("HH:mm");
  const formattedDateTime = (
    <span>
      <span className="text-red-900">{formattedDate}</span> lúc
      <span className="text-red-900 mx-1">{formattedStartTime}</span> -
      <span className="text-red-900 mx-1">{formattedEndTime}</span>
    </span>
  );
  const { callApi, error, loading } = useCallApi();
  // Format the time difference for display
  const [reservationData, setReservationData] = useState({});
  const handleChange = async (id) => {
    setShowDetails(!showDetails);
    const response = await callApi(`${OrderApi.GET_DETAIL}/${id}`, "GET");
    if (response?.isSuccess) {
      setReservationData(response?.result);
      setCurrentReservationId(id);
    }
  };
  useEffect(() => {
    if (showDetails) {
    }
  }, [showDetails, reservationId]);
  const statusKey = getKeyByValue(ReservationStatus, reservation.statusId);
  const handlePayment = async () => {
    const data = await createPayment({
      reservationId: reservation.reservationId,
      paymentMethod: 2,
    });
    if (data?.isSuccess) {
      window.location.href = data?.result;
    }
  };
  function getBadgeColor(status) {
    switch (status) {
      case ReservationStatus.PENDING:
        return "yellow";
      case ReservationStatus.TABLE_ASSIGNED:
        return "blue";
      case ReservationStatus.PAID:
        return "green";
      case ReservationStatus.DINING:
        return "orange";
      case ReservationStatus.CANCELLED:
        return "red";
      default:
        return "gray";
    }
  }

  if (loading) {
    return <LoadingOverlay isLoading={loading} />;
  }
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex items-center mb-2 md:mb-0">
          <p className=" text-sm font-bold ml-2">
            ID: {reservation.orderId.substring(0, 8)}
          </p>
          <p className="text-gray-600 text-xs ml-2">
            {formatDateTime(reservation.reservationDate)}
          </p>
        </div>
        <p
          className={`text-yellow-600 text-lg  font-semibold px-3 py-1 rounded-full text-${getBadgeColor(
            statusKey
          )}-700`}
        >
          {reservation.status.vietnameseName.toUpperCase()}
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex items-center mb-2 md:mb-0">
          <div className="flex text-lg">
            <p className="font-semibold uppercase">
              {`${reservation.account.lastName} ${reservation?.account?.firstName} `}
            </p>
            <p className="font-bold mx-2">
              {`- 0${reservation?.account?.phoneNumber} `}
            </p>
          </div>
        </div>
      </div>
      <div className="">
        <p className="font-medium flex items-center justify-start">
          <FaCalendar className="mr-2 text-gray-500" />
          {formattedDateTime} dành cho {reservation.numOfPeople} người
        </p>
      </div>
      <div className="flex flex-col md:flex-row justify-end items-center">
        <div className="flex justify-end">
          {reservation?.statusId === 1 && (
            <button
              onClick={() => handlePayment(reservation)}
              className=" text-red-900 font-semibold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
            >
              Thanh toán ngay
            </button>
          )}

          <button
            onClick={() => handleChange(reservation.orderId)}
            className="flex items-center mx-2 text-red-900 font-semibold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
          >
            {showDetails
              ? "Ẩn thông tin chi tiết"
              : "Chi tiết thông tin đặt bàn"}
            {showDetails ? <FaAngleUp /> : <FaAngleDown />}
          </button>
        </div>
      </div>

      {!loading && showDetails && (
        <ReservationDetail reservationData={reservationData} />
      )}
    </div>
  );
};

export default ReservationRequestItem;
