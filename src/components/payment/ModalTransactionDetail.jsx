import { Modal } from "antd";
import OrderDetailsView from "./PaymentDetail";

const ModalTransactionDetail = ({ data, isOpen, onClose }) => {
  return (
    <Modal open={isOpen} onCancel={onClose} footer={null}>
      <OrderDetailsView data={data} />
    </Modal>
  );
};
export default ModalTransactionDetail;
