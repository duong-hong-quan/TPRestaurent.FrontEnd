import { Button, Image, Table } from "antd";
import { FaEdit, FaLock, FaTrash } from "react-icons/fa";
import { MdEditNote } from "react-icons/md";

const DishTable = ({ dishes, loading }) => {
  const renderTag = (dishSizeDetail) => {};

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, record) => <span>{record.dish.dishId.substring(0, 8)}</span>,
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (_, record) => (
        <Image
          src={record.dish.image}
          alt={record.dish.name}
          width={100}
          height={100}
          style={{
            objectFit: "cover",
            marginBottom: "8px",
            borderRadius: "20px",
          }}
        />
      ),
    },
    {
      title: "Tên món ",
      dataIndex: "name",
      key: "name",
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
        `${sizes
          .find((s) => s.dishSize.name === "SMALL")
          .price.toLocaleString()} VND`,
    },
    {
      title: "Size vừa",
      dataIndex: "dishSizeDetails",
      key: "medium",
      render: (sizes) =>
        `${sizes
          .find((s) => s.dishSize.name === "MEDIUM")
          .price.toLocaleString()} VND`,
    },
    {
      title: "Size lớn",
      dataIndex: "dishSizeDetails",
      key: "large",
      render: (sizes) =>
        `${sizes
          .find((s) => s.dishSize.name === "LARGE")
          .price.toLocaleString()} VND`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Hành động",
      dataIndex: "",
      key: "action",
      render: () => (
        <div className="flex gap-4">
          <Button size="sm" className="bg-white text-blue-800">
            <FaEdit />
          </Button>
          <Button size="sm" className="bg-white text-red-800">
            <FaTrash />
          </Button>
        </div>
      ),
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={dishes}
      pagination={false}
      loading={loading}
    />
  );
};
export default DishTable;
