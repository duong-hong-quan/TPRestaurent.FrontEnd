import React from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96">
        <CardBody className="flex flex-col items-center">
          <Typography variant="h1" color="blue-gray" className="mb-2">
            404
          </Typography>
          <Typography variant="h5" color="blue-gray" className="mb-4">
            Trang không được tìm thấy
          </Typography>
          <Typography color="gray" className="mb-8 text-center">
            Oops! Trang bạn đang truy cập không tồn tại hoặc đã bị xóa.
          </Typography>
          <Link to="/">
            <Button variant="gradient" color="red">
              Trở lại trang chủ chúng tôi
            </Button>
          </Link>
        </CardBody>
      </Card>
    </div>
  );
};

export default ErrorPage;
