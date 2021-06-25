import React, { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";
import { API } from "../util/constants";

const authContext = createContext();

const config = {
  baseURL: `${API}`,
  withCredentials: true,
};

function useProvideAuth() {
  const [user, setUser] = useState(false);

  const logout = async () => {
    let response = await axios.get(`/auth/logout`, config);
    if (response.status === 200) {
      setUser(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        let response = await axios.get(`/auth/status`, config);
        if (response.status === 200) {
          setUser(true);
        } else if (response.status === 401) {
          setUser(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkAuth();

    return () => checkAuth();
  }, []);

  return {
    user,
    logout,
  };
}

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};
