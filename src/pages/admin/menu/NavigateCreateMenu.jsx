import React, { useState } from "react";
import { Radio, Card } from "antd";
import CreateMenuPage from "./CreateMenuPage";
import CreateComboPage from "./CreateComboPage";

const NavigateCreateMenu = () => {
  const [selectedTab, setSelectedTab] = useState("tab1");

  const handleTabChange = (e) => {
    setSelectedTab(e.target.value);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg">
      <h1 className="text-start text-red-800 text-xl font-bold uppercase">
        Tạo thực đơn
      </h1>
      <Radio.Group onChange={handleTabChange} value={selectedTab}>
        <Radio value="tab1">Món ăn</Radio>
        <Radio value="tab2">Combo</Radio>
      </Radio.Group>
      <div className="" style={{ marginTop: 16 }}>
        {selectedTab === "tab1" && (
          <div>
            <CreateMenuPage />
          </div>
        )}
        {selectedTab === "tab2" && (
          <div>
            <CreateComboPage />
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigateCreateMenu;
