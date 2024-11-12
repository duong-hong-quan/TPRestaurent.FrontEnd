import React from "react";
import { Button, Image, Modal, Select, Table, Tag, Tooltip } from "antd";
import { formatDateTime, formatPrice } from "../../util/Utility";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { StyledTable } from "../custom-ui/StyledTable";
import { render } from "react-dom";

const ComboTable = ({
  data,
  loading,
  isAction,
  deleteCombo,
  handleSelectRow,
}) => {
  const navigate = useNavigate();
  const handleSelectChange = (value, record) => {
    if (value === "edit") {
      navigate(`/admin/create-combo/${record.comboId}`);
    } else if (value === "delete") {
      Modal.confirm({
        title: "Xác nhận xóa",
        content: "Bạn có chắc chắn muốn xóa combo này?",
        onOk: () => {
          deleteCombo(record.comboId);
        },
      });
    }
  };

  const renderTag = (combo) => {
    let statusConfig = {};
    if (
      combo.quantityLeft > 0 ||
      (combo.quantityLeft === null && combo.dailyCountdown > 0)
    ) {
      statusConfig = {
        color: "success",
        text: "Còn món",
        icon: <CheckCircleOutlined />,
        quantityLeft: combo.quantityLeft || 0,
      };
    } else if (combo.quantityLeft === 0 || combo.quantityLeft === null) {
      statusConfig = {
        color: "error",
        text: "Hết món",
        icon: <CloseCircleOutlined />,
        quantityLeft: combo.quantityLeft || 0,
      };
    } else {
      statusConfig = {
        color: "warning",
        text: "Ngưng bán",
        icon: <ExclamationCircleOutlined />,
        quantityLeft: combo.quantityLeft || 0,
      };
    }

    return (
      <div className="flex items-center space-x-2 my-2">
        <Tooltip title={`Trạng thái: ${statusConfig.text}`}>
          <Tag
            color={statusConfig.color}
            icon={statusConfig.icon}
            className="px-2 py-1 rounded-full text-sm font-semibold text-wrap"
          >
            {statusConfig.text} ({statusConfig.quantityLeft})
          </Tag>
        </Tooltip>
      </div>
    );
  };
  const columns = [
    {
      title: "Mã combo",
      dataIndex: "comboId",
      key: "comboId",
      width: 80,
      render: (text) => <span>{text.substring(0, 8)}</span>,
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 200,
      render: (image) => (
        <Image
          src={image}
          width={100}
          height={100}
          alt="combo"
          className=" object-cover rounded-lg border border-gray-200"
        />
      ),
    },
    {
      title: "Tên combo",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 200,
      render: (text, record) => (
        <div>
          <div>{text}</div>
        </div>
      ),
    },
    {
      title: "Loại",
      dataIndex: ["category", "vietnameseName"],
      key: "category",
      width: 100,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 150,
      render: (price) => `${formatPrice(price)} `,
    },
    {
      title: "Hạn bán",
      key: "dateRange",
      width: 200,
      render: (_, record) => (
        <span>
          {formatDateTime(record.startDate)} - {formatDateTime(record.endDate)}
        </span>
      ),
    },
    {
      title: "Đánh giá",
      key: "rating",
      width: 150,
      render: (_, record) => (
        <span>
          {record.averageRating} ({record.numberOfRating} lượt đánh giá)
        </span>
      ),
    },
    {
      title: "Trạng thái",
      key: "rating",
      width: 200,
      render: (_, record) => (
        <div className="flex justify-center">{renderTag(record)}</div>
      ),
    },
    ...(isAction
      ? [
          {
            title: "Hành động",
            dataIndex: "action",
            key: "action",
            width: 140,
            render: (_, record) => (
              <div className="">
                <Select
                  defaultValue="actions"
                  style={{ width: 120 }}
                  onChange={(value) => handleSelectChange(value, record)}
                >
                  <Option value="actions" disabled>
                    Hành động
                  </Option>
                  <Option value="edit">
                    <div className="flex items-center">
                      <FaEdit color="blue" />{" "}
                      <span className="ml-2">Chỉnh sửa</span>
                    </div>
                  </Option>
                  <Option value="delete">
                    <div className="flex items-center">
                      <FaTrash color="red" /> <span className="ml-2">Xoá</span>
                    </div>
                  </Option>
                </Select>
              </div>
            ),
          },
        ]
      : []),
  ];
  return (
    <StyledTable
      columns={columns}
      dataSource={data}
      rowKey="comboId"
      pagination={false}
      loading={loading}
      scroll={{ x: 600 }}
      onRow={(record) => {
        return {
          onClick: () => {
            handleSelectRow(record);
          },
        };
      }}
    />
  );
};

export default ComboTable;
