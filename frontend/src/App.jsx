import { useContext, useState } from "react";
import "./App.css";
import { Toaster } from "react-hot-toast";
import NavBar from "./component/NavBar";
import { HabitContext } from "./context/HabitContext";
import { Navigate, Route, Routes } from "react-router-dom";
import Habits from "./component/Habits";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const token = useContext(HabitContext);

  return (
    <>
      <Toaster />
      <NavBar />
      <Routes>
        <>
          {token ? (
            <Route path="/Habits" element={<Habits />} />
          ) : (
            <>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </>
          )}
        </>
        <Route path="*" element={<Navigate to={token ? "/Habits" : "/"} />} />
      </Routes>
    </>
  );
}

export default App;
