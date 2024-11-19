import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { Input, Typography, Button } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import TransactionTable from "./transaction/TransactionTable";
import useCallApi from "../../api/useCallApi";
import LoadingOverlay from "../../components/loading/LoadingOverlay";
import TabMananger from "../../components/tab/TabManager";
import Pagination from "../../components/pagination/Pagination";
import { TransactionStatus } from "../../util/GlobalType";
import { TransactionApi } from "../../api/endpoint";
import ModalTransactionDetail from "../../components/payment/ModalTransactionDetail";

const TABS = TransactionStatus;

const TransactionPage = () => {
  const [activeTab, setActiveTab] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState({});
  const [transactionData, setTransactionData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { callApi, error, loading } = useCallApi();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const totalItems = 10;
  const handleCurrentPageChange = (page) => {
    setCurrentPage(page);
  };
  const handleOpenModal = async (record) => {
    const response = await callApi(
      `${TransactionApi.GET_TRANSACTION_BY_ID}/${record.id}`,
      "GET"
    );
    if (response.isSuccess) {
      setSelectedTransaction(response.result);
      setIsModalOpen(true);
    } else {
      showError(error);
    }
  };
  const fetchData = async () => {
    const response = await callApi(
      `/transaction/get-all-payment/${currentPage}/${totalItems}?transationStatus=${activeTab}`,
      "GET"
    );
    if (response?.isSuccess) {
      setTransactionData(response.result?.items);
      setTotalPages(response.result.totalPages);
    }
  };
  useEffect(() => {
    fetchData();
  }, [currentPage, activeTab]);

  return (
    <div className="w-full">
      <LoadingOverlay isLoading={loading} />

      <div className="w-full  bg-white px-4 py-2  rounded-md">
        <div className="w-full">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Danh sách giao dịch
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Xem và quản lý tất cả các giao dịch
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button className="flex items-center gap-3 bg-red-800" size="sm">
                <ArrowPathIcon strokeWidth={2} className="h-4 w-4" /> Làm mới
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="mb-4">
              <TabMananger
                items={TABS}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
            <div className="w-full md:w-72">
              <Input
                label="Tìm kiếm"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
            </div>
          </div>
        </div>
        <TransactionTable
          data={transactionData}
          loading={loading}
          handleOpenModal={handleOpenModal}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handleCurrentPageChange}
        />
        <ModalTransactionDetail
          data={selectedTransaction}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
};
export default TransactionPage;
