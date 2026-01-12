import { useEffect, useState, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../App/hook";
import {
  useUpdateMeMutation,
  useChangePasswordMutation,
} from "../Features/auth/authapi";
import { setUser } from "../Features/auth/authSlice";
import UserLayout from "./UserLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Profile = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [updateMe, { isLoading: updatingProfile }] = useUpdateMeMutation();
  const [changePassword, { isLoading: changingPassword }] =
    useChangePasswordMutation();

  const feedbackRef = useRef(null);
  const [feedback, setFeedback] = useState({ type: null, message: "" });

  const showFeedback = (type, message, timeout = 2600) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: null, message: "" }), timeout);
  };

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  useEffect(() => {
    if (feedback.message && feedbackRef.current) {
      feedbackRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [feedback.message]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (name.trim() === user.name) {
      return showFeedback("warning", "Name unchanged");
    }

    try {
      const res = await updateMe({ name }).unwrap();
      dispatch(setUser(res));
      showFeedback("success", "Profile updated successfully");
    } catch (err) {
      showFeedback("error", err?.data?.message || "Profile update failed");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword)
      return showFeedback("warning", "Enter both passwords");

    if (currentPassword === newPassword)
      return showFeedback("warning", "New password must be different");

    if (newPassword.length < 8)
      return showFeedback("warning", "Password must be minimum 8 characters");

    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      setCurrentPassword("");
      setNewPassword("");
      showFeedback("success", "Password updated");
    } catch (err) {
      showFeedback("error", err?.data?.message || "Password change failed");
    }
  };

  return (
    <UserLayout>
      <div
        className="min-h-screen bg-gradient-to-br 
          from-gray-50 to-gray-200 
          dark:from-gray-900 dark:to-black px-4 py-10"
      >
        <div className="max-w-3xl mx-auto space-y-10">
          {/* HEADER */}
          <div className="flex items-center gap-5">
            <div
              className="w-20 h-20 rounded-3xl bg-blue-600/10 dark:bg-blue-500/20
                flex items-center justify-center border border-blue-300/20 dark:border-blue-400/20
                shadow-lg backdrop-blur-md"
            >
              <span className="text-4xl font-bold text-blue-700 dark:text-blue-300">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>

            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Hi, {user?.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 font-medium">
                Manage your personal information & security settings
              </p>
            </div>
          </div>

          {/* FEEDBACK BANNER */}
          {feedback.message && (
            <div
              ref={feedbackRef}
              className={`
                p-4 rounded-xl shadow 
                border backdrop-blur 
                flex items-center gap-2 text-sm font-semibold
                ${
                  feedback.type === "success"
                    ? "bg-green-50/80 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300"
                    : feedback.type === "warning"
                    ? "bg-yellow-50/80 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300"
                    : "bg-red-50/80 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300"
                }
              `}
            >
              {feedback.type === "success" && "✔"}
              {feedback.type === "warning" && "⚠"}
              {feedback.type === "error" && "✖"}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* ACCOUNT INFORMATION CARD */}
          <form
            onSubmit={handleProfileSubmit}
            className="p-6 rounded-2xl bg-white/80 dark:bg-gray-900/40 
                border shadow-xl backdrop-blur space-y-5"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Account Information
            </h2>

            <Input label="Email" value={user.email} disabled />

            <Input
              label="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="pt-2 flex justify-end sm:justify-start">
              <Button
                type="submit"
                disabled={updatingProfile}
                className="
      bg-blue-600 hover:bg-blue-700
      text-white
      h-11
      px-6
      rounded-lg
      font-semibold
      flex items-center justify-center
      w-full sm:w-auto
    "
              >
                {updatingProfile ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>

          {/* SECURITY CARD */}
          <form
            onSubmit={handlePasswordSubmit}
            className="p-6 rounded-2xl bg-white/80 dark:bg-gray-900/40 
                border shadow-xl backdrop-blur space-y-5"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Security Settings
            </h2>

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

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Password must be at least 8 characters long
            </p>

            <div className="pt-2 flex justify-end sm:justify-start">
              <Button
                type="submit"
                disabled={changingPassword}
                className="
      bg-red-600 hover:bg-red-700
      text-white
      h-11
      px-6
      rounded-lg
      font-semibold
      flex items-center justify-center
      w-full sm:w-auto
    "
              >
                {changingPassword ? "Updating..." : "Change Password"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </UserLayout>
  );
};

export default Profile;
