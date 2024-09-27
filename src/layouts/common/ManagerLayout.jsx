import React from "react";
import { MultiLevelSidebar } from "../../components/sidebar/MultiLevelSidebar";
import { Outlet } from "react-router-dom";
import HeaderManager from "../../components/manager/HeaderManager";
import {
  FaChartBar,
  FaCog,
  FaEnvelope,
  FaGooglePlay,
  FaNewspaper,
  FaShoppingBag,
  FaSignOutAlt,
} from "react-icons/fa";
const menuItems = [
  {
    title: "Tổng quan",
    icon: <FaChartBar className="h-5 w-5 text-white" />,
    subItems: [
      { title: "Bảng điều khiển", path: "/overview/dashboard" },
      { title: "Báo cáo", path: "/overview/reports" },
    ],
  },
  {
    title: "Quản lý đơn hàng",
    icon: <FaShoppingBag className="h-5 w-5 text-white" />,
    subItems: [
      { title: "Yêu cầu đặt bàn", path: "/admin/reservation-history" },
      { title: "Đơn hàng online", path: "/admin/order-history" },
      { title: "Đặt món tại quán", path: "/admin/meal-history" },
    ],
  },
  {
    title: "Quản lý giao dịch",
    icon: <FaGooglePlay className="h-5 w-5 text-white" />,
    path: "/admin/transaction-history",
  },
  {
    title: "Tin nhắn",
    icon: <FaEnvelope className="h-5 w-5 text-white" />,
    path: "/admin/messages",
  },
  {
    title: "Cấu hình hệ thống",
    icon: <FaCog className="h-5 w-5 text-white" />,
    subItems: [
      { title: "Cài đặt", path: "/admin/settings" },
      { title: "Quản lý thiết bị", path: "/admin/manage-devices" },
    ],
  },
  {
    title: "Đăng xuất",
    icon: <FaSignOutAlt className="h-5 w-5 text-white" />,
    path: "/logout",
  },
];
const ManagerLayout = () => {
  return (
    <div className="flex">
      <MultiLevelSidebar menuItems={menuItems} />
      <div className=" flex-1 w-full min-h-dvh bg-blue-gray-50">
        <HeaderManager />
        <div className="m-2 mt-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ManagerLayout;
