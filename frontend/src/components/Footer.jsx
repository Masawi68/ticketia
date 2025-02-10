import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; 
import { useNavigate } from 'react-router-dom';

const Footer = () => {
 
  return (
    <div className='bg-gradient-to-b from-[#0033FF] to-[#00020B] h-[100px] px-[160px] py-[25px] fixed bottom-0 left-0 right-0'>
      <div className='flex items-center justify-between'>
        <img src={assets.ticketia_logo2} className='w-[170px] h-7 ' alt="" />
      </div>
      <p className='text-center text-xl text-white'>&copy; copyright 2025 Ticketia</p>
    </div>
  );
};

export default Footer;
