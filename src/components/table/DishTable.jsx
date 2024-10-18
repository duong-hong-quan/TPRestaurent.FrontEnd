import { Button, Image, Modal, Table, Tag } from "antd";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Tooltip } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { uniqueId } from "lodash";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../util/Utility";

const DishTable = ({
  dishes,
  loading,
  isAction = false,
  handleSelectRow,
  deleteDish,
}) => {
  const navigate = useNavigate();
  const renderTag = (dishSizeDetails, dish) => {
    return dishSizeDetails.map((dishSizeDetail, index) => {
      let statusConfig = {
        color: "",
        text: "",
        icon: null,
        quantityLeft: dishSizeDetail.quantityLeft,
      };

      if (
        dish.isAvailable &&
        (dishSizeDetail.quantityLeft > 0 ||
          dishSizeDetail.quantityLeft === null)
      ) {
        statusConfig = {
          color: "success",
          text: "Còn món",
          icon: <CheckCircleOutlined />,
          quantityLeft: dishSizeDetail.quantityLeft,
        };
      } else if (dish.isAvailable && dishSizeDetail.quantityLeft === 0) {
        statusConfig = {
          color: "error",
          text: "Hết món",
          icon: <CloseCircleOutlined />,
          quantityLeft: dishSizeDetail.quantityLeft,
        };
      } else {
        statusConfig = {
          color: "warning",
          text: "Ngưng bán",
          icon: <ExclamationCircleOutlined />,
          quantityLeft: dishSizeDetail.quantityLeft,
        };
      }

      return (
        <div key={index} className="flex items-center space-x-2 my-2">
          <span className="font-medium">
            {dishSizeDetail.dishSize.vietnameseName}:
          </span>
          <Tooltip title={`Trạng thái: ${statusConfig.text}`}>
            <Tag
              color={statusConfig.color}
              // icon={statusConfig.icon}
              className="px-2 py-1 rounded-full text-sm font-semibold"
            >
              {statusConfig.text} ({statusConfig.quantityLeft})
            </Tag>
          </Tooltip>
        </div>
      );
    });
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: uniqueId(),
      align:"center",
      render: (_, record) => <span>{record.dish.dishId.substring(0, 8)}</span>,
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      align:"center",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Image
        src={record.dish.image}
        alt={record.dish.name}
        width={100}
        height={100}
        style={{
          objectFit: "cover",
          borderRadius: "20px",
          display: "block"
        }}
      />
    </div>
      ),
      
    },
    {
      title: "Tên món ",
      dataIndex: "name",
      key: "name",
      align:"center",

      render: (_, record) => (
        <span className="uppercase">{record.dish.name}</span>
      ),
    },
    {
      title: "Danh mục ",
      dataIndex: "category",
      key: "category",
      render: (_, record) => (
        <span className="uppercase">
          {record.dish.dishItemType.vietnameseName}
        </span>
      ),
    },
    {
      title: "Size nhỏ",
      dataIndex: "dishSizeDetails",
      key: "small",
      render: (sizes) =>
        `${formatPrice(
          sizes.find((s) => s.dishSize?.name === "SMALL")?.price
        )}`,
    },
    {
      title: "Size vừa",
      dataIndex: "dishSizeDetails",
      key: "medium",
      render: (sizes) =>
        `${formatPrice(
          sizes.find((s) => s.dishSize?.name === "MEDIUM")?.price
        )} `,
    },
    {
      title: "Size lớn",
      dataIndex: "dishSizeDetails",
      key: "large",
      render: (sizes) =>
        `${formatPrice(
          sizes.find((s) => s.dishSize?.name === "LARGE")?.price
        )} `,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, record) => renderTag(record.dishSizeDetails, record.dish),
    },
    ...(isAction
      ? [
          {
            title: "Hành động",
            dataIndex: "",
            key: "action",
            render: (_, record) => (
              <div className="flex gap-4">
                <Button
                  size="sm"
                  className="bg-white text-blue-800"
                  onClick={() => {
                    navigate(`/admin/create-menu/${record.dish.dishId}`);
                  }}
                >
                  <FaEdit />
                </Button>
                <Button
                  size="sm"
                  className="bg-white text-red-800"
                  onClick={() => {
                    Modal.confirm({
                      title: "Xác nhận xóa món ăn",
                      content: `Bạn có chắc chắn muốn xóa món ăn ${record.dish.name}?`,
                      onOk: () => deleteDish(record.dish.dishId),
                      okText: "Xác nhận",
                      cancelText: "Hủy",
                    });
                  }}
                >
                  <FaTrash />
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <Table
      columns={columns}
      dataSource={dishes}
      pagination={false}
      loading={loading}
      key={uniqueId()}
      onRow={(record) => {
        return {
          onClick: () => {
            handleSelectRow(record);
          },
        };
      }}
      scroll={{ x: 768 }}
    />
  );
};
export default DishTable;
