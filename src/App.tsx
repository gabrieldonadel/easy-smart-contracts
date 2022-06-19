import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Editor from "./views/Editor";
import Login from "./views/Login";
import Compiler from "./views/Compiler";
import AuthContext from "./context/AuthContext";
import Contracts from "./views/Contracts";
import { getAuth, User } from "firebase/auth";
import Drawer from "./views/Drawer";

const App = () => {
  const [user, setUser] = useState<User>();
  const [initializing, setInitializing] = useState(true);
  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = getAuth().onAuthStateChanged(
      async (user) => {
        if (user) {
          setUser(user);
        }
        setInitializing(false);
      }
    );
    return unregisterAuthObserver;
  }, []);

  if (initializing) {
    return <div>Loading</div>;
  }

  return (
    <AuthContext.Provider value={{ setUser, user }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Drawer />}>
          <Route path="/compiler" element={<Compiler />} />
          <Route path={"/editor/:contractId"} element={<Editor />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/about" element={<Contracts />} />
        </Route>
        <Route
          path="/*"
          element={
            user ? (
              <Navigate to="/contracts" replace={true} />
            ) : (
              <Navigate to="/login" replace={true} />
            )
          }
        />
      </Routes>
    </AuthContext.Provider>
  );
};

export default App;
