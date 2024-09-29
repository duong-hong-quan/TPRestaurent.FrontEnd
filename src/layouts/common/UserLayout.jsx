import { useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../../components/common/Footer";
import { Navbar } from "../../components/common/Navbar";
import UserInfo from "../../components/user/UserInfo";
import UserSidebar from "../../components/user/UserSidebar";
import { useSelector } from "react-redux";
import InfoModal from "../../components/user/InfoModal";
import ChatButton from "../../components/chat/ChatButton";

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector((state) => state.user?.user || {});
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const handleUpdate = (data) => {};

  return (
    <div>
      <Navbar />
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <UserInfo
          userData={user}
          handleOpenUpdate={() => setIsUpdateModalOpen(true)}
        />
        <div className="">
          <button
            className="xl:hidden bg-red-700 text-white px-4 py-2 rounded-md mb-4"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "Menu" : " Menu"}
          </button>

          <div className="xl:flex justify-center">
            <div className={` ${sidebarOpen ? "block" : "hidden"} xl:block`}>
              <UserSidebar />
            </div>
            <div className="flex-1">
              <ChatButton />

              <Outlet />
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <InfoModal
        initialData={user}
        isOpen={isUpdateModalOpen}
        isUpdate={true}
        handleClose={() => setIsUpdateModalOpen(false)}
        onClose={() => setIsUpdateModalOpen(false)}
        onSubmit={handleUpdate}
      />
    </div>
  );
};

export default UserLayout;
