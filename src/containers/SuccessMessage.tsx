import { CheckCircle } from "lucide-react";
import React, { FC, useEffect, useState } from "react";
interface messageProps{
    visibled? : boolean
    userName? : string
}
const SuccessMessage : FC<messageProps> = ({visibled , userName}) => {
  const [visible, setVisible] = useState(visibled); // Modal starts visible

  const handleClose = () => {
    const modal = document.querySelector(".modal");
    if (modal) {
      modal.classList.remove("animate__fadeInDown");
      modal.classList.add("animate__fadeOutLeftBig");

      // Hide the modal after animation ends
      modal.addEventListener(
        "animationend",
        () => {
          setVisible(false);
        },
        { once: true }
      );
    }
  };

  // Ensure the component unmounts when `visible` becomes `false`
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 min-h-screen flex items-center justify-center">
      <div className="flex items-center justify-center p-4">
        <div
          className={`modal max-w-sm p-8 animate__animated animate__fast animate__fadeInDown w-full bg-white rounded-xl shadow-lg`}
        >
          <div className="flex justify-end">
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={handleClose}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100">
            <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mt-2 text-center">
            <h1 className="text-xl font-bold text-gray-900">Welcome, {userName}!</h1>
            <p className="mt-3 text-base text-gray-600">
              Your account has been successfully created.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 space-y-3">
            <button className="w-full  text-sky-700  py-1 px-8 rounded-lg hover:text-gray-700 transition-colors font-medium">
              Go home
            </button>
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;
