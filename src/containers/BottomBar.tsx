
import React from "react";

const BottomBar = () => {
  return (
    <div className="lg:hidden md:hidden sm:block mt-20">
      <nav className="fixed bottom-0 w-full  border-gray-400 bg-slate-700



 z-10 left-0 right-0  text-white shadow-lg">
        <div className="flex justify-around p-4">
          <Link
            href="/home"
            className="flex flex-col items-center text-gray-400 hover:text-white"
          >
            <i className="fa fa-home text-xl text-white"></i>
            <span className="text-xs text-white font-normal mt-1">Home</span>
          </Link>
          <Link
            href="/mylearning"
            className="flex flex-col items-center text-gray-400 hover:text-white"
          >
            <i className="fas fa-circle-play text-xl text-white "></i>
            <span className="text-xs text-white font-normal mt-1">My learning</span>
          </Link>
          <Link
            href="/home"
            className="flex flex-col items-center text-gray-400 hover:text-white"
          >
            <i className="fa fa-graduation-cap text-xl text-white "></i>
            <span className="text-xs text-white font-normal mt-1">Teachers</span>
          </Link>
          <Link
            href="/login"
            className="flex flex-col items-center text-gray-400 hover:text-white"
          >
            <i className="fa fa-user text-xl text-white"></i>
            <span className="text-xs text-white font-normal mt-1">My account</span>
          </Link>

        </div>
      </nav>
    </div>
  );
};

export default BottomBar;
