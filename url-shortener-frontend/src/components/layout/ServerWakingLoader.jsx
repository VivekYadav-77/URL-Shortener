import { useEffect, useState } from "react";

const messages = [
  "Waking up server...",
  "Preparing your dashboard...",
  "Optimizing your experience...",
  "Almost there...",
];

const ServerWakingLoader = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex flex-col items-center gap-8">

        {/* Logo / Brand (optional but recommended) */}
        <div className="flex items-center gap-2 text-2xl font-black tracking-tight">
          <span className="text-gray-900">SHORT</span>
          <span className="text-blue-600">LY</span>
        </div>

        {/* Animated Loader */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 bg-blue-600 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Message */}
        <div className="text-center space-y-2 transition-all duration-500">
          <p className="text-lg font-semibold text-gray-800">
            {messages[index]}
          </p>
          <p className="text-sm text-gray-500">
            Free server may take a few seconds on first request
          </p>
        </div>

        {/* Animated dots */}
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-300"></div>
        </div>

      </div>
    </div>
  );
};

export default ServerWakingLoader;