import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import TransactionTable from "./transaction/TransactionTable";
import { getAllTransactions } from "../../api/transactionApi";

const TABS = [
  {
    label: "Tất cả",
    value: "",
  },
  {
    label: "Đang xử lý",
    value: "0",
  },
  {
    label: "Thất bại",
    value: "1",
  },
  {
    label: "Thành công",
    value: "2",
  },
  {
    label: "Đã áp dụng",
    value: "3",
  },
];

export function TransactionPage() {
  const [activeTab, setActiveTab] = useState("");
  const [transactionData, setTransactionData] = useState([]);

  const fetchData = async () => {
    const response = await getAllTransactions(1, 10, activeTab);
    if (response?.isSuccess) {
      setTransactionData(response.result?.items);
    }
  };
  useEffect(() => {
    fetchData();
  }, [activeTab]);
  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
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
            <Button variant="outlined" size="sm">
              Xuất báo cáo
            </Button>
            <Button className="flex items-center gap-3 bg-red-800" size="sm">
              <ArrowPathIcon strokeWidth={2} className="h-4 w-4" /> Làm mới
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="mb-4">
            <div className="flex border-b border-gray-200">
              {TABS.map((tab) => (
                <button
                  key={tab.value}
                  className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                    activeTab === tab.value
                      ? "border-b-2 border-red-700 text-red-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab.value)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full md:w-72">
            <Input
              label="Tìm kiếm"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <TransactionTable data={transactionData} />
      </CardBody>
    </Card>
  );
}
