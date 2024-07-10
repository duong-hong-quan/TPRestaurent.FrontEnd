import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../../components/common/Navbar";

export const CommonLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      {/* <Footer /> */}
    </>
  );
};
