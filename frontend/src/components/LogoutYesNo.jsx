import React from 'react';

const LogoutYesNo = ({ onConfirm, onCancel }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50" 
      onClick={onCancel} 
    >
      <div
        className="bg-white p-6 px-[60px] rounded-lg shadow-lg text-center"
        onClick={(e) => e.stopPropagation()} 
      >
        <p className="text-2xl text-blue-950 font-semibold mb-6">
          Are you sure<br />you want to log out?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="bg-green-600 text-white px-10 py-2 rounded-[15px] hover:bg-green-700"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-10 py-2 rounded-[15px] hover:bg-red-700"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutYesNo;
