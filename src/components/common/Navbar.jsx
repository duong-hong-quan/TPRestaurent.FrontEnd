export const Navbar = () => {
  return (
    <nav className="hidden  bg-mainColor text-white p-4 h-24 md:flex items-center">
      <div className="container mx-auto  grid grid-cols-9 space-x-4">
        <h1 className="text-2xl font-bold col-span-1">Thiên Phú</h1>
        <ul className="col-span-4 flex items-center text-lg space-x-6 h-full ">
          <li>
            <a href="/" className="hover:text-button-hover">
              Thực đơn
            </a>
          </li>
          <li>
            <a href="/" className="hover:text-button-hover">
              Đặt bàn
            </a>
          </li>
          <li>
            <a href="/" className="hover:text-button-hover">
              Giới thiệu
            </a>
          </li>
          <li>
            <a href="/" className="hover:text-button-hover">
              Khuyến mãi
            </a>
          </li>
          <li>
            <a href="/" className="hover:text-button-hover">
              Liên hệ
            </a>
          </li>
        </ul>
        <div className="col-span-2">
          <ul className=" flex justify-end items-center text-lg space-x-6 h-full ">
            <li>
              <i className="fa-solid fa-magnifying-glass text-white "></i>
            </li>
            <li>
              <i className="fa-solid fa-cart-shopping text-white"></i>
            </li>
            <li>
              <i className="fa-regular fa-bell text-white"></i>
            </li>
          </ul>
        </div>
        <div className="col-span-2 flex justify-end">
          <button className="bg-white bg-opacity-50 text-white px-4 py-2 rounded-md">
            Đăng nhập
          </button>
        </div>
      </div>
    </nav>
  );
};
