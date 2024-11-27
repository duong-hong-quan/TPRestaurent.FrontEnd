import { Button, Result } from "antd";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/features/authSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(logout());
  }, []);

  return (
    <Result
      status="403"
      title="403"
      subTitle="Rất tiếc bạn không thể truy cập vào trang này"
      extra={
        <Button type="primary" onClick={() => navigate("/")}>
          Trở về trang chủ
        </Button>
      }
    />
  );
};
export default Unauthorized;
