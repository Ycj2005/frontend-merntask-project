import {
  Calendar,
  CheckCircle,
  CircleCheckBig,
  ClipboardList,
  Clock,
  History,
  SquarePen,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import DeleteComponent from "./removeCompo";
import { StateContext } from "../context/stateContext";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    totalPages: 1,
  });

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [page, setPage] = useState(1);
  const [completed, setCompleted] = useState(0);

  let token = localStorage.getItem("islogin");
  const { deleted } = useContext(StateContext);

  useEffect(() => {
    async function getData() {
      let res = await api.get("/task", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let data = res?.data?.data;
      let total = 0;
      console.log("completed task data : ", data);
      data.forEach((el) => {
        el.status === "completed" && (total += 1);
      });

      setCompleted(total);
    }
    getData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        let queryParams = `?page=${page}&limit=5`;
        if (search.trim())
          queryParams += `&search=${encodeURIComponent(search)}`;
        if (sortBy) queryParams += `&sortBy=${sortBy}`;
        if (statusFilter) queryParams += `&status=${statusFilter}`;
        if (priorityFilter) queryParams += `&priority=${priorityFilter}`;

        let response = await api.get(`/task/sorted${queryParams}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const payload = response?.data;

        if (payload?.success && Array.isArray(payload.tasks)) {
          setTasks(payload.tasks);
          if (payload.pagination) {
            setPagination(payload.pagination);
          }
        } else {
          setTasks([]);
        }
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        setTasks([]);
      }
    }

    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [deleted, search, sortBy, statusFilter, priorityFilter, page, token]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: "bg-red-50 text-red-700 border-red-200",
      medium: "bg-amber-50 text-amber-700 border-amber-200",
      low: "bg-slate-100 text-slate-700 border-slate-200",
    };
    return styles[priority?.toLowerCase()] || styles.low;
  };

  const handleDeleteSuccess = (deletedId) => {
    setTasks((prev) => prev.filter((t) => t._id !== deletedId));
    if (tasks.length <= 1 && page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-4 p-4 max-w-6xl mx-auto">
      <div>
        <span className="text-sm font-semibold text-gray-500 block mb-2">
          tasks status
        </span>
        {/* Pass overall total from pagination metadata */}
        <TaskStatusCards
          totaltasks={pagination.total}
          completedtask={completed}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
        <div className="flex items-center justify-center">
          <input
            type="text"
            className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition shadow-sm"
            placeholder="search...."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div>
          <select
            className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-800 bg-white focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition shadow-sm cursor-pointer"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Sorted by Default</option>
            <option value="priority">Priority</option>
            <option value="time">Time-added</option>
            <option value="status">Status</option>
          </select>
        </div>
        <div>
          <select
            className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-800 bg-white focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition shadow-sm cursor-pointer"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <select
            className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-800 bg-white focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition shadow-sm cursor-pointer"
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div>
        <div className="text-sm font-semibold text-gray-500 mb-2">lists</div>
        <div className="flex flex-col gap-3">
          {(() => {
            if (tasks.length === 0) {
              return (
                <div className="w-full flex flex-col items-center justify-center p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                  <p className="text-slate-600 font-medium mb-3">
                    No tasks found matching your filters.
                  </p>
                  <Link
                    to="/dashboard/add-task"
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors shadow-sm"
                  >
                    Create a new task
                  </Link>
                </div>
              );
            }

            return tasks.map((task) => (
              <div
                key={task._id}
                className="w-full bg-white border border-slate-100 shadow-sm rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className={`w-2 h-2 rounded-full ${task.status === "completed" ? "bg-green-500" : "bg-amber-500"}`}
                    />
                    <h3
                      className={`font-bold text-base text-slate-800 truncate ${task.status === "completed" ? "line-through opacity-60" : ""}`}
                    >
                      {task.title}
                    </h3>
                  </div>
                  <p className="text-slate-500 text-sm line-clamp-1">
                    {task.description}
                  </p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <span
                    className={`text-xs px-2.5 py-1 font-semibold rounded-full border uppercase tracking-wider ${getPriorityBadge(task.priority)}`}
                  >
                    {task.priority || "low"}
                  </span>

                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                    <Calendar size={14} />
                    <span>{formatDate(task.createdAt)}</span>
                  </div>

                  <button
                    className={`p-1.5 rounded-lg border transition ${
                      task.status === "completed"
                        ? "bg-green-50 border-green-200 text-green-600"
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {task.status === "completed" ? (
                      <CheckCircle size={18} />
                    ) : (
                      <Clock size={18} />
                    )}
                  </button>

                  <DeleteComponent
                    id={task._id}
                    onSuccess={handleDeleteSuccess}
                  />

                  <Link
                    to={`/dashboard/add-task?id=${task._id}`}
                    className="p-1.5 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-amber-50 transition cursor-pointer"
                  >
                    <SquarePen color="#d97706" size={18} />
                  </Link>
                </div>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* Pagination Controls Section */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          <span className="text-sm text-slate-600 font-medium">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            disabled={page === pagination.totalPages}
            onClick={() =>
              setPage((prev) => Math.min(prev + 1, pagination.totalPages))
            }
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

const TaskStatusCards = ({ totaltasks, completedtask }) => {
  const pending_Task = totaltasks - completedtask;
  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-2 mt-3">
      <div className="w-full flex-1 rounded-xl py-4 px-4 bg-white shadow-md">
        <div className="font-semibold text-gray-700/80 mb-4">All Tasks</div>
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">{totaltasks || 0}</div>
          <button className="p-1.5 rounded-lg border bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100">
            <ClipboardList color="#000000" size={20} />
          </button>
        </div>
      </div>
      <div className="w-full flex-1 rounded-xl py-4 px-4 bg-white shadow-md">
        <div className="font-semibold text-gray-700/80 mb-4">Completed</div>
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">{completedtask}</div>
          <button className="p-1.5 rounded-lg border bg-green-50 border-green-200 text-amber-600">
            <CircleCheckBig color="#16a34a" size={20} />
          </button>
        </div>
      </div>
      <div className="w-full flex-1 rounded-xl py-4 px-4 bg-white shadow-md">
        <div className="font-semibold text-gray-700/80 mb-4">Pending</div>
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">{pending_Task || "--"} </div>
          <button className="p-1.5 rounded-lg border bg-green-50 border-amber-200">
            <History color="#d97706" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
