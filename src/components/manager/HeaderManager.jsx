import React, { useEffect, useState } from "react";
import {
  Navbar,
  Typography,
  IconButton,
  Avatar,
  Badge,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  BellIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { FaBars, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { close, open } from "../../redux/features/sidebarSlice";
import useCallApi from "../../api/useCallApi";
import { NotificationApi, TokenApi } from "../../api/endpoint";
import * as signalR from "@microsoft/signalr";
import { baseUrl } from "../../api/config/axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/features/authSlice";
import { Dot } from "lucide-react";
import { formatDateTime } from "../../util/Utility";
import { SignalRMethod } from "../../util/GlobalType";
const HeaderManager = ({ userName = "Admin" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { callApi, error, loading } = useCallApi();
  const [notifications, setNotifications] = useState([]);
  const [connection, setConnection] = useState(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user || {});
  const fetchNotifications = async () => {
    const response = await callApi(
      `${NotificationApi.GET_ALL_NOTIFICATION_BY_USER}/${user.id}`,
      "GET"
    );
    if (response.isSuccess) {
      setNotifications(response.result?.items);
    } else {
      showError(response.messages);
    }
  };
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
            connection.on(SignalRMethod.LOAD_ORDER, async () => {
              await fetchNotifications();
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
  useEffect(() => {
    fetchNotifications();
  }, []);
  const closeMenu = () => setIsMenuOpen(false);
  const dispatch = useDispatch();
  const siderbar = useSelector((state) => state.sidebar);

  const unreadCount = notifications?.filter((item) => !item.isRead).length;

  return (
    <div className="mx-auto min-w-full text-black bg-white  rounded-lg mt-2 px-4 py-2 shadow-lg">
      <div className="flex items-center justify-between ">
        <button
          onClick={() => {
            if (siderbar.isOpen) {
              dispatch(close());
            } else {
              dispatch(open());
            }
          }}
          className="md:hidden focus:outline-none transition-transform duration-300 ease-in-out hover:scale-110"
        >
          {siderbar?.isOpen ? (
            <FaTimes className="h-6 w-6" />
          ) : (
            <FaBars className="h-6 w-6" />
          )}
        </button>
        <Typography
          variant="h4"
          className="flex justify-center items-center mr-4 cursor-pointer py-1.5 lg:ml-2 font-bold text-red-900 "
        >
          Welcome, {userName}
        </Typography>

        <div className="flex items-center gap-4">
          <Menu
            open={isNotificationOpen}
            handler={setIsNotificationOpen}
            placement="bottom-end"
          >
            <MenuHandler>
              <Badge
                content={unreadCount}
                color="red"
                className="animate-pulse"
              >
                <IconButton
                  variant="text"
                  color="white"
                  className="rounded-full border border-gray-200 shadow-md  hover:bg-white/20 transition-all duration-300"
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                >
                  <BellIcon className="h-5 w-5 text-red-800" />
                </IconButton>
              </Badge>
            </MenuHandler>
            <MenuList className="p-2 mt-8 shadow-2xl border border-gray-500 bg-white rounded-lg ">
              <Typography variant="h3" className="text-red-800 ">
                Thông báo
              </Typography>
              <hr />
              <div className="w-80 h-[400px] overflow-auto ">
                {notifications.map((notification) => (
                  <MenuItem
                    key={notification.notificationId}
                    onClick={async () => {
                      const response = await callApi(
                        `${NotificationApi.MARK_AS_READ}/${notification.notificationId}`,
                        "POST"
                      );
                      if (response.isSuccess) {
                        await fetchNotifications();
                      }
                    }}
                    className={`flex flex-col  gap-2 p-2 rounded-md transition-all duration-300 ${
                      notification?.read
                        ? "opacity-50 bg-gray-100"
                        : "hover:bg-blue-50"
                    }`}
                  >
                    <Typography
                      variant="lead"
                      className="font-bold text-lg text-gray-700"
                    >
                      {notification.notificationName}
                    </Typography>
                    <Typography className="font-normal text-gray-700 text-sm flex items-center">
                      {notification.messages}
                      {!notification.isRead && (
                        <span className="text-blue-600 animate-pulse">
                          <Dot size={40} />
                        </span>
                      )}
                    </Typography>
                    <div className="flex justify-end">
                      <span className="text-xs block">
                        {formatDateTime(notification.notifyTime)}
                      </span>
                    </div>
                  </MenuItem>
                ))}
              </div>

              <MenuItem className="flex items-center gap-2 justify-center mt-2 p-2 rounded-md hover:bg-blue-50 transition-all duration-300">
                <Typography
                  variant="small"
                  className="font-medium text-blue-500 hover:text-blue-700 cursor-pointer"
                  onClick={async () => {
                    const response = await callApi(
                      `${NotificationApi.MARK_ALL_AS_READ}/${user.id}`,
                      "POST"
                    );
                    if (response.isSuccess) {
                      await fetchNotifications();
                    }
                  }}
                >
                  Đánh dấu đọc tất cả
                </Typography>
              </MenuItem>
            </MenuList>
          </Menu>

          <Menu
            open={isMenuOpen}
            handler={setIsMenuOpen}
            placement="bottom-end"
          >
            <MenuHandler>
              <IconButton
                variant="text"
                color="white"
                className="rounded-full hover:bg-white/20 transition-all duration-300"
              >
                <Avatar
                  size="sm"
                  alt={userName}
                  src={user.avatar}
                  className="border-2 border-white shadow-md"
                />
              </IconButton>
            </MenuHandler>
            <MenuList className="p-2 mt-2 bg-white rounded-lg shadow-xl border border-gray-200">
              <MenuItem
                onClick={() => {
                  navigate("/user");
                  closeMenu();
                }}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-50 transition-all duration-300"
              >
                <UserCircleIcon className="h-4 w-4 text-red-800" />
                <Typography
                  variant="small"
                  className="font-normal text-gray-700"
                >
                  Thông tin cá nhân
                </Typography>
              </MenuItem>

              <MenuItem
                onClick={async () => {
                  const tokenUser = await callApi(
                    `${TokenApi.GET_USER_TOKEN_BY_IP}`,
                    "POST"
                  );
                  if (tokenUser.isSuccess) {
                    const responseRemoveToken = await callApi(
                      `${TokenApi.DELETE_TOKEN}?tokenId=${tokenUser.result.tokenId}`,
                      "DELETE"
                    );
                    if (responseRemoveToken.isSuccess) {
                      dispatch(logout());
                      navigate("/");
                    }
                  } else {
                    dispatch(logout());
                    navigate("/");
                  }

                  closeMenu();
                }}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-red-50 transition-all duration-300"
              >
                <PowerIcon className="h-4 w-4 text-red-500" />
                <Typography
                  variant="small"
                  className="font-normal text-red-500"
                >
                  Đăng xuất
                </Typography>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default HeaderManager;
