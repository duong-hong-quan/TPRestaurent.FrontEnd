import { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Space,
  Select,
  Card,
  Typography,
  Divider,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import useCallApi from "../../../api/useCallApi";
import { DishApi } from "../../../api/endpoint";
import { uniqueId } from "lodash";
import { formatLocalDateTime } from "../../../util/Utility";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const CreateComboPage = () => {
  const [form] = Form.useForm();
  const { callApi, error, loading } = useCallApi();
  const [dishItemTypes, setDishItemTypes] = useState([]);
  const [dishTags, setDishTags] = useState([]);
  const fetchData = async () => {
    const response = await callApi(`${DishApi.GET_ALL_DISH_TAG}/1/100`, "GET");
    dishItemTypes;
    const responseType = await callApi(
      `${DishApi.GET_ALL_DISH_TYPE}/1/100`,
      "GET"
    );
    if (response.isSuccess && responseType.isSuccess) {
      setDishTags(response.result.items);
      setDishItemTypes(responseType.result.items);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const disabledDate = (current) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return current && current < today;
  };
  const disabledTime = (_, type) => {
    if (type === "start" || type === "end") {
      const hours = [...Array(24).keys()]; // [0,1,2,...,23]
      const disabledHours = [...Array(7).keys(), ...Array(1).fill(23)]; // [0,1,2,3,4,5,6, 23]

      return {
        disabledHours: () => disabledHours,
        disabledMinutes: (hour) => {
          // If hour is 7 or 23, disable all minutes
          if (hour === 7 || hour === 23) {
            return [...Array(60).keys()];
          }
          return [];
        },
      };
    }
    return {};
  };
  const onFinish = (values) => {
    const [startDate, endDate] = values.dateRange || [];

    const transformedData = {
      name: values.name,
      price: values.price,
      description: values.description,
      tagIds: values.tagIds,
      startDate: formatLocalDateTime(new Date(startDate)),
      endDate: formatLocalDateTime(new Date(endDate)),
      dishComboDtos: values.dishComboDtos?.map((combo, index) => ({
        ...combo,
        optionSetNumber: index + 1,
        listDishId: combo.listDishId?.map((dish) => ({
          dishSizeDetailId: dish.dishSizeDetailId,
          quantity: dish.quantity,
        })),
      })),
    };

    console.log("Received values of form: ", transformedData);
  };

  console.log(form.getFieldsValue());
  return (
    <div className="max-w-4xl mx-auto my-8 ">
      <Typography className="text-xl font-bold text-center mb-6 uppercase text-red-800">
        Tạo combo món ăn
      </Typography>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item name="name" label="Tên combo" rules={[{ required: true }]}>
            <Input placeholder="Nhập tên combo" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá combo"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>

          <Form.Item
            name="tagIds"
            label="Từ khoá liên quan"
            rules={[{ required: true }]}
          >
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Chọn hoặc tạo từ khoá"
            >
              {dishTags?.map((tag) => (
                <Select.Option key={tag.tagId} value={tag.tagId}>
                  {tag.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <Form.Item
          name="dateRange"
          label="Thời gian bán"
          rules={[{ required: true }]}
        >
          <RangePicker
            showTime
            format="DD/MM/YYYY HH:mm"
            disabledTime={disabledTime}
            disabledDate={disabledDate}
          />
        </Form.Item>
        <Form.Item name="description" label="Mô tả combo">
          <Input.TextArea rows={4} placeholder="Mô tả combo..." />
        </Form.Item>

        <Divider orientation="left">Bộ món</Divider>

        <Form.List name="dishComboDtos">
          {(fields, { add, remove }) => (
            <div className="space-y-4">
              {fields.map(({ key, name, ...restField }, index) => (
                <Card key={uniqueId()} className="bg-gray-50">
                  <Space direction="vertical" className="w-full" size="large">
                    <div className="flex justify-between items-center">
                      <Text strong>Bộ {index + 1}</Text>
                      <Button
                        type="text"
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                        danger
                      >
                        Xoá
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Form.Item
                        {...restField}
                        name={[name, "dishItemType"]}
                        label="Loại món"
                        rules={[{ required: true, message: "Required" }]}
                      >
                        <Select placeholder="Select dish type">
                          {dishItemTypes?.map((type) => (
                            <Select.Option key={type.id} value={type.id}>
                              {type.vietnameseName}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "numOfChoice"]}
                        label="Giới hạn chọn"
                        rules={[{ required: true, message: "Required" }]}
                      >
                        <InputNumber placeholder="e.g., 2" className="w-full" />
                      </Form.Item>
                    </div>

                    <Form.List name={[name, "listDishId"]}>
                      {(subFields, subOpt) => (
                        <>
                          <div
                            className="space-y-2 grid grid-cols-1"
                            key={uniqueId()}
                          >
                            {subFields.map((subField) => (
                              <Space
                                key={uniqueId()}
                                align="center"
                                direction="horizontal"
                              >
                                <Form.Item
                                  {...subField}
                                  key={uniqueId()}
                                  name={[subField.name, "quantity"]}
                                  rules={[
                                    { required: true, message: "Required" },
                                  ]}
                                  label="Số lượng"
                                >
                                  <InputNumber placeholder="Số lượng" />
                                </Form.Item>
                                <Form.Item
                                  {...subField}
                                  key={uniqueId()}
                                  name={[subField.name, "dishSizeDetailId"]}
                                  rules={[
                                    { required: true, message: "Required" },
                                  ]}
                                  label="Món ăn"
                                >
                                  <Select
                                    key={uniqueId()}
                                    style={{ width: 200 }}
                                    placeholder="Select size"
                                  >
                                    <Select.Option value="1">
                                      Small
                                    </Select.Option>
                                    <Select.Option value="2">
                                      Medium
                                    </Select.Option>
                                    <Select.Option value="3">
                                      Large
                                    </Select.Option>
                                  </Select>
                                </Form.Item>
                                <Button
                                  type="text"
                                  icon={<MinusCircleOutlined />}
                                  onClick={() => subOpt.remove(subField.name)}
                                  danger
                                />
                              </Space>
                            ))}
                          </div>
                          <Button
                            type="dashed"
                            onClick={() => subOpt.add()}
                            icon={<PlusOutlined />}
                          >
                            Thêm món
                          </Button>
                        </>
                      )}
                    </Form.List>
                  </Space>
                </Card>
              ))}
              <Button
                type="default"
                className="bg-red-800 text-white"
                onClick={() => add()}
                icon={<PlusOutlined />}
              >
                Tạo bộ món
              </Button>
            </div>
          )}
        </Form.List>

        <Form.Item>
          <Button
            size="large"
            className="w-full bg-red-800 text-white"
            htmlType="submit"
          >
            Create Combo
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateComboPage;
