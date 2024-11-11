import React, { useState } from "react";
import { Form, Input, Rate, Upload, Button } from "antd";
import { PictureOutlined, DeleteOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const FeedbackForm = ({ orderDetailId, orderId }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return false;
      }
      return false;
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    fileList,
    multiple: true,
    maxCount: 5,
    listType: "picture-card",
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
      removeIcon: (
        <DeleteOutlined className="text-gray-500 hover:text-red-500" />
      ),
    },
  };

  const onFinish = (values) => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("ImageFiles", file.originFileObj);
    });

    Object.keys(values).forEach((key) => {
      if (key !== "ImageFiles") {
        formData.append(key, values[key]);
      }
    });

    console.log("Form values:", values);
    console.log("FormData:", formData);
  };

  return (
    <div className="max-w-7xlp-6 rounded-lg my-4">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Form.Item
            name="PointId"
            className="mb-0"
            label="Đánh giá"
            valuePropName="value"
            getValueFromEvent={(value) => value}
            rules={[
              {
                required: true,
                message: "Please provide a rating.",
              },
              {
                type: "number",
                min: 0.5,
                message: "Please provide a rating.",
              },
            ]}
          >
            <Rate className="text-3xl text-left " allowHalf />
          </Form.Item>
        </div>

        {/* Main Feedback Content */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Form.Item name="OrderDetailId" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="AccountId" hidden>
            <Input />
          </Form.Item>

          {/* Title */}
          <Form.Item
            name="Title"
            label="Tiêu đề"
            rules={[
              {
                required: true,
                message: "Please add a title for your review!",
              },
            ]}
          >
            <Input placeholder="Tiêu đề đánh giá" className="text-lg" />
          </Form.Item>

          {/* Content */}
          <Form.Item
            name="Content"
            label="Nội dung"
            rules={[
              {
                required: true,
                message: " Bạn hãy cho chúng tôi biết trải nghiệm của bạn!",
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Những điểm gì bạn hài lòng và không hài lòng về chúng tôi."
              className="text-base"
            />
          </Form.Item>

          <Form.Item name="ImageFiles" label="Thêm ảnh">
            <Upload {...uploadProps}>
              {fileList.length >= 5 ? null : (
                <div className="flex flex-col items-center justify-center p-4">
                  <PictureOutlined className="text-2xl text-gray-400 mb-1" />
                  <span className="text-gray-500">Tải ảnh lên</span>
                </div>
              )}
            </Upload>
          </Form.Item>
        </div>

        {/* Submit Button */}
        <Form.Item className="mb-0">
          <Button
            htmlType="submit"
            className="w-full max-w-32 text-white h-12 text-lg bg-red-800 hover:bg-red-600 border-red-500"
          >
            Gửi đánh giá
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FeedbackForm;
