import { House, ListEnd, SquareCheck } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigateData = [
    {
      id: 1,
      path: "/dashboard",
      icon: <House size={18} />,
      title: "Dashboard",
    },
    {
      id: 2,
      path: "/dashboard/add-task",
      icon: <SquareCheck size={18} />,
      title: "Add task",
    },
    {
      id: 3,
      path: "/dashboard/tasks",
      icon: <ListEnd size={18} />,
      title: "task lists",
    },
  ];

  const location = useLocation();
  const currentPath = location.pathname;

  console.log(currentPath);

  return (
    <div className="px-4 py-4 bg-white border-r border-slate-100">
      <div className="">
        <div>Menu</div>
        <div className="space-y-4 mt-4">
          {navigateData.map((el, index) => (
            <Link
              key={index}
              to={el.path}
              className="py-3 pl-2.5 flex items-center gap-2 text-sm rounded-md cursor-pointer transition duration-300"
              style={{
                backgroundColor: currentPath === el.path ? "#1e293b" : "#Fff",
                color: currentPath === el.path ? "#fff" : "#000",
              }}
            >
              {el.icon}
              <span className="hidden md:block">{el.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
