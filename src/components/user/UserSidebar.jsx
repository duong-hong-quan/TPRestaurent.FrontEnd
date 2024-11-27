import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const sidebarItems = [
  { icon: "fa-user", text: "Thông tin của tôi", href: "/user/info" },
  { icon: "fa-shopping-bag", text: "Đơn hàng của tôi", href: "/user/order" },
  {
    icon: "fa-calendar",
    text: "Lịch sử đặt chỗ của tôi",
    href: "/user/reservation-history",
  },
  {
    icon: "fa-comment",
    text: "Đánh giá của tôi",
    href: "/user/feedback",
  },
  { icon: "fa-wallet", text: "Ví xu", href: "transaction-history" },
];

const SidebarItem = ({ icon, text, href }) => (
  <li>
    <NavLink
      to={href}
      className={({ isActive }) =>
        `flex items-center px-4 py-4 text-gray-700 hover:bg-red-700 rounded-md transition duration-300 hover:text-white ${
          isActive ? "bg-red-700 text-white" : ""
        }`
      }
    >
      <i className={`fas ${icon} w-6`}></i>
      <span>{text}</span>
    </NavLink>
  </li>
);

const UserSidebar = () => {
  const user = useSelector((state) => state.user?.user || {});
  const userRole = user?.mainRole;

  // Only show the first item if the role is admin, chef, or shipper
  const filteredSidebarItems =
    userRole === "ADMIN" || userRole === "CHEF" || userRole === "SHIPPER"
      ? [sidebarItems[0]] // Show only the first item
      : sidebarItems; // Show all items

  return (
    <nav className="p-4 rounded-lg shadow-md w-full min-h-full xl:w-64">
      <ul className="space-y-2">
        {filteredSidebarItems.map((item, index) => (
          <SidebarItem key={index} {...item} />
        ))}
      </ul>
    </nav>
  );
};

export default UserSidebar;
