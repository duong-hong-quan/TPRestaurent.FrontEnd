import React from "react";
import { MultiLevelSidebar } from "../../components/sidebar/MultiLevelSidebar";
import { Outlet } from "react-router-dom";
import HeaderManager from "../../components/manager/HeaderManager";

const ManagerLayout = () => {
  return (
    <div className="flex">
      <MultiLevelSidebar />
      <div className=" flex-1 w-full h-full bg-blue-gray-50">
        <HeaderManager />
        <div className="container my-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ManagerLayout;
