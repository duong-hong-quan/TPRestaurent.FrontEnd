import { useEffect, useState } from "react";
import LoyalPointHistoryList from "../../../components/loyalpoint/LoyalPointHistoryList";
import { Tooltip } from "antd";
import { Coins, Gift, HelpCircle, Wallet } from "lucide-react";
import { useSelector } from "react-redux";
import { MoneyCollectFilled } from "@ant-design/icons";
import useCallApi from "../../../api/useCallApi";
import { TransactionApi } from "../../../api/endpoint";
import { showError } from "../../../util/Utility";
import StoreCreditHistory from "../../../components/store-credit/StoreCreditHistory";

const PersonalTransaction = () => {
  const user = useSelector((state) => state.user.user || {});
  const [activeTab, setActiveTab] = useState("loyalPoint");
  const { callApi, error, loading } = useCallApi();
  const [transactions, setTransactions] = useState([]);
  const [storeCreditTransactions, setStoreCreditTransactions] = useState([]);
  const fetchData = async () => {
    if (activeTab === "loyalPoint") {
      const res = await callApi(
        `${TransactionApi.GET_LOYALTY_POINT_BY_CUSTOMER}/${user.id}`,
        "GET"
      );
      if (res.isSuccess) {
        setTransactions(res.result.items);
      } else {
        showError(error);
      }
    } else {
      const res = await callApi(
        `${TransactionApi.GET_TRANSACTION_HISTORY_BY_CUSTOMER_ID}/${user.id}`,
        "GET"
      );
      if (res.isSuccess) {
        setStoreCreditTransactions(res.result.items);
      } else {
        showError(error);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, [activeTab]);
  const renderTabContent = () => {
    switch (activeTab) {
      case "loyalPoint":
        return <LoyalPointHistoryList transactions={transactions} />;
      case "storeCredit":
        return (
          <StoreCreditHistory storeCreditHistory={storeCreditTransactions} />
        );
      default:
        return <LoyalPointHistoryList transactions={transactions} />;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="uppercase text-red-900 font-bold text-2xl mb-6">
        TÀI KHOẢN VÀ ĐIỂM HỘI VIÊN
      </h1>

      <div className="max-w-4xl mx-auto p-4">
        <div className="flex gap-4 justify-between">
          <div
            onClick={() => setActiveTab("loyalpoint")}
            className="bg-gradient-to-r from-orange-400 to-amber-300 rounded-lg shadow-lg p-6 w-1/2 transform hover:scale-105 transition-transform duration-300"
          >
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
              <span className="text-white text-3xl font-bold">
                {user.loyalPoint.toLocaleString()}
              </span>
            </div>
          </div>
          <div
            onClick={() => setActiveTab("storeCredit")}
            className="bg-gradient-to-r from-red-600 to-pink-500 rounded-lg shadow-lg p-6 w-1/2 transform hover:scale-105 transition-transform duration-300"
          >
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
              <span className="text-white text-2xl font-bold">
                {user.storeCredit.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 shadow-lg rounded-lg">{renderTabContent()}</div>
    </div>
  );
};

export default PersonalTransaction;
