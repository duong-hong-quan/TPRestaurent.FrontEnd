import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  InputNumber,
  Button,
  Input,
  Select,
  Typography,
  Card,
  Space,
  Divider,
  Image,
  Empty,
  AutoComplete,
} from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import useCallApi from "../../api/useCallApi";
import { DishApi } from "../../api/endpoint";

const { Title, Text } = Typography;
const { Option } = Select;

const CreateOptionSetModal = ({
  isOpen,
  onClose,
  index,
  dishItemTypes,
  onSubmit,
  initData,
}) => {
  console.log(initData);
  const [form] = Form.useForm();
  const [dishs, setDishs] = useState([]);
  const { callApi } = useCallApi();
  const [selectedDish, setSelectedDish] = useState(null);
  const [listDishSizeDetail, setListDishSizeDetail] = useState([]);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const fetchDataDish = async () => {
    let response = await callApi(
      `${DishApi.GET_ALL}/1/1000?type=${form.getFieldValue("dishItemType")}`,
      "GET"
    );

    if (response.isSuccess) {
      setDishs(response.result.items);
      setSelectedDish(response.result.items[0]?.dish.dishId);
      const dataFilter = dishs.filter(
        (dish) => dish.dish.dishId === selectedDish
      );
      setListDishSizeDetail(dataFilter[0]?.dishSizeDetails || []);
    }
  };
  const handleSelect = (value) => {
    const dish = dishs.find((dish) => dish.dish.dishId === value);
    setSelectedDish(dish);
  };
  useEffect(() => {
    fetchDataDish();
  }, [selectedType]);
  const updateSelectedDishes = (values) => {
    if (!values?.dishSizeDetails || !dishs.length) return;

    const newSelectedDishes = values.dishSizeDetails
      .map((detail) => {
        const dish = dishs.find((d) => d.dish.dishId === detail?.dishSelected);
        if (!dish) return null;

        const sizeDetail = dish.dishSizeDetails.find(
          (s) => s.dishSizeDetailId === detail?.dishSizeDetail
        );

        return {
          dish: dish.dish,
          size: sizeDetail?.dishSize,
          quantity: detail?.quantity,
        };
      })
      .filter(Boolean);

    setSelectedDishes(newSelectedDishes);
  };
  useEffect(() => {
    if (selectedDish) {
      const dataFilter = dishs.filter(
        (dish) => dish.dish.dishId === selectedDish?.dish?.dishId
      );
      setListDishSizeDetail(dataFilter[0]?.dishSizeDetails || []);
    }
  }, [selectedDish]);

  const handleSubmit = () => {
    form.validateFields().then(() => {
      console.log(form.getFieldsValue());
      onSubmit(index, form.getFieldsValue(), selectedDishes);
      onClose();
    });
  };
  console.log(initData);
  useEffect(() => {
    if (initData?.values) {
      form.setFieldsValue(initData.values);
      setSelectedDishes(initData.selectedDish);
    } else {
      form.resetFields();
      setSelectedDishes([]);
    }
  }, [isOpen]);

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
        <Title level={3} className="text-center my-4 text-red-800">
          TẠO COMBO BỘ {index}
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-4"
          name="optionSetForm"
          onValuesChange={(_, allValues) => updateSelectedDishes(allValues)}
        >
          <Card className="shadow-sm">
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

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Số lượng"
                name="quantity"
                rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
              >
                <InputNumber
                  className="w-full"
                  min={1}
                  placeholder="Nhập số lượng"
                />
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
                {fields.map(({ key, name, ...restField }) => (
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
                            onChange={(value) => setSelectedDish(value)}
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
                          <Select placeholder="Chọn size">
                            {listDishSizeDetail?.map((dish) => (
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
                          />
                        </Form.Item>
                      </div>

                      <div className="col-span-1 flex items-center">
                        <Button
                          type="text"
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(name)}
                        />
                      </div>
                    </div>
                  </Card>
                ))}

                <Form.Item>
                  <Button
                    className="bg-red-800 text-white"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Thêm món ăn vào bộ {index}
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>

          {/* Preview Section */}
          {selectedDishes.length > 0 && (
            <>
              <Divider>Món ăn đã chọn</Divider>
              <div className="grid grid-cols-2 gap-1">
                {selectedDishes.map((item, idx) => (
                  <Card key={idx}>
                    <div className=" flex items-center">
                      <Image
                        src={item.dish.image}
                        alt={item.dish.name}
                        style={{
                          width: "60px",
                          height: "60px",
                        }}
                      />
                      <div className="p-2 flex flex-col">
                        <Text strong className="block">
                          {item.dish.name}
                        </Text>
                        <Space className="mt-1">
                          <Text type="secondary">
                            Size: {item.size?.vietnameseName}
                          </Text>
                          <Text type="secondary">SL: {item.quantity}</Text>
                        </Space>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {form.getFieldValue("dishSizeDetails")?.length > 0 &&
            selectedDishes.length === 0 && (
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
