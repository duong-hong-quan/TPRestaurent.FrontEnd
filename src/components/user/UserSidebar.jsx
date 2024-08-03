import { NavLink } from "react-router-dom";

const sidebarItems = [
  { icon: "fa-user", text: "Thông tin của tôi", href: "/user/info" },
  { icon: "fa-shopping-bag", text: "Đơn hàng của tôi", href: "/user/order" },
  {
    icon: "fa-calendar-alt",
    text: "Lịch sử đặt bàn",
    href: "/user/reservation",
  },
  { icon: "fa-wallet", text: "Ví xu", href: "#" },
];

const SidebarItem = ({ icon, text, href }) => (
  <li>
    <NavLink
      to={href}
      className="flex items-center px-4 py-4 text-gray-700 hover:bg-red-700 rounded-md transition duration-300 hover:text-white"
    >
      <i className={`fas ${icon} w-6`}></i>
      <span>{text}</span>
    </NavLink>
  </li>
);

const UserSidebar = () => {
  return (
    <nav className="p-4 rounded-lg shadow-md w-64 min-h-full">
      <ul className="space-y-2">
        {sidebarItems.map((item, index) => (
          <SidebarItem key={index} {...item} />
        ))}
      </ul>
    </nav>
  );
};

export default UserSidebar;
