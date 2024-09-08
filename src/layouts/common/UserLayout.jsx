import { useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../../components/common/Footer";
import { Navbar } from "../../components/common/Navbar";
import UserInfo from "../../components/user/UserInfo";
import UserSidebar from "../../components/user/UserSidebar";

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <Navbar />
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <UserInfo />
        <div className="">
          <button
            className="md:hidden bg-red-700 text-white px-4 py-2 rounded-md mb-4"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "Menu" : " Menu"}
          </button>

          <div className="md:flex justify-center">
            <div className={` ${sidebarOpen ? "block" : "hidden"} md:block`}>
              <UserSidebar />
            </div>
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserLayout;
