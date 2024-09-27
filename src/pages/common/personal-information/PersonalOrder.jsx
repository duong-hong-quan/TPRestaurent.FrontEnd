import { useEffect, useState } from "react";
import OrderHistoryList from "../../../components/order-history/OrderHistoryList";
import useCallApi from "../../../api/useCallApi";
import { useSelector } from "react-redux";
import LoadingOverlay from "../../../components/loading/LoadingOverlay";
import Pagination from "../../../components/pagination/Pagination";
import TabMananger from "../../../components/tab/TabManager";

const PersonalOrder = () => {
  const { callApi, error, loading } = useCallApi();
  const user = useSelector((state) => state.user.user || {});
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const totalItems = 10;
  const [activeTab, setActiveTab] = useState(4);

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
  }, [user, currentPage, activeTab]);
  const tabs = [
    { value: 4, label: "Chờ xác nhận" },
    { value: 5, label: "Chưa thanh toán" },
    { ivalued: 6, label: "Đang giao" },
    { value: 7, label: "Đã nhận hàng" },
    { value: 8, label: "Đã huỷ" },
  ];

  if (loading) {
    return <LoadingOverlay isLoading={loading} />;
  }
  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="uppercase text-red-700 font-bold text-2xl mb-6">
        Thông tin của tôi
      </h1>

      <div className="mb-4">
        <TabMananger
          items={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      <div className="mt-4">
        {" "}
        <div>
          <OrderHistoryList orders={orders} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handleCurrentPageChange}
          />
        </div>
      </div>
    </div>
  );
};
export default PersonalOrder;
