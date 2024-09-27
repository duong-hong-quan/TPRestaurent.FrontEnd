import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { isEmptyObject } from "../util/Utility";

export const ProtectedRoute = ({ children, role }) => {
  const user = useSelector((state) => state.user.user || {});
  const navigate = useNavigate();

  useEffect(() => {
    if (isEmptyObject(user)) {
      navigate("/");
    } else {
      switch (role) {
        case "admin":
          if (user.mainRole !== "ADMIN") {
            navigate("/");
          }
          break;
        case "user":
          if (user.mainRole !== "CUSTOMER") {
            navigate("/");
          }
          break;
        case "kitchen":
          if (user.mainRole !== "CHEF") {
            navigate("/");
          }
          break;
        default:
          navigate("/");
      }
    }
  }, [user, role, navigate]);

  if (
    isEmptyObject(user) ||
    (role === "admin" && user.mainRole !== "ADMIN") ||
    (role === "user" && user.mainRole !== "CUSTOMER") ||
    (role === "kitchen" && user.mainRole !== "CHEF")
  ) {
    return null; // or a loading spinner, or a redirect component
  }

  return children;
};
