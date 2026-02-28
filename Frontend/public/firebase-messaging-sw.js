importScripts("https://www.gstatic.com/firebasejs/10.3.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.3.0/firebase-messaging-compat.js");


const firebaseConfig = {
  apiKey: "AIzaSyBA7dGKKM-QqWEw6XOMWXPmfljqM9nBYxg",
  authDomain: "bhajan-bank-d8e0a.firebaseapp.com",
  projectId: "bhajan-bank-d8e0a",
  storageBucket: "bhajan-bank-d8e0a.firebasestorage.app",
  messagingSenderId: "135110860650",
  appId: "1:135110860650:web:6bd4da5149c4a51e90cf13",
  measurementId: "G-7DMH0NNB49"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", 
    payload
);
  
const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "./1.png"
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
