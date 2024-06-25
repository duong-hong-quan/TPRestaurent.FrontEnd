import { Navigate, useRoutes } from "react-router-dom";

function Routers() {
  const routing = useRoutes([
    {
      path: "/",
      element: <p className="text-primary font-bold">a</p>,
    },
  ]);
  return routing;
}
export default Routers;
