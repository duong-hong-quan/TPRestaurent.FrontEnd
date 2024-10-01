import { Modal } from "antd";
import ReservationDetail from "../reservation-detail/ReservationDetail";

const ModalReservationDetail = ({ reservation, visible, onClose }) => {
  return (
    <Modal open={visible} onCancel={onClose} footer={null} width={950}>
      <div className="h-[650px] overflow-auto">
        <ReservationDetail reservationData={reservation} />
      </div>
    </Modal>
  );
};
export default ModalReservationDetail;
