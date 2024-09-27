import React, { useState } from "react";
import UpdateProfile from "./UpdateProfile";
import PersonalAddress from "./PersonalAddress";
import TabMananger from "../../../components/tab/TabManager";

const PersonalInformation = () => {
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { value: "personal", label: "Thông tin cá nhân" },
    { value: "address", label: "Địa chỉ giao hàng" },
    { value: "settings", label: "Cài đặt tài khoản" },
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
        <TabMananger
          items={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      <div className="mt-4">{renderTabContent()}</div>
    </div>
  );
};

export default PersonalInformation;
