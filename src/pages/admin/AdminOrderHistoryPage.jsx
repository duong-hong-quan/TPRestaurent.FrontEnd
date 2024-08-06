import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { EyeIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { useState } from "react";

const TABS = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "Đang xử lý",
    value: "processing",
  },
  {
    label: "Đã giao hàng",
    value: "delivered",
  },
  {
    label: "Đã hủy",
    value: "cancelled",
  },
];

const TABLE_HEAD = [
  "Mã đơn hàng",
  "Khách hàng",
  "Tổng tiền",
  "Trạng thái",
  "Ngày đặt hàng",
  "",
];

const TABLE_ROWS = [
  {
    id: "DH001",
    customer: "Nguyễn Văn A",
    total: "1,500,000 VND",
    status: "delivered",
    orderDate: "23/04/2024",
  },
  {
    id: "DH002",
    customer: "Trần Thị B",
    total: "800,000 VND",
    status: "processing",
    orderDate: "24/04/2024",
  },
  {
    id: "DH003",
    customer: "Lê Văn C",
    total: "2,200,000 VND",
    status: "delivered",
    orderDate: "25/04/2024",
  },
  {
    id: "DH004",
    customer: "Phạm Thị D",
    total: "1,000,000 VND",
    status: "cancelled",
    orderDate: "26/04/2024",
  },
  {
    id: "DH005",
    customer: "Hoàng Văn E",
    total: "1,800,000 VND",
    status: "processing",
    orderDate: "27/04/2024",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "delivered":
      return "green";
    case "processing":
      return "blue";
    case "cancelled":
      return "red";
    default:
      return "blue-gray";
  }
};

const getStatusText = (status) => {
  switch (status) {
    case "delivered":
      return "Đã giao hàng";
    case "processing":
      return "Đang xử lý";
    case "cancelled":
      return "Đã hủy";
    default:
      return "Không xác định";
  }
};

export function AdminOrderHistoryPage() {
  const [activeTab, setActiveTab] = useState("delivered");

  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Lịch sử đơn hàng
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Xem và quản lý tất cả các đơn hàng
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
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_ROWS.map(
              ({ id, customer, total, status, orderDate }, index) => {
                const isLast = index === TABLE_ROWS.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={id}>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {id}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {customer}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {total}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={getStatusText(status)}
                          color={getStatusColor(status)}
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {orderDate}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Xem chi tiết">
                        <IconButton variant="text">
                          <EyeIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Trang 1 / 10
        </Typography>
        <div className="flex gap-2">
          <Button variant="outlined" size="sm">
            Trước
          </Button>
          <Button variant="outlined" size="sm">
            Tiếp
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
