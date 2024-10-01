import { useEffect, useState } from "react";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import {
  Upload,
  Button,
  Form,
  Input,
  Select,
  Card,
  Space,
  message,
  Modal,
} from "antd";
import { Typography } from "@material-tailwind/react";
import useCallApi from "../../../api/useCallApi";
import { DishApi } from "../../../api/endpoint";
import { showError } from "../../../util/Utility";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const CreateMenuPage = ({ back }) => {
  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const { callApi, error, loading } = useCallApi();
  const [dishTypes, setDishTypes] = useState([]);
  const [tags, setTags] = useState([]);
  const [dishSizes, setDishSizes] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    const dishTypeResponse = await callApi(
      `${DishApi.GET_ALL_DISH_TYPE}/1/100`,
      "GET"
    );
    if (dishTypeResponse?.isSuccess) {
      setDishTypes(dishTypeResponse.result.items);
    }
    const tagResponse = await callApi(
      `${DishApi.GET_ALL_DISH_TAG}/1/100`,
      "GET"
    );
    if (tagResponse?.isSuccess) {
      setTags(tagResponse.result.items);
    }
    const dishSizeResponse = await callApi(
      `${DishApi.GET_ALL_DISH_SIZE}/1/100`,
      "GET"
    );
    if (dishSizeResponse?.isSuccess) {
      setDishSizes(dishSizeResponse.result.items);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onFinish = async () => {
    const formData = new FormData();
    const data = form.getFieldsValue();
    form.setFieldValue("MainImageFile", fileList[0]);
    formData.append("MainImageFile", fileList[0].originFileObj);
    formData.append("Name", data.Name);
    formData.append("DishItemType", data.DishItemType);
    formData.append("Description", data.Description);
    for (let i = 0; i < fileList.length; i++) {
      formData.append("ImageFiles", fileList[i].originFileObj);
    }
    if (Array.isArray(data.TagIds)) {
      data.TagIds.forEach((tagId, index) => {
        formData.append(`TagIds[${index}]`, tagId);
      });
    }
    if (Array.isArray(data.DishSizeDetailDtos)) {
      data.DishSizeDetailDtos.forEach((item, index) => {
        formData.append(`DishSizeDetailDtos[${index}][price]`, item.price);
        formData.append(
          `DishSizeDetailDtos[${index}][discount]`,
          item.discount
        );
        formData.append(
          `DishSizeDetailDtos[${index}][dishSize]`,
          item.dishSize
        );
      });
    }

    const response = await callApi(`${DishApi.CREATE_DISH}`, "POST", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response?.isSuccess) {
      message.success("Tạo món ăn thành công");
      back();
    } else {
      showError(error);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="p-6 shadow-lg">
        <Typography className="text-red-800 mb-6 text-xl font-bold uppercase text-center">
          Thêm món ăn
        </Typography>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Form.Item
              name="Name"
              label="Tên món ăn"
              rules={[{ required: true, message: "Vui lòng nhập tên món ăn" }]}
            >
              <Input placeholder="Nhập tên món ăn" name="name" />
            </Form.Item>
            <Form.Item
              name="DishItemType"
              label="Danh mục"
              rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
            >
              <Select placeholder="Chọn danh mục">
                {dishTypes &&
                  dishTypes.length > 0 &&
                  dishTypes.map((type) => (
                    <Select.Option key={type.id} value={type.id}>
                      {type.vietnameseName}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item name="TagIds" label="Tag món ăn">
              <Select mode="tags" placeholder="Thêm tag cho món ăn" name="tags">
                {tags &&
                  tags.length > 0 &&
                  tags.map((tag) => (
                    <Select.Option key={tag.tagId} value={tag.tagId}>
                      {tag.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="Description"
            label="Mô tả món ăn"
            rules={[{ required: true, message: "Vui lòng nhập mô tả món ăn" }]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập mô tả chi tiết về món ăn"
              name="description"
            />
          </Form.Item>

          <Form.List name="DishSizeDetailDtos">
            {(fields, { add, remove }) => (
              <>
                <Form.Item>
                  <Button
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    className="mt-2 bg-red-800 hover:bg-red-700 text-white"
                  >
                    Thêm Size
                  </Button>
                </Form.Item>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "dishSize"]}
                      rules={[
                        { required: true, message: "Vui lòng chọn size" },
                      ]}
                      label="Size"
                    >
                      <Select
                        style={{ width: 120 }}
                        placeholder="Chọn size"
                        name={`dishSizeDetailDtos[${name}].size`}
                      >
                        {dishSizes &&
                          dishSizes.length > 0 &&
                          dishSizes.map((size) => (
                            <Select.Option key={size.id} value={size.id}>
                              {size.vietnameseName}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "price"]}
                      rules={[{ required: true, message: "Vui lòng nhập giá" }]}
                      label="Giá"
                    >
                      <Input
                        placeholder="Nhập giá"
                        style={{ width: 120 }}
                        name={`dishSizeDetailDtos[${name}].price`}
                        type="number"
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "discount"]}
                      rules={[{ required: true, message: "Vui lòng nhập giá" }]}
                      label="Giảm (%)"
                    >
                      <Input
                        placeholder="Nhập giá"
                        style={{ width: 120 }}
                        name={`dishSizeDetailDtos[${name}].discount`}
                        type="number"
                      />
                    </Form.Item>

                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      className="text-red-500"
                    />
                  </Space>
                ))}
              </>
            )}
          </Form.List>

          <Form.Item
            name="ImageFiles"
            label="Hình ảnh món ăn"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              customRequest={dummyRequest}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item name="MainImageFile" label="Hình ảnh món ăn" hidden>
            <Upload
              customRequest={dummyRequest}
              listType="picture-card"
            ></Upload>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-red-800 hover:bg-red-700"
              loading={loading}
            >
              Tạo món ăn
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Modal
        visible={previewOpen}
        title="Preview Image"
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default CreateMenuPage;
