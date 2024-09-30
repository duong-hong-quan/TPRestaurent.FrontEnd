import { useEffect, useState } from "react";
import TabMananger from "../../components/tab/TabManager";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
} from "@material-tailwind/react";
import { ArrowPathIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import useCallApi from "../../api/useCallApi";
import DishTable from "../../components/table/DishTable";
import Pagination from "../../components/pagination/Pagination";
import { DishApi } from "../../api/endpoint";
const AdminDishPage = () => {
  const MenuTab = [
    {
      label: "Món lẻ",
      value: "1",
    },

    {
      label: "Món Combo",
      value: "2",
    },
  ];
  const TABS = [
    {
      label: "Tất cả",
      value: "",
    },
    {
      label: "Còn món",
      value: "7",
    },
    {
      label: "Hết món",
      value: "8",
    },
    {
      label: "Ngưng bán",
      value: "8",
    },
  ];

  const [activeTab, setActiveTab] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dishes, setDishes] = useState([]);
  const { callApi, error, loading } = useCallApi();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedMenuTab, setSelectedMenuTab] = useState("1");
  const totalItems = 10;
  const handleCurrentPageChange = (page) => {
    setCurrentPage(page);
  };
  const renderMenuTab = () => {
    return (
      <div className="flex gap-1 my-1">
        {MenuTab.map((tab) => (
          <Button
            key={tab.value}
            className={`${
              Number(selectedMenuTab) === Number(tab.value)
                ? "bg-red-800 text-white"
                : "bg-white text-gray-800"
            }    min-w-40  rounded-tl-md rounded-tr-md rounded-bl-none rounded-br-none border`}
            size="sm"
            onClick={() => setSelectedMenuTab(tab.value)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
    );
  };
  const fetchDishes = async () => {
    const response = await callApi(
      `${DishApi.GET_ALL}/${currentPage}/${totalItems}`,
      "GET"
    );
    if (response?.isSuccess) {
      setDishes(response.result.items);
      setTotalPages(response.result.totalPages);
    }
  };
  useEffect(() => {
    fetchDishes();
  }, [currentPage]);
  console.log(selectedMenuTab);
  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Quản lý món ăn
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Xem và quản lý tất cả các món ăn
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button variant="outlined" size="sm">
              Xuất báo cáo
            </Button>
            <Button className="flex items-center bg-red-700 gap-3" size="sm">
              <ArrowPathIcon strokeWidth={2} className="h-4 w-4" /> Làm mới
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="mb-4">
            {renderMenuTab()}
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-y-scroll h-[550px]">
        <DishTable dishes={dishes} key={"dishes"} loading={loading} />
      </CardBody>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handleCurrentPageChange}
      />
    </Card>
  );
};
export default AdminDishPage;
