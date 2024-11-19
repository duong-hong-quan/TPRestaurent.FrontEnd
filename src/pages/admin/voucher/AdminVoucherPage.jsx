import { ArrowPathIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Typography,
} from "@material-tailwind/react";
import { Edit, PlusIcon, TrashIcon } from "lucide-react";
import useCallApi from "../../../api/useCallApi";
import { CouponApi } from "../../../api/endpoint";
import { formatDateTime, formatPrice, showError } from "../../../util/Utility";
import { useEffect, useState } from "react";
import LoadingOverlay from "../../../components/loading/LoadingOverlay";
import { Image, Tag } from "antd";
import { StyledTable } from "../../../components/custom-ui/StyledTable";

const AdminVoucherPage = () => {
  const [coupons, setCoupons] = useState([]);
  const { callApi, error, loading } = useCallApi();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const totalItems = 10;
  const handleCurrentPageChange = (page) => {
    setCurrentPage(page);
  };
  const fetchData = async () => {
    const response = await callApi(`${CouponApi.GET_ALL}/1/100`, "GET");
    if (response?.isSuccess) {
      setCoupons(response.result.items);
      setTotalPages(response.totalPages);
    } else {
      showError(response.messages);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "img",
      key: "img",
      render: (img) => (
        <div className="w-16 h-16">
          <Image
            src={img}
            alt="Coupon"
            className="w-16 h-16 object-cover rounded"
          />
        </div>
      ),
    },
    {
      title: "Mã giảm giá",
      dataIndex: "code",
      key: "code",

      render: (code) => (
        <Tag color="blue" className="text-base px-3 py-1">
          {code}
        </Tag>
      ),
    },
    {
      title: "Phần trăm giảm",
      dataIndex: "discountPercent",
      key: "discountPercent",
      render: (discount) => `${discount}%`,
    },
    {
      title: "Giá tối thiểu",
      dataIndex: "minimumAmount",
      key: "minimumAmount",
      render: (amount) => formatPrice(amount),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Thời gian sử dụng",
      key: "period",
      render: (_, record) => (
        <div className="flex justify-center flex-nowrap ">
          <div> {formatDateTime(record.startDate)}</div>
          <span className="mx-2">-</span>
          <div>{formatDateTime(record.expiryDate)}</div>
        </div>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "",
      key: "",
      width: 100,
      render: (_, record) => (
        <div className="flex gap-4">
          <Button size="sm" className="bg-white text-red-800">
            <Edit />
          </Button>
          <Button size="sm" className="bg-white text-red-800">
            <TrashIcon />
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-4">
      <LoadingOverlay isLoading={loading} />
      <div className="mb-8 flex items-center justify-between gap-8">
        <div>
          <Typography variant="h5" color="blue-gray">
            Quản lý mã giảm giá
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
            Xem và quản lý tất cả các mã giảm giá tại nhà hàng
          </Typography>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button className="flex items-center bg-red-800 gap-3" size="sm">
            <PlusIcon strokeWidth={2} className="h-4 w-4" /> Tạo mã giảm giá mới
          </Button>
          <Button className="flex items-center bg-red-800 gap-3" size="sm">
            <ArrowPathIcon strokeWidth={2} className="h-4 w-4" /> Làm mới
          </Button>
        </div>
      </div>
      <StyledTable
        loading={loading}
        columns={columns}
        dataSource={coupons}
        pagination={false}
      />
    </div>
  );
};
export default AdminVoucherPage;
