import { Trash2 } from "lucide-react";
import React, { useContext } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { StateContext } from "../context/stateContext";

export default function DeleteComponent({ id, onSuccess }) {
  let token = localStorage.getItem("islogin");
  const { setDeleted } = useContext(StateContext);
  async function HandleDelete() {
    let confirm = window.confirm("are you sure to delete this task");
    if (!confirm) return;

    let res = await api.delete(`/task/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    let data = res.data;

    if (data.status === 200) {
      toast.success(data.msg, {
        position: "top-right",
      });

      setDeleted((prev) => !prev);
      // call optional callback to allow optimistic UI updates
      if (typeof onSuccess === "function") onSuccess(id);
      // debug: confirm toggle ran
      console.log("Delete successful — toggled `deleted`", { id, time: Date.now() });
    }
  }

  return (
    <button
      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition cursor-pointer"
      onClick={HandleDelete}
    >
      <Trash2 size={18} />
    </button>
  );
}
