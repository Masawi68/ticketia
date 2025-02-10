import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; 
import LoginModal from './LoginModal';
import LogoutYesNo from './LogoutYesNo'; 

const Navbar = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);  
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate(); 

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const handleLogout = () => {
    setShowLogoutModal(true); 
  };

  const handleLogoutConfirm = () => {
    setIsLoggedIn(false);
    setShowLogoutModal(false);
    navigate('/'); 
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false); 
  };

  return (
    <div className=''>
      <div className="flex items-center justify-between py-5 font-medium px-[150px]">
        <img src={assets.ticketia_logo} className="w-36" alt="Ticketia Logo" />
        <div className="flex gap-4">
          {!isLoggedIn ? (
            <>
              <NavLink className="text-2xl text-blue-950" onClick={toggleModal}>
                Login
              </NavLink>
              <div className="text-3xl text-gray-500 cursor-pointer" onClick={toggleModal}>
                <FontAwesomeIcon icon={faRightToBracket} />
              </div>
            </>
          ) : (
            <>
              <div className="text-3xl text-gray-500 cursor-pointer">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className="text-3xl text-gray-500 cursor-pointer" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} />
              </div>
            </>
          )}
        </div>
      </div>
      <hr className="border border-gray-200" />
      <LoginModal isOpen={isModalOpen} toggleModal={toggleModal} onLogin={() => setIsLoggedIn(true)} />

      {showLogoutModal && (
        <LogoutYesNo
          onConfirm={handleLogoutConfirm}
          onCancel={handleLogoutCancel}
        />
      )}
    </div>
  );
};

export default Navbar;
