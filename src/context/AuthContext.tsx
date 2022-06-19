import React from "react";
import { User } from "firebase/auth";

export type AuthContextData = {
  user?: User;
  setUser: (user: User) => void;
};

export const AuthContext = React.createContext<AuthContextData>({
  user: null,
  setUser: () => {},
});

export default AuthContext;
