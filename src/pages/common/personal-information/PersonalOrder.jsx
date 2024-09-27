import { useEffect, useState } from "react";
import OrderHistoryList from "../../../components/order-history/OrderHistoryList";
import useCallApi from "../../../api/useCallApi";
import { useSelector } from "react-redux";
import LoadingOverlay from "../../../components/loading/LoadingOverlay";
import Pagination from "../../../components/pagination/Pagination";

const PersonalOrder = () => {
  const { callApi, error, loading } = useCallApi();
  const user = useSelector((state) => state.user.user || {});
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const totalItems = 10;
  const handleCurrentPageChange = (page) => {
    setCurrentPage(page);
  };
  const fetchData = async () => {
    const res = await callApi(
      `order/get-all-order-by-phone-number/${currentPage}/${totalItems}?phoneNumber=${user.phoneNumber}`,
      "GET"
    );
    if (res.isSuccess) {
      setOrders(res.result.items);
      setTotalPages(res.result.totalPages);
    }
  };
  useEffect(() => {
    fetchData();
  }, [user, currentPage]);
  const tabs = [
    { id: "all", label: "Tất cả" },
    { id: "pending", label: "Chờ xác nhận" },
    { id: "verified", label: "Đã xác nhận" },
    { id: "delivering", label: "Đang giao" },
    { id: "received", label: "Đã nhận hàng" },
    { id: "canceled", label: "Đã huỷ" },
  ];
  const [activeTab, setActiveTab] = useState("all");
  const renderTabContent = () => {
    switch (activeTab) {
      case "all":
        return (
          <div>
            <OrderHistoryList orders={orders} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handleCurrentPageChange}
            />
          </div>
        );
      case "pending":
        return <p>Nội dung cài đặt tài khoản ở đây.</p>;
      case "delivering":
        return <p>Nội dung cài đặt tài khoản ở đây.</p>;
      case "canceled":
        return <p>Nội dung cài đặt tài khoản ở đây.</p>;
      default:
        return null;
    }
  };
  if (loading) {
    return <LoadingOverlay isLoading={loading} />;
  }
  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="uppercase text-red-700 font-bold text-2xl mb-6">
        Thông tin của tôi
      </h1>

      <div className="mb-4">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                activeTab === tab.id
                  ? "border-b-2 border-red-700 text-red-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">{renderTabContent()}</div>
    </div>
  );
};
export default PersonalOrder;
