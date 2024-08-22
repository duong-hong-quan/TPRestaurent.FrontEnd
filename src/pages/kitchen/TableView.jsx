import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Checkbox,
} from "@material-tailwind/react";
import {
  getCurrentTableSession,
  getTableSessionById,
  updatePrelistOrderStatus,
} from "../../api/tableSessionApi";
import { BellIcon } from "@heroicons/react/24/solid";

const CustomBadge = ({ color, content }) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-semibold text-white bg-${color}-500`}
  >
    {content}
  </span>
);
const NotificationBell = ({ count }) => (
  <div className="absolute top-0 right-2 flex items-center">
    <BellIcon className="h-8 w-8 text-yellow-500" />
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
      {count}
    </span>
  </div>
);
const TableView = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [data, setData] = useState({});
  const [activeTab, setActiveTab] = useState("read");
  const [selectedUnchecked, setSelectedUnchecked] = useState([]);
  const [selectedRead, setSelectedRead] = useState([]);
  const [selectedReady, setSelectedReady] = useState([]);
  const fetchData = async () => {
    const data = await getCurrentTableSession();
    if (data?.isSuccess) {
      setTables(data?.result);
    }
  };
  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleTableClick = async (table) => {
    setSelectedTable(table);
    const response = await getTableSessionById(table);
    if (response?.isSuccess) {
      setData(response?.result);
      setShowDialog(true);
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
  };
  const handleSelectAll = (listType) => {
    switch (listType) {
      case "unchecked":
        const allUncheckedIds = data.uncheckedPrelistOrderDetails.map(
          (order) => order.prelistOrder.prelistOrderId
        );
        setSelectedUnchecked(
          selectedUnchecked.length === allUncheckedIds.length
            ? []
            : allUncheckedIds
        );
        break;
      case "read":
        const allReadIds = data.readPrelistOrderDetails.map(
          (order) => order.prelistOrder.prelistOrderId
        );
        setSelectedRead(
          selectedRead.length === allReadIds.length ? [] : allReadIds
        );
        break;
      case "ready":
        const allReadyIds = data.readyToServePrelistOrderDetails.map(
          (order) => order.prelistOrder.prelistOrderId
        );
        setSelectedReady(
          selectedReady.length === allReadyIds.length ? [] : allReadyIds
        );
        break;
    }
  };
  const handleCheckboxChange = (id, listType) => {
    switch (listType) {
      case "unchecked":
        setSelectedUnchecked((prev) =>
          prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
        break;
      case "read":
        setSelectedRead((prev) =>
          prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
        break;
      case "ready":
        setSelectedReady((prev) =>
          prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
        break;
    }
  };

  const getTableStatusColor = (table) => {
    // Implement logic to determine table status color
    return "red";
  };
  const getUnreadCount = (table) => {
    if (table.unCheckedNumberOfDishes > 0) {
      return Math.floor(table.unCheckedNumberOfDishes); // This is just a placeholder
    } else {
      return 0;
    }
  };

  const handleChangeStatus = async (status) => {
    switch (status) {
      case "unchecked":
        const response = await updatePrelistOrderStatus(selectedUnchecked);
        if (response?.isSuccess) {
          setSelectedUnchecked([]);
          setShowDialog(false);
          await fetchData();
        }
        break;
      case "read":
        const response2 = await updatePrelistOrderStatus(selectedRead);
        if (response2?.isSuccess) {
          setSelectedUnchecked([]);
          setShowDialog(false);
          await fetchData();
        }
        break;
    }
  };
  return (
    <div className="container mx-auto p-4">
      <Typography variant="h3" className="text-center mb-6 text-blue-gray-800">
        Quản lý bàn
      </Typography>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map((table) => (
          <Card
            key={table.tableId}
            className="cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => handleTableClick(table.tableSessionId)}
          >
            <CardBody className="flex flex-col justify-center items-center p-4">
              <div
                className={`w-32 h-32 rounded-full flex justify-center items-center mb-2 bg-${getTableStatusColor(
                  table
                )}-100`}
              >
                <Typography
                  variant="h4"
                  className={`font-bold text-${getTableStatusColor(table)}-900`}
                >
                  {table.tableName}
                </Typography>
                <NotificationBell count={getUnreadCount(table)} />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Dialog open={showDialog} handler={handleDialogClose} size="xxl">
        <DialogHeader>Chi tiết bàn {selectedTable?.tableName}</DialogHeader>
        <DialogBody divider>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-2/3">
              <Typography variant="h5" className="mb-4">
                Món chưa đọc
              </Typography>
              <div className="mb-2">
                <Checkbox
                  label="Chọn tất cả"
                  checked={
                    selectedUnchecked.length > 0 &&
                    selectedUnchecked.length ===
                      data.uncheckedPrelistOrderDetails?.length
                  }
                  onChange={() => handleSelectAll("unchecked")}
                />
              </div>
              <List>
                {data.uncheckedPrelistOrderDetails?.map((order) => (
                  <ListItem key={order.prelistOrder.prelistOrderId}>
                    <ListItemPrefix>
                      <Checkbox
                        checked={selectedUnchecked.includes(
                          order.prelistOrder.prelistOrderId
                        )}
                        onChange={() =>
                          handleCheckboxChange(
                            order.prelistOrder.prelistOrderId,
                            "unchecked"
                          )
                        }
                      />
                      <Avatar
                        variant="circular"
                        alt={order.prelistOrder.dishSizeDetail.dish.name}
                        src={order.prelistOrder.dishSizeDetail.dish.image}
                      />
                    </ListItemPrefix>
                    <div className="flex-grow">
                      <Typography variant="h6" color="blue-gray">
                        {order.prelistOrder.dishSizeDetail.dish.name}
                      </Typography>
                      <Typography variant="small" color="gray">
                        Số lượng: {order.prelistOrder.quantity}
                      </Typography>
                    </div>
                    <CustomBadge color="red" content="Mới" />
                  </ListItem>
                ))}
              </List>
              {selectedUnchecked.length > 0 && (
                <Button
                  className="bg-red-900 "
                  onClick={() => handleChangeStatus("unchecked")}
                >
                  Đã đọc
                </Button>
              )}
            </div>
            <div className="md:w-1/3">
              <Tabs value={activeTab} onChange={(value) => setActiveTab(value)}>
                <TabsHeader>
                  <Tab value="read">Đã đọc</Tab>
                  <Tab value="ready">Sẵn sàng phục vụ</Tab>
                </TabsHeader>
                <TabsBody>
                  <TabPanel value="read">
                    <div className="mb-2">
                      <Checkbox
                        label="Chọn tất cả"
                        checked={
                          selectedRead.length > 0 &&
                          selectedRead.length ===
                            data.readPrelistOrderDetails?.length
                        }
                        onChange={() => handleSelectAll("read")}
                      />
                    </div>
                    <List>
                      {data.readPrelistOrderDetails?.map((order) => (
                        <ListItem key={order.prelistOrder.prelistOrderId}>
                          <ListItemPrefix>
                            <Checkbox
                              checked={selectedRead.includes(
                                order.prelistOrder.prelistOrderId
                              )}
                              onChange={() =>
                                handleCheckboxChange(
                                  order.prelistOrder.prelistOrderId,
                                  "read"
                                )
                              }
                            />
                            <Avatar
                              variant="circular"
                              alt={
                                order.prelistOrder.combo?.name ||
                                order.prelistOrder.dishSizeDetail?.dish.name
                              }
                              src={
                                order.prelistOrder.combo?.image ||
                                order.prelistOrder.dishSizeDetail?.dish.image
                              }
                            />
                          </ListItemPrefix>
                          <div className="flex-grow">
                            <Typography variant="h6" color="blue-gray">
                              {order.prelistOrder.combo?.name ||
                                order.prelistOrder.dishSizeDetail?.dish.name}
                            </Typography>
                            <Typography variant="small" color="gray">
                              Số lượng: {order.prelistOrder.quantity}
                            </Typography>
                          </div>
                          <CustomBadge color="blue" content="Đã đọc" />
                        </ListItem>
                      ))}
                    </List>
                    {selectedRead.length > 0 && (
                      <Button
                        className="bg-red-900 "
                        onClick={() => handleChangeStatus("read")}
                      >
                        Đã nấu xong, sẵn sàng phục vụ
                      </Button>
                    )}
                  </TabPanel>
                  <TabPanel value="ready">
                    <List>
                      {data.readyToServePrelistOrderDetails?.map((order) => (
                        <ListItem key={order.prelistOrder?.prelistOrderId}>
                          <ListItemPrefix>
                            <Avatar
                              variant="circular"
                              alt={
                                order.prelistOrder?.dishSizeDetail?.dish?.name
                              }
                              src={
                                order.prelistOrder?.dishSizeDetail?.dish?.image
                              }
                            />
                          </ListItemPrefix>
                          <div className="flex-grow">
                            <Typography variant="h6" color="blue-gray">
                              {order.prelistOrder?.dishSizeDetail?.dish?.name}
                            </Typography>
                            <Typography variant="small" color="gray">
                              Số lượng: {order.prelistOrder?.quantity}
                            </Typography>
                          </div>
                          <CustomBadge color="green" content="Sẵn sàng" />
                        </ListItem>
                      ))}
                    </List>
                  </TabPanel>
                </TabsBody>
              </Tabs>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleDialogClose}>
            Đóng
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default TableView;
