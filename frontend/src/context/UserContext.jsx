import React from "react";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { server } from "../main";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [btnLoading, setBtnLoading] = useState(false);
  const [user, setUser] = useState(null); // null is better than []
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ================= LOGIN ================= */
  const loginUser = async (email, navigate) => {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/login`, { email });
      toast.success(data.message);
      localStorage.setItem("verifyToken", data.verifyToken);
      navigate("/verify");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
      console.error(error);
    } finally {
      setBtnLoading(false);
    }
  };

  /* ================= VERIFY ================= */
  const verifyUser = async (otp, navigate, fetchChats) => {
    const verifyToken = localStorage.getItem("verifyToken");
    if (!verifyToken) return toast.error("Please provide verification token");

    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/verify`, { otp, verifyToken });

      toast.success(data.message);
      localStorage.removeItem("verifyToken");
      localStorage.setItem("token", data.token);

      setIsAuth(true);
      setUser(data.user);

      fetchChats?.();
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Verification failed");
      console.error(error);
    } finally {
      setBtnLoading(false);
    }
  };

  /* ================= FETCH USER ================= */
  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${server}/api/user/me`, { headers: { token } });
      setUser(data);
      setIsAuth(true);
    } catch (error) {
      console.error(error);
      setIsAuth(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= LOGOUT ================= */
  const logoutHandler = (navigate) => {
    localStorage.removeItem("token");
    toast.success("Logged out");
    setIsAuth(false);
    setUser(null);
    navigate("/login");
  };

  /* ================= AUTO LOGIN ================= */
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider
      value={{
        loginUser,
        verifyUser,
        logoutHandler,
        btnLoading,
        loading,
        isAuth,
        user,
        setIsAuth,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

/* ================= CUSTOM HOOK ================= */
export const UserData = () => useContext(UserContext);
