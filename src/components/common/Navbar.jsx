import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Button,
  IconButton,
} from "@material-tailwind/react";
import LoadingOverlay from "../loading/LoadingOverlay";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = [
    { name: "Combo", path: "/combo" },
    { name: "Đặt bàn", path: "/booking" },
    { name: "Giới thiệu", path: "/about" },
    { name: "Khuyến mãi", path: "/promotions" },
    { name: "Liên hệ", path: "/contact" },
  ];

  const icons = [
    { icon: "fa-cart-shopping", path: "/cart", name: "Giỏ hàng" },
    { icon: "fa-bell", path: "/notifications", name: "Thông báo" },
  ];
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    setIsOpen(false);
    navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-[#A31927] text-white shadow-lg">
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-20">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            <NavLink
              to="/"
              className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
            >
              Thiên Phú
            </NavLink>
          </h1>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white focus:outline-none"
          >
            {isMenuOpen ? (
              <CloseOutlined className="text-2xl" />
            ) : (
              <MenuOutlined className="text-2xl" />
            )}
          </button>

          {/* Desktop menu */}
          <ul className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className="text-base lg:text-lg font-medium hover:text-yellow-300 transition duration-300 ease-in-out relative group"
                  activeClassName="text-yellow-300"
                >
                  {item.name}
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-yellow-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center space-x-4">
            {icons.map((item) => (
              <NavLink
                key={item.icon}
                to={item.path}
                className="hover:text-yellow-300 transition duration-300 ease-in-out"
              >
                <i className={`fa-solid ${item.icon} text-xl`}></i>
              </NavLink>
            ))}

            {isOpen && (
              <div className="left-1/2 -translate-x-1/2 top-20 absolute w-full px-4 sm:px-6 lg:px-8 z-50">
                <div className="max-w-7xl mx-auto">
                  <form className="flex flex-col sm:flex-row items-center gap-2 bg-white rounded-lg shadow-2xl p-2 mt-10">
                    <input
                      placeholder="Tìm kiếm..."
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full h-full focus:outline-none text-black px-4 py-2 text-lg"
                    />
                    <Button
                      size="lg"
                      className=" sm:w-auto bg-red-700 hover:bg-red-600 transition-all duration-300 text-nowrap"
                      onClick={handleSearch}
                    >
                      Tra cứu
                    </Button>
                  </form>
                </div>
              </div>
            )}
            <IconButton
              variant="text"
              className="rounded-full text-white hover:bg-white/20 transition-all"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </IconButton>
            <NavLink
              to="/login"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold px-4 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
              Đăng nhập
            </NavLink>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <ul className="pt-2 pb-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className="block py-2 px-4 text-sm hover:bg-red-700 transition duration-300 ease-in-out"
                    activeClassName="bg-red-700"
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
              {icons.map((item) => (
                <li key={item.icon}>
                  <NavLink
                    to={item.path}
                    className="block py-2 px-4 text-sm hover:bg-red-700 transition duration-300 ease-in-out"
                    activeClassName="bg-red-700"
                    onClick={toggleMenu}
                  >
                    <i className={`fa-solid ${item.icon} mr-2`}></i>
                    {item.name}
                  </NavLink>
                </li>
              ))}
              <li>
                <NavLink
                  to="/login"
                  className="block py-2 px-4 text-sm hover:bg-red-700 transition duration-300 ease-in-out"
                  onClick={toggleMenu}
                >
                  Đăng nhập
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};
