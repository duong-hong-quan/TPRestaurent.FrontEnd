import React from "react";
import { MultiLevelSidebar } from "../../components/sidebar/MultiLevelSidebar";
import { Outlet } from "react-router-dom";
import HeaderManager from "../../components/manager/HeaderManager";

const ManagerLayout = () => {
  return (
    <div className="flex">
      <MultiLevelSidebar />
      <div className=" flex-1 w-full h-screen bg-blue-gray-50">
        <HeaderManager />
        <div className=" m-2 mt-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ManagerLayout;
