import { Button, Image, Table, Tag } from "antd";
import { render } from "react-dom";
import { FaEdit, FaLock, FaTrash } from "react-icons/fa";
import { MdEditNote } from "react-icons/md";
import { Tooltip } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { DishApi } from "../../api/endpoint";
import { useState } from "react";
import useCallApi from "../../api/useCallApi";
import { uniqueId } from "lodash";
import NavigateCreateMenu from "../../pages/admin/menu/NavigateCreateMenu";
import AdminDishPage from "../../pages/admin/AdminDishPage";
import { useNavigate } from "react-router-dom";

const DishTable = ({ dishes, loading }) => {
  const navigate = useNavigate();
  const renderTag = (dishSizeDetails, dish) => {
    return dishSizeDetails.map((dishSizeDetail, index) => {
      let statusConfig = {
        color: "",
        text: "",
        icon: null,
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
        };
      } else if (dish.isAvailable && dishSizeDetail.quantityLeft === 0) {
        statusConfig = {
          color: "error",
          text: "Hết món",
          icon: <CloseCircleOutlined />,
        };
      } else {
        statusConfig = {
          color: "warning",
          text: "Ngưng bán",
          icon: <ExclamationCircleOutlined />,
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
              icon={statusConfig.icon}
              className="px-2 py-1 rounded-full text-sm font-semibold"
            >
              {statusConfig.text}
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
          .find((s) => s.dishSize?.name === "SMALL")
          ?.price?.toLocaleString()} VND`,
    },
    {
      title: "Size vừa",
      dataIndex: "dishSizeDetails",
      key: "medium",
      render: (sizes) =>
        `${sizes
          .find((s) => s.dishSize?.name === "MEDIUM")
          ?.price?.toLocaleString()} VND`,
    },
    {
      title: "Size lớn",
      dataIndex: "dishSizeDetails",
      key: "large",
      render: (sizes) =>
        `${sizes
          .find((s) => s.dishSize?.name === "LARGE")
          ?.price?.toLocaleString()} VND`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, record) => renderTag(record.dishSizeDetails, record.dish),
    },
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
      key={uniqueId()}
    />
  );
};
export default DishTable;
