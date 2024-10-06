import React from "react";

const PolicyBooking = () => {
  return (
    <div className="max-w-2xl">
      <div className="py-4">
        <h2 className="text-lg font-bold text-red-800 uppercase">
          Chính sách đặt bàn
        </h2>
      </div>
      <div className=" space-y-6">
        <section>
          <h3 className="text-lg font-semibold mb-2 text-gray-700 uppercase ">
            Đặt chỗ
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Thanh toán cọc trước 100% giá trị đặt chỗ</li>
            <li>Sau khi ăn, tiền cọc sẽ được trừ vào hóa đơn</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2 text-gray-700 uppercase">
            Đặt kèm đồ ăn
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600 ">
            <li>
              Thanh toán tiền cọc = Phần trăm giá trị đơn đặt đồ ăn + Tiền giữ
              chỗ
            </li>
          </ul>
        </section>
        <section>
          <h3 className="text-lg font-semibold mb-2 text-gray-700 uppercase">
            Thời gian giữ chỗ
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600 ">
            <li>Đối với đặt chỗ kèm món ăn: trước 2 ngày</li>
            <li>Đối với đặt chỗ không kèm món ăn: trước 2 tiếng dùng bữa</li>
          </ul>
        </section>

        <p className="italic text-sm text-gray-500">
          Lưu ý: Chính sách này áp dụng cho tất cả các đơn đặt bàn. Để biết thêm
          chi tiết, vui lòng liên hệ với nhân viên nhà hàng.
        </p>
      </div>
    </div>
  );
};

export default PolicyBooking;
