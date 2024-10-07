import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { StateProvider } from "./context/StateProvider";
import { toast, ToastContainer } from "react-toastify";
import "aos/dist/aos.css";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AOS from "aos";
AOS.init({
  duration: 1000,
});
import { registerables } from "chart.js";
import Chart from "chart.js/auto";
Chart.register(...registerables);
import moment from "moment-timezone";
import Routers from "./routes/Routers";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase/firebase";
import React, { useEffect } from "react";
import { message } from "antd";
import { NotificationProvider } from "./context/NotificationContext";
import { useNotification } from "./hook/useNotification";
import { data } from "autoprefixer";
moment.tz.setDefault("Asia/Ho_Chi_Minh");

async function requestPermission() {
  //requesting permission using Notification API
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey:
        "BL7dDy3O-wyKM9nnhcexB5Q8jhPKTG7Zq21-bEkykBkhmxM094VcL2FSzZ16nBBbj4VPloS3w4Hc8I4I1EW8oQw",
    });

    //We can send token to server
    console.log("Token generated : ", token);
  } else if (permission === "denied") {
    //notifications are blocked
    alert("You denied for the notification");
  }
}
export const NotificationListener = () => {
  const { addNotification } = useNotification();

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      addNotification({
        title: payload?.notification?.title || "New Notification",
        body: payload?.notification?.body || "You have a new message",
        type: "default",
        duration: 5000,
        data: payload?.notification.body,
      });
    });

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [addNotification]);

  return null;
};
function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StateProvider>
            <BrowserRouter>
              <NotificationProvider>
                <NotificationListener />

                <Routers />

                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                />
                <ToastContainer />
              </NotificationProvider>
            </BrowserRouter>
          </StateProvider>
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
