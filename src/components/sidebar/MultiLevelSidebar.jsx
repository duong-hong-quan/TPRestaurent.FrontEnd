import React, { useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  FaChevronDown,
  FaChevronRight,
  FaBars,
  FaTimes,
  FaChartBar,
  FaShoppingBag,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const menuItems = [
  {
    title: "Tổng quan",
    icon: <FaChartBar className="h-5 w-5 text-white" />,
    subItems: ["Bảng điều khiển", "Báo cáo"],
  },
  {
    title: "Quản lý giao dịch",
    icon: <FaShoppingBag className="h-5 w-5 text-white" />,
    subItems: ["Đơn đặt hàng", "Yêu cầu đặt bàn"],
  },
  { title: "Tin nhắn", icon: <FaEnvelope className="h-5 w-5 text-white" /> },
  {
    title: "Cấu hình hệ thống",
    icon: <FaCog className="h-5 w-5 text-white" />,
  },
  { title: "Đăng xuất", icon: <FaSignOutAlt className="h-5 w-5 text-white" /> },
];

const AccordionItem = ({ item, open, handleOpen, index }) => (
  <Accordion
    open={open === index}
    icon={
      item.subItems && (
        <FaChevronDown
          className={`h-4 w-4 transition-transform text-white ${
            open === index ? "rotate-180" : ""
          }`}
        />
      )
    }
  >
    <ListItem className="p-0" selected={open === index}>
      <AccordionHeader
        onClick={() => handleOpen(index)}
        className="border-b-0 px-4 py-4  cursor-pointer"
      >
        <ListItemPrefix>{item.icon}</ListItemPrefix>
        <Typography className="mr-auto text-white">{item.title}</Typography>
      </AccordionHeader>
    </ListItem>
    {item.subItems && (
      <AccordionBody className="py-1">
        <List className="p-0">
          {item.subItems.map((subItem, subIndex) => (
            <ListItem key={subIndex} className="text-white ">
              <ListItemPrefix>
                <FaChevronRight className="h-3 w-3" />
              </ListItemPrefix>
              <Typography className="text-white">{subItem}</Typography>
            </ListItem>
          ))}
        </List>
      </AccordionBody>
    )}
  </Accordion>
);

export function MultiLevelSidebar() {
  const [open, setOpen] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#970C1A] text-white transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <p className="font-bold text-2xl text-center text-white w-full">
            Thien Phu
          </p>
          <button
            onClick={toggleSidebar}
            className="md:hidden text-white focus:outline-none"
          >
            <FaTimes className="h-6 w-6 text" />
          </button>
        </div>
        <List className="text-white p-2">
          {menuItems.map((item, index) => (
            <AccordionItem
              key={index}
              item={item}
              open={open}
              handleOpen={handleOpen}
              index={index + 1}
            />
          ))}
        </List>
      </aside>
    </div>
  );
}
