import React, { useState } from "react";
import UpdateProfile from "./UpdateProfile";
import PersonalAddress from "./PersonalAddress";

const PersonalInformation = () => {
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { id: "personal", label: "Thông tin cá nhân" },
    { id: "address", label: "Địa chỉ giao hàng" },
    { id: "settings", label: "Cài đặt tài khoản" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return <UpdateProfile />;
      case "address":
        return <PersonalAddress />;
      case "settings":
        return <p>Nội dung cài đặt tài khoản ở đây.</p>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="uppercase text-red-700 font-bold text-2xl mb-6">
        Thông tin của tôi
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

export default PersonalInformation;
