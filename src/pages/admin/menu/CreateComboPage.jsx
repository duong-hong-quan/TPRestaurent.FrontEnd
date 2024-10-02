import React from "react";
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

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const CreateComboPage = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

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
              <Select.Option key="1">Popular</Select.Option>
              <Select.Option key="2">New</Select.Option>
              <Select.Option key="3">Limited Time</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item name="description" label="Mô tả combo">
          <Input.TextArea rows={4} placeholder="Mô tả combo..." />
        </Form.Item>

        <Form.Item
          name="dateRange"
          label="Thời gian bán"
          rules={[{ required: true }]}
        >
          <RangePicker showTime format="DD/MM/YYYY HH:mm" className="w-full" />
        </Form.Item>

        <Divider orientation="left">Bộ món</Divider>

        <Form.List name="dishComboDtos">
          {(fields, { add, remove }) => (
            <div className="space-y-4">
              {fields.map(({ key, name, ...restField }, index) => (
                <Card key={key} className="bg-gray-50">
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
                        name={[name, "optionSetNumber"]}
                        label="Số thứ tự bộ món"
                        rules={[{ required: true, message: "Required" }]}
                      >
                        <InputNumber placeholder="e.g., 1" className="w-full" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "dishItemType"]}
                        label="Loại món"
                        rules={[{ required: true, message: "Required" }]}
                      >
                        <Select placeholder="Select dish type">
                          <Select.Option value="MAIN">Main</Select.Option>
                          <Select.Option value="SIDE">Side</Select.Option>
                          <Select.Option value="DRINK">Drink</Select.Option>
                          <Select.Option value="DESSERT">Dessert</Select.Option>
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
                          <div className="space-y-2 grid grid-cols-1">
                            {subFields.map((subField) => (
                              <Space
                                key={subField.key}
                                align="center"
                                direction="horizontal"
                              >
                                <Form.Item
                                  {...subField}
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
                                  name={[subField.name, "dishSizeDetailId"]}
                                  rules={[
                                    { required: true, message: "Required" },
                                  ]}
                                  label="Món ăn"
                                >
                                  {/* <Select
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
                                  </Select> */}
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
            htmlType="submit"
            size="large"
            className="w-full bg-red-800 text-white"
          >
            Create Combo
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateComboPage;
