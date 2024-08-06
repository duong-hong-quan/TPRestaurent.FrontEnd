import { Navigate, useRoutes } from "react-router-dom";
import { HomePage } from "../pages/common/home-page/HomePage";
import LoginPage from "../pages/login/Login";
import CartPage from "../pages/common/cart/CartPage";
import MenuPage from "../pages/common/menu-page/MenuPage";
import ProductDetail from "../pages/common/product-detail/ProductDetail";
import Reservation from "../components/reservation/Reservation";
import ReservationPage from "../pages/common/reservation/ReservationPage";
import UserLayout from "../layouts/common/UserLayout";
import PersonalInformation from "../pages/common/personal-information/PersonalInformation";
import PersonalOrder from "../pages/common/personal-information/PersonalOrder";
import ReservationList from "../components/reservation/reservation-list/ReservationList";
import PersonalTransaction from "../pages/common/personal-information/PersonalTransaction";
import PersonalReservation from "../pages/common/personal-information/PersonalReservation";
import ManagerLayout from "../layouts/common/ManagerLayout";
import CommonLayout from "../layouts/common/CommonLayout";
import { TransactionPage } from "../pages/admin/TransactionPage";
import { AdminOrderHistoryPage } from "../pages/admin/AdminOrderHistoryPage";
import { AdminReservationPage } from "../pages/admin/AdminReservationPage";
import ChatComponent from "../pages/common/chat/ChatComponent";
import MessengerApp from "../pages/common/chat/ChatComponent";
import SettingsPage from "../pages/admin/SettingsPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";

function Routers() {
  const routing = useRoutes([
    {
      path: "/",
      element: <CommonLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "cart",
          element: <CartPage />,
        },
        {
          path: "menu",
          element: <MenuPage />,
        },
        {
          path: "product/:id",
          element: <ProductDetail />,
        },
        {
          path: "booking",
          element: <ReservationPage />,
        },
      ],
    },
    {
      path: "/user",
      element: <UserLayout />,
      children: [
        {
          index: true,
          element: <PersonalInformation />,
        },
        {
          path: "info",
          element: <PersonalInformation />,
        },
        {
          path: "order",
          element: <PersonalOrder />,
        },
        {
          path: "reservation-history",
          element: <PersonalReservation />,
        },
        {
          path: "transaction-history",
          element: <PersonalTransaction />,
        },
      ],
    },
    {
      path: "admin",
      element: <ManagerLayout />,
      children: [
        {
          index: true,
          element: <TransactionPage />,
        },
        {
          path: "order-history",
          element: <AdminOrderHistoryPage />,
        },
        {
          path: "transaction-history",
          element: <TransactionPage />,
        },
        {
          path: "reservation-history",
          element: <AdminReservationPage />,
        },
        {
          path: "messages",
          element: <MessengerApp />,
        },
        {
          path: "settings",
          element: <SettingsPage />,
        },
        {
          path: "overviews",
          element: <AdminDashboardPage />,
        },
      ],
    },
  ]);
  return routing;
}
export default Routers;
