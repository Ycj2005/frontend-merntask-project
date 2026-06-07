import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <>
      {" "}
      <Toaster />
      <AppRoutes />
    </>
  );
}

export default App;
