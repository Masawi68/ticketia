import React from 'react';

const YesNo = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <p className="text-2xl text-blue-950 font-semibold mb-6"> Are you sure you<br/>want to delete this ticket?</p>
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

export default YesNo;
