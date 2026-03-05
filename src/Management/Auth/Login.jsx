import React, { useState, useEffect } from "react";
import enyeControl from "../../assets/images/enyecontrols.jpg";
import enyeBg from "../../assets/images/enyebg.png";
import bg from "../../assets/images/bg.jpg";
import engineerImg from "../../assets/images/engineer.png";

/* ================= Animated Input Component ================= */
function AnimatedInput({ label, type = "text" }) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const isActive = focused || value.length > 0;

  return (
    <div className="relative w-full mt-4 mb-5">
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onTouchStart={() => setFocused(true)}
        onClick={() => setFocused(true)}
        className="w-full bg-transparent border-0 border-b-2 border-white/70
                   text-white text-lg py-3
                   focus:outline-none focus:border-orange-400
                   transition-colors"
      />
      <label className="absolute left-0 top-3 pointer-events-none">
        {label.split("").map((char, index) => (
          <span
            key={index}
            style={{ transitionDelay: `${index * 50}ms` }}
            className={`inline-block text-lg transition-all duration-300
                        ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]
                        ${isActive 
                          ? "-translate-y-7 text-orange-400" 
                          : "translate-y-0 text-white"
                        }`}
          >
            {char}
          </span>
        ))}
      </label>
    </div>
  );
}

/* ================= Animated Button Component ================= */
function AnimatedButton({ children }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
      className="relative w-full h-12.5 rounded-sm border border-white overflow-hidden shadow-lg transition-all duration-300 cursor-pointer mt-2"
    >
      <span
        className="absolute top-0 -left-2.5 h-full skew-x-15 transition-all duration-500 ease-in-out -z-10"
        style={{ width: hovered ? "58%" : "0%", background: "#fff" }}
      ></span>
      <span
        className="absolute top-0 -right-2.5 h-full skew-x-15 transition-all duration-500 ease-in-out -z-10"
        style={{ width: hovered ? "58%" : "0%", background: "#FF8C00" }}
      ></span>
      <span
        className="relative text-white text-[16px] font-medium transition-all duration-300"
        style={{ color: hovered ? "black" : "white" }}
      >
        {children}
      </span>
    </button>
  );
}

/* ================= Login Page with Slideshow ================= */
export default function Login() {
  const images = [enyeBg, bg];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000); // change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen bg-black/80 backdrop-blur-sm flex">
      
      {/* LEFT SIDE - LOGIN FORM */}
      <div className="w-full md:w-1/3 p-10 flex flex-col justify-between relative
      bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl h-full">
        <div className="flex justify-center mb-4">
          <img 
            src={enyeControl}
            alt="Enye Logo" 
            className="w-100 h-20 object-contain rounded-full shadow-md"
          />
        </div>
        <div className="flex flex-col justify-center flex-1 px-4">
          <div className="flex justify-center mb-8">
            <div className="w-28 h-28 flex items-center justify-center">
              <img src={engineerImg} alt="Engineer" />
            </div>
          </div>
          <h2 className="text-white text-2xl mb-4">Account Login</h2>
          <AnimatedInput label="Email" type="text" />
          <AnimatedInput label="Password" type="password" />
          <AnimatedButton>Sign in</AnimatedButton>
          <div className="flex items-center gap-2 text-sm text-white/70 mt-4">
            <input type="checkbox" className="accent-orange-500" />
            <span>Remember me</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div 
        className="hidden md:flex flex-1 relative overflow-hidden bg-cover transition-all duration-1000"
        style={{ backgroundImage: `url(${images[current]})` }}
      >
        <div className="absolute -bottom-20 -left-20 w-125 h-125 bg-orange-300 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute top-20 right-0 w-100 h-100 bg-yellow-200 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 right-20 w-75 h-75 bg-amber-100 rounded-full blur-3xl opacity-30"></div>

        <div className="absolute bottom-10 left-10 z-10">
          <h2 className="text-7xl font-extrabold text-white leading-tight">
            Enye <br />
            Warehouse.
          </h2>
        </div>
      </div>

    </div>
  );
}