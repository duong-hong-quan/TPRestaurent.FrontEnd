import { act, useEffect, useState } from "react";
import {
  Table,
  Card,
  Typography,
  Modal,
  Form,
  Input,
  Button,
  DatePicker,
  TimePicker,
  Skeleton,
  Tabs,
  message,
} from "antd";
import moment from "moment";
import useCallApi from "../../api/useCallApi";
import { ConfigurationApi } from "../../api/endpoint";
import Pagination from "../../components/pagination/Pagination";
import { StyledTable } from "../../components/custom-ui/StyledTable";
import { EditIcon, ShowerHead } from "lucide-react";
import dayjs from "dayjs";
import { showError } from "../../util/Utility";
import LoadingOverlay from "../../components/loading/LoadingOverlay";

const { Title } = Typography;
const { TabPane } = Tabs;

const SettingsPage = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const { callApi, error, loading } = useCallApi();
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const totalItems = 100;

  const handleCurrentPageChange = (page) => {
    setCurrentPage(page);
  };

  const fetchData = async () => {
    const response = await callApi(
      `${ConfigurationApi.GET_ALL}/${currentPage}/${totalItems}`,
      "GET"
    );
    if (response?.isSuccess) {
      setData(response.result?.items);
      setTotalPages(response.result.totalPages);
    } else {
      console.log("error", response);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handleEdit = (record) => {
    setSelectedRecord(record);
    form.setFieldsValue({
      configurationId: record.configurationId,
      name: record.name,
      currentValue: record.currentValue,
      unit: record.unit,
    });
    form2.setFieldsValue({
      configurationId: record.configurationId,
      activeDate: dayjs(),
      activeValue: record.currentValue,
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
  };

  const columns = [
    {
      title: "Tên cấu hình",
      dataIndex: "name",
      key: "name",
      render(_, record) {
        return <span>{`${record.vietnameseName}  (${record.unit})`}</span>;
      },
    },
    {
      title: "Giá trị hiện tại",
      dataIndex: "currentValue",
      key: "currentValue",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          <EditIcon />
        </Button>
      ),
    },
  ];
  const handleCreateConfigService = async (values) => {
    debugger;
    const payload = {
      ...values,
      activeDate: dayjs(values.activeDate).format("YYYY-MM-DD"),
    };
    console.log("payload", payload);
    const data = {
      activeValue: payload.activeValue,
      activeDate: dayjs(payload.activeDate).format("YYYY-MM-DD"),
      configurationId: payload.configurationId,
    };
    const response = await callApi(
      `${ConfigurationApi.CREATE_CONFIG_SERVICE}`,
      "POST",
      data
    );
    if (response?.isSuccess) {
      setIsModalVisible(false);
      setSelectedRecord(null);
      await fetchData();
      message.success("Cấu hình thành công");
    } else {
      showError(error);
    }
  };
  const handleSubmitUpdateConfigService = async (values) => {
    console.log("values", values);
    const response = await callApi(
      `${ConfigurationApi.UPDATE_CONFIG}`,
      "PUT",
      values
    );
    if (response?.isSuccess) {
      setIsModalVisible(false);
      setSelectedRecord(null);
      await fetchData();
      message.success("Cập nhật cấu hình thành công");
    } else {
      showError(error);
    }
  };
  return (
    <Card className="max-w-7xl mx-auto my-8">
      <LoadingOverlay isLoading={loading} />
      <div>
        <h3 className="uppercase text-center text-xl text-red-800 my-4 font-semibold">
          Cấu hình hệ thống
        </h3>
      </div>
      <div className="overflow-y-scroll h-[650px]">
        {loading && <Skeleton active />}
        {!loading && (
          <StyledTable
            columns={columns}
            dataSource={data}
            pagination={false}
            loading={loading}
          />
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        key={currentPage}
        onPageChange={handleCurrentPageChange}
      />
      <Modal
        title="Config Service"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1200}
      >
        <div style={{ display: "flex" }}>
          <Tabs>
            <TabPane tab="Cập nhật cấu hình hiện tại" key="1">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmitUpdateConfigService}
              >
                <Form.Item hidden label="ID" name="configurationId">
                  <Input disabled />
                </Form.Item>
                <Form.Item label="Tên cấu hình" name="name">
                  <Input disabled />
                </Form.Item>
                <Form.Item label="Gía trị hiện tại" name="currentValue">
                  <Input />
                </Form.Item>
                <Form.Item label="Đơn vị" name="unit">
                  <Input disabled />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Cập nhật
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
            <TabPane tab="Cập nhật cấu hình theo lịch " key="2">
              <Form
                form={form2}
                layout="vertical"
                onFinish={handleCreateConfigService}
              >
                <Form.Item hidden label="ID" name="configurationId">
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  label="Gía trị cấu hình tiếp theo"
                  name="activeValue"
                  rules={[
                    {
                      required: true,
                      message: "Please input the Active Value!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Ngày áp dụng"
                  name="activeDate"
                  rules={[
                    {
                      required: true,
                      message: "Please select the Active Date!",
                    },
                  ]}
                >
                  <DatePicker
                    needConfirm={false}
                    format={"DD/MM/YYYY"}
                    showTime
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Cấu hình
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>

          <div className="flex-1 ml-4">
            <h3 className="font-semibold text-red-800 uppercase text-center">
              Lịch sử cấu hình
            </h3>
            <StyledTable
              columns={[
                {
                  title: "Ngày áp dụng",
                  dataIndex: "activeDate",
                  key: "activeDate",
                  render: (text) => (
                    <span>{moment(text).format("DD/MM/YYYY")}</span>
                  ),
                },
                {
                  title: "Gía trị cấu hình",
                  dataIndex: "activeValue",
                  key: "activeValue",
                },
              ]}
              pagination={false}
            />
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default SettingsPage;
