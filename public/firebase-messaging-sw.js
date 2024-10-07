importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const defaultConfig = {
  apiKey: "AIzaSyAJKw0In21Lxcsx-eXZmvEQXn6LmmVVyNk",
  authDomain: "thienphu-app.fxirebaseapp.com",
  projectId: "thienphu-app",
  storageBucket: "thienphu-app.appspot.com",
  messagingSenderId: "94244733994",
  appId: "1:94244733994:web:702149d32992b71c64af53",
};

firebase.initializeApp(defaultConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
