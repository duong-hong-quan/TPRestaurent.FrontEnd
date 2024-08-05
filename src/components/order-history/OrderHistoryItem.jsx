const OrderHistoryItem = ({ order }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex items-center mb-2 md:mb-0">
          <p className="text-gray-600 mr-2">Ngày tạo đơn: 03/12/2002</p>
          <span className="text-gray-400">|</span>
          <p className="text-gray-600 ml-2">ID: 11111</p>
        </div>
        <p className="text-green-600 font-semibold">Đã nhận hàng</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex items-center mb-2 md:mb-0">
          <img
            src=""
            alt=""
            className="w-16 h-16 object-cover rounded-md mr-4"
          />
          <div>
            <p className="font-semibold">Sủi cảo</p>
            <p className="text-gray-600">Số lượng: 1</p>
            <p className="text-gray-800 font-medium">200,000 đ</p>
          </div>
        </div>
        <p className="text-red-600">+10 món khác</p>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold">
          Thành tiền: <span className="text-red-700"> 330.000 đ </span>
        </p>
        <button className="bg-red-700 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
          Xem chi tiết
        </button>
      </div>
    </div>
  );
};

export default OrderHistoryItem;
