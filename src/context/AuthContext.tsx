import React from "react";
import firebase from "firebase/compat/app";

export type AuthContextData = {
  user: firebase.User;
  setUser: (user: firebase.User) => void;
};

export const AuthContext = React.createContext<AuthContextData>({
  user: null,
  setUser: () => {},
});

export default AuthContext;
