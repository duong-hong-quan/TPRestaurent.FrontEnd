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
}) => {
  const [form] = Form.useForm();
  const [dishs, setDishs] = useState([]);
  const { callApi } = useCallApi();
  const [selectedType, setSelectedType] = useState(null);
  const fetchDataDish = async () => {
    const response = await callApi(
      `${DishApi.GET_ALL}/1/1000?type=${
        form.getFieldValue("dishItemType") || initData?.values?.dishItemType
      }`,
      "GET"
    );

    if (response.isSuccess) {
      setDishs(response.result.items);
    }
  };
  const handleSelect = (value) => {
    const dish = dishs.find((dish) => dish.dish.dishId === value);
    // setSelectedDish(dish);
  };
  useEffect(() => {
    fetchDataDish();
  }, [selectedType]);
  const handleSubmit = () => {
    form.validateFields().then(() => {
      console.log(form.getFieldsValue());
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

  const mapData = async () => {
    await fetchDataDish();

    if (initData) {
      form.setFieldsValue(initData);
    } else {
      form.resetFields();
    }
  };
  useEffect(() => {
    mapData();
  }, [initData]);
  const handleSelectedDish = async (value, indexList) => {
    debugger;
    let selectedDishs = [...selectedDish];
    let selecterDishIndex = selectedDishs[index] || [];
    selecterDishIndex[indexList] = value;
    selectedDishs[index] = selecterDishIndex;
    setSelectedDish(selectedDishs);
    handleSelectedDishSizeDetail(value, indexList);
  };

  const handleSelectedDishSizeDetail = (value, indexList) => {
    let listDishSizeDetails = [...listDishSizeDetail];
    let dishSizeDetailIndex = listDishSizeDetails[index] || [];
    const dataFilter = dishs.filter((dish) => dish.dish.dishId === value);
    dishSizeDetailIndex[indexList] = dataFilter[0]?.dishSizeDetails || [];
    listDishSizeDetails[index] = dishSizeDetailIndex;
    setListDishSizeDetail(listDishSizeDetails);
  };
  const getDishBaseDishDetailId = (dishSizeDetailId) => {
    const dataFilter = dishs.filter((dish) =>
      dish.dishSizeDetails.find(
        (detail) => detail.dishSizeDetailId === dishSizeDetailId
      )
    );
    return dataFilter[0]?.dish;
  };
  const getDishSizeDetail = (dishSizeDetailId) => {
    return listDishSizeDetail[index]?.flat().filter((dishItem) => {
      return dishItem.dishSizeDetailId === dishSizeDetailId;
    })[0];
  };

  const handlePreview = (value, quantity) => {
    debugger;
    let previewDish = [...previewDishes];
    let previewDishIndex = previewDish[index] || [];
    const dish = previewDishIndex.find(
      (dish) => dish.dish.dishId === getDishBaseDishDetailId(value).dishId
    );
    if (dish) {
      dish.quantity = quantity;
    } else {
      debugger;
      previewDishIndex.push({
        dish: getDishBaseDishDetailId(value),
        quantity: quantity,
        dishSizeDetail: getDishSizeDetail(value),
      });
    }
    previewDish[index] = previewDishIndex;
    setPreviewDishes(previewDish);
  };
  const handleRemoveDish = (index, indexList) => {
    let selectedDishs = [...selectedDish];
    let selecterDishIndex = selectedDishs[index] || [];
    selecterDishIndex.splice(indexList, 1);
    selectedDishs[index] = selecterDishIndex;
    setSelectedDish(selectedDishs);

    let listDishSizeDetails = [...listDishSizeDetail];
    let dishSizeDetailIndex = listDishSizeDetails[index] || [];
    dishSizeDetailIndex.splice(indexList, 1);
    listDishSizeDetails[index] = dishSizeDetailIndex;
    setListDishSizeDetail(listDishSizeDetails);

    let previewDish = [...previewDishes];
    let previewDishIndex = previewDish[index] || [];
    previewDishIndex.splice(indexList, 1);
    previewDish[index] = previewDishIndex;
    setPreviewDishes(previewDish);
  };
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
                                handlePreview(
                                  listDishSizeDetail[index]?.[
                                    indexDishSizeDetails
                                  ]?.[0]?.dishSizeDetailId,
                                  value
                                );
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
