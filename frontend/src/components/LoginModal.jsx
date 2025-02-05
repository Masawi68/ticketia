import React, { useState } from 'react';
import { NavLink, useNavigate  } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

const LoginModal = ({ isOpen, toggleModal, onLogin }) => {
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    console.log('Submitting login:', formData);
    e.preventDefault();

    if (isResetPassword) {
      // Handle password reset logic
      console.log('Reset Password:', formData.email);
      return;
    }

    try {
      const response = await fetch('https://ticketia-backend.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      const data = await response.json();
      console.log('Login Successful:', data);

      
        // Save token to localStorage (optional)
        localStorage.setItem('token', data.token);
      // Update parent login state
      onLogin(true);

      // Close modal
      toggleModal();

      navigate('./dashboard');
      
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClose = () => {
    setError(null); // Clear errors on close
    setIsResetPassword(false); // Reset to login modal
    toggleModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 pb-80">
      <div
        className={`bg-white rounded-lg shadow-lg p-8 relative flex flex-col justify-between ${
          isResetPassword ? 'w-[40vw] sm:w-[30vw] md:w-[20vw]' : 'w-[80vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[35vw]'
        }`}
      >
        <button onClick={handleClose} className="absolute top-4 right-4" aria-label="Close">
          <FontAwesomeIcon icon={faCircleXmark} className="h-7 w-7 text-gray-600" />
        </button>

        {isResetPassword ? (
          <form onSubmit={handleSubmit} className="flex flex-col justify-center h-full">
            <div className="mb-4">
              <label className="block mb-1 text-gray-600" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                aria-label="Email"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between">
              <button type="submit" className="px-4 py-2 text-white bg-blue-950 rounded hover:bg-blue-700">
                Reset Password
              </button>
              <NavLink to="#" className="text-blue-950 hover:underline" onClick={() => setIsResetPassword(false)}>
                Cancel
              </NavLink>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col">
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex gap-4 mb-4">
              <div className="w-full">
                <label className="block mb-1 text-gray-600" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  aria-label="Email"
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-full">
                <label className="block mb-1 text-gray-600" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  required
                  aria-label="Password"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <button type="submit" className="px-20 py-2 text-white bg-blue-950 rounded hover:bg-blue-700">
                Login
              </button>
              {/* <NavLink to="#" className="text-blue-950 hover:underline" onClick={() => setIsResetPassword(true)}>
                Forgot password?
              </NavLink> */}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
