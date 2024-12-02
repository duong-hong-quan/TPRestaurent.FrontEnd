import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  InputNumber,
  Button,
  Select,
  Typography,
  Card,
  Divider,
  Image,
  Empty,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import useCallApi from "../../api/useCallApi";
import { DishApi } from "../../api/endpoint";
import { formatPrice } from "../../util/Utility";

const { Title, Text } = Typography;
const { Option } = Select;

const CreateOptionSetModal = ({
  isOpen,
  onClose,
  index,
  dishItemTypes,
  onSubmit,
  initData,
  selectedDish,
  listDishSizeDetail,
  previewDishes,
  setSelectedDish,
  setListDishSizeDetail,
  setPreviewDishes,
  handleSelect,
}) => {
  const [form] = Form.useForm();
  const [dishs, setDishs] = useState([]);
  const { callApi } = useCallApi();
  const [selectedType, setSelectedType] = useState(null);
  console.log("listDishSizeDetail", listDishSizeDetail);
  const fetchDataDish = async () => {
    const response = await callApi(
      `${DishApi.GET_ALL}/1/1000?type=${
        form.getFieldValue("dishItemType") || initData?.dishItemType
      }`,
      "GET"
    );

    if (response.isSuccess) {
      setDishs(response.result.items);
    }
  };
  useEffect(() => {
    if (isOpen) {
      fetchDataDish();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedType) {
      fetchDataDish();
    }
  }, [selectedType]);

  const handleSelectedDish = (value, indexList) => {
    // Update selected dishes
    const updatedSelectedDish = [...selectedDish];
    if (!updatedSelectedDish[index]) {
      updatedSelectedDish[index] = [];
    }
    updatedSelectedDish[index][indexList] = value;
    setSelectedDish(updatedSelectedDish);

    // Update dish size details
    const handleUpdateDishSizeDetails = () => {
      const selectedDishData = dishs.find(
        (dishItem) => dishItem.dish.dishId === value
      );

      const updatedListDishSizeDetail = [...listDishSizeDetail];
      if (!updatedListDishSizeDetail[index]) {
        updatedListDishSizeDetail[index] = [];
      }

      const currentDishSizeDetails = selectedDishData
        ? selectedDishData.dishSizeDetails
        : [];

      updatedListDishSizeDetail[index][indexList] = currentDishSizeDetails;
      setListDishSizeDetail(updatedListDishSizeDetail);
    };

    handleUpdateDishSizeDetails();
  };

  const handlePreview = (dishSizeDetailId, quantity) => {
    const updatedPreviewDishes = [...previewDishes];
    if (!updatedPreviewDishes[index]) {
      updatedPreviewDishes[index] = [];
    }

    // Find the dish and size detail
    const dishWithSizeDetail = dishs.find((dish) =>
      dish.dishSizeDetails.some(
        (detail) => detail.dishSizeDetailId === dishSizeDetailId
      )
    );

    if (dishWithSizeDetail) {
      const dishSizeDetail = dishWithSizeDetail.dishSizeDetails.find(
        (detail) => detail.dishSizeDetailId === dishSizeDetailId
      );

      // Check if dish already exists in preview
      const existingDishIndex = updatedPreviewDishes[index].findIndex(
        (preview) => preview.dish.dishId === dishWithSizeDetail.dish.dishId
      );

      if (existingDishIndex !== -1) {
        // Update existing dish
        updatedPreviewDishes[index][existingDishIndex] = {
          dish: dishWithSizeDetail.dish,
          dishSizeDetail: dishSizeDetail,
          quantity: quantity,
        };
      } else {
        // Add new dish
        updatedPreviewDishes[index].push({
          dish: dishWithSizeDetail.dish,
          dishSizeDetail: dishSizeDetail,
          quantity: quantity,
        });
      }

      setPreviewDishes(updatedPreviewDishes);
    }
  };

  const handleRemoveDish = (index, indexList) => {
    // Remove from selected dishes
    const updatedSelectedDish = [...selectedDish];
    if (updatedSelectedDish[index]) {
      updatedSelectedDish[index].splice(indexList, 1);
    }
    setSelectedDish(updatedSelectedDish);

    // Remove from dish size details
    const updatedListDishSizeDetail = [...listDishSizeDetail];
    if (updatedListDishSizeDetail[index]) {
      updatedListDishSizeDetail[index].splice(indexList, 1);
    }
    setListDishSizeDetail(updatedListDishSizeDetail);

    // Remove from preview dishes
    const updatedPreviewDishes = [...previewDishes];
    if (updatedPreviewDishes[index]) {
      updatedPreviewDishes[index].splice(indexList, 1);
    }
    setPreviewDishes(updatedPreviewDishes);
  };

  const handleSubmit = () => {
    form.validateFields().then(() => {
      onSubmit(
        index,
        form.getFieldsValue(),
        selectedDish,
        listDishSizeDetail,
        previewDishes
      );
      form.resetFields();
      onClose();
    });
  };

  useEffect(() => {
    if (initData) {
      form.setFieldsValue(initData);
    }
  }, [initData]);
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="submit"
          className="bg-red-800 text-white"
          onClick={() => {
            handleSubmit();
          }}
        >
          Xác nhận
        </Button>,
      ]}
    >
      <div className="max-h-[calc(100vh-200px)] overflow-auto px-4">
        <h1 className="text-center my-4 text-red-800 text-2xl font-bold">
          TẠO COMBO BỘ {index + 1}
        </h1>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-4"
          name="optionSetForm"
        >
          <Card className="shadow-sm">
            <div className="grid grid-cols-2 gap-1">
              <Form.Item
                name="dishItemType"
                label="Loại món"
                rules={[{ required: true, message: "Vui lòng chọn loại món" }]}
              >
                <Select
                  placeholder="Chọn loại món"
                  className="w-full"
                  showSearch
                  onChange={(value) => setSelectedType(value)}
                >
                  {dishItemTypes?.map((type) => (
                    <Option key={type.id} value={type.id}>
                      {type.vietnameseName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Giới hạn chọn"
                name="numberOfChoices"
                rules={[
                  { required: true, message: "Vui lòng nhập giới hạn chọn" },
                ]}
              >
                <InputNumber
                  className="w-full"
                  min={1}
                  placeholder="Nhập giới hạn chọn"
                />
              </Form.Item>
            </div>
          </Card>

          <Divider>Danh sách món ăn</Divider>

          <Form.List name="dishSizeDetails">
            {(fields, { add, remove }) => (
              <div className="space-y-4">
                {fields.map(
                  ({ key, name, ...restField }, indexDishSizeDetails) => (
                    <Card key={key} className="shadow-sm">
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-4">
                          <Form.Item
                            {...restField}
                            name={[name, "dishSelected"]}
                            rules={[
                              { required: true, message: "Vui lòng chọn món" },
                            ]}
                            label="Món ăn"
                          >
                            <Select
                              showSearch
                              placeholder="Chọn món"
                              onSelect={handleSelect}
                              onChange={(value) =>
                                handleSelectedDish(value, indexDishSizeDetails)
                              }
                              loading={!dishs.length}
                              onSearch={(value) => {
                                if (value) {
                                  const dataFilter = dishs.filter((dish) =>
                                    dish.dish.name
                                      .toLowerCase()
                                      .includes(value.toLowerCase())
                                  );
                                  setDishs(dataFilter);
                                } else {
                                  fetchDataDish();
                                }
                              }}
                            >
                              {dishs?.map((dish) => (
                                <Option
                                  key={dish.dish.dishId}
                                  value={dish.dish.dishId}
                                >
                                  {dish.dish.name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </div>

                        <div className="col-span-4">
                          <Form.Item
                            {...restField}
                            name={[name, "dishSizeDetail"]}
                            rules={[
                              { required: true, message: "Vui lòng chọn size" },
                            ]}
                            label="Size"
                          >
                            <Select
                              placeholder="Chọn size"
                              onChange={(value) => {
                                handlePreview(
                                  value,
                                  form.getFieldValue([name, "quantity"]) || 1
                                );
                              }}
                              loading={
                                !listDishSizeDetail[index]?.[
                                  indexDishSizeDetails
                                ]
                              }
                            >
                              {listDishSizeDetail[index]?.[
                                indexDishSizeDetails
                              ]?.map((dish) => (
                                <Option
                                  key={dish.dishSizeDetailId}
                                  value={dish.dishSizeDetailId}
                                >
                                  {dish.dishSize.vietnameseName}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </div>

                        <div className="col-span-3">
                          <Form.Item
                            {...restField}
                            name={[name, "quantity"]}
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập số lượng",
                              },
                            ]}
                            label="Số lượng"
                          >
                            <InputNumber
                              placeholder="SL"
                              min={1}
                              className="w-full"
                              onChange={(value) => {
                                const currentDishSizeDetail =
                                  form.getFieldValue([name, "dishSizeDetail"]);
                                if (currentDishSizeDetail) {
                                  handlePreview(currentDishSizeDetail, value);
                                }
                              }}
                            />
                          </Form.Item>
                        </div>

                        <div className="col-span-1 flex items-center">
                          <Button
                            type="text"
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => {
                              handleRemoveDish(index, indexDishSizeDetails);
                              remove(name);
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                  )
                )}

                <Form.Item>
                  <Button
                    className="bg-red-800 text-white"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Thêm món ăn vào bộ {index + 1}
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>

          {/* Preview Section */}
          {previewDishes[index]?.length > 0 && (
            <>
              <Divider>Món ăn đã chọn</Divider>
              <div className="grid grid-cols-2 gap-1">
                {previewDishes[index].map((item, idx) => (
                  <div
                    key={idx}
                    className="shadow-lg p-2 border border-gray-200 rounded-xl"
                  >
                    <div className=" flex items-center">
                      <Image
                        src={item.dish?.image}
                        alt={item.dish?.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "20px",
                        }}
                      />
                      <div className="p-2 flex flex-col">
                        <Text strong className="block">
                          {item.dish?.name}
                        </Text>
                        <Text type="secondary">
                          Size: {item.dishSizeDetail?.dishSize.vietnameseName}
                        </Text>
                        <Text type="secondary">Số lượng: {item.quantity}</Text>
                        <Text type="secondary">
                          Giá : {formatPrice(item.dishSizeDetail.price)}
                        </Text>
                        <Text type="secondary">
                          Giá tạm tính:{" "}
                          {formatPrice(
                            item.dishSizeDetail.price * item.quantity
                          )}
                        </Text>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {form.getFieldValue("dishSizeDetails")?.length > 0 &&
            previewDishes[index]?.length === 0 && (
              <div className="mt-4">
                <Empty
                  description="Chưa có món ăn nào được chọn"
                  className="my-4"
                />
              </div>
            )}
        </Form>
      </div>
    </Modal>
  );
};

export default CreateOptionSetModal;
