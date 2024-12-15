import React, { useState } from "react";
import { Modal, List, Checkbox, Button, Typography } from "antd";
import { Ticket, Calendar, DollarSign } from "lucide-react";
import { formatDate, formatDateTime, formatPrice } from "../../util/Utility";

const { Text } = Typography;

const CouponSelectionModal = ({
  visible,
  onClose,
  coupons,
  onSelectCoupons,
  totalPrice,
}) => {
  const [selectedCoupons, setSelectedCoupons] = useState([]);

  const handleSelectCoupon = (couponId) => {
    setSelectedCoupons((prev) =>
      prev.includes(couponId)
        ? prev.filter((id) => id !== couponId)
        : [...prev, couponId]
    );
  };

  const handleConfirm = () => {
    onSelectCoupons(selectedCoupons);
    onClose();
  };
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={[
        <Button
          key="confirm"
          className="bg-red-900 text-white"
          onClick={handleConfirm}
        >
          Xác nhận
        </Button>,
      ]}
      width={600}
    >
      <h3 className="font-bold text-red-800 text-xl text-center">
        CÁC COUPON KHẢ DỤNG
      </h3>
      <List
        dataSource={coupons}
        renderItem={(coupon) => (
          <List.Item
            className={
              totalPrice < coupon.couponProgram?.minimumAmount
                ? `flex  bg-gray-50  items-center `
                : `bg-white flex items-center`
            }
          >
            <Checkbox
              onChange={() => handleSelectCoupon(coupon?.couponId)}
              checked={selectedCoupons.includes(coupon?.couponId)}
              disabled={totalPrice < coupon.minimumAmount}
            >
              <div className="flex items-center">
                <img
                  src={coupon?.couponProgram?.img}
                  alt={coupon?.couponProgram?.code}
                  className="w-16 h-16 mr-4 object-cover rounded"
                />
                <div>
                  <Text className="uppercase font-bold">
                    Chương trình {coupon?.couponProgram?.title}{" "}
                  </Text>
                  <Text strong>{coupon.code}</Text>
                  <div className="flex items-center">
                    <Ticket className="w-4 h-4 mr-1" />
                    <Text>Giảm {coupon?.couponProgram?.discountPercent}% </Text>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <Text>{formatDate(coupon?.couponProgram?.expiryDate)}</Text>
                  </div>
                  <div className="flex items-center">
                    <Text>
                      Mua sắm tổi thiểu{" "}
                      {formatPrice(coupon?.couponProgram.minimumAmount)}
                    </Text>
                  </div>
                </div>
              </div>
            </Checkbox>
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default CouponSelectionModal;
