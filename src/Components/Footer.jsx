import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-black mt-10 py-4 px-6 bottom-0 w-full flex flex-col md:flex-row items-center md:justify-between z-10">

  {/* Left content */}
  <div className="text-sm mb-2 md:mb-0">
    <strong>
        Copyright
      &copy; 2026{" "}
      <a href="https://enye.com.ph/" target="_blank" className="text-blue-400 hover:underline">
        Enye Ltd. Corp
      </a>.
    </strong>
  </div>

  {/* Right content */}
  <div className="text-sm md:block">
    version 2.0
  </div>
</footer>
  );
};

export default Footer;