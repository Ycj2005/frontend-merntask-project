import { BookOpenCheck } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    // remove only the auth token instead of clearing all storage
    localStorage.removeItem("islogin");
    navigate("/", { replace: true });
  }
  return (
    <div className="w-full h-full flex items-center justify-between px-4 shadow-md z-3">
      <div className="text-slate-800 font-black text-base flex items-center gap-2 justify-center">
        <BookOpenCheck color="#000000" /> <div>Task Manager</div>
      </div>
      <div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 border  rounded-lg cursor-pointer transition duration-300 hover:bg-black hover:text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
