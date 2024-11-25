import { Button, Form, Modal, Table } from "antd";
import {
  Award as BronzeMedal,
  Star as SilverStar,
  Crown as GoldCrown,
  Gem as DiamondGem,
  Users as UserIcon,
} from "lucide-react";
import { render } from "react-dom";
import { formatDate } from "../../../util/Utility";
import { assign } from "lodash";
const ModalAssignVoucher = ({
  show,
  handleClose,
  userRankId,
  users,
  assignVoucher,
  loading,
}) => {
  const ranks = [
    {
      id: 1,
      name: "ĐỒNG",
      icon: <BronzeMedal className="w-12 h-12 text-[#CD7F32]" />,
      color: "bg-[#CD7F32]",
      textColor: "text-[#CD7F32]",
      description: "Hạng đồng đối với những người dùng có điểm từ 0 đến 99,999",
      minPoints: 0,
      maxPoints: 99999,
    },
    {
      id: 2,
      name: "BẠC",
      icon: <SilverStar className="w-12 h-12 text-[#5e3e3e]" />,
      color: "bg-[#5e3e3e]",
      textColor: "text-[#5e3e3e]",
      description:
        "Hạng bạc đối với những người dùng có điểm từ 100,000 đến 299,999",
      minPoints: 100000,
      maxPoints: 299999,
    },
    {
      id: 3,
      name: "VÀNG",
      icon: <GoldCrown className="w-12 h-12 text-[#FFD700]" />,
      color: "bg-[#FFD700]",
      textColor: "text-[#FFD700]",
      description:
        "Hạng vàng đối với những người dùng có điểm từ 300,000 đến 499,999",
      minPoints: 300000,
      maxPoints: 499999,
    },
    {
      id: 4,
      name: "KIM CƯƠNG",
      icon: <DiamondGem className="w-12 h-12 text-[#6ccde3]" />,
      color: "bg-[#54c1d9]",
      textColor: "text-[#6ccde3]",
      description:
        "Hạng kim cương đối với những người dùng có điểm từ 500,000 trở lên",
      minPoints: 500000,
      maxPoints: Infinity,
    },
  ];
  const rank = ranks.find((rank) => rank.id === userRankId);
  const columns = [
    {
      title: "Top",
      dataIndex: "top",
      key: "top",
      render: (_, __, index) => index + 1,
      width: 80,
    },
    {
      title: "Tên",
      dataIndex: "firstName",
      key: "name",
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (phone) => <span>0{phone}</span>,
    },
    {
      title: "Số điểm",
      dataIndex: "loyaltyPoint",
      key: "loyaltyPoints",
      render: (point) => point.toLocaleString(),
    },
    {
      title: "Ngày đăng ký",
      dataIndex: "registeredDate",
      key: "registeredDate",
      render: (date) => formatDate(date),
    },

    {
      title: "Hạng",
      dataIndex: "userRankId",
      key: "userRank",
      render: (rankId) => {
        const ranks = {
          1: "Đồng",
          2: "Bạc",
          3: "Vàng",
          4: "Kim Cương",
        };
        return ranks[rankId] || "Unknown";
      },
    },
  ];
  return (
    <Modal
      width={1700}
      open={show}
      onCancel={handleClose}
      onClose={handleClose}
      footer={null}
    >
      <div
        className={`
              border-2 border-opacity-50 rounded-lg 
              p-6 text-center transform transition-all cursor-pointer
            `}
      >
        <div className="flex justify-center mb-4">{rank?.icon}</div>
        <h3 className={`text-2xl font-bold mb-2 ${rank?.textColor}`}>
          {rank?.name}
        </h3>
        <p className="text-gray-600 mb-4">{rank?.description}</p>
        <div className="flex items-center justify-center">
          <UserIcon className="w-5 h-5 mr-2 text-gray-600" />
          <span className="text-sm text-gray-700">{users.length}</span>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={users.sort((a, b) => b.loyaltyPoint - a.loyaltyPoint)}
        pagination={false}
        rowKey={(record) => record.id}
        scroll={{ x: 768, y: 700 }}
        loading={loading}
      />
      <div className="flex justify-center my-2">
        <Button
          className={`${rank?.color} text-white`}
          onClick={assignVoucher}
          loading={loading}
        >
          Phát mã giảm giá cho {users.length} khách hàng có hạng{" "}
          {rank?.name.toLowerCase()}
        </Button>
      </div>
    </Modal>
  );
};
export default ModalAssignVoucher;
