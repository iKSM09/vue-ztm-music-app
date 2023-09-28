import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAJ4PF5WMNkVryFjyWQM6mqTdhGEahSGg0",
  authDomain: "media-zone-a4422.firebaseapp.com",
  projectId: "media-zone-a4422",
  storageBucket: "media-zone-a4422.appspot.com",
  appId: "1:1034428657583:web:ca57dea049ea4f87f5095a"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

db.enablePersistence().catch((error) => console.error(`Firebase persistence error ${error.code}`));

const usersCollection = db.collection("users");
const songsCollection = db.collection("songs");
const commentsCollection = db.collection("comments");

export { auth, db, storage, usersCollection, songsCollection, commentsCollection };
