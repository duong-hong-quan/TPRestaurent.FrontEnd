// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from "react";
import OrderSessionList from "./OrderSessionList";
import ProcessingOrders from "./ProcessingOrders";
import CompletedOrders from "./CompletedOrders";
import Header from "./HeaderTivi";
import useCallApi from "../../../api/useCallApi";
import { OrderSessionApi } from "../../../api/endpoint";
import { useMemo } from "react";
import OrderProgressBar from "./ProgressTotal";
import LoadingOverlay from "../../../components/loading/LoadingOverlay";
import * as signalR from "@microsoft/signalr";
import { baseUrl } from "../../../api/config/axios";
import { message } from "antd";
import { SignalRMethod } from "../../../util/GlobalType";

const TiviShow = () => {
  const [orderSessions, setOrderSessions] = useState([]);
  const [orderSessions1, setOrderSessions1] = useState([]);
  const [connection, setConnection] = useState(null);
  const audioRef = useRef(null);
  const { callApi } = useCallApi();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 100;
  const selectedStatus = 1; // Chỉ lấy trạng thái '1'

  console.log("====================================");
  console.log("loading", loading);
  console.log("====================================");

  // Cập nhật loading trạng thái trong suốt quá trình fetch
  const fetchData = async () => {
    setLoading(true); // Đặt trạng thái loading là true trước khi gọi API
    try {
      await Promise.all([
        fetchDataOrderSessionNew(),
        fetchDataAllOrderSession(),
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // Sau khi tất cả đã hoàn tất, tắt loading
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    // Create connection
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}/notifications`)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    let retryCount = 0;
    const MAX_RETRIES = 5;
    const RETRY_DELAY = 3000; // 3 seconds
    const startConnection = async () => {
      if (connection) {
        connection
          .start()
          .then(() => {
            message.success("Connected to SignalR");
            connection.on(SignalRMethod.LOAD_ORDER_SESIONS, async () => {
              message.success("Có một phiên mới được tạo");
            });
          })
          .catch((error) => {
            if (retryCount < MAX_RETRIES) {
              retryCount++;
              setTimeout(startConnection, RETRY_DELAY);
            } else {
              console.log("Max retries reached. Could not connect to SignalR.");
            }
          });
      }
    };
    startConnection();
    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [connection]);
  // Hàm gọi API
  // Hàm gọi API tất cả phiên
  const fetchDataAllOrderSession = async () => {
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
  };

  // Hàm gọi API các phiên có trạng thái mới
  const fetchDataOrderSessionNew = async () => {
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
      {loading && !processingOrders && !completedOrders && (
        <LoadingOverlay loading={loading} />
      )}

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
          <div className="w-[40%] overflow-hidden mb-4">
            <OrderSessionList orderSessions={orderSessions1} />
            <div className="w-full text-center rounded-lg py-2 mt-2 bg-blue-500 font-semibold text-white">
              Hiện có {orderSessions1.length} phiên đặt mới hôm nay
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
          <div className="flex w-[60%] justify-between overflow-hidden">
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
