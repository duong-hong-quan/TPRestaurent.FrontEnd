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
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { getAllReservations, suggestTable } from "../../api/reservationApi";
import LoadingOverlay from "../../components/loading/LoadingOverlay";
import { formatDateTime, formatPrice } from "../../util/Utility";
import TableSuggestionModal from "./reservation/TableSuggestionModal";
import { Table } from "antd";

const TABS = [
  {
    label: "Tất cả",
    value: "",
  },
  {
    label: "Đã chọn bàn",
    value: "1",
  },
  {
    label: "Đã thanh toán",
    value: "2",
  },
  {
    label: "Đang dùng bữa",
    value: "3",
  },
  {
    label: "Đã hủy",
    value: "4",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 0:
      return "green";
    case 1:
      return "amber";
    case 2:
      return "blue";
    default:
      return "blue-gray";
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 1:
      return "Đã chọn bàn";
    case 2:
      return "Đã thanh toán";
    case 3:
      return "Đang dùng bữa";
    case 4:
      return "Đã hủy";
    default:
      return "Không xác định";
  }
};

export function AdminReservationPage() {
  const [activeTab, setActiveTab] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tables, setTables] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const fetchReservations = async (time, pageNumber, pageSize) => {
    try {
      setLoading(true);
      const response = await getAllReservations(
        time,
        pageNumber,
        pageSize,
        activeTab
      );
      if (response?.isSuccess) {
        setReservations(response?.result?.items);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations(1, 1, 10);
  }, [activeTab]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSuggestTable = async (
    startDate,
    endDate,
    people,
    reservationId
  ) => {
    setSelectedReservation({
      startDate: startDate,
      endDate: endDate,
      people: people,
      isPrivate: false,
      reservationId: reservationId,
    });
    openModal();
    try {
      const response = await suggestTable({
        startTime: startDate,
        endTime: endDate,
        numOfPeople: people,
        isPrivate: false,
      });
      if (response?.isSuccess) {
        setTables(response?.result);
      }
    } catch (error) {
    } finally {
    }
  };

  const columns = [
    {
      title: "Mã đặt bàn",
      dataIndex: "reservationId",
      key: "reservationId",
      render: (text) => <Typography>{text.substring(0, 8)}</Typography>,
    },
    {
      title: "Khách hàng",
      dataIndex: "customerInfo",
      key: "customerInfo",
      render: (customerInfo) => (
        <Typography>{`${customerInfo?.name} - ${customerInfo?.phoneNumber}`}</Typography>
      ),
    },
    {
      title: "Số người",
      dataIndex: "numberOfPeople",
      key: "numberOfPeople",
      render: (numberOfPeople) => <Typography>{numberOfPeople}</Typography>,
    },
    {
      title: "Ngày - Giờ",
      dataIndex: "endTime",
      key: "endTime",
      render: (endTime) => <Typography>{formatDateTime(endTime)}</Typography>,
    },
    {
      title: "Tiền cọc",
      dataIndex: "deposit",
      key: "deposit",
      render: (deposit) => <Typography>{formatPrice(deposit)}</Typography>,
    },
    {
      title: "Trạng thái",
      dataIndex: "statusId",
      key: "statusId",
      render: (statusId) => (
        <Chip
          variant="ghost"
          size="sm"
          className="text-center"
          value={getStatusText(statusId)}
          color={getStatusColor(statusId)}
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (record) => (
        <Tooltip content="Xem chi tiết">
          <IconButton
            variant="text"
            onClick={() =>
              handleSuggestTable(
                record.reservationDate,
                record.endTime,
                record.numberOfPeople,
                record.reservationId
              )
            }
          >
            <EyeIcon className="h-4 w-4" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const filteredReservations = reservations.filter((item) => {
    const customerInfo = item.customerInfo || {};
    const searchString = `${customerInfo.name || ""} ${
      customerInfo.phoneNumber || ""
    }`.toLowerCase();
    return searchString.includes(searchQuery.toLowerCase());
  });

  return (
    <Card className="h-full w-full">
      <LoadingOverlay isLoading={loading} />
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Quản lý đặt bàn
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Xem và quản lý tất cả các đơn đặt bàn
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button variant="outlined" size="sm">
              Xuất báo cáo
            </Button>
            <Button
              className="flex items-center bg-red-700 gap-3"
              size="sm"
              onClick={fetchReservations}
            >
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-auto h-[550px]">
        <Table
          columns={columns}
          dataSource={filteredReservations}
          rowKey="reservationId"
        />
      </CardBody>
      <TableSuggestionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        tables={tables}
        selectedReservation={selectedReservation}
      />
    </Card>
  );
}
