import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Sidebar from "../components/Sidebar";
import StateContextProvider from "../context/stateContext";

export default function DashboardLayout() {
  return (
    <StateContextProvider>
      <div className="h-svh grid grid-rows-[8%_92%]">
        <Navbar />

        <div className="h-full grid grid-cols-[20%_80%] md:grid-cols-[20%_80%] ">
          <Sidebar />

          <main className="flex-1 p-5 h-full w-full bg-gradient-to-br from-slate-50 via-slate-100 to-zinc-200 px-4 py-4 min-h-full overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </StateContextProvider>
  );
}
