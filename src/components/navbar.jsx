import { BookOpenCheck } from "lucide-react";
import React from "react";

export default function Navbar() {
  function handlelLogout() {
    localStorage.clear("");
    window.location.reload();
  }
  return (
    <div className="w-full h-full flex items-center justify-between px-4 shadow-md z-3">
      <div className="text-slate-800 font-black text-base flex items-center gap-2 justify-center">
        <BookOpenCheck color="#000000" /> <div>Task Manager</div>
      </div>
      <div>
        <button
          onClick={handlelLogout}
          className="px-4 py-2 border  rounded-lg cursor-pointer transition duration-300 hover:bg-black hover:text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
