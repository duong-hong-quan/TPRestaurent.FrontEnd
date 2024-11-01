import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { BanknotesIcon, ChartBarIcon } from "@heroicons/react/24/solid";
import {
  CalendarCheck,
  ChefHatIcon,
  Clock,
  ExternalLink,
  EyeIcon,
  MapPin,
  TruckIcon,
  UserIcon,
  Users,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import useCallApi from "../../api/useCallApi";
import { OrderApi } from "../../api/endpoint";
import dayjs from "dayjs";
import { formatDate, formatDateTime, formatPrice } from "../../util/Utility";
import OrderTag from "../../components/tag/OrderTag";
import ModalOrderDetailAdmin from "../../components/order/modal/ModalOrderDetailAdmin";
import LoadingOverlay from "../../components/loading/LoadingOverlay";
import { StyledTable } from "../../components/custom-ui/StyledTable";
import { DatePicker, Space } from "antd";
import { configCalendar } from "./AdminMealHistoryPage";
const { RangePicker } = DatePicker;

// Thêm mock data cho các biểu đồ
const mockData = {
  stats: [
    {
      icon: <BanknotesIcon className="w-6 h-6 text-white" />,
      title: "Lợi nhuận hôm nay",
      footer: "10% tăng so với hôm qua",
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
      icon: <CalendarCheck className="w-6 h-6 text-white" />,
      title: "Tổng lượt đặt bàn hôm nay",
      value: "10 lịch đặt bàn",
    },
    {
      icon: <ChefHatIcon className="w-6 h-6 text-white" />,
      title: "Nhân viên nhà bếp",
      value: "19 nhân viên",
    },
    {
      icon: <UserIcon className="w-6 h-6 text-white" />,
      title: "Tổng shipper",
      value: "7 nhân viên",
      footer: "3 nhân viên đang hoạt động",
    },
  ],

  popularItems: [
    { name: "Margherita Pizza", sales: 145, price: 12.99 },
    { name: "Caesar Salad", sales: 98, price: 8.5 },
    { name: "Spaghetti Carbonara", sales: 87, price: 14.75 },
    { name: "Grilled Salmon", sales: 76, price: 18.99 },
    { name: "Chocolate Lava Cake", sales: 65, price: 6.5 },
  ],
  revenueData: [
    { name: "T2", revenue: 4000 },
    { name: "T3", revenue: 3000 },
    { name: "T4", revenue: 2000 },
    { name: "T5", revenue: 2780 },
    { name: "T6", revenue: 1890 },
    { name: "T7", revenue: 2390 },
    { name: "CN", revenue: 3490 },
  ],
  categoryData: [
    { name: "Món chính", value: 400 },
    { name: "Tráng miệng", value: 300 },
    { name: "Đồ uống", value: 300 },
    { name: "Khai vị", value: 200 },
  ],
  orderStatusData: [
    { status: "Hoàn thành", count: 45 },
    { status: "Đang xử lý", count: 25 },
    { status: "Đang xác nhận", count: 15 },
    { status: "Huỷ", count: 5 },
  ],
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AdminDashboardPage = ({
  stats = mockData.stats,
  orders = mockData.orders,
  popularItems = mockData.popularItems,
  revenueData = mockData.revenueData,
  categoryData = mockData.categoryData,
  orderStatusData = mockData.orderStatusData,
}) => {
  const [reservations, setReservations] = useState([]);
  const { callApi, error, loading } = useCallApi();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [ordersData, setOrdersData] = useState([]);
  const fetchDetail = async (id) => {
    const response = await callApi(`${OrderApi.GET_DETAIL}/${id}`, "GET");
    if (response?.isSuccess) {
      setOrderDetail(response?.result);
      setIsModalOpen(true);
    }
  };
  const fetchReservations = async () => {
    const response = await callApi(
      `${OrderApi.GET_ORDER_WITH_FILTER}`,
      "POST",
      {
        startDate: dayjs().format("YYYY-MM-DD"),
        endDate: dayjs().format("YYYY-MM-DD"),
        type: 1 || 3,
      }
    );
    if (response?.isSuccess) {
      setReservations(response?.result?.items);
    }
  };
  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
      render: (text) => <Typography>{text.substring(0, 8)}</Typography>,
    },
    {
      title: "Khách hàng",
      dataIndex: "customerInfo",
      key: "customerInfo",
      render: (_, record) => (
        <Typography>
          {`${record.account?.firstName} ${record.account?.lastName}`}
        </Typography>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (_, record) => (
        <Typography>{formatPrice(record.totalAmount)} </Typography>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, record) => <OrderTag orderStatusId={record.statusId} />,
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (_, record) => (
        <Typography>{formatDateTime(record.orderDate)}</Typography>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      dataIndex: "action",
      render: (_, record) => (
        <IconButton
          variant="text"
          onClick={async () => await fetchDetail(record.orderId)}
        >
          <EyeIcon className="h-4 w-4 text-black" />
        </IconButton>
      ),
    },
  ];
  const fetchOrder = async () => {
    const response = await callApi(
      `${OrderApi.GET_ORDER_WITH_FILTER}`,
      "POST",
      {
        startDate: dayjs().format("YYYY-MM-DD"),

        endDate: dayjs().format("YYYY-MM-DD"),
        status: 4 || 5,
        type: 2,
      }
    );
    if (response?.isSuccess) {
      setOrdersData(response?.result?.items);
    }
  };
  useEffect(() => {
    fetchReservations();
    fetchOrder();
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12">
      <LoadingOverlay loading={loading} />
      <div className="p-6  bg-white col-span-1 xl:col-span-9 max-h-[900px] overflow-y-auto">
        <div className="flex   justify-between my-10">
          <Typography className="mr-2 text-red-800 font-semibold text-2xl">
            TRANG THỐNG KÊ TỔNG QUAN HỆ THỐNG
          </Typography>
          <div className="flex bg-white px-2 py-4 rounded-xl items-center">
            <Typography className="mr-2 text-red-800 font-semibold">
              Chọn khoảng ngày
            </Typography>
            <RangePicker
              locale={configCalendar}
              format="DD/MM/YYYY"
              onChange={(value) => {
                console.log(value);
              }}
              value={[dayjs().subtract(7, "day"), dayjs()]}
              size="large"
            />
          </div>
        </div>
        <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
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

        {/* Biểu đồ doanh thu theo ngày */}

        <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2">
          <Card>
            <CardHeader variant="gradient" className="mb-8 p-6 bg-red-900">
              <Typography variant="h6" color="white">
                Doanh thu theo ngày
              </Typography>
            </CardHeader>
            <CardBody>
              <div className="w-full h-96">
                <LineChart
                  height={300}
                  width={500}
                  data={revenueData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                </LineChart>
              </div>
            </CardBody>
          </Card>
          {/* Biểu đồ trạng thái đơn hàng */}
          <Card>
            <CardHeader
              variant="gradient"
              className="mb-8 p-6 text-center bg-red-900"
            >
              <Typography variant="h6" color="white">
                Trạng thái đơn hàng
              </Typography>
            </CardHeader>
            <CardBody>
              <div className="w-full h-72">
                <BarChart width={400} height={250} data={orderStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8">
                    {orderStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </div>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader
            variant="gradient"
            className="mb-8 p-6 text-center bg-red-900"
          >
            <Typography variant="h6" color="white">
              Đơn hàng gần đây
            </Typography>
          </CardHeader>
          <CardBody className="overflow-y-scroll max-h-[300px] pb-2">
            <StyledTable
              columns={columns}
              dataSource={ordersData}
              pagination={false}
              rowKey="orderId"
              loading={loading}
            />
          </CardBody>
        </Card>
      </div>
      <div className="col-span-1 xl:col-span-3 p-4 max-h-[900px] overflow-y-auto bg-gray-50">
        <Typography className="text-lg uppercase text-red-800 font-semibold my-2">
          Lịch đặt bàn hôm nay
        </Typography>
        {reservations?.map((item, index) => (
          <div
            key={index}
            className="my-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4"
          >
            {/* Header Section */}
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-800">
                  {formatDate(item?.mealTime)}
                </span>
              </div>
              <button
                onClick={async () => await fetchDetail(item.orderId)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <ExternalLink className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Content Section */}
            <div className="flex space-x-4">
              {/* Time Indicator */}
              <div className="relative flex flex-col items-center">
                <div
                  className={`w-2 h-full absolute top-0 left-1/2 transform -translate-x-1/2 rounded-full ${
                    item.statusId == 4
                      ? "bg-blue-500"
                      : item.statusId == 10
                      ? "bg-red-700"
                      : "bg-green-800"
                  }`}
                />
                <span className="bg-white z-10 px-3 py-1 rounded-full text-sm font-semibold text-gray-700 border border-gray-200">
                  {dayjs(item?.mealTime).format("HH:mm")}
                </span>
              </div>

              {/* Booking Details */}
              <div className="flex-1">
                <div className="space-y-3">
                  {/* Customer Name */}
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-800">{`${item.account?.firstName} ${item.account.lastName}`}</span>
                  </div>

                  {/* Table Information */}
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {item.tables.map((item) => (
                      <span className="text-sm font-bold mx-2 block">
                        {item.table.tableName}
                      </span>
                    ))}
                  </div>

                  {/* Guest Count */}
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{item.numOfPeople} người</span>
                  </div>
                </div>

                {/* Status Tag */}
                <div className="mt-4">
                  <OrderTag orderStatusId={item.statusId} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ModalOrderDetailAdmin
        onClose={() => setIsModalOpen(false)}
        reservation={orderDetail}
        visible={isModalOpen}
        key={`MODAL`}
      />
    </div>
  );
};

export default AdminDashboardPage;
