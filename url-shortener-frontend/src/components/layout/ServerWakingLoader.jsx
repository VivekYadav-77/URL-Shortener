import { useEffect, useState } from "react";

const messages = [
  "Waking up the sleeping server...",
  "Calibrating URL routing matrices...",
  "Compressing data pathways...",
  "Securing encrypted links...",
  "Almost ready, initiating launch...",
];

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";

const ServerWakingLoader = () => {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [startProgress, setStartProgress] = useState(false);

  // Trigger the 50s progress bar
  useEffect(() => {
    setTimeout(() => setStartProgress(true), 100);
  }, []);

  // Handle the message cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => Math.min(prev + 1, messages.length - 1));
    }, 10000); // Change message every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle the Hacker Text Scramble Effect
  useEffect(() => {
    let iteration = 0;
    let scrambleInterval = setInterval(() => {
      setDisplayText(
        messages[index]
          .split("")
          .map((letter, i) => {
            if (i < iteration) return messages[index][i];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= messages[index].length) {
        clearInterval(scrambleInterval);
      }
      
      iteration += 1 / 2; // Controls the speed of the decoding
    }, 30);

    return () => clearInterval(scrambleInterval);
  }, [index]);

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden font-sans selection:bg-blue-500/30"
    >
      {/* 1. INTERACTIVE MOUSE GLOW */}
      <div
        className="absolute w-[800px] h-[800px] bg-blue-600/15 rounded-full blur-[150px] pointer-events-none transition-transform duration-700 ease-out z-0"
        style={{
          transform: `translate(${mousePos.x - 400}px, ${mousePos.y - 400}px)`,
        }}
      />

      {/* 2. FLOATING DATA PARTICLES (Background) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/10 rounded-full animate-floatUp"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              bottom: "-10px",
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* MAIN GLASS CARD */}
      <div className="relative z-10 p-10 sm:p-12 bg-black/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_0_80px_rgba(59,130,246,0.15)] flex flex-col items-center gap-12 max-w-md w-full mx-4">
        
        {/* BRAND */}
        <div className="flex items-center gap-1 text-4xl font-black tracking-tighter drop-shadow-2xl">
          <span className="text-white">SHORT</span>
          <span className="text-blue-500 animate-pulse">
            LY
          </span>
        </div>

        {/* 3. URL COMPRESSION ENGINE (Replaces the Solar System) */}
        <div className="relative w-full h-24 flex items-center justify-between my-2">
          
          {/* Left Side: Incoming Long URL */}
          <div className="relative w-28 h-8 rounded bg-white/5 border border-white/10 overflow-hidden flex items-center">
            {/* Fade effect on the edges so text smoothly disappears */}
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/80 to-transparent z-10" />
            <div className="text-[10px] text-white/40 font-mono whitespace-nowrap animate-[slideLeft_2.5s_linear_infinite]">
              https://very-long-website-url.com/path?id=8675309&ref=123
            </div>
          </div>

          {/* Center: The Compressor (YOUR LOGO GOES HERE) */}
          <div className="relative z-10 w-20 h-20 bg-black border-2 border-blue-500 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.5)] group">
            {/* Pulsing Core behind logo */}
            <div className="absolute inset-0 bg-blue-500/20 rounded-2xl animate-pulse" />
            
            {/* ========================================== */}
            {/* REPLACE THE SVG BELOW WITH YOUR ACTUAL SVG */}
            {/* ========================================== */}
            <svg className="w-10 h-10 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {/* ========================================== */}

          </div>

          {/* Right Side: Outgoing Short URL */}
          <div className="relative w-28 h-8 flex items-center justify-start overflow-hidden px-2">
            {/* The short URL pill shooting out */}
            <div className="w-12 h-6 rounded bg-blue-600 text-white font-mono text-[10px] font-bold flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[shootRight_2.5s_infinite]">
              shr.ly
            </div>
          </div>

          {/* Connecting Laser Beams */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-white/10 -z-10" />
        </div>

        {/* TERMINAL TEXT SCRAMBLE */}
        <div className="text-center h-20 flex flex-col justify-center w-full">
          <p className="text-lg font-mono font-bold text-white tracking-wide h-6">
            {displayText}
          </p>
          <p className="text-xs text-white/40 mt-4 font-mono uppercase tracking-widest animate-pulse">
            System Boot Sequence...
          </p>
        </div>

        {/* 50-SECOND PROGRESS BAR */}
        <div className="w-full space-y-3 relative group">
          {/* Glowing background for the bar */}
          <div className="absolute -inset-1 bg-blue-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          
          <div className="flex justify-between text-[10px] font-mono font-semibold text-white/70 px-1 uppercase tracking-wider relative">
            <span>Initializing</span>
            <span>Online</span>
          </div>
          
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative z-10">
            <div
              className="h-full bg-blue-500 relative"
              style={{
                width: startProgress ? "100%" : "0%",
                transition: "width 50s cubic-bezier(0.1, 0.5, 0.8, 1)",
              }}
            >
              {/* Internal Bar Shimmer */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_1.5s_infinite] -translate-x-full" />
            </div>
          </div>
        </div>

      </div>

      {/* Custom Keyframes for the URL Compressor, Particles, and Shimmer */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatUp {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(-10vh) scale(1); opacity: 0; }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes slideLeft {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-150%); }
        }
        @keyframes shootRight {
          0% { transform: translateX(-200%) scale(0.5); opacity: 0; }
          30% { transform: translateX(0) scale(1); opacity: 1; }
          70% { transform: translateX(50%) scale(1); opacity: 1; }
          100% { transform: translateX(250%) scale(0.5); opacity: 0; }
        }
      `}} />
    </div>
  );
};

export default ServerWakingLoader;