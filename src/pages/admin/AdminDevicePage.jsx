import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Typography,
} from "@material-tailwind/react";
import { message, Skeleton, Table } from "antd";
import { ArrowPathIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { FaLock } from "react-icons/fa";
import { MdEditNote } from "react-icons/md";
import useCallApi from "../../api/useCallApi";
import Pagination from "../../components/pagination/Pagination";
import LoadingOverlay from "../../components/loading/LoadingOverlay";
import { StyledTable } from "../../components/custom-ui/StyledTable";
import { NavLink } from "react-router-dom";
import CreateTableModal from "../../components/modal/CreateTableModal";
import { Edit, PlusIcon, SettingsIcon, TrashIcon } from "lucide-react";
import { TableApi } from "../../api/endpoint";
import { render } from "react-dom";
import UpdateTableModal from "../../components/modal/UpdateTableModal";
import { showError } from "../../util/Utility";

export function AdminDevicePage() {
  const [devices, setDevices] = useState([]);
  const { callApi, error, loading } = useCallApi();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const totalItems = 10;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    tableId: "",
    tableName: "",
    deviceCode: "",
    devicePassword: "",
  });
  const handleEditClick = (data) => {
    console.log(data);
    setFormData({
      deviceCode: data.name,
      tableId: data.id,
      devicePassword: "",
      tableName: data.name,
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFormSubmit = async (values) => {
    const response = await callApi(TableApi.UPDATE_TABLE, "POST", values);
    if (response?.isSuccess) {
      setIsModalVisible(false);
      await fetchData();
    } else {
      showError(error);
    }
  };
  const handleCurrentPageChange = (page) => {
    setCurrentPage(page);
  };
  const fetchData = async () => {
    const response = await callApi(
      `${TableApi.GET_ALL}/${currentPage}/${totalItems}`,
      "GET"
    );
    if (response?.isSuccess) {
      setDevices(response?.result?.items);

      setTotalPages(response?.result?.totalPages);
    }
  };
  const handleDeleteClick = async (record) => {
    const response = await callApi(
      `${TableApi.DELETE_TABLE}/${record.id}`,
      "POST"
    );
    if (response?.isSuccess) {
      message.success("Xóa bàn thành công");
      await fetchData();
    } else {
      showError(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [currentPage]);
  const columns = [
    {
      title: "Tên bàn",
      dataIndex: "name",
      key: "name",
    },
    {
      title: " Loại bàn",
      dataIndex: "tableSizeId",
      key: "tableSizeId",
      render: (tableSizeId) => {
        switch (tableSizeId) {
          case 1:
            return "Bàn 1 người";
          case 2:
            return "Bàn 2 người";
          case 3:
            return "Bàn 3 người";
          case 4:
            return "Bàn 4 người";
          case 5:
            return "Bàn 5 người";
          case 6:
            return "Bàn 6 người";
          case 7:
            return "Bàn 7 người";
          case 8:
            return "Bàn 8 người";
          case 9:
            return "Bàn 9 người";
          case 10:
            return "Bàn 10 người";
          default:
            return "Bàn 2 người";
        }
      },
    },
    {
      title: "Loại phòng",
      dataIndex: ["room", "name"],
    },
    {
      title: "Riêng tư",
      dataIndex: ["room", "isPrivate"],
      render: (isPrivate) => {
        return isPrivate ? "Có" : "Không";
      },
    },
    {
      title: "Hành động",
      dataIndex: "",
      key: "",
      width: 100,
      render: (_, record) => (
        <div className="flex gap-4">
          <Button
            onClick={() => handleEditClick(record)}
            size="sm"
            className="bg-white text-red-800"
          >
            <Edit />
          </Button>
          <Button
            size="sm"
            className="bg-white text-red-800"
            onClick={() => handleDeleteClick(record)}
          >
            <TrashIcon />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card className="h-full w-full">
      <LoadingOverlay isLoading={loading} />
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Quản lý bàn ăn
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Xem và quản lý tất cả các bàn ăn tại nhà hàng
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <NavLink
              to={`/admin/dining-area`}
              className={`flex bg-red-800  items-center text-white rounded-md shadow-xl px-4 py-2 cursor-pointer`}
            >
              <SettingsIcon strokeWidth={2} className="h-4 w-4 mr-1" /> Cấu hình
              sơ đồ bàn
            </NavLink>
            <Button
              className="flex items-center bg-red-800 gap-3"
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusIcon strokeWidth={2} className="h-4 w-4" /> Tạo bàn mới
            </Button>
            <Button
              className="flex items-center bg-red-800 gap-3"
              size="sm"
              onClick={fetchData}
            >
              <ArrowPathIcon strokeWidth={2} className="h-4 w-4" /> Làm mới
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-auto h-[550px]">
        <StyledTable
          dataSource={devices}
          columns={columns}
          rowKey="deviceId"
          pagination={false}
        />
      </CardBody>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handleCurrentPageChange}
      />
      <CreateTableModal
        handleCloseModal={() => setIsModalOpen(false)}
        isModalOpen={isModalOpen}
        key={"create-table-modal"}
      />
      <UpdateTableModal
        formData={formData}
        handleCancel={handleCancel}
        handleFormSubmit={handleFormSubmit}
        isModalVisible={isModalVisible}
        loading={loading}
      />
    </Card>
  );
}
