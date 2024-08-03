import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

export const CommonLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};
