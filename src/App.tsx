import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import firebase from "firebase/compat/app";

import Editor from "./views/Editor";
import Login from "./views/Login";
import firebaseConfig from "./firebase-credentials.json";
import AuthContext from "./context/AuthContext";

firebase.initializeApp(firebaseConfig);

const App = () => {
  const [user, setUser] = useState<firebase.User>();
  const [initializing, setInitializing] = useState(true);
  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(async (user) => {
        if (user) {
          setUser(user);
        }
        setInitializing(false);
      });
    return () => unregisterAuthObserver();
  }, []);

  if (initializing) {
    return <div>Loading</div>;
  }

  return (
    <AuthContext.Provider value={{ setUser, user }}>
      <Routes>
      <Route path={"/editor"} element={<Editor />} />
      <Route path="/login" element={<Login />} />
      </Routes>
    </AuthContext.Provider>
  );
};

export default App;
