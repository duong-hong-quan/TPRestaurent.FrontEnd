import { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
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
import {
  formatLocalDateTime,
  formatPrice,
  showError,
} from "../../../util/Utility";
import CreateOptionSetModal from "../../../components/modal/CreateOptionSetModal";
import { useParams } from "react-router-dom";
import moment from "moment";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const CreateComboPage = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const { callApi, error, loading } = useCallApi();
  const [dishItemTypes, setDishItemTypes] = useState([]);
  const [dishTags, setDishTags] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [comboData, setComboData] = useState(null);
  const [selectedDish, setSelectedDish] = useState([[]]);
  const [listDishSizeDetail, setListDishSizeDetail] = useState([[]]);
  const [previewDishes, setPreviewDishes] = useState([[]]);
  const [valuesOptionSet, setValuesOptionSet] = useState([]);
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
  };
  const fetchDetailCombo = async () => {
    const response = await callApi(`${ComboApi.GET_BY_ID}/${id}`, "GET");
    if (response.isSuccess) {
      setComboData(response.result);
    }
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
    fetchDetailCombo();
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      name: comboData?.combo?.name,
      price: comboData?.combo?.price,
      preparationTime: comboData?.combo?.preparationTime,
      description: comboData?.combo?.description,
      tagIds: [...new Set(comboData?.dishTags.map((tag) => tag.tagId))],
      dateRange: [
        comboData?.combo?.startDate
          ? moment(comboData?.combo?.startDate)
          : null,
        comboData?.combo?.endDate ? moment(comboData.combo?.endDate) : null,
      ],
      dishComboDtos: [undefined],
    });
    mapOptionSetToForm();
  }, [comboData]);
  const mapOptionSetToForm = async () => {
    console.log(comboData);
    let selectedDishs = [...selectedDish];
    let listDishSizeDetails = [...listDishSizeDetail];
    let previewDishs = [...previewDishes];
    let valuesOptionSets = [...valuesOptionSet];

    comboData?.dishCombo?.forEach((combo, index) => {
      selectedDishs[index] = combo.dishCombo.map(
        (dish) => dish.dishSizeDetail.dishId
      );
      combo.dishCombo.forEach(async (dish, index) => {
        const response = await callApi(
          `${DishApi.GET_BY_ID}/${dish.dishSizeDetail.dish.dishId}`,
          "GET"
        );
        listDishSizeDetails[index].push(response.result.dish.dishSizeDetails);
      });
      previewDishs[index] = combo.dishCombo.map((dish) => ({
        dish: dish.dishSizeDetail.dish,
        dishSizeDetail: dish.dishSizeDetail,
        quantity: dish.quantity,
      }));
      valuesOptionSets[index] = {
        dishItemType: combo?.dishItemTypeId,
        numberOfChoices: combo.numOfChoice,
        dishSizeDetails: combo.dishCombo.map((dish) => ({
          dishSizeDetail: dish.dishSizeDetail.dishSizeDetailId,
          quantity: dish.quantity,
          dishSelected: dish.dishSizeDetail.dish.dishId,
        })),
      };
    });
    setSelectedDish(selectedDishs);
    setListDishSizeDetail(listDishSizeDetails);
    setPreviewDishes(previewDishs);
    setValuesOptionSet(valuesOptionSets);
  };

  const disabledDate = (current) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return current && current < today;
  };
  const disabledTime = (_, type) => {
    if (type === "start" || type === "end") {
      const disabledHours = [...Array(7).keys(), ...Array(1).fill(23)];
      return {
        disabledHours: () => disabledHours,
        disabledMinutes: (hour) => {
          if (hour === 7 || hour === 23) {
            return [...Array(60).keys()];
          }
          return [];
        },
      };
    }
    return {};
  };
  const onFinish = async (values) => {
    if (id) {
      const [startDate, endDate] = values.dateRange || [];
      const transformedData = {
        comboId: id,
        name: values.name,
        price: values.price,
        description: values.description,
        tagIds: values.tagIds,
        preparationTime: Number(values.preparationTime),
        startDate: formatLocalDateTime(new Date(startDate)),
        endDate: formatLocalDateTime(new Date(endDate)),
        dishComboDtos: valuesOptionSet.flat().map((combo, index) => ({
          optionSetNumber: index + 1,
          dishItemType: combo.dishItemType,
          numOfChoice: combo.numberOfChoices,
          listDishId: combo?.dishSizeDetails.map((dish) => ({
            dishSizeDetailId: dish.dishSizeDetail,
            quantity: dish.quantity,
          })),
        })),
      };
      const response = await callApi(
        `${ComboApi.UPDATE_COMBO}`,
        "PUT",
        transformedData
      );
      if (response.isSuccess) {
        message.success("Cập nhật combo thành công");
      } else {
        showError(response.messages);
      }
    } else {
      const [startDate, endDate] = values.dateRange || [];
      const transformedData = {
        name: values.name,
        price: values.price,
        description: values.description,
        tagIds: values.tagIds,
        preparationTime: Number(values.preparationTime),
        startDate: formatLocalDateTime(new Date(startDate)),
        endDate: formatLocalDateTime(new Date(endDate)),
        dishComboDtos: valuesOptionSet.flat().map((combo, index) => ({
          optionSetNumber: index + 1,
          dishItemType: combo.dishItemType,
          numOfChoice: combo.numberOfChoices,
          listDishId: combo?.dishSizeDetails.map((dish) => ({
            dishSizeDetailId: dish.dishSizeDetail,
            quantity: dish.quantity,
          })),
        })),
      };

      const formData = new FormData();

      formData.append("name", transformedData.name);
      formData.append("price", transformedData.price);
      formData.append("description", transformedData.description);
      formData.append("preparationTime", transformedData.preparationTime);
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
      const response = await callApi(ComboApi.CREATE_COMBO, "POST", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.isSuccess) {
        message.success("Tạo combo thành công");
      } else {
        showError(response.messages);
      }
    }
  };
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleOptionSetSubmit = (
    index,
    values,
    selectedDish,
    listDishSizeDetail,
    previewDishes
  ) => {
    setPreviewDishes(previewDishes);
    setListDishSizeDetail(listDishSizeDetail);
    setSelectedDish(selectedDish);
    let valuesCp = [...valuesOptionSet];
    valuesCp[index] = values;
    setValuesOptionSet(valuesCp);
    console.log(previewDishes);
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );
  const handleUpdateImage = async (file, image) => {
    const formData = new FormData();
    formData.append("ComboId", id);
    formData.append("Img", file);
    formData.append("OldImageLink", image.path);
    const response = await callApi(
      `${ComboApi.UPLOAD_COMBO_IMAGE}`,
      "POST",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response?.isSuccess) {
      message.success("Cập nhật ảnh thành công");
      await fetchDetailCombo();
    } else {
      showError(response.messages);
    }
  };
  return (
    <div className="max-w-7xl mx-auto my-8  bg-white px-4 py-6  rounded-lg">
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
                <Select.Option key={tag.tagId}>{tag.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <div className="flex gap-4">
          <Form.Item
            name="preparationTime"
            label="Thời gian chuẩn bị"
            rules={[{ required: true }]}
          >
            <InputNumber
              min={1}
              className="max-w-[200px]"
              placeholder="Nhập thời gian chuẩn bị"
            />
          </Form.Item>
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
        </div>
        <Form.Item name="description" label="Mô tả combo">
          <ReactQuill placeholder="Nhập mô tả chi tiết về combo món ăn" />
        </Form.Item>

        <Divider orientation="left">Bộ món</Divider>

        <Form.List name="dishComboDtos">
          {(fields, { add, remove }) => (
            <div className="space-y-4">
              {fields.map(({ key, name }, index) => (
                <Card key={key}>
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
                  {valuesOptionSet[index] && (
                    <>
                      <Typography className="text-red-800 font-semibold text-lg">
                        Giới hạn chọn: {valuesOptionSet[index].numberOfChoices}
                      </Typography>
                    </>
                  )}
                  {previewDishes[index]?.map((item, idx) => (
                    <div className="grid grid-cols-2 my-1">
                      <div
                        key={idx}
                        className="shadow-lg p-2 border border-gray-200 rounded-xl "
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
                              Size:{" "}
                              {item.dishSizeDetail?.dishSize.vietnameseName}
                            </Text>
                            <Text type="secondary">
                              Số lượng: {item.quantity}
                            </Text>
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
                    </div>
                  ))}
                  <Button
                    onClick={() => {
                      setIndex(index);
                      setIsModalOpen(true);
                      console.log(index);
                      console.log(isModalOpen);
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
        {!id && (
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
        )}

        {id && (
          <div className="flex items-center">
            {comboData?.imgs?.map((image) => (
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
        <Form.Item>
          <Button
            size="large"
            className="w-full bg-red-800 text-white"
            htmlType="submit"
            loading={loading}
          >
            {id ? "Cập nhật combo" : "Tạo combo"}
          </Button>
        </Form.Item>
      </Form>
      <CreateOptionSetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        index={index}
        dishItemTypes={dishItemTypes}
        onSubmit={handleOptionSetSubmit}
        initData={valuesOptionSet[index]}
        previewDishes={previewDishes}
        listDishSizeDetail={listDishSizeDetail}
        selectedDish={selectedDish}
        setPreviewDishes={setPreviewDishes}
        setListDishSizeDetail={setListDishSizeDetail}
        setSelectedDish={setSelectedDish}
      />
    </div>
  );
};

export default CreateComboPage;
