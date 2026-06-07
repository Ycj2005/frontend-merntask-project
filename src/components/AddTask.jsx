import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Calendar, Tag, FileText, CheckCircle2 } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";
import { useParams, useSearchParams } from "react-router-dom";

export default function AddTask() {
  const token = localStorage.getItem("islogin");
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      priority: "medium",
      title: "",
      description: "",
      dueDate: "",
      status: "pending",
    },
  });

  useEffect(() => {
    async function fetchParticularId() {
      if (!id) return;

      try {
        const response = await api.get(`/task/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        console.log("updated task data : ", data.data);

        const task = data?.data;

        if (task) {
          reset({
            title: task.title || "",
            description: task.description || "",
            priority: task.priority || "medium",
            dueDate: task.date ? task.date.split("T")[0] : "",
            status: task.status || "pending",
          });
        }
      } catch (error) {
        console.error("Error fetching task details:", error);
        toast.error("Failed to load task details.");
      }
    }

    fetchParticularId();
  }, [id, reset, token]);

  // console.log("updated id is : ", id);

  const onSubmit = async (data) => {
    if (id) {
      try {
        const payload = {
          title: data.title,
          description: data.description,
          priority: data.priority,
          date: data.dueDate,
          status: data.status,
        };

        let response = await api.patch(`/task/${id}/status`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 || response.data.status === 200) {
          toast.success(response.data.msg || "Task updated successfully!", {
            position: "top-right",
          });
          reset();
        }
      } catch (error) {
        console.error("Task update error:", error);
        toast.error(
          error.response?.data?.msg || "Failed to update task entry.",
        );
      }
    } else {
      try {
        const payload = {
          title: data.title,
          description: data.description,
          priority: data.priority,
          date: data.dueDate,
        };

        let response = await api.post("/task", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 || response.data.status === 200) {
          toast.success(response.data.msg || "Task created successfully!", {
            position: "top-right",
          });
          reset();
        }
      } catch (error) {
        console.error("Task generation error:", error);
        toast.error(
          error.response?.data?.msg || "Failed to create task entry.",
        );
      }
    }
  };

  return (
    <div className="max-w-3xl md:max-w-full mx-auto">
      <h1 className="text-slate-800 font-bold text-xl mb-6 tracking-normal">
        {id ? "Edit Task" : "Create New Task"}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8 flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <label
            htmlFor="title"
            className="text-sm font-semibold text-slate-700 flex items-center gap-2"
          >
            <CheckCircle2 size={16} className="text-slate-500" /> Task Title
          </label>
          <input
            type="text"
            id="title"
            placeholder="e.g., Design landing page structure"
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition shadow-sm"
            {...register("title", {
              required: "Task title is required",
              minLength: {
                value: 3,
                message: "Title must be at least 3 characters",
              },
              maxLength: {
                value: 100,
                message: "Title cannot exceed 100 characters",
              },
            })}
          />
          {errors.title && (
            <span className="text-red-500 text-xs font-medium mt-0.5">
              {errors.title.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="description"
            className="text-sm font-semibold text-slate-700 flex items-center gap-2"
          >
            <FileText size={16} className="text-slate-500" /> Description
          </label>
          <textarea
            id="description"
            rows="4"
            placeholder="Provide a short breakdown of the steps needed..."
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition shadow-sm resize-none"
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Please provide a slightly longer description",
              },
            })}
          />
          {errors.description && (
            <span className="text-red-500 text-xs font-medium mt-0.5">
              {errors.description.message}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="dueDate"
              className="text-sm font-semibold text-slate-700 flex items-center gap-2"
            >
              <Calendar size={16} className="text-slate-500" /> Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition shadow-sm cursor-pointer"
              {...register("dueDate", {
                required: "Please select a completion date",
              })}
            />
            {errors.dueDate && (
              <span className="text-red-500 text-xs font-medium mt-0.5">
                {errors.dueDate.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="priority"
              className="text-sm font-semibold text-slate-700 flex items-center gap-2"
            >
              <Tag size={16} className="text-slate-500" /> Priority Level
            </label>
            <select
              id="priority"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white text-slate-800 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition shadow-sm cursor-pointer"
              {...register("priority", { required: true })}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          {id && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="status"
                className="text-sm font-semibold text-slate-700 flex items-center gap-2"
              >
                <Tag size={16} className="text-slate-500" /> Status
              </label>
              <select
                id="status"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white text-slate-800 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition shadow-sm cursor-pointer"
                {...register("status", { required: true })}
              >
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="mt-4 w-full md:w-auto md:self-end px-8 py-3 bg-[#1e293b] hover:bg-[#0f172a] text-white font-bold text-sm rounded-lg transition-all shadow-md active:scale-[0.98] cursor-pointer"
        >
          {id ? "Update Task Entry" : "Add Task Entry"}
        </button>
      </form>
    </div>
  );
}
