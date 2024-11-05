import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { isEmptyObject } from "../util/Utility";
import useCallApi from "../api/useCallApi";
import { TokenApi } from "../api/endpoint";
import { useDispatch } from "react-redux";
import { logout } from "../redux/features/authSlice";

export const ProtectedRoute = ({ children, role }) => {
  const user = useSelector((state) => state.user.user || {});
  const { callApi, error, loading } = useCallApi();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fetchCurrentToken = async () => {
    debugger;
    const currentTokenResponse = await callApi(
      `${TokenApi.GET_USER_TOKEN_BY_IP}`,
      "GET"
    );
    if (!currentTokenResponse.isSuccess) {
      dispatch(logout());
      navigate("/");
    }
  };

  useEffect(() => {
    if (isEmptyObject(user)) {
      navigate("/");
    } else {
      fetchCurrentToken();
      switch (role) {
        case "admin":
          if (user.mainRole !== "ADMIN") {
            navigate("/");
          }
          break;
        case "user":
          if (localStorage.getItem("token") === null) {
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
    (role === "kitchen" && user.mainRole !== "CHEF")
  ) {
    return null; // or a loading spinner, or a redirect component
  }

  return children;
};
