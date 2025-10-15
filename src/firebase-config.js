import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAGC9tsh5ivthOx5deNYZGg1dvgdyfK0zU",
  authDomain: "sytemowcy-react.firebaseapp.com",
  databaseURL: "https://sytemowcy-react-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sytemowcy-react",
  storageBucket: "sytemowcy-react.firebasestorage.app",
  messagingSenderId: "919346622947",
  appId: "1:919346622947:web:5a9e075dc64f1eaaa3b0d6",
  measurementId: "G-8F331F2KTP"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;