import { Modal } from "antd";
import OrderDetailAdmin from "../order-detail/OrderDetailAdmin";

const ModalOrderDetailAdmin = ({
  reservation,
  visible,
  onClose,
  fetchData,
}) => {
  return (
    <Modal open={visible} onCancel={onClose} footer={null} width={1400}>
      <div className="max-h-[750px] overflow-y-scroll">
        <OrderDetailAdmin
          reservationData={reservation}
          onClose={onClose}
          fetchData={fetchData}
        />
      </div>
    </Modal>
  );
};
export default ModalOrderDetailAdmin;
