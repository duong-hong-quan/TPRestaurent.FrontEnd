import React, { useState } from "react";
import { Radio, Card } from "antd";
import CreateMenuPage from "./CreateMenuPage";
import CreateComboPage from "./CreateComboPage";
import { uniqueId } from "lodash";

const NavigateCreateMenu = ({ back }) => {
  const [selectedTab, setSelectedTab] = useState("tab1");

  const handleTabChange = (e) => {
    setSelectedTab(e.target.value);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg">
      <span
        onClick={back}
        className=" py-2 rounded-lg block cursor-pointer text-red-800"
      >
        Trở về
      </span>
      <h1 className="text-start text-red-800 text-xl font-bold uppercase">
        Tạo thực đơn
      </h1>
      <Radio.Group onChange={handleTabChange} value={selectedTab}>
        <Radio key={uniqueId()} value="tab1">
          Món ăn
        </Radio>
        <Radio key={uniqueId()} value="tab2">
          Combo
        </Radio>
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
