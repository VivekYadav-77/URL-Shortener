import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../App/themeStore";
import { Send, User, Mail, MessageSquare, Type, X } from "lucide-react";

const ContactMePage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      alert("Please fill in all details before sending.");
      return;
    }

    const myEmail = import.meta.env.VITE_EMAIL || "yourgmail@gmail.com";

    const subject = encodeURIComponent(formData.subject);
    const body = encodeURIComponent(
      `From: ${formData.name}\nUser Email: ${formData.email}\n\nMessage:\n${formData.message}`,
    );

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${myEmail}&su=${subject}&body=${body}`;

    window.open(gmailUrl, "_blank");
  };

  return (
    <div
      className={`min-h-screen p-6 md:p-12 transition-colors duration-500 flex items-center justify-center ${
        isDark ? "bg-[#050505] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div
        className={`w-full max-w-2xl relative overflow-hidden p-8 md:p-12 rounded-[2.5rem] border shadow-2xl transition-all ${
          isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
        }`}
      >
        {/* --- CLOSE / BACK TO LOGIN BUTTON --- */}
        <button
          onClick={() => navigate(-1)}
          className={`absolute top-8 right-8 z-20 p-3 rounded-full transition-all active:scale-90 ${
            isDark
              ? "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900"
          }`}
        >
          <X size={20} />
        </button>

        {/* --- BACKGROUND ACCENT --- */}
        <div
          className={`absolute -right-20 -top-20 h-64 w-64 rounded-full blur-[120px] ${
            isDark ? "bg-blue-600/20" : "bg-blue-600/10"
          }`}
        ></div>

        {/* --- HEADER --- */}
        <div className="relative z-10 mb-10 text-center md:text-left">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border mb-4 ${
              isDark
                ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                : "bg-blue-50 border-blue-200 text-blue-600"
            }`}
          >
            Identity Communication
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-2">
            Get{" "}
            <span className="bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              in Touch
            </span>
          </h1>
          <p
            className={`text-lg font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Complete the form to draft a secure dispatch to my Gmail.
          </p>
        </div>

        {/* --- FORM --- */}
        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NAME FIELD */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 flex items-center gap-2">
                <User size={12} /> Full Name
              </label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className={`w-full px-5 py-4 rounded-2xl border-2 outline-none transition-all ${
                  isDark
                    ? "bg-black/40 border-white/10 focus:border-blue-500 text-white"
                    : "bg-gray-50 border-gray-200 focus:border-blue-500 text-gray-900"
                }`}
              />
            </div>

            {/* EMAIL FIELD */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 flex items-center gap-2">
                <Mail size={12} /> Your Email
              </label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className={`w-full px-5 py-4 rounded-2xl border-2 outline-none transition-all ${
                  isDark
                    ? "bg-black/40 border-white/10 focus:border-blue-500 text-white"
                    : "bg-gray-50 border-gray-200 focus:border-blue-500 text-gray-900"
                }`}
              />
            </div>
          </div>

          {/* SUBJECT FIELD */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 flex items-center gap-2">
              <Type size={12} /> Subject
            </label>
            <input
              required
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Inquiry Topic"
              className={`w-full px-5 py-4 rounded-2xl border-2 outline-none transition-all ${
                isDark
                  ? "bg-black/40 border-white/10 focus:border-blue-500 text-white"
                  : "bg-gray-50 border-gray-200 focus:border-blue-500 text-gray-900"
              }`}
            />
          </div>

          {/* MESSAGE FIELD */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 flex items-center gap-2">
              <MessageSquare size={12} /> Message
            </label>
            <textarea
              required
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message here..."
              className={`w-full px-5 py-4 rounded-2xl border-2 outline-none transition-all resize-none ${
                isDark
                  ? "bg-black/40 border-white/10 focus:border-blue-500 text-white"
                  : "bg-gray-50 border-gray-200 focus:border-blue-500 text-gray-900"
              }`}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className={`w-full flex items-center justify-center gap-3 px-10 py-5 rounded-4xl font-black transition-all active:scale-95 shadow-xl mt-4 ${
              isDark
                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/40"
            }`}
          >
            Draft in Gmail <Send size={20} />
          </button>
        </form>

        {/* --- FOOTER INFO --- */}
        <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Response Time: 24h
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactMePage;
