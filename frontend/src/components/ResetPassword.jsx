import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

export const ResetPassword = ({ isOpen, toggleModal }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle reset password logic here
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 pb-80">
      <div className="bg-white rounded-lg shadow-lg w-[50vw] sm:w-[40vw] md:w-[30vw] lg:w-[20vw] xl:w-[15vw] p-8 relative">
        <button onClick={toggleModal} className="absolute top-4 right-4" aria-label="Close">
          <FontAwesomeIcon icon={faCircleXmark} className="h-7 w-7 text-gray-600" />
        </button>

        <form onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <div className="mb-4 w-full">
              <label className="block mb-1 text-gray-600" htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Email" aria-label="Email" required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>

          <div className="flex justify-between">
            <button type="submit" className="px-4 py-2 text-white bg-blue-950 rounded hover:bg-blue-700">Reset Password</button>
            <NavLink to="#" className="text-blue-950 hover:underline" onClick={toggleModal}>
              Cancel
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword
