import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { Typography } from "@material-tailwind/react";
import { Edit, PlusIcon, TrashIcon, UserRoundCheck } from "lucide-react";
import useCallApi from "../../../api/useCallApi";
import { CouponApi } from "../../../api/endpoint";
import { formatDateTime, formatPrice, showError } from "../../../util/Utility";
import { useEffect, useState } from "react";
import LoadingOverlay from "../../../components/loading/LoadingOverlay";
import {
  DatePicker,
  Form,
  Image,
  InputNumber,
  Select,
  Tag,
  Input,
  Button,
  Modal,
  Tooltip,
  message,
} from "antd";
import { StyledTable } from "../../../components/custom-ui/StyledTable";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;
import RankTiers from "../rank/RankTiers";
import ModalAssignVoucher from "./ModalAssignVoucher";
import { set } from "lodash";
const AdminVoucherPage = () => {
  const [coupons, setCoupons] = useState([]);
  const { callApi, error, loading, callMultipleApis, loadingPromise } =
    useCallApi();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const totalItems = 10;
  const user = useSelector((state) => state.user.user || {});
  const [form] = Form.useForm();
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [couponProgramType, setCouponProgramType] = useState(1);
  const [selectedRank, setSelectedRank] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [users, setUsers] = useState([]);
  const [rankData, setRankData] = useState([]);
  const onFinish = async (values) => {
    try {
      const data = {
        code: values.code,
        title: values.title,
        couponProgramType: values.couponProgramType,
        discountPercent: values.discountPercent,
        minimumAmount: values.minimumAmount,
        quantity: values.quantity,
        userRank: values.userRank,
        startDate: values.startDate[0].format("YYYY-MM-DDTHH:mm:ss"),
        expiryDate: values.startDate[1].format("YYYY-MM-DDTHH:mm:ss"),
        accountId: user.id,
      };

      let response;
      if (editingCoupon) {
        // Update existing coupon
        response = await callApi(
          `${CouponApi.UPDATE_COUPON_PROGRAM}`,
          "PUT",

          {
            ...data,
            couponProgramId: editingCoupon.couponProgramId,
            imageFile:
              "https://static.vecteezy.com/system/resources/previews/024/170/335/non_2x/voucher-discount-3d-icon-free-png.png",
          }
        );
      } else {
        // Create new coupon
        response = await callApi(CouponApi.CREATE_COUPON_PROGRAM, "POST", {
          ...data,
          file: "https://static.vecteezy.com/system/resources/previews/024/170/335/non_2x/voucher-discount-3d-icon-free-png.png",
        });
      }

      if (response?.isSuccess) {
        form.resetFields();
        setEditingCoupon(null);
        message.success(
          `${editingCoupon ? "Cập nhật thành công" : "Tạo thành công"}!`
        );
        await fetchData();
      } else {
        showError(response.messages);
      }
    } catch (error) {
      showError("An error occurred while saving the coupon.");
    }
  };
  const handleEdit = (record) => {
    setIsFormVisible(true);
    setEditingCoupon(record);
    console.log(record);
    form.setFieldsValue({
      code: record.code,
      title: record.title,
      couponProgramType: record.couponProgramTypeId,
      discountPercent: record.discountPercent,
      minimumAmount: record.minimumAmount,
      quantity: record.quantity,
      startDate: [dayjs(record.startDate), dayjs(record.expiryDate)],
    });
  };
  const handleCurrentPageChange = (page) => {
    setCurrentPage(page);
  };
  const fetchData = async () => {
    // const response = await callApi(
    //   `${CouponApi.GET_AVAILABLE_COUPON_PROGRAM}/1/100`,
    //   "GET"
    // );
    // if (response?.isSuccess) {
    //   setCoupons(response.result.items);
    //   setTotalPages(response.totalPages);
    // } else {
    //   showError(response.messages);
    // }
    const [response, rankData] = await callMultipleApis([
      {
        endpoint: `${CouponApi.GET_AVAILABLE_COUPON_PROGRAM}/1/100`,
        method: "GET",
      },
      {
        endpoint: `${CouponApi.GET_TOTAL_USER_BY_RANK}`,
        method: "GET",
      },
    ]);
    if (response?.isSuccess) {
      setCoupons(response.result.items);
      setTotalPages(response.totalPages);
    } else {
      showError(response.messages);
    }
    if (rankData?.isSuccess) {
      setRankData(rankData.result);
    } else {
      showError(rankData.messages);
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
      width: 100,
    },
    {
      title: "Tên",
      dataIndex: "title",
      key: "title",
      width: 100,
    },

    {
      title: "Mã giảm giá",
      dataIndex: "code",
      key: "code",
      width: 150,

      render: (code) => (
        <Tag color="blue" className="text-sm">
          {code}
        </Tag>
      ),
    },
    {
      title: "Phần trăm giảm",
      dataIndex: "discountPercent",
      key: "discountPercent",
      width: 100,
      render: (discount) => `${discount}%`,
    },
    {
      title: "Giá tối thiểu",
      dataIndex: "minimumAmount",
      key: "minimumAmount",
      width: 100,

      render: (amount) => formatPrice(amount),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: "Thời gian sử dụng",
      key: "period",
      width: 200,
      render: (_, record) => (
        <div className="flex justify-center flex-nowrap ">
          <div> {formatDateTime(record.startDate)}</div>
          <span className="mx-2">-</span>
          <div>{formatDateTime(record.expiryDate)}</div>
        </div>
      ),
    },
    {
      title: "Loại",
      key: "userRankId",
      dataIndex: "userRankId",
      width: 100,
      render: (userRankId) => {
        switch (userRankId) {
          case 1:
            return "Đồng";
          case 2:
            return "Bạc";
          case 3:
            return "Vàng";
          case 4:
            return "Kim cương";
          default:
            return "Không xác định";
        }
      },
    },
    {
      title: "Hành động",
      dataIndex: "",
      key: "",
      width: 100,
      render: (_, record) => (
        <div className="flex">
          <Tooltip title="Chỉnh sửa">
            <Button
              size="sm"
              className="bg-white text-red-800"
              onClick={() => handleEdit(record)}
            >
              <Edit size={12} />
            </Button>
          </Tooltip>
          <Tooltip title="Xoá">
            <Button
              size="sm"
              className="bg-white text-red-800"
              onClick={async () => {
                Modal.confirm({
                  title: "Xác nhận xóa",
                  content: "Bạn có chắc chắn muốn xóa mã giảm giá này không?",
                  okText: "Xóa",
                  okType: "danger",
                  cancelText: "Hủy",
                  onOk: async () => {
                    const response = await callApi(
                      `${CouponApi.DELETE_COUPON_PROGRAM}?couponId=${record.couponProgramId}`,
                      "PUT"
                    );
                    if (response?.isSuccess) {
                      await fetchData();
                    } else {
                      showError(response.messages);
                    }
                  },
                });
              }}
            >
              <TrashIcon size={12} />
            </Button>
          </Tooltip>
          {record.userRankId && (
            <Tooltip title="Cấp phát coupon cho người dùng">
              <Button
                size="sm"
                className="bg-white text-red-800"
                onClick={() => handleSelectRank(record)}
              >
                <UserRoundCheck size={12} />
              </Button>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];
  const handleCancelEdit = () => {
    form.resetFields();
    setEditingCoupon(null);
    setIsFormVisible(false);
  };
  const handleSelectRank = async (rank) => {
    setSelectedRank(rank.userRankId);
    setIsModalOpen(true);
    setSelectedCoupon(rank.couponProgramId);
    const response = await callApi(
      `${CouponApi.GET_USER_BY_RANK}?userRank=${rank.userRankId}`,
      "GET"
    );
    if (response?.isSuccess) {
      setUsers(response.result?.items);
    } else {
      showError(response.messages);
      setUsers([]);
    }
  };

  return (
    <div className="w-full px-4 bg-white rounded-lg shadow-lg ">
      <LoadingOverlay isLoading={loading} />
      <RankTiers rankData={rankData} handleViewRankDetail={handleSelectRank} />

      <div className="mb-8 px-2 py-4 flex items-center justify-between gap-8">
        <div>
          <Typography variant="h5" color="blue-gray">
            Quản lý mã giảm giá
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
            Xem và quản lý tất cả các mã giảm giá tại nhà hàng
          </Typography>
        </div>
        <Button
          className="flex items-center bg-red-800 gap-3 text-white"
          size="sm"
          onClick={() => setIsFormVisible(!isFormVisible)}
        >
          <PlusIcon strokeWidth={2} className="h-4 w-4" />
          {editingCoupon ? "Chỉnh sửa" : "Tạo"} chương trình mã giảm giá
        </Button>
      </div>

      {isFormVisible && (
        <div
          style={{
            border: "1px solid #e5e7eb",
          }}
          className="flex items-center justify-center shadow-lg py-4 px-4 sm:px-6 rounded-lg my-2 lg:px-8"
        >
          <div className="max-w-7xl w-full bg-white rounded-lg p-4">
            <h2 className="text-center uppercase text-lg font-bold text-red-800 mb-8">
              {editingCoupon ? "Chỉnh sửa" : "Tạo"} mã giảm giá
            </h2>
            <Form
              form={form}
              onFinish={onFinish}
              layout="vertical"
              className="space-y-6"
            >
              <div className="flex space-x-6">
                <Form.Item
                  name="code"
                  label="Mã code"
                  className="flex-1"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng điền mã code của bạn",
                    },
                  ]}
                >
                  <Input placeholder="Nhập mã giảm giá" className="w-full" />
                </Form.Item>

                <Form.Item
                  name="couponProgramType"
                  label="Chương trình áp dụng"
                  className="flex-1"
                  initialValue={1}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn chương trình áp dụng",
                    },
                  ]}
                >
                  <Select
                    onChange={(value) => setCouponProgramType(value)}
                    value={couponProgramType}
                  >
                    <Select.Option value={1}>Sinh nhật</Select.Option>
                    <Select.Option value={2}>Người mới</Select.Option>
                    <Select.Option value={3}>Xếp hạng</Select.Option>
                  </Select>
                </Form.Item>
                {couponProgramType === 3 && !editingCoupon && (
                  <Form.Item
                    name="userRank"
                    label="Hạng người dùng"
                    className="flex-1"
                    initialValue={1}
                    rules={[
                      couponProgramType === 3 &&
                        !editingCoupon && {
                          required: true,
                          message: "Vui lòng chọn hạng người dùng",
                        },
                    ]}
                  >
                    <Select>
                      <Select.Option value={1}>Đồng</Select.Option>
                      <Select.Option value={2}>Bạc</Select.Option>
                      <Select.Option value={3}>Vàng</Select.Option>
                      <Select.Option value={4}>Kim cương</Select.Option>
                    </Select>
                  </Form.Item>
                )}

                {editingCoupon?.userRank && (
                  <Form.Item
                    name="userRank"
                    label="Hạng người dùng"
                    className="flex-1"
                    initialValue={1}
                    rules={[
                      editingCoupon?.userRank && {
                        required: true,
                        message: "Vui lòng chọn hạng người dùng",
                      },
                    ]}
                  >
                    <Select>
                      <Select.Option value={1}>Đồng</Select.Option>
                      <Select.Option value={2}>Bạc</Select.Option>
                      <Select.Option value={3}>Vàng</Select.Option>
                      <Select.Option value={4}>Kim cương</Select.Option>
                    </Select>
                  </Form.Item>
                )}
              </div>

              <div className="flex space-x-6">
                <Form.Item
                  name="title"
                  label="Nội dung"
                  className="flex-1"
                  rules={[
                    { required: true, message: "Vui lòng nhập nội dung" },
                  ]}
                >
                  <Input placeholder="Nhập nội dung" className="w-full" />
                </Form.Item>
                <Form.Item
                  name="discountPercent"
                  label="Phần trăm giảm giá"
                  className="flex-1"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập phần trăm giảm giá",
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    max={100}
                    className="w-full"
                    placeholder="Nhập phần trăm"
                  />
                </Form.Item>

                <Form.Item
                  name="minimumAmount"
                  label="Hạn chi tiêu tối thiểu"
                  className="flex-1"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập hạn chi tiêu tối thiểu",
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    className="w-full"
                    placeholder="Nhập hạn chi tiêu tối thiểu"
                  />
                </Form.Item>

                <Form.Item
                  name="quantity"
                  label="Số lượng"
                  className="flex-1"
                  rules={[
                    { required: true, message: "Vui lòng nhập số lượng" },
                  ]}
                >
                  <InputNumber
                    min={0}
                    className="w-full"
                    placeholder="Nhập số lượng"
                  />
                </Form.Item>
              </div>

              <Form.Item
                name="startDate"
                label="Ngày bắt đầu áp dụng và kết thúc"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày bắt đầu và kết thúc",
                  },
                ]}
              >
                <RangePicker
                  needConfirm={false}
                  showTime
                  format="DD/MM/YYYY HH:mm"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  htmlType="submit"
                  className="text-sm bg-red-800 text-white"
                >
                  {editingCoupon ? "Cập nhật" : "Tạo chương trình mã giảm giá"}
                </Button>
                {editingCoupon && (
                  <Button
                    type="default"
                    onClick={handleCancelEdit}
                    className="text-sm"
                  >
                    Hủy
                  </Button>
                )}
              </Form.Item>
            </Form>
          </div>
        </div>
      )}

      <div className="flex justify-end my-2">
        <Button
          className="flex items-center bg-red-800 gap-3 text-white"
          size="sm"
          onClick={fetchData}
          loading={loading}
        >
          <ArrowPathIcon strokeWidth={2} className="h-4 w-4" /> Làm mới
        </Button>
      </div>

      <StyledTable
        loading={loading}
        columns={columns}
        dataSource={coupons}
        pagination={false}
        scroll={{ x: 768, y: 600 }}
      />
      <ModalAssignVoucher
        show={isModalOpen}
        handleClose={() => {
          setIsModalOpen(!isModalOpen);
          setSelectedRank(null);
        }}
        userRankId={selectedRank}
        users={users}
        assignVoucher={async () => {
          const response = await callApi(`${CouponApi.ASSIGN_COUPON}`, "POST", {
            couponProgramId: selectedCoupon,
            customerIds: users.map((user) => user.id),
          });
          if (response?.isSuccess) {
            message.success("Phân phối mã giảm giá thành công!");
            setIsModalOpen(false);
            setSelectedRank(null);
          } else {
            showError(response.messages);
          }
        }}
        loading={loading}
      />
    </div>
  );
};
export default AdminVoucherPage;
