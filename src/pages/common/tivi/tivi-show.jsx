// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import OrderSessionList from "./OrderSessionList";
import ProcessingOrders from "./ProcessingOrders";
import CompletedOrders from "./CompletedOrders";
import Header from "./HeaderTivi";
import useCallApi from "../../../api/useCallApi";
import { OrderSessionApi } from "../../../api/endpoint";
import { useMemo } from "react";
import OrderProgressBar from "./ProgressTotal";

const TiviShow = () => {
  const [orderSessions, setOrderSessions] = useState([]);
  const [orderSessions1, setOrderSessions1] = useState([]);
  const { callApi } = useCallApi();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 100;
  const selectedStatus = 1; // Chỉ lấy trạng thái '1'

  useEffect(() => {
    const fetchData = async () => {
      await fetchDataOrderSessionNew();
      await fetchDataAllOrderSession();
    };
    fetchData();
  }, [currentPage]);

  // Hàm gọi API
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchDataAllOrderSession = async () => {
    setLoading(true);
    const response = await callApi(
      `${OrderSessionApi.GET_ALL_ORDER_SESSION}?pageNumber=${currentPage}&pageSize=${pageSize}`,
      "GET"
    );

    if (response.isSuccess) {
      const sortedItems = response.result.items.sort(
        (a, b) =>
          b.orderSession?.orderSessionNumber -
          a.orderSession?.orderSessionNumber
      );
      setOrderSessions(sortedItems);
      setTotalPages(response.result?.totalPages);
    } else {
      setOrderSessions([]);
      setTotalPages(0);
    }
    setLoading(false);
  };

  const fetchDataOrderSessionNew = async () => {
    setLoading(true);
    try {
      const response = await callApi(
        `${OrderSessionApi.GET_ALL_ORDER_SESSION}?status=${selectedStatus}&pageNumber=${currentPage}&pageSize=${pageSize}`,
        "GET"
      );

      if (response.isSuccess) {
        const sortedItems = response.result.items.sort(
          (a, b) =>
            b.orderSession?.orderSessionNumber -
            a.orderSession?.orderSessionNumber
        );
        setOrderSessions1(sortedItems);
        setTotalPages(response.result?.totalPages);
        setError(null); // Clear any existing error
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      setError(err.message);
      setOrderSessions1([]);
    } finally {
      setLoading(false);
    }
  };

  // Render error message
  if (error) return <div>Error: {error}</div>;

  // const orderSessions = sampleData.result.items;
  console.log("====================================");
  console.log("orderSessions", orderSessions);
  console.log("====================================");

  // Lọc các món ăn đang chuẩn bị và đã hoàn thành
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const processingOrders = useMemo(
    () =>
      orderSessions.flatMap((session) =>
        session.orderDetails
          ?.filter((detail) => detail.orderDetailStatusId === 3)
          .map((detail) => ({
            ...detail,
            orderSessionNumber: session.orderSession?.orderSessionNumber,
            tableName: session?.table?.tableName,
          }))
      ) || [],
    [orderSessions]
  );

  console.log("====================================");
  console.log("processingOrders", processingOrders);
  console.log("====================================");

  // Lọc các món ăn đã hoàn thành hoặc hủy
  const completedOrders = orderSessions.flatMap((session) =>
    session.orderDetails
      .filter(
        (detail) =>
          detail.orderDetailStatusId === 4 || detail.orderDetailStatusId === 5
      )
      .map((detail) => ({
        ...detail,
        orderSessionNumber: session.orderSession?.orderSessionNumber, // Include orderSessionNumber
        tableName: session?.table?.tableName, // Include orderSessionNumber
      }))
  );

  // =================================================================================================

  // Lọc tất cả các món ăn trong tất cả phiên ngoại trừ phiên đặt trước
  const totalOrders = orderSessions
    .filter((detail) => detail.orderSession.orderSessionStatusId !== 0)
    .flatMap((session) => session.orderDetails);

  // Lọc món cần chế biến
  const unProcessingOrders = orderSessions.flatMap((session) =>
    session.orderDetails
      .filter((detail) => detail.orderDetailStatusId === 2)
      .map((detail) => ({
        ...detail,
        orderSessionNumber: session.orderSession?.orderSessionNumber, // Include orderSessionNumber
        tableName: session?.table?.tableName, // Include orderSessionNumber
      }))
  );

  // Lọc các món ăn đã hoàn thành hoặc hủy
  const doneOrders = orderSessions.flatMap((session) =>
    session.orderDetails
      .filter((detail) => detail.orderDetailStatusId === 4)
      .map((detail) => ({
        ...detail,
        orderSessionNumber: session.orderSession?.orderSessionNumber, // Include orderSessionNumber
        tableName: session?.table?.tableName, // Include orderSessionNumber
      }))
  );
  // Lọc các món ăn đã hoàn thành hoặc hủy
  const cancelOrders = orderSessions.flatMap((session) =>
    session.orderDetails
      .filter((detail) => detail.orderDetailStatusId === 5)
      .map((detail) => ({
        ...detail,
        orderSessionNumber: session.orderSession?.orderSessionNumber, // Include orderSessionNumber
        tableName: session?.table?.tableName, // Include orderSessionNumber
      }))
  );

  const totalOrdersCount =
    unProcessingOrders.length +
    processingOrders.length +
    doneOrders.length +
    cancelOrders.length;

  return (
    <div className="h-screen flex flex-col  overflow-hidden">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <Header />
      </div>

      {/* Main Content Section */}
      {/* {loading ? (
        <div className=" mt-[260px]">Loading...</div>
      ) : ( */}
      <div className="flex flex-1 mt-[160px]  bg-gray-100 overflow-hidden p-10">
        <div className="flex w-full justify-between space-x-4">
          {/* Order Session List */}
          <div className="w-1/3 overflow-hidden mb-4">
            <OrderSessionList orderSessions={orderSessions1} />
            <div className="w-full text-center rounded-lg py-2 mt-2 bg-blue-500 font-semibold text-white">
              Hiện có {orderSessions1.length} Phiên đặt mới
            </div>
            <div className="mt-4">
              {/* <p>
                Tổng số lượng phiên:{" "}
                {
                  orderSessions.filter(
                    (detail) => detail.orderSession.orderSessionStatusId !== 0
                  ).length
                }{" "}
                phiên ( trừ phiên đặt trước)
              </p>
              <p>
                Tổng số lượng món tất cả các phiên: {totalOrders.length} món (
                trừ phiên đặt trước)
              </p> */}
              <div className="flex justify-center items-center">
                <div className="font-semibold text-[#9A0E1D]">
                  100% ({totalOrdersCount} món)
                </div>
                <OrderProgressBar
                  unProcessingOrders={unProcessingOrders}
                  processingOrders={processingOrders}
                  doneOrders={doneOrders}
                  cancelOrders={cancelOrders}
                  totalOrdersCount={totalOrdersCount}
                />
              </div>
              {/* <p>
                Tổng số lượng món cần chế biến: {unProcessingOrders.length} món
              </p>
              <p>
                Tổng số lượng món đang chế biến: {processingOrders.length} món
              </p>
              <p>Tổng số lượng món đã chế biến xong: {doneOrders.length} món</p>
              <p>Tổng số lượng món đã huỷ: {cancelOrders.length} món</p> */}
            </div>
          </div>
          <div className="h-[1050px] w-[5px] rounded-md bg-[#9A0E1D]/30 mx-2"></div>
          {/* Processing and Completed Orders */}
          <div className="flex w-[65%] justify-between overflow-hidden">
            <ProcessingOrders orders={processingOrders} />
            <CompletedOrders orders={completedOrders} />
          </div>
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default TiviShow;
