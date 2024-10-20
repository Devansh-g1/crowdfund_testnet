import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { logo, sun, logout } from '../assets'; // Import your icons
import { navlinks } from '../constants';
import { useStateContext } from '../context'; // Assuming you have a disconnect function in your context

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (
  <div 
    className={`w-[48px] h-[48px] rounded-[10px] flex justify-center items-center
      ${!disabled && 'cursor-pointer'} 
      ${isActive === name ? '' : ''} // Apply bg color only when active
      hover:bg-[#3a3a43] transition-colors duration-200`}  // Add hover effect for all icons
    onClick={handleClick}
  >
    <img 
      src={imgUrl} 
      alt={name} 
      className={`w-1/2 h-1/2 ${isActive !== name ? 'grayscale' : ''}`} // Remove grayscale when active
    />
  </div>
)


const Sidebar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');
  const { disconnectWallet } = useStateContext(); // Assuming you have a disconnect function in your context

  const handleLogout = () => {
    disconnectWallet(); // Call the disconnect function
    navigate('/'); // Navigate to the home page or login page after logout
  };

  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">
      {/* Logo at the top */}
      <Link to="/">
        <Icon styles="w-[52px] h-[52px] bg-[#2c2f32]" imgUrl={logo} />
      </Link>

      {/* Navigation Links */}
      <div className="flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] w-[76px] py-4 mt-6"> {/* Adjusted the margin-top to shift background up */}
        <div className="flex flex-col justify-center items-center gap-3">
          {navlinks.map((link) => (
            <Icon 
              key={link.name}
              {...link}
              isActive={isActive}
              handleClick={() => {
                if (!link.disabled) {
                  setIsActive(link.name);
                  navigate(link.link);
                }
              }}
            />
          ))}
        </div>

        {/* Box containing the icons, adjusted with margin */}
        <div className="flex flex-col justify-end items-center gap-4 flex-grow mb-6"> {/* Adjusted margin to move icons up */}
          {/* Logout Icon */}
          <Icon 
            styles="bg-[#2c2f32] hover:bg-[#3a3a43] transition-colors duration-200" // Style for logout with gray bg and hover effect
            imgUrl={logout} // Logout icon
            name="Logout" 
            handleClick={handleLogout} // Call the logout function
          />

          {/* Sun Icon */}
          <Icon 
            styles="bg-[#2c2f32] hover:bg-[#3a3a43] transition-colors duration-200" // Same hover effect for the sun icon
            imgUrl={sun} 
          />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
