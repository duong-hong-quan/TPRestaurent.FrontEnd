import React from "react";
import { MultiLevelSidebar } from "../../components/sidebar/MultiLevelSidebar";
import { Outlet } from "react-router-dom";
import HeaderManager from "../../components/manager/HeaderManager";
import {
  FaChartBar,
  FaCog,
  FaEnvelope,
  FaMoneyBill,
  FaNewspaper,
  FaSignOutAlt,
} from "react-icons/fa";
import { useSelector } from "react-redux";
const menuItems = [
  {
    title: "Tối ưu chế biến",
    icon: <FaNewspaper className="h-5 w-5 text-white" />,
    path: "/kitchen/optimize-process",
  },
  {
    title: "Danh sách phiên đặt món",
    icon: <FaChartBar className="h-5 w-5 text-white" />,
    path: "/kitchen/session-management",
  },

  {
    title: "Xem đơn đặt món",
    icon: <FaMoneyBill className="h-5 w-5 text-white" />,
    path: "/kitchen/order-management",
  },
];
const KitchenLayout = () => {
  const user= useSelector((state) => state.user?.user || {});
  return (
    <div className="flex">
      <MultiLevelSidebar menuItems={menuItems} />
      <div className=" flex-1 w-full min-h-dvh bg-blue-gray-50 overflow-hidden">
        <div className="mx-2">
          <HeaderManager userName={user.lastName} />
        </div>
        <div className="m-2 mt-8 h-[1019px] bg-white overflow-y-scroll rounded-lg p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default KitchenLayout;
