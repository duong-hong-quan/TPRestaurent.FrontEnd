import { Navigate, useRoutes } from "react-router-dom";
import { HomePage } from "../pages/common/home-page/HomePage";
import { CommonLayout } from "../layouts/common/CommonLayout";
import LoginPage from "../pages/login/Login";
import CartPage from "../pages/common/cart/CartPage";
import MenuPage from "../pages/common/menu-page/MenuPage";
import ProductDetail from "../pages/common/product-detail/ProductDetail";

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
      ],
    },
  ]);
  return routing;
}
export default Routers;
