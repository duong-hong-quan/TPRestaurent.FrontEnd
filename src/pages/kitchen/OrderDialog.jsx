import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import OrderList from "./OrderList";

const OrderDialog = ({
  open,
  onClose,
  selectedTable,
  data,
  activeTab,
  setActiveTab,
  selectedUnchecked,
  selectedRead,
  selectedReady,
  handleSelectAll,
  handleCheckboxChange,
  handleChangeStatus,
}) => {
  return (
    <Dialog open={open} handler={onClose} size="xl">
      <DialogHeader>Chi tiết bàn {selectedTable?.tableName}</DialogHeader>
      <DialogBody divider>
        <div className="flex flex-col md:flex-row gap-4">
          <OrderList
            title="Món chưa đọc"
            orders={data?.uncheckedPrelistOrderDetails}
            selectedOrders={selectedUnchecked}
            onSelectAll={() => handleSelectAll("unchecked")}
            onCheckboxChange={(id) => handleCheckboxChange(id, "unchecked")}
            onChangeStatus={() => handleChangeStatus("unchecked")}
            buttonText="Đã đọc"
            status={"Mới"}
          />
          <div className="w-full">
            <Tabs value={activeTab} onChange={(value) => setActiveTab(value)}>
              <TabsHeader>
                <Tab value="read">Đã đọc</Tab>
                <Tab value="ready">Sẵn sàng phục vụ</Tab>
              </TabsHeader>
              <TabsBody>
                <TabPanel value="read">
                  <OrderList
                    orders={data?.readPrelistOrderDetails}
                    selectedOrders={selectedRead}
                    onSelectAll={() => handleSelectAll("read")}
                    onCheckboxChange={(id) => handleCheckboxChange(id, "read")}
                    onChangeStatus={() => handleChangeStatus("read")}
                    buttonText="Đã nấu xong, sẵn sàng phục vụ"
                    status={"Đã đọc"}
                  />
                </TabPanel>
                <TabPanel value="ready">
                  <OrderList
                    orders={data?.readyToServePrelistOrderDetails}
                    selectedOrders={selectedReady}
                    onSelectAll={() => handleSelectAll("ready")}
                    onCheckboxChange={(id) => handleCheckboxChange(id, "ready")}
                    onChangeStatus={() => handleChangeStatus("ready")}
                    buttonText=""
                    status={"Sẵn sàng phục vụ"}
                  />
                </TabPanel>
              </TabsBody>
            </Tabs>
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={onClose}>
          Đóng
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default OrderDialog;
