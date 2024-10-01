import { useState } from "react";
import LoyalPointHistoryList from "../../../components/loyalpoint/LoyalPointHistoryList";
import { Tooltip } from "antd";
import { Coins, Gift, HelpCircle, Wallet } from "lucide-react";
import { useSelector } from "react-redux";
import { MoneyCollectFilled } from "@ant-design/icons";

const PersonalTransaction = () => {
  const user = useSelector((state) => state.user.user || {});
  const tabs = [
    { id: "all", label: "Tất cả" },
    { id: "received", label: "Tiền vào" },
    { id: "spent", label: "Tiền ra" },
    { id: "pending", label: "Đang xử lý" },
  ];

  const [activeTab, setActiveTab] = useState("all");

  const transactions = [
    {
      type: "received",
      description: "Nhận tiền từ Nguyễn Văn A",
      date: "05/08/2024 14:30",
      amount: 500000,
      balanceAfter: 1500000,
    },
    {
      type: "spent",
      description: "Thanh toán hóa đơn điện",
      date: "04/08/2024 10:15",
      amount: 200000,
      balanceAfter: 1000000,
    },
    // Add more transactions...
  ];

  const filteredTransactions = transactions.filter((transaction) => {
    if (activeTab === "all") return true;
    return transaction.type === activeTab;
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case "all":
      case "received":
      case "spent":
        return <LoyalPointHistoryList transactions={filteredTransactions} />;
      case "pending":
        return <p>Các giao dịch đang xử lý sẽ hiển thị ở đây.</p>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="uppercase text-red-900 font-bold text-2xl mb-6">
        TÀI KHOẢN VÀ ĐIỂM HỘI VIÊN
      </h1>

      <div className="max-w-4xl mx-auto p-4">
        <div className="flex gap-4 justify-between">
          <div className="bg-gradient-to-r from-orange-400 to-amber-300 rounded-lg shadow-lg p-6 w-1/2 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-lg font-semibold">
                Điểm đang có
              </span>
              <Tooltip title="Điểm hội viên là điểm thưởng bạn nhận được sau mỗi giao dịch.">
                <HelpCircle
                  className="text-white cursor-pointer hover:animate-pulse"
                  size={20}
                />
              </Tooltip>
            </div>
            <div className="flex items-center space-x-2">
              <Coins className="text-white animate-bounce" size={32} />
              <span className="text-white text-3xl font-bold">1,500,000</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-red-600 to-pink-500 rounded-lg shadow-lg p-6 w-1/2 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-lg font-semibold">
                Tài khoản của {user.firstName}
              </span>
              <Tooltip title="Đây là số dư hiện tại trong tài khoản của bạn.">
                <HelpCircle
                  className="text-white cursor-pointer hover:animate-pulse"
                  size={20}
                />
              </Tooltip>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center text-white text-sm">
                <Wallet className="mr-2" size={20} />
                <span>Số dư tài khoản</span>
              </div>
              <span className="text-white text-2xl font-bold">1,500,000 đ</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 shadow-lg rounded-lg">{renderTabContent()}</div>
    </div>
  );
};

export default PersonalTransaction;
