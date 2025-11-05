import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HabitContextProvider from "./context/HabitContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <HabitContextProvider>
      <App />
      <Toaster />
    </HabitContextProvider>
  </BrowserRouter>
);
