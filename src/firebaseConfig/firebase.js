import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database'
import 'firebase/storage'

 let config = {
    apiKey: "AIzaSyC6aQLPcVXuF04YZfW1gzGwkOdYR3zFqNg",
    authDomain: "slack-clone-a2fb9.firebaseapp.com",
    databaseURL: "https://slack-clone-a2fb9.firebaseio.com",
    projectId: "slack-clone-a2fb9",
    storageBucket: "slack-clone-a2fb9.appspot.com",
    messagingSenderId: "103745750448"
  };
  firebase.initializeApp(config);

  export default firebase;