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
  const handleToken = async () => {
    const currentTokenResponse = await callApi(
      `${TokenApi.GET_USER_TOKEN_BY_IP}`,
      "POST"
    );
    if (currentTokenResponse.isSuccess) {
      switch (role) {
        case "admin":
          if (user.mainRole !== "ADMIN") {
            navigate("/unauthorized");
          }
          break;
        case "user":
          break;
        case "kitchen":
          if (user.mainRole !== "CHEF") {
            navigate("/unauthorized");
          }
          break;
        default:
          navigate("/");
      }
    } else {
      dispatch(logout());
      navigate("/");
    }
  };

  useEffect(() => {
    if (isEmptyObject(user)) {
      navigate("/");
    } else {
      handleToken();
    }
  }, [user, role, navigate]);

  return children;
};
