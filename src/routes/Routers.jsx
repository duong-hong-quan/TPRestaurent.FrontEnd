import { Navigate, useRoutes } from "react-router-dom";
import { HomePage } from "../pages/common/home-page/HomePage";
import { CommonLayout } from "../layouts/common/CommonLayout";
import LoginPage from "../pages/login/Login";
import CartPage from "../pages/common/cart/CartPage";
import MenuPage from "../pages/common/menu-page/MenuPage";
import ProductDetail from "../pages/common/product-detail/ProductDetail";
import Reservation from "../components/reservation/Reservation";
import ReservationPage from "../pages/common/reservation/ReservationPage";
import UserLayout from "../layouts/common/UserLayout";
import PersonalInformation from "../pages/common/personal-information/PersonalInformation";

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
      ],
    },
  ]);
  return routing;
}
export default Routers;
