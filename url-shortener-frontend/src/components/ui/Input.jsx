import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
const Input = ({ label, type = "text", ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-[#1E293B] mb-1">
        {label}
      </label>

      <div className="relative">
        <input
          {...props}
          type={isPassword && showPassword ? "text" : type}
          className="
           w-full border rounded px-3 py-2 focus:outline-none focus:ring
          "
        />

        {/* TOGGLE BUTTON */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              text-sm text-slate-500 hover:text-[#2563EB]
            "
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
