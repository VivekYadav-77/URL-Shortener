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
import { useTheme } from "../App/themeStore";

const Profile = () => {
  const { theme } = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const pageBg = theme === "light" ? "bg-white text-black" : "bg-black text-white";
  const cardBg = theme === "light" ? "bg-white" : "bg-gray-900";
  const border = theme === "light" ? "border-gray-300" : "border-gray-700";
  const softText = theme === "light" ? "text-gray-600" : "text-gray-400";
  const strongText = theme === "light" ? "text-black" : "text-white";
  const inputBg = theme === "light" ? "bg-gray-100" : "bg-gray-800";

  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [updateMe, { isLoading: updatingProfile }] = useUpdateMeMutation();
  const [changePassword, { isLoading: changingPassword }] =
    useChangePasswordMutation();

  const feedbackRef = useRef(null);
  const [feedback, setFeedback] = useState({ type: null, message: "" });

  const showFeedback = (type, message, timeout = 2500) => {
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
      return showFeedback("warning", "Password must be at least 8 characters");

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
      <div className={`min-h-screen px-4 py-10 transition-colors ${pageBg}`}>
        <div className="max-w-3xl mx-auto space-y-10">

          {/* HEADER */}
          <div className="flex items-center gap-5">
            <div
              className={`w-20 h-20 rounded-3xl flex items-center justify-center
              border shadow-md ${border}
              ${theme === "light" ? "bg-blue-100" : "bg-blue-900/30"}`}
            >
              <span className="text-4xl font-bold text-blue-600">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>

            <div>
              <h1 className={`text-3xl font-extrabold ${strongText}`}>
                Hi, {user?.name}
              </h1>
              <p className={`mt-1 font-medium ${softText}`}>
                Manage your personal info & security settings
              </p>
            </div>
          </div>

          {/* FEEDBACK BANNER */}
          {feedback.message && (
            <div
              ref={feedbackRef}
              className={`
                p-4 rounded-xl border shadow-md text-sm font-semibold
                ${feedback.type === "success" &&
                  (theme === "light"
                    ? "bg-green-100 text-green-700 border-green-300"
                    : "bg-green-900/30 text-green-300 border-green-700")}
                
                ${feedback.type === "warning" &&
                  (theme === "light"
                    ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                    : "bg-yellow-900/30 text-yellow-300 border-yellow-700")}
                
                ${feedback.type === "error" &&
                  (theme === "light"
                    ? "bg-red-100 text-red-700 border-red-300"
                    : "bg-red-900/30 text-red-300 border-red-700")}
              `}
            >
              {feedback.message}
            </div>
          )}

          {/* ACCOUNT INFO CARD */}
          <form
            onSubmit={handleProfileSubmit}
            className={`p-6 rounded-2xl shadow-xl border space-y-5 ${cardBg} ${border}`}
          >
            <h2 className={`text-xl font-bold ${strongText}`}>
              Account Information
            </h2>

            <Input label="Email" value={user.email} disabled theme={theme} />

            <Input
              label="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              theme={theme}
            />

            <div className="pt-2 flex justify-end sm:justify-start">
              <Button
                type="submit"
                disabled={updatingProfile}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
              >
                {updatingProfile ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>

          {/* SECURITY CARD */}
          <form
            onSubmit={handlePasswordSubmit}
            className={`p-6 rounded-2xl shadow-xl border space-y-5 ${cardBg} ${border}`}
          >
            <h2 className={`text-xl font-bold ${strongText}`}>
              Security Settings
            </h2>

            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              theme={theme}
            />

            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              theme={theme}
            />

            <p className={`text-xs ${softText}`}>
              Password must be at least 8 characters
            </p>

            <div className="pt-2 flex justify-end sm:justify-start">
              <Button
                type="submit"
                disabled={changingPassword}
                className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
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
