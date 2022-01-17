var firebaseConfig = {
    apiKey: "AIzaSyDt7KgbXtWUR7FVdmzgXCdSIZI2dlt504c",
    authDomain: "to-do-live-88fe8.firebaseapp.com",
    projectId: "to-do-live-88fe8",
    storageBucket: "to-do-live-88fe8.appspot.com",
    messagingSenderId: "624623798282",
    appId: "1:624623798282:web:116199f4ce2f969cacf7f3",
    measurementId: "G-17HW4DRTNF"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  var db = firebase.firestore();

