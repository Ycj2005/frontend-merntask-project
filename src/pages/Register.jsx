import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { BookOpenCheck, Popsicle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const onSubmit = async () => {
    let res = await api.post("/auth/register", {
      ...form,
    });
    const data = res.data;
    if (data.status === 200) {
      toast.success(`${data?.msg + " " + data?.username}`, {
        position: "top-right",
      });

      navigate("/", { replace: true });
    }
    // console.log(data);
  };
  return (
    <div className="w-full h-svh flex flex-col items-center py-8 justify-center gap-6 lg:gap-[8%]">
      <div className="text-slate-800 font-black text-2xl flex items-center gap-2 justify-center">
        <BookOpenCheck color="#000000" /> <div>Task Manager</div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full md:w-[80%] lg:w-[50%] mx-auto shadow-md rounded-md flex flex-col gap-6 px-4 py-5 tracking-wider"
      >
        <div className="text-start font-bold text-xl tracking-normal">
          Register
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="">
            Username
          </label>
          <input
            type="text"
            className=" shadow-md rounded-md px-3 py-3 focus:outline-none"
            placeholder="john doe"
            id="name"
            // defaultValue="john doe"
            {...register("username", {
              required: true,
              minLength: 2,
              maxLength: 50,
            })}
            value={form.username}
            onChange={(e) =>
              setForm({
                ...form,
                username: e.target.value,
              })
            }
          />
          {errors.username?.type === "required" && (
            <span className="text-red-500 text-sm">
              username field is required
            </span>
          )}
          {errors.username?.type === "minLength" && (
            <span className="text-red-500 text-sm">
              username must be at least 2 characters
            </span>
          )}
          {errors.username?.type === "maxLength" && (
            <span className="text-red-500 text-sm">
              username cannot exceed 50 characters
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="">
            Email
          </label>
          <input
            type="email"
            className=" shadow-md rounded-md px-3 py-3 focus:outline-none"
            placeholder="abc@gmail.com"
            id="email"
            // defaultValue="abc@gmail.com"
            {...register("email", {
              required: true,
              maxLength: 50,
              minLength: 2,
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            })}
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />
          {errors.email?.type === "required" && (
            <span className="text-red-500 text-sm">
              Email field is required
            </span>
          )}
          {errors.email?.type === "minLength" && (
            <span className="text-red-500 text-sm">
              Email must be at least 2 characters
            </span>
          )}
          {errors.email?.type === "maxLength" && (
            <span className="text-red-500 text-sm">
              Email cannot exceed 50 characters
            </span>
          )}
          {errors.email?.type === "pattern" && (
            <span className="text-red-500 text-sm">
              Please enter a valid email address
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="">
            Password
          </label>
          <input
            type="password"
            className=" shadow-md rounded-md px-3 py-3 tracking-wide focus:outline-none"
            placeholder="********"
            id="password"
            // defaultValue="********"
            {...register("password", {
              required: true,
              maxLength: 8,
              minLength: 4,
            })}
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />
          {errors.password?.type === "required" && (
            <span className="text-red-500 text-sm">
              Password field is required
            </span>
          )}
          {errors.password?.type === "minLength" && (
            <span className="text-red-500 text-sm">
              Password must be at least 4 characters
            </span>
          )}
          {errors.password?.type === "maxLength" && (
            <span className="text-red-500 text-sm">
              Password cannot exceed 8 characters
            </span>
          )}
        </div>

        <button
          type="submit"
          className="mt-2 border rounded-md py-2 bg-black text-white font-semibold text-base transition duration-300 hover:bg-black/70 cursor-pointer"
        >
          Register
        </button>

        <div className="tracking-wide space-x-1.5">
          <label htmlFor="">I already have an Account</label>
          <Link
            to={"/"}
            className="cursor-pointer font-bold tracking-normal underline"
          >
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
