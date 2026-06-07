import React from "react";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  let token = localStorage.getItem("islogin");
  return (
    <>{token ? <Navigate to={"/dashboard"} replace /> : <>{children}</>}</>
  );
}
