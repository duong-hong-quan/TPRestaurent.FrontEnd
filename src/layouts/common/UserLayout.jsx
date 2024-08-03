import { Outlet } from "react-router-dom";
import Footer from "../../components/common/Footer";
import { Navbar } from "../../components/common/Navbar";
import UserInfo from "../../components/user/UserInfo";
import UserSidebar from "../../components/user/UserSidebar";

const UserLayout = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <UserInfo />
        <div className="grid md:grid-cols-4">
          <div className="col-span-1">
            <UserSidebar />
          </div>
          <div className="col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default UserLayout;
