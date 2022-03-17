import { Route, Routes } from "react-router-dom";
import firebase from "firebase/compat/app";

import Editor from "./views/Editor";
import Login from "./views/Login";
import firebaseConfig from "./firebase-credentials.json";

firebase.initializeApp(firebaseConfig);

const App = () => {
  return (
    <Routes>
      <Route path={"/editor"} element={<Editor />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default App;
