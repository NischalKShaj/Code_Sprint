// file to show the premium subscription
"use client";

// importing the required modules
import React from "react";

interface PremiumSubscriptionProps {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const PremiumSubscription: React.FC<PremiumSubscriptionProps> = ({
  isOpen,
  openModal,
  closeModal,
}) => {
  const handleConfirm = () => {
    // Handle subscription upgrade logic here
    closeModal();
  };

  return (
    <div>
      <button
        onClick={openModal}
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Unlock All Videos - ₹9,999 Only!
      </button>

      {isOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1"
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1l6 6m0 0 6-6M1 7l6 6m-6-6l6-6"
                  />
                </svg>
              </button>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Unlock All Videos
            </h3>
            <p className="text-gray-600 mb-4">
              Enjoy lifetime access to our entire video library for just ₹9,999.
              Don`t miss out on this exclusive offer!
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleConfirm}
                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2"
              >
                Yes, I`m Sure
              </button>
              <button
                onClick={closeModal}
                className="text-gray-900 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumSubscription;
