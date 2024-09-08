import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";

const InfoModal = ({ isOpen, onClose, onSubmit, isUpdate, initialData }) => {
  console.log(initialData);
  const [formData, setFormData] = useState({
    addressId:
      initialData?.customerAddresses?.[0]?.customerInfoAddressId || "new",
  });
  const [newAddress, setNewAddress] = useState("");
  const [showNewAddressInput, setShowNewAddressInput] = useState(false);

  useEffect(() => {
    if (isUpdate && initialData) {
      setFormData((prev) => ({
        ...initialData.customerInfo,
        addressId:
          initialData.customerAddresses?.[0]?.customerInfoAddressId || "new",
      }));
    }
  }, [isUpdate, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "gender" ? value === "true" : value,
    }));
  };

  const handleAddressChange = (value) => {
    if (value === "new") {
      setShowNewAddressInput(true);
      setFormData((prevData) => ({
        ...prevData,
        addressId: "new",
        address: null,
      }));
    } else {
      setShowNewAddressInput(false);
      setFormData((prevData) => ({
        ...prevData,
        addressId: value,
        address: null,
      }));
    }
  };

  const handleNewAddressChange = (e) => {
    const { value } = e.target;
    setNewAddress(value);
    setFormData((prevData) => ({
      ...prevData,
      address: value,
      addressId: "new",
    }));
  };

  const handleSubmit = () => {
    const dataToSubmit = {
      ...formData,
      ...(showNewAddressInput && { address: newAddress }),
    };

    if (dataToSubmit.addressId === "new") {
      dataToSubmit.addressId = null;
    } else {
      dataToSubmit.address = null;
    }

    console.log(dataToSubmit);
    onSubmit(dataToSubmit);
    onClose();
    window.scrollTo(0, 0);
  };

  const getSelectedAddressName = () => {
    if (showNewAddressInput && newAddress) {
      return newAddress;
    }
    if (
      formData.addressId &&
      formData.addressId !== "new" &&
      initialData?.customerAddresses
    ) {
      const selectedAddress = initialData.customerAddresses.find(
        (addr) => addr.customerInfoAddressId === formData.addressId
      );
      return selectedAddress ? selectedAddress.customerInfoAddressName : "";
    }
    return "";
  };

  return (
    <Dialog open={isOpen} handler={onClose} size="sm">
      <h3 className="font-semibold text-xl text-red-800 text-center py-4">
        {isUpdate ? "Cập nhật" : "Tạo"} thông tin của bạn
      </h3>
      <DialogBody>
        <div className="grid gap-4">
          <Input
            label="Tên"
            name="name"
            value={formData?.name || ""}
            onChange={handleChange}
          />
          <Input
            label="Số điện thoại"
            name="phoneNumber"
            value={formData?.phoneNumber || ""}
            onChange={handleChange}
          />

          {initialData?.customerAddresses && (
            <Select
              label="Địa chỉ"
              name="addressId"
              onChange={handleAddressChange}
              value={formData.addressId || "new"}
              selected={(element) => element && getSelectedAddressName()}
            >
              {initialData.customerAddresses.map((item, index) => (
                <Option key={index} value={item.customerInfoAddressId}>
                  {item.customerInfoAddressName}
                </Option>
              ))}
              <Option value="new">Thêm địa chỉ mới</Option>
            </Select>
          )}
          {!initialData?.customerAddresses && (
            <Input
              label="Địa chỉ mới"
              name="address"
              value={newAddress}
              onChange={handleNewAddressChange}
            />
          )}
          {showNewAddressInput && (
            <Input
              label="Địa chỉ mới"
              name="address"
              value={newAddress}
              onChange={handleNewAddressChange}
            />
          )}
          <Input
            label="Ngày sinh của bạn"
            name="dob"
            type="date"
            value={formData?.dob?.split("T")[0] || ""}
            onChange={handleChange}
          />
          <Select
            label="Giới tính"
            name="gender"
            value={formData?.gender?.toString() || ""}
            onChange={(value) =>
              handleChange({ target: { name: "gender", value } })
            }
          >
            <Option value="true">Nam</Option>
            <Option value="false">Nữ</Option>
          </Select>
          <Input
            name="accountId"
            value={formData?.accountId || ""}
            onChange={handleChange}
            hidden
          />
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={onClose} className="mr-1">
          Huỷ
        </Button>
        <Button variant="gradient" color="red" onClick={handleSubmit}>
          {isUpdate ? "Cập nhật" : "Tạo"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default InfoModal;
