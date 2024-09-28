import React from "react";

const PolicyBooking = () => {
  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Chính sách đặt bàn
        </h2>
      </div>
      <div className="p-6 space-y-6">
        <section>
          <h3 className="text-xl font-semibold mb-2 text-gray-700">
            1. Đặt chỗ
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Thanh toán cọc trước 100% giá trị đặt chỗ</li>
            <li>Sau khi ăn, tiền cọc sẽ được trừ vào hóa đơn</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2 text-gray-700">
            2. Đặt kèm đồ ăn
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>
              Thanh toán tiền cọc bằng tổng của:
              <ul className="list-circle list-inside ml-4 mt-2">
                <li>Phần trăm giá trị đơn đặt đồ ăn</li>
                <li>Tiền giữ chỗ</li>
              </ul>
            </li>
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
