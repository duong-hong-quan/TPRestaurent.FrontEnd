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
  Image,
  Upload,
  message,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import useCallApi from "../../../api/useCallApi";
import { ComboApi, DishApi } from "../../../api/endpoint";
import { uniqueId } from "lodash";
import { formatLocalDateTime } from "../../../util/Utility";
import CreateOptionSetModal from "../../../components/modal/CreateOptionSetModal";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const CreateComboPage = () => {
  const [form] = Form.useForm();
  const { callApi, error, loading } = useCallApi();
  const [dishItemTypes, setDishItemTypes] = useState([]);
  const [dishTags, setDishTags] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [optionSets, setOptionSets] = useState([]);
  const [index, setIndex] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
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
      dishComboDtos: optionSets.map((combo, index) => ({
        optionSetNumber: index + 1,
        dishItemType: combo.values.dishItemType,
        quantity: combo.values.quantity,
        numOfChoice: combo.values.numberOfChoices,
        listDishId: combo.values?.dishSizeDetails.map((dish) => ({
          dishSizeDetailId: dish.dishSizeDetail,
          quantity: dish.quantity,
        })),
      })),
    };

    const formData = new FormData();

    formData.append("name", transformedData.name);
    formData.append("price", transformedData.price);
    formData.append("description", transformedData.description);
    // formData.append("tagIds", JSON.stringify(transformedData.tagIds));
    transformedData.tagIds.forEach((tagId, index) => {
      formData.append(`tagIds[${index}]`, tagId);
    });
    formData.append("startDate", transformedData.startDate);
    formData.append("endDate", transformedData.endDate);
    for (let i = 0; i < fileList.length; i++) {
      formData.append("imgs", fileList[i].originFileObj);
    }
    formData.append("MainImg", fileList[0].originFileObj);
    transformedData.dishComboDtos.forEach((combo, index) => {
      formData.append(
        `dishComboDtos[${index}][optionSetNumber]`,
        combo.optionSetNumber
      );
      formData.append(
        `dishComboDtos[${index}][dishItemType]`,
        combo.dishItemType
      );
      formData.append(`dishComboDtos[${index}][quantity]`, combo.quantity);
      formData.append(
        `dishComboDtos[${index}][numOfChoice]`,
        combo.numOfChoice
      );
      combo.listDishId.forEach((dish, dishIndex) => {
        formData.append(
          `dishComboDtos[${index}][listDishId][${dishIndex}][dishSizeDetailId]`,
          dish.dishSizeDetailId
        );
        formData.append(
          `dishComboDtos[${index}][listDishId][${dishIndex}][quantity]`,
          dish.quantity
        );
      });
    });
    const response = callApi(ComboApi.CREATE_COMBO, "POST", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.isSuccess) {
      message.success("Tạo combo thành công");
    } else {
      message.error("Tạo combo thất bại");
    }
  };
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleOptionSetSubmit = (index, values, selectedDish) => {
    const newOptionSet = { index, values, selectedDish };
    let newOptionSets = [...optionSets];

    const existingIndex = newOptionSets.findIndex(
      (item) => item.index === index
    );
    if (existingIndex !== -1) {
      newOptionSets[existingIndex] = newOptionSet;
    } else {
      newOptionSets.push(newOptionSet);
    }

    setOptionSets(newOptionSets);
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );
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
        name="createCombo"
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
              {fields.map(({ key, name }, index) => (
                <Card key={uniqueId()}>
                  <div className="flex justify-between">
                    <span className="text-lg text-red-800 font-semibold">
                      Bộ {index + 1}
                    </span>
                    <span>
                      <Button
                        type="text"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                      />
                    </span>
                  </div>

                  {optionSets[index]?.selectedDish?.map((item, detailIdx) => (
                    <div className="grid grid-cols-3 gap-1 my-2">
                      <div
                        key={detailIdx}
                        className="shadow-md p-2 rounded-md border border-gray-50"
                      >
                        <div className="flex items-center">
                          <Image
                            src={item.dish.image}
                            alt={item.dish.name}
                            style={{
                              width: "60px",
                              height: "60px",
                            }}
                            className="rounded-md"
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
                      </div>
                    </div>
                  ))}
                  <Button
                    onClick={() => {
                      setIndex(index);
                      setIsModalOpen(true);
                    }}
                    className="bg-red-800 text-white"
                  >
                    Tạo
                  </Button>
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
        <Form.Item
          name="Imgs"
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
        <Form.Item>
          <Button
            size="large"
            className="w-full bg-red-800 text-white"
            htmlType="submit"
            loading={loading}
          >
            Create Combo
          </Button>
        </Form.Item>
      </Form>
      <CreateOptionSetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        index={index + 1}
        dishItemTypes={dishItemTypes}
        onSubmit={handleOptionSetSubmit}
        initData={optionSets[index] || null}
      />
    </div>
  );
};

export default CreateComboPage;
