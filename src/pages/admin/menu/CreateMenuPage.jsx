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
  Image,
  InputNumber,
} from "antd";
import { Typography } from "@material-tailwind/react";
import useCallApi from "../../../api/useCallApi";
import { DishApi } from "../../../api/endpoint";
import { formatPrice, numberToWords, showError } from "../../../util/Utility";
import { useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css"; // import styles
import ReactQuill from "react-quill";
import LoadingOverlay from "../../../components/loading/LoadingOverlay";
import { set } from "lodash";

const { TextArea } = Input;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const CreateMenuPage = ({ back }) => {
  const { id } = useParams();
  const [initData, setInitData] = useState(null);
  const [discountedPrices, setDiscountedPrices] = useState({});

  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const { callApi, error, loading } = useCallApi();
  const [dishTypes, setDishTypes] = useState([]);
  const [tags, setTags] = useState([]);
  const [dishSizes, setDishSizes] = useState([]);
  const navigate = useNavigate();
  const [priceText, setPriceText] = useState([]);
  const [priceDiscounts, setPriceDiscounts] = useState([]);
  const caculateDiscountPriceChange = (index) => {
    const data = form.getFieldValue(`DishSizeDetailDtos`);
    let price = data[index]?.price;
    let discount = data[index]?.discount;
    let discountPrice = price - (price * discount) / 100;
    setPriceDiscounts((prev) => {
      prev[index] = discountPrice;
      return [...prev];
    });
  };
  const fetchDataById = async (id) => {
    const response = await callApi(`${DishApi.GET_BY_ID}/${id}`, "GET");
    if (response?.isSuccess) {
      setInitData(response.result);
      console.log(response.result);
    }
  };
  useEffect(() => {
    if (id) {
      fetchDataById(id);
    }
  }, [id]);
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
    if (initData) {
      const data = form.getFieldsValue();
      console.log(data);
      const response = await callApi(`${DishApi.UPDATE_DISH}`, "PUT", {
        dishId: initData.dish?.dish?.dishId,
        name: data.Name,
        preparationTime: Number(data.PreparationTime),
        description: data.Description,
        updateDishSizeDetailDtos: data.DishSizeDetailDtos,
        dishItemType: data.DishItemType,
      });
      if (response?.isSuccess) {
        message.success("Cập nhật món ăn thành công");
      } else {
        showError(response.messages);
      }
    } else {
      const formData = new FormData();
      const data = form.getFieldsValue();
      form.setFieldValue("MainImageFile", fileList[0]);
      formData.append("MainImageFile", fileList[0].originFileObj);
      formData.append("Name", data.Name);
      formData.append("DishItemType", data.DishItemType);
      formData.append("Description", data.Description);
      formData.append("PreparationTime", Number(data.PreparationTime));
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

      const response = await callApi(
        `${DishApi.CREATE_DISH}`,
        "POST",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response?.isSuccess) {
        message.success("Tạo món ăn thành công");
        back();
      } else {
        showError(response.messages);
      }
    }
  };
  useEffect(() => {
    if (initData) {
      console.log(initData);
      form.setFieldsValue({
        Name: initData?.dish?.dish?.name,
        DishItemType: initData?.dish?.dish?.dishItemTypeId,
        Description: initData?.dish?.dish?.description,
        PreparationTime: initData?.dish?.dish?.preparationTime,
        TagIds: initData?.dishTags?.map((tag) => tag.tag.tagId),
        DishSizeDetailDtos: initData?.dish?.dishSizeDetails?.map((size) => ({
          dishSizeDetailId: size.dishSizeDetailId,
          dishSize: size.dishSize.id,
          price: size.price,
          discount: size.discount,
        })),
      });
      setPriceText((prev) => {
        initData?.dish?.dishSizeDetails?.forEach((size, index) => {
          prev[index] = numberToWords(size.price);
        });
        return [...prev];
      });
      setPriceDiscounts((prev) => {
        initData?.dish?.dishSizeDetails?.forEach((size, index) => {
          let discountPrice = size.price - (size.price * size.discount) / 100;
          prev[index] = discountPrice;
        });
        return [...prev];
      });
    }
  }, [initData]);
  const uploadButton = () => {
    if (initData) {
    }

    return (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Tải lên</div>
      </div>
    );
  };
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
  const handleUpdateImage = async (file, image) => {
    const formData = new FormData();
    formData.append("DishId", id);
    formData.append("Image", file);
    formData.append("OldImageLink", image.path);
    const response = await callApi(
      `${DishApi.UPDATE_DISH_IMAGE}`,
      "PUT",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response?.isSuccess) {
      message.success("Cập nhật ảnh thành công");
      await fetchDataById(id);
    } else {
      showError(response.messages);
    }
  };
  const renderPriceText = (index) => {
    let price = form.getFieldValue(`DishSizeDetailDtos`);
    price = price[index]?.price;
    if (price) {
      setPriceText((prev) => {
        prev[index] = numberToWords(price);
        return [...prev];
      });
    }
    return "";
  };
  return (
    <div className="max-w-6xl mx-auto my-8 ">
      <LoadingOverlay isLoading={loading} />
      <div className=" border-none p-4 bg-white">
        <Typography className="text-red-800 mb-6 text-xl font-bold uppercase text-center">
          {id ? "Chỉnh sửa" : "Thêm "} món ăn
        </Typography>
        <div className="max-h-[900px] overflow-y-scroll">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="border-none"
            style={{ border: "none !important" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Form.Item
                name="Name"
                label="Tên món ăn"
                rules={[
                  { required: true, message: "Vui lòng nhập tên món ăn" },
                ]}
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
              <Form.Item
                required
                name="PreparationTime"
                label="Thời gian ước tính (phút)"
              >
                <Input type="number" className="max-w-[200px]" />
              </Form.Item>
              <Form.Item name="TagIds" label="Tag món ăn">
                <Select
                  mode="tags"
                  placeholder="Thêm tag cho món ăn"
                  name="tags"
                >
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
              rules={[
                { required: true, message: "Vui lòng nhập mô tả món ăn" },
              ]}
            >
              <ReactQuill placeholder="Nhập mô tả chi tiết về món ăn" />
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
                  {fields.map(({ key, name, ...restField }, index) => (
                    <>
                      <Space
                        key={key}
                        style={{ display: "flex", marginBottom: 8 }}
                        align="baseline"
                        className="my-4"
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
                        <div className="flex flex-col">
                          <Form.Item
                            {...restField}
                            name={[name, "price"]}
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập giá gốc",
                              },
                              {
                                type: "number",
                                min: 1000,
                                message: "Giá không được nhỏ hơn 1000 đồng",
                              },
                            ]}
                            label="Giá gốc"
                          >
                            <InputNumber
                              placeholder="Nhập giá"
                              style={{ width: 120 }}
                              name={`dishSizeDetailDtos[${name}].price`}
                              onChange={() => {
                                renderPriceText(index);
                                caculateDiscountPriceChange(index);
                              }}
                            />
                          </Form.Item>
                        </div>

                        <Form.Item
                          {...restField}
                          name={[name, "dishSizeDetailId"]}
                          hidden
                        >
                          <Input
                            placeholder="Nhập giá"
                            style={{ width: 120 }}
                            name={`dishSizeDetailDtos[${name}].dishSizeDetailId`}
                          />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "discount"]}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập phần trăm giảm giá",
                            },
                            {
                              type: "number",
                              min: 0,
                              max: 99,
                              message:
                                "Phần trăm giảm giá nằm trong khoảng 0 đến 99%",
                            },
                          ]}
                          label="Giảm (%)"
                        >
                          <InputNumber
                            placeholder="Nhập giá"
                            style={{ width: 120 }}
                            name={`dishSizeDetailDtos[${name}].discount`}
                            onChange={() => {
                              caculateDiscountPriceChange(index);
                            }}
                            defaultValue={0}
                          />
                        </Form.Item>

                        <MinusCircleOutlined
                          onClick={() => remove(name)}
                          className="text-red-500"
                        />
                      </Space>
                      <span className="items-center font-bold block text-red-800  my-2">
                        Gía sau khi giảm:{" "}
                        {priceDiscounts[index] &&
                          formatPrice(priceDiscounts[index])}
                      </span>
                      <span className="items-center font-bold  my-2">
                        Bằng chữ: {priceText[index]}
                      </span>
                    </>
                  ))}
                </>
              )}
            </Form.List>

            <Form.Item
              name="ImageFiles"
              label="Hình ảnh món ăn"
              valuePropName="fileList"
              getValueFromEvent={(e) => e.fileList}
              required
            >
              {!initData && (
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  customRequest={dummyRequest}
                >
                  {fileList.length >= 8 ? null : uploadButton()}
                </Upload>
              )}
              {initData && (
                <div className="flex items-center">
                  {initData?.dishImgs?.map((image) => (
                    <div
                      className="relative w-32 h-32 mr-4 shadow-md cursor-pointer"
                      key={image.id}
                    >
                      <Upload
                        showUploadList={false}
                        beforeUpload={(file) => {
                          handleUpdateImage(file, image);
                          return false;
                        }}
                      >
                        <img
                          src={image.path}
                          alt="avatar"
                          className=" w-32 h-32 object-cover border border-gray-100"
                        />
                      </Upload>
                    </div>
                  ))}
                </div>
              )}
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
                {id ? "Chỉnh sửa" : "Thêm "} món ăn
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
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
