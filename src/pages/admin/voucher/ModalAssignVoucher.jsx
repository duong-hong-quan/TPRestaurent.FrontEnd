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
  rankData,
}) => {
   const ranks = [
     {
       userRankId: 1,
       name: "ĐỒNG",
       icon: <BronzeMedal className="w-12 h-12" />,
       color: "border-[#CD7F32]",
       textColor: "text-[#CD7F32]",
       bgColor: "bg-[#CD7F32]",
       stats: rankData?.find((r) => r.userRank === 1),
     },
     {
       userRankId: 2,
       name: "BẠC",
       icon: <SilverStar className="w-12 h-12" />,
       color: "border-[#C0C0C0]",
       textColor: "text-[#C0C0C0]",
       bgColor: "bg-[#C0C0C0]",

       stats: rankData?.find((r) => r.userRank === 2),
     },
     {
       userRankId: 3,
       name: "VÀNG",
       icon: <GoldCrown className="w-12 h-12" />,
       color: "border-[#FFD700]",
       textColor: "text-[#FFD700]",
       bgColor: "bg-[#FFD700]",

       stats: rankData?.find((r) => r.userRank === 3),
     },
     {
       userRankId: 4,
       name: "KIM CƯƠNG",
       icon: <DiamondGem className="w-12 h-12" />,
       color: "border-[#6ccde3]",
       textColor: "text-[#6ccde3]",
       stats: rankData?.find((r) => r.userRank === 4),
       bgColor: "bg-[#6ccde3]",
     },
   ];
   console.log(userRankId)
  const rank = ranks?.find((rank) => rank.userRankId === userRankId);
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
  console.log(rank)
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
        <div className={`${rank?.textColor} flex justify-center mb-4`}>{rank?.icon}</div>
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
          className={`${rank?.color} ${rank?.bgColor} text-white`}
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
