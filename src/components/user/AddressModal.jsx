import { Modal, Form, Input, Switch, Grid } from "antd";
import { Button, IconButton, Typography } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { Edit2, Trash2, Plus, MapPin } from "lucide-react";

const { Row, Col } = Grid;

const AddressModal = ({
  isModalVisible,
  setIsModalVisible,
  editingAddress,
  isAdding,
  setIsAdding,
  setEditingAddress,
}) => {
  const user = useSelector((state) => state.user.user || {});
  const addresses = user.addresses || [];

  const [form] = Form.useForm();

  const handleOk = () => {
    setIsModalVisible(false);
    setIsAdding(false);
    setEditingAddress(null);
  };
  const handleCancel = handleOk;

  const handleEdit = (address) => {};
  const handleDelete = (id) => {};
  const handleAddNew = () => {};

  const renderAddressForm = () => (
    <Form form={form} layout="vertical" className="mt-4 space-y-4">
      <Form.Item
        name="address"
        label="Địa chỉ của bạn"
        rules={[{ required: true, message: "Vui lòng nhập địa chỉ của bạn!" }]}
      >
        <Input
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Nhập địa chỉ..."
        />
      </Form.Item>

      <Form.Item name="isPrimary" valuePropName="checked" label="Địa chỉ chính">
        <Switch />
      </Form.Item>

      <Form.Item>
        <div>
          <Button className="bg-red-800 text-white mr-2" onClick={handleAddNew}>
            Thêm địa chỉ
          </Button>
          <Button className="bg-gray-500" onClick={() => setIsAdding(false)}>
            Huỷ
          </Button>
        </div>
      </Form.Item>
    </Form>
  );

  const renderAddressList = () => {
    if (addresses.length === 0) {
      return (
        <Typography
          variant="lead"
          color="gray"
          className="text-center text-sm mt-4"
        >
          Không tìm thấy địa chỉ nào của bạn. Vui lòng thêm ít nhất 1 địa chỉ để
          đơn hàng của bạn được giao đến một cách sớm nhất.
        </Typography>
      );
    } else {
      return (
        <div className="space-y-4 mt-4">
          {addresses.map((address) => (
            <div
              key={address.customerInfoAddressId}
              className="bg-white p-4 shadow-lg border border-red-50 rounded-xl "
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Typography variant="h6" className="text-red-900">
                    {address.customerInfoAddressName}
                  </Typography>
                  {!address.isCurrentUsed && (
                    <div className="flex items-center">
                      <Typography
                        variant="small"
                        className="mr-2 font-semibold"
                      >
                        Chuyển thành địa chỉ mặc định
                      </Typography>
                      <Switch />
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <IconButton
                    size="sm"
                    onClick={() => handleEdit(address)}
                    className="bg-white"
                  >
                    <Edit2 size={16} className="text-blue-800" />
                  </IconButton>
                  <IconButton
                    color="red"
                    size="sm"
                    onClick={() => handleDelete(address.customerInfoAddressId)}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </div>
              </div>
              <Typography variant="small" className="mt-2">
                {address.address}
              </Typography>
              {address.isCurrentUsed && (
                <Typography
                  variant="small"
                  className="mt-2 flex items-center text-red-800"
                >
                  <MapPin size={16} className="mr-1" /> Địa chỉ mặc định
                </Typography>
              )}
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div>
      <Modal
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        className="rounded-lg"
        width={750}
      >
        <Typography variant="h4" className="text-center text-red-800 mb-4">
          ĐỊA CHỈ GIAO HÀNG
        </Typography>
        {isAdding ? (
          renderAddressForm()
        ) : (
          <>
            {renderAddressList()}
            <Button
              className="mt-4 flex items-center gap-2 bg-red-800"
              onClick={() => setIsAdding(true)}
            >
              <Plus size={16} />
              Tạo thêm địa chỉ
            </Button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default AddressModal;
