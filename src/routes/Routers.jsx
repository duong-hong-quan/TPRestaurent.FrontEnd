import { Navigate, useRoutes } from "react-router-dom";
import { HomePage } from "../pages/common/home-page/HomePage";
import { CommonLayout } from "../layouts/common/CommonLayout";

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
      ],
    },
  ]);
  return routing;
}
export default Routers;
