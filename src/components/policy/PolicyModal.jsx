import { Button, Modal } from "antd";
import PolicyBooking from "./PolicyBooking";
import PolicyOrder from "./PolicyOrder";
import { Typography } from "@material-tailwind/react";

const ModalPolicy = ({ show, handleClose, setChoose }) => {
  return (
    <Modal
      title=""
      open={show}
      onCancel={handleClose}
      footer={null}
      width={700}
    >
      <Typography className="text-red-900 text-3xl font-bold text-center">
        CHÍNH SÁCH NHÀ HÀNG THIÊN PHÚ
      </Typography>
      <div className="max-h-[400px] overflow-auto">
        <PolicyBooking />
        <PolicyOrder />
      </div>
      <hr />
      <div className="flex justify-center py-2">
        <Button
          onClick={() => {
            setChoose(1);
            handleClose();
          }}
          className="bg-red-900 text-white"
        >
          Đặt bàn giữ chỗ
        </Button>
        <Button
          onClick={() => {
            setChoose(2);
            handleClose();
          }}
          className="ml-4 bg-red-900 text-white"
        >
          Đặt bàn kèm món ăn
        </Button>
      </div>
    </Modal>
  );
};

export default ModalPolicy;
