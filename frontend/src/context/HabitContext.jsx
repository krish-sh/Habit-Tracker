import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import toast from "react-hot-toast";
import axios from "axios";

export const HabitContext = createContext();

const HabitContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [habitData, setHabitData] = useState([]);

  const backendURL = "http://localhost:3000";

  const getAuthToken = () => Cookie.get("token");

  const fetchHabits = async () => {
    try {
      const authToken = localStorage.getItem("token");

      if (!authToken) {
        console.log("⚠️ No token found in fetchHabits");
        return;
      }

      const { data } = await axios.get(`${backendURL}/api/user/habits`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (data.success) {
        setHabitData(data.data);
      }
    } catch (error) {
      console.error(
        "❌ Fetch habits error:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again");
        localStorage.removeItem("token");
        setToken(null);
        navigate("/login");
      } else {
        toast.error("Failed to fetch habits");
      }
    }
  };

  const handleRegister = async (username, email, password) => {
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/register`,
        { username, email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        localStorage.setItem("token");

        setToken(data.token);
        setHabitData(data.data || []);

        toast.success(data.message || "Register Successfully");
        navigate("/Habits");
      }
      return data;
    } catch (error) {
      console.error(
        "❌ Register error:",
        error.response?.data || error.message || error
      );

      toast.error(error.response?.data?.message || "Registration failed");
      return { success: false };
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/user/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const { data } = response;

      if (data.success) {
        console.log("✅ Login successful!");

        if (!data.token || data.token === "" || data.token === "undefined") {
          console.error("❌ CRITICAL: Token is empty or invalid!");
          toast.error("Login failed - Invalid token received from server");
          return { success: false };
        }
        localStorage.setItem("token", data.token);
        console.log("💾 Token saved to localStorage");

        setToken(data.token);
        setHabitData(data.data || []);

        const storedToken = localStorage.getItem("token");

        toast.success("Login successful");
        navigate("/Habits");

        return data;
      } else {
        console.error("❌ Login failed - success=false");
        toast.error(data.message || "Login failed");
        return { success: false };
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      console.error("❌ Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Login failed");
      return { success: false };
    }
  };

  const addHabits = async (name, description, frequency) => {
    try {
      let authToken = localStorage.getItem("token");

      if (!authToken && token) {
        authToken = token;
        console.log("⚠️ Using token from state instead");
      }

      if (!authToken || authToken === "undefined" || authToken === "null") {
        console.error("❌ No valid token found!");
        toast.error("Please login first - No authentication token found");
        navigate("/login");
        return;
      }

      const { data } = await axios.post(
        `${backendURL}/api/user/add-habit`,
        {
          name,
          description,
          frequency,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success("Habit added successfully");
        await fetchHabits();
        navigate("/Habits");
      }
    } catch (error) {
      console.error("❌ Add Habit Error Full:", error);
      console.error("❌ Error Response:", error.response?.data);
      console.error("❌ Error Status:", error.response?.status);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again");
        localStorage.removeItem("token");
        setToken(null);
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to add Habits");
      }
    }
  };

  const editHabits = async (id, name, description, frequency) => {
    try {
      const authToken = localStorage.getItem("token") || token;

      const { data } = await axios.put(
        `${backendURL}/api/user/habits/${id}`,
        {
          name,
          description,
          frequency,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (data.success) {
        toast.success("Edit habits done");
        fetchHabits();
        navigate("/Habits");
      }
    } catch (error) {
      console.log(error);
      toast.error("edit habits error");
    }
  };

  const deleteHabits = async (id) => {
    try {
      const authToken = localStorage.getItem("token") || token;

      const { data } = await axios.delete(
        `${backendURL}/api/user/habits/${id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (data.success) {
        toast.success("Delete Habit");
        fetchHabits();
      }
    } catch (error) {
      console.log(error);
      toast.error("Delete Habits error");
    }
  };

  const markCompleted = async (id) => {
    try {
      const authToken = localStorage.getItem("token") || token;

      const { data } = await axios.put(
        `${backendURL}/api/user/habits/completed/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (data.success) {
        fetchHabits();
        toast.success("Task completed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in marked complete");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setHabitData([]);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      fetchHabits();
    }
  }, []);

  const values = {
    backendURL,
    fetchHabits,
    habitData,
    setHabitData,
    handleRegister,
    handleLogin,
    handleLogout,
    addHabits,
    editHabits,
    deleteHabits,
    markCompleted,
    token,
    setToken,
  };

  return (
    <HabitContext.Provider value={values}>{children}</HabitContext.Provider>
  );
};

export default HabitContextProvider;
