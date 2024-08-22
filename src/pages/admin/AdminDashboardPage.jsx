import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  IconButton,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { BanknotesIcon, ChartBarIcon } from "@heroicons/react/24/solid";
import { TruckIcon, UserIcon } from "lucide-react";
const mockData = {
  stats: [
    {
      icon: <BanknotesIcon className="w-6 h-6 text-white" />,
      title: "Lợi nhuận hôm nay",
      value: "$15,350",
      footer: "10% tăng so với hôm qua  ",
    },
    {
      icon: <UserIcon className="w-6 h-6 text-white" />,
      title: "Tổng số khách hàng",
      value: "3,462",
      footer: "5% tăng trong tuần này",
    },
    {
      icon: <TruckIcon className="w-6 h-6 text-white" />,
      title: "Đơn hàng hôm nay",
      value: "23",
    },
    {
      icon: <ChartBarIcon className="w-6 h-6 text-white" />,
      title: "Giá trị đơn hàng trung bình",
      value: "$42.50",
    },
  ],
  orders: [
    { id: "1001", status: "Hoàn thành", total: 125.99 },
    { id: "1002", status: "Đang xử lý", total: 89.5 },
    { id: "1003", status: "Đang xác nhận", total: 54.25 },
    { id: "1005", status: "Huỷ", total: 0 },
  ],
  popularItems: [
    { name: "Margherita Pizza", sales: 145, price: 12.99 },
    { name: "Caesar Salad", sales: 98, price: 8.5 },
    { name: "Spaghetti Carbonara", sales: 87, price: 14.75 },
    { name: "Grilled Salmon", sales: 76, price: 18.99 },
    { name: "Chocolate Lava Cake", sales: 65, price: 6.5 },
  ],
};
const AdminDashboardPage = ({
  stats = mockData.stats,
  orders = mockData.orders,
  popularItems = mockData.popularItems,
}) => {
  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ icon, title, value, footer }) => (
          <Card key={title}>
            <CardHeader
              variant="gradient"
              className="bg-red-900 absolute -mt-4 grid h-16 w-16 place-items-center"
            >
              {icon}
            </CardHeader>
            <CardBody className="p-4 text-right">
              <Typography
                variant="small"
                className="font-normal text-red-gray-600"
              >
                {title}
              </Typography>
              <Typography variant="h4" color="red-gray">
                {value}
              </Typography>
            </CardBody>
            {footer && (
              <CardBody className="border-t border-red-gray-50 p-4">
                <Typography className="font-normal text-red-gray-600">
                  {footer}
                </Typography>
              </CardBody>
            )}
          </Card>
        ))}
      </div>
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 ">
        <Card>
          <CardHeader
            variant="gradient"
            className="mb-8 p-6 text-center bg-red-900"
          >
            <Typography variant="h6" color="white">
              Đơn hàng gần đây
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Mã đơn", "trạng thái", "Tổng tiền"].map((el) => (
                    <th
                      key={el}
                      className="border-b border-red-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-red-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(({ id, status, total }, key) => (
                  <tr key={id}>
                    <td className="py-3 px-5">
                      <Typography variant="small" color="red-gray">
                        #{id}
                      </Typography>
                    </td>
                    <td className="py-3 px-5">
                      <Typography variant="small" color="red-gray">
                        {status}
                      </Typography>
                    </td>
                    <td className="py-3 px-5">
                      <Typography variant="small" color="red-gray">
                        ${total}
                      </Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            variant="gradient"
            className="mb-8 p-6 text-center bg-red-900"
          >
            <Typography variant="h6" color="white">
              Món ăn phổ biến nhất
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Món", "Số lượng", "Giá"].map((el) => (
                    <th
                      key={el}
                      className="border-b border-red-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-red-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {popularItems.map(({ name, sales, price }, key) => (
                  <tr key={name}>
                    <td className="py-3 px-5">
                      <Typography variant="small" color="red-gray">
                        {name}
                      </Typography>
                    </td>
                    <td className="py-3 px-5">
                      <Typography variant="small" color="red-gray">
                        {sales}
                      </Typography>
                    </td>
                    <td className="py-3 px-5">
                      <Typography variant="small" color="red-gray">
                        ${price}
                      </Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
