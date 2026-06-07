import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpenCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import api from "../services/api";
import { useState } from "react";
import toast from "react-hot-toast";
export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    // if (e) e.preventDefault();
    try {
      let res = await api.post("/auth/login", {
        ...form,
      });
      let data = res.data;
      if (data.status === 200) {
        toast.success(`${data?.msg}`, {
          position: "top-right",
        });
        localStorage.setItem("islogin", data.token);
        navigate("/dashboard", { replace: true });
      } else {
        toast.error(data.msg || "Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "Something went wrong");
    }

    // console.log(data);
  };

  // const handleSkip = async () => {
  //   localStorage.setItem("islogin", true);
  //   window.location.reload();
  // };
  return (
    <div className="w-full h-svh flex flex-col items-center justify-center gap-6 lg:gap-[10%]">
      <div className="text-slate-800 font-black text-2xl flex items-center gap-2 justify-center">
        <BookOpenCheck color="#000000" /> <div>Task Manager</div>
      </div>

      <form
        className="w-full md:w-[80%] lg:w-[50%] mx-auto shadow-md rounded-md flex flex-col gap-6 px-4 py-5 tracking-wider"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="text-start font-bold text-xl tracking-normal">
          Login
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            className="shadow-md rounded-md px-3 py-3 focus:outline-none"
            id="email"
            placeholder="abc@gmail.com"
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
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="shadow-md rounded-md px-3 py-3 tracking-wide focus:outline-none"
            id="password"
            placeholder="********"
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
          Login
        </button>

        <div className="tracking-wide space-x-1.5">
          <label htmlFor="">I don't have Account</label>
          <Link
            to={"/register"}
            className="cursor-pointer font-bold tracking-normal underline"
          >
            Sign Up
          </Link>
        </div>

        {/* <button onClick={handleSkip}>skip</button> */}
      </form>
    </div>
  );
}
