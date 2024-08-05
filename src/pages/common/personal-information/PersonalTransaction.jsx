import { useState } from "react";
import TransactionList from "../../../components/transaction/TransactionList";

const PersonalTransaction = () => {
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
        return <TransactionList transactions={filteredTransactions} />;
      case "pending":
        return <p>Các giao dịch đang xử lý sẽ hiển thị ở đây.</p>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="uppercase text-red-700 font-bold text-2xl mb-6">
        Lịch sử giao dịch
      </h1>

      <div className="mb-4">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                activeTab === tab.id
                  ? "border-b-2 border-red-700 text-red-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">{renderTabContent()}</div>
    </div>
  );
};

export default PersonalTransaction;
