import { useEffect, useState } from "react";
import TabMananger from "../../../components/tab/TabManager";
import useCallApi from "../../../api/useCallApi";
import { OrderApi } from "../../../api/endpoint";
import { useSelector } from "react-redux";
import { Badge, Button, Card, Image, Modal, Tag } from "antd";
import FeedbackForm from "../../../components/feedback/FeedbackForm";
import { formatDateTime, formatPrice } from "../../../util/Utility";
import { MoveDownIcon } from "lucide-react";
import { DownCircleFilled } from "@ant-design/icons";
import LoadingOverlay from "../../../components/loading/LoadingOverlay";
import { useNavigate } from "react-router-dom";

const PersonalFeedback = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState([]);
  const { callApi, error, loading } = useCallApi();
  const user = useSelector((state) => state.user.user || {});
  const [isShowModal, setIsShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const items = [
    {
      value: 0,
      label: "Chưa đánh giá",
    },
    {
      value: 1,
      label: "Đã đánh giá",
    },
  ];

  const fetchData = async () => {
    const response = await callApi(
      `${OrderApi.GET_ALL_ORDER_DETAIL_BY_ACCOUNT_ID}/${user.id}/${activeTab}/1/100`,
      "GET"
    );
    if (response.isSuccess) {
      setData(response.result.items);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  return (
    <div className="max-w-7xl px-4">
      <LoadingOverlay isLoading={loading} />
      <TabMananger
        activeTab={activeTab}
        items={items}
        setActiveTab={setActiveTab}
      />
      <div className="space-y-4">
        {data?.length > 0 &&
          data.map((item) => (
            <>
              <div
                key={item.orderDetailsId}
                className="shadow-lg flex flex-row items-center rounded-l p-4 w-full"
              >
                <div className="flex items-center  w-full g gap-2 flex-1">
                  <Image
                    src={
                      item.dishSizeDetail?.dish?.image ||
                      item.comboDish?.combo?.image
                    }
                    alt={
                      item.dishSizeDetail?.dish?.name ||
                      item.comboDish?.combo?.name
                    }
                    width={100}
                    height={100}
                    className="mr-4"
                  />
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-center">
                      <h2 className="font-bold text-lg">
                        {item.dishSizeDetail?.dish?.name ||
                          item.comboDish?.combo?.name}
                      </h2>
                      <Tag color="green">{item.status?.vietnameseName}</Tag>
                    </div>

                    <p
                      className="text-gray-500"
                      dangerouslySetInnerHTML={{
                        __html:
                          item.dishSizeDetail?.dish?.description ||
                          item.comboDish?.combo?.description,
                      }}
                    />
                    <div className="mt-2 flex items-center space-x-4">
                      {item.dishSizeDetail?.dishSize && (
                        <Badge
                          count={`${item.dishSizeDetail?.dishSize?.vietnameseName} `}
                          style={{ backgroundColor: "#87d068" }}
                        />
                      )}
                      <p>Số lượng: {item.quantity}</p>
                      <p className="font-bold">
                        {formatPrice(
                          item.dishSizeDetail?.price ||
                            item.comboDish?.combo.price
                        )}
                      </p>
                      <p className="text-red-500">
                        Giảm:{" "}
                        {item.dishSizeDetail?.discount ||
                          item.comboDish?.combo.discount}
                        %
                      </p>
                    </div>
                    <div className="mt-2 flex items-center space-x-4">
                      {item.dishSizeDetail?.dish?.dishItemType && (
                        <Tag color="blue">
                          {
                            item.dishSizeDetail?.dish?.dishItemType
                              ?.vietnameseName
                          }
                        </Tag>
                      )}
                      <p>Thời gian đặt đơn: {formatDateTime(item.orderTime)}</p>
                      {item.isRated && (
                        <Button
                          onClick={() =>
                            navigate(
                              `/${item.dishSizeDetail ? "product" : "combo"}/${
                                item.dishSizeDetail?.dishId ||
                                item.comboDish?.comboId
                              }`
                            )
                          }
                        >
                          Xem lại đánh giá
                        </Button>
                      )}
                    </div>
                  </div>
                  {!item.isRated && (
                    <DownCircleFilled
                      size={50}
                      className="cursor-pointer text-red-800"
                      onClick={() => {
                        setIsShowModal(!isShowModal);
                        setSelectedItem(item.orderDetailsId);
                      }}
                    />
                  )}
                </div>
              </div>
              {isShowModal && item.orderDetailsId === selectedItem && (
                <FeedbackForm
                  orderDetailId={selectedItem}
                  accountId={user.id}
                  onHide={async () => {
                    setIsShowModal(!isShowModal);
                    await fetchData();
                  }}
                />
              )}
            </>
          ))}
      </div>
    </div>
  );
};

export default PersonalFeedback;
