const PolicyOrder = () => {
  return (
    <div class="max-w-2xl bg-white my-2">
      <h2 class="text-lg font-bold mb-6 text-red-800  uppercase pb-2">
        Chính Sách Mua Hàng
      </h2>

      <div class="mb-6">
        <h3 class="text-xl font-semibold mb-3 text-gray-700">ĐƠN HÀNG:</h3>
        <ul class="list-disc pl-5 space-y-2 text-gray-600">
          <li>Đồ ăn đã mua không được đổi trả.</li>
          <li>Vui lòng kiểm tra kỹ trước khi nhận hàng.</li>
          <li>
            Khách hàng vui lòng thanh toán 100% online qua các cổng thanh toán
            MOMO, VNPAY.
          </li>
          <li>Mọi sự khiếu nại vui lòng gọi hotline 0366.666.666</li>
        </ul>
      </div>

      <div>
        <h3 class="text-xl font-semibold mb-3 text-gray-700">PHÍ GIAO HÀNG:</h3>
        <ul class="list-disc pl-5 space-y-2 text-gray-600">
          <li>
            Phí giao hàng sẽ được tính dựa trên khoảng cách và thời gian giao
            hàng.
          </li>
          <li>
            Phí giao hàng sẽ được hiển thị rõ ràng trước khi xác nhận đơn hàng.
          </li>
        </ul>
      </div>
    </div>
  );
};
export default PolicyOrder;
