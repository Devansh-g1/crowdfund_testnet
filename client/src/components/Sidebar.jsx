import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logo, sun, logout } from '../assets';
import { navlinks } from '../constants';
import { useStateContext } from '../context';

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (
  <div 
    className={`w-[48px] h-[48px] rounded-[10px] flex justify-center items-center
      ${!disabled && 'cursor-pointer'} 
      ${isActive === name ? 'bg-background-700' : 'hover:bg-background-800'} 
      transition-colors duration-200`}
    onClick={handleClick}
  >
    <img 
      src={imgUrl} 
      alt={name} 
      className={`w-1/2 h-1/2 ${isActive !== name ? 'opacity-60' : 'opacity-100'}`}
    />
  </div>
)

const Sidebar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');
  const [theme, setTheme] = useState(
    // Check localStorage or system preference for initial theme
    localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );
  const { disconnectWallet } = useStateContext();

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Update document root and localStorage
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Optional: Add class for Tailwind dark mode support
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    disconnectWallet();
    navigate('/');
  };

  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">
      

      {/* Navigation Links */}
      <div className="flex-1 flex flex-col justify-between items-center bg-background-900 rounded-[20px] w-[76px] py-4 mt-16">
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

        {/* Bottom Icons */}
        <div className="flex flex-col justify-end items-center gap-4 flex-grow mb-6">
          {/* Logout Icon */}
          <Icon 
            styles="bg-background-700 hover:bg-background-600" 
            imgUrl={logout} 
            name="Logout" 
            handleClick={handleLogout}
          />
          
          {/* Theme Toggle Icon */}
          {/* <Icon 
            styles="bg-background-700 hover:bg-background-600" 
            imgUrl={sun} 
            name="Theme"
            handleClick={handleThemeToggle}
          /> */}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;