import React, { useState, useEffect, useContext } from "react";
import auth from './Auth/Auth'

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(auth.getUser());
  console.log(user);

  // useEffect(() => {})

  function signin({ user, token }) {
    auth.signin({ user, token });
    setUser(user);
  }

  return (
      <AuthContext.Provider value={
        {
          user,
          signin
        }
      }>
        {children}
      </AuthContext.Provider>
  );
}
