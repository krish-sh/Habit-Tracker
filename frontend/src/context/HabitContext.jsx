import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cookie from "js-cookie";
import toast from "react-hot-toast";

export const HabitContext = createContext();

const HabitContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(cookie.get("token"));
  const [habitData, setHabitData] = useState([]);

  const backendURL = "http://localhost:3000";

  const getAuthToken = () => cookie.get("token");

  const fetchHabits = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/user/habits`, {
        headers: {
          Authorization: `Bearer ${getAuthToken}`,
        },
      });
      if (data.success) {
        setHabitData(data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("failed in fetch habit");
    }
  };

  const handleRegister = async (name, email, password) => {
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/register`,
        { name, email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (data.success) {
        cookie.set("token", data.token, { expires: 7 });
        setToken(true);
        setHabitData(data.data);
        toast.success(data.message || "Register Successfully");
        navigate("/Login");
      }
    } catch (error) {
      console.log(error);
      toast.error("Registration failed");
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (data.success) {
        cookie.set("token", data.token, { expires: 7 });
        setToken(true);
        setHabitData(data.data);
        toast.success(data.message || "Login Successfully");
        navigate("/Habits");
      }
    } catch (error) {
      console.log(error);
      toast.error("Login failed");
    }
  };

  const addHabits = async (name, description, frequency) => {
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/add-habit`,
        {
          name,
          description,
          frequency,
        },
        {
          headers: {
            Authorization: `Bearer ${getAuthToken}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message || "Add habits succesfully");
        fetchHabits();
        navigate("/Habits");
      }
    } catch (error) {
      console.log(error);
      toast.error("Add habits failed");
    }
  };

  const editHabits = async (id, name, description, frequency) => {
    try {
      const { data } = await axios.put(
        `${backendURL}/api/user/habits/${id}`,
        {
          name,
          description,
          frequency,
        },
        {
          headers: {
            Authorization: `Bearer ${getAuthToken}`,
          },
        }
      );

      if (data.success) {
        toast.error("Edit habits done");
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
      const { data } = await axios.delete(
        `${backendURL}/api/user/habits/${id}`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken}`,
          },
        }
      );

      if (data.success) {
        toast.success("Delete Habit");
        fetchHabits();
        navigate("/Habits");
      }
    } catch (error) {
      console.log(error);
      toast.error("Delete Habits error");
    }
  };

  const markCompleted = async (id) => {
    try {
      const { data } = await axios.put(
        `${backendURL}/user/api/habits/completed/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getAuthToken}`,
          },
        }
      );

      if (data.success) {
        fetchHabits();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in marked complete");
    }
  };

  useEffect(() => {
    if (token) {
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
