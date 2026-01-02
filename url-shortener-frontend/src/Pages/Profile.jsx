import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { setUser } from "../Features/auth/authSlice";
import {
  useGetMeQuery,
  useUpdateMeMutation,
  useChangePasswordMutation,
} from "../Features/auth/authapi";
import { useAppSelector } from "../App/hook";

const Profile = () => {
  const [updateMe, { isLoading: updatingProfile }] = useUpdateMeMutation();
  const [changePassword, { isLoading: changingPassword }] =
    useChangePasswordMutation();
  const user = useAppSelector((state) => state.auth.user)
 console.log("user",user)
  const [name, setName] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const r = await updateMe({name }).unwrap();
      dispatch(setUser(user))
      console.log(r)
      alert("Profile updated");
    } catch (err) {
      alert(err?.data?.message || "Update failed");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    try {
      await changePassword({
        currentPassword,
        newPassword,
      }).unwrap();

      setCurrentPassword("");
      setNewPassword("");
      alert("Password updated successfully");
    } catch (err) {
      alert(err?.data?.message || "Password change failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="mb-10 flex items-center gap-5">
          {/* Icon Container - Increased size and adjusted padding */}
          <div className="flex-shrink-0 w-16 h-16 bg-blue-50 flex items-center justify-center rounded-2xl border border-blue-100 shadow-sm">
            <svg
              viewBox="-2.4 -2.4 28.80 28.80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10" // Explicitly setting a larger size
            >
              <g id="SVGRepo_bgCarrier">
                <path
                  transform="translate(-2.4, -2.4), scale(1.7999999999999998)"
                  fill="#7ed0ec"
                  d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z"
                ></path>
              </g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M8.78355 21.9999C7.09836 21.2478 5.70641 20.0758 4.7915 18.5068"
                  stroke="#1C274C"
                  strokeWidth="1.2" // Slightly thinner stroke for a cleaner look at larger sizes
                  strokeLinecap="round"
                ></path>
                <path
                  d="M14.8252 2.18595C16.5021 1.70882 18.2333 2.16305 19.4417 3.39724"
                  stroke="#1C274C"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                ></path>
                <path
                  d="M4.0106 8.36655L3.63846 7.71539M6.50218 8.86743L7.15007 8.48962M3.2028 10.7531L2.55491 11.1309M7.69685 3.37253L8.34474 2.99472M8.53873 4.81624L7.89085 5.19405M10.4165 9.52517M7.53806 12.1327M4.39747 5.25817L3.74958 5.63598M11.8381 2.9306L12.486 2.55279M14.3638 7.26172L15.0117 6.88391M16.0475 10.1491L16.4197 10.8003M17.6632 5.37608M20.1888 9.7072M6.99128 17.2497M16.9576 19.2533"
                  stroke="#1C274C"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                ></path>
                <path
                  d="M4.38275 9.0177C5.01642 8.65555 5.64023 8.87817 5.85429 9.24524L7.15007 8.48962C6.4342 7.26202 4.82698 7.03613 3.63846 7.71539L4.38275 9.0177ZM3.63846 7.71539C2.44761 8.39597 1.83532 9.8969 2.55491 11.1309L3.85068 10.3753C3.64035 10.0146 3.75139 9.37853 4.38275 9.0177L3.63846 7.71539ZM7.04896 3.75034L7.89085 5.19405L9.18662 4.43843L8.34474 2.99472L7.04896 3.75034ZM7.89085 5.19405L10.4165 9.52517L11.7123 8.76955L9.18662 4.43843L7.89085 5.19405ZM8.83384 11.377L7.15007 8.48962L5.85429 9.24524L7.53806 12.1327L8.83384 11.377ZM7.15007 8.48962L5.04535 4.88036L3.74958 5.63598L5.85429 9.24524L7.15007 8.48962ZM5.57742 3.5228C6.21109 3.16065 6.8349 3.38327 7.04896 3.75034L8.34474 2.99472C7.62887 1.76712 6.02165 1.54123 4.83313 2.22048L5.57742 3.5228ZM4.83313 2.22048C3.64228 2.90107 3.02999 4.40199 3.74958 5.63598L5.04535 4.88036C4.83502 4.51967 4.94606 3.88363 5.57742 3.5228L4.83313 2.22048ZM11.1902 3.30841L13.7159 7.63953L15.0117 6.88391L12.486 2.55279L11.1902 3.30841ZM13.7159 7.63953L15.3997 10.5269L16.6954 9.77132L15.0117 6.88391L13.7159 7.63953ZM9.71869 3.08087C10.3524 2.71872 10.9762 2.94134 11.1902 3.30841L12.486 2.55279C11.7701 1.32519 10.1629 1.0993 8.9744 1.77855L9.71869 3.08087ZM8.9744 1.77855C7.78355 2.45914 7.17126 3.96006 7.89085 5.19405L9.18662 4.43843C8.97629 4.07774 9.08733 3.4417 9.71869 3.08087L8.9744 1.77855ZM17.0153 5.75389L19.5409 10.085L20.8367 9.32939L18.311 4.99827L17.0153 5.75389ZM15.5437 5.52635C16.1774 5.1642 16.8012 5.38682 17.0153 5.75389L18.311 4.99827C17.5952 3.77068 15.988 3.54478 14.7994 4.22404L15.5437 5.52635ZM14.7994 4.22404C13.6086 4.90462 12.9963 6.40555 13.7159 7.63953L15.0117 6.88391C14.8013 6.52322 14.9124 5.88718 15.5437 5.52635L14.7994 4.22404ZM2.55491 11.1309L6.34339 17.6276L7.63917 16.8719L3.85068 10.3753L2.55491 11.1309ZM16.5854 18.6021C13.2185 20.5264 9.24811 19.631 7.63917 16.8719L6.34339 17.6276C8.45414 21.2472 13.4079 22.1458 17.3297 19.9045L16.5854 18.6021ZM19.5409 10.085C21.1461 12.8377 19.9501 16.6792 16.5854 18.6021L17.3297 19.9045C21.2539 17.6618 22.9512 12.9554 20.8367 9.32939L19.5409 10.085ZM15.0798 14.5444C14.4045 13.3863 14.8772 11.6818 16.4197 10.8003L15.6754 9.49797C13.5735 10.6993 12.5995 13.2687 13.784 15.3L15.0798 14.5444"
                  fill="#1C274C"
                ></path>
              </g>
            </svg>
          </div>

          {/* Text Content */}
          <div className="flex flex-col">
            <h2 className="text-3xl font-extrabold text-[#1E293B] uppercase tracking-tight">
              Hi! {user?.name || "Guest"}
            </h2>
            <p className="text-slate-500 Ymt-1 font-medium">
              Manage your account information and security settings
            </p>
          </div>
        </div>
        {/* ACCOUNT INFO */}
        <form
          onSubmit={handleProfileSubmit}
          className="bg-white border rounded-xl p-6 mb-8"
        >
          <h3 className="text-lg font-bold mb-4 text-[#1E293B]">
            Account Information
          </h3>

          <div className="space-y-4">
            <Input label="Email" value={user?.email || ""} disabled />

            <Input
              label="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mt-6">
            <Button
              type="submit"
              disabled={updatingProfile}
              className="inline-flex items-center justify-center bg-[#2563EB] text-white px-5 py-2.5 rounded-lg  hover:bg-blue-700
             transition
             shadow-sm"
            >
              {updatingProfile ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>

        <form
          onSubmit={handlePasswordSubmit}
          className="bg-white border rounded-xl p-6"
        >
          <h3 className="text-lg font-bold mb-4 text-[#1E293B]">Security</h3>

          <div className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <p className="text-xs text-slate-500 font-bold">
              **Password must be at least 8 characters long
            </p>
          </div>

          <div className="mt-6">
            <Button
              type="submit"
              disabled={changingPassword}
              className=" bg-[#eb2525] text-white
                px-6 py-2.5 rounded-lg
                hover:bg-red-400 transition
                disabled:opacity-50"
            >
              {changingPassword ? "Updating..." : "Change Password"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Profile;
