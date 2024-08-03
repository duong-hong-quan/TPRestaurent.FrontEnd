import { NavLink } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="hidden md:block  bg-red-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          <h1 className="text-3xl font-extrabold tracking-tight">
            <NavLink
              to={`/`}
              className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
            >
              Thiên Phú
            </NavLink>
          </h1>

          <ul className="flex space-x-8">
            {["Thực đơn", "Đặt bàn", "Giới thiệu", "Khuyến mãi", "Liên hệ"].map(
              (item) => (
                <li key={item}>
                  <a
                    href="/"
                    className="text-lg font-medium hover:text-yellow-300 transition duration-300 ease-in-out relative group"
                  >
                    {item}
                    <span className="absolute left-0 bottom-0 w-full h-0.5 bg-yellow-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
                  </a>
                </li>
              )
            )}
          </ul>

          <div className="flex items-center space-x-6">
            <div className="flex space-x-4">
              {["fa-magnifying-glass", "fa-cart-shopping", "fa-bell"].map(
                (icon) => (
                  <button
                    key={icon}
                    className="hover:text-yellow-300 transition duration-300 ease-in-out"
                  >
                    <i className={`fa-solid ${icon} text-xl`}></i>
                  </button>
                )
              )}
            </div>
            <NavLink
              to={`login`}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold px-6 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
              Đăng nhập
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};
