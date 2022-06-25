import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { Box, CircularProgress } from "@mui/material";
import type {} from "@mui/lab/themeAugmentation";

import Editor from "./views/Editor";
import Login from "./views/Login";
import Compiler from "./views/Compiler";
import AuthContext from "./context/AuthContext";
import Contracts from "./views/Contracts";
import { getAuth, User } from "firebase/auth";
import Drawer from "./views/Drawer";
import About from "./views/About";
import Examples from "./views/Examples";

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
    return (
      <Box
        sx={{
          display: "flex",
          width: "100vw",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <SnackbarProvider maxSnack={5}>
      <AuthContext.Provider value={{ setUser, user }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Drawer />}>
            <Route path="/compiler" element={<Compiler />} />
            <Route path={"/editor/:contractId"} element={<Editor />} />
            <Route path="/contracts" element={<Contracts />} />
            <Route path="/about" element={<About />} />
            <Route path="/examples" element={<Examples />} />
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
    </SnackbarProvider>
  );
};

export default App;
