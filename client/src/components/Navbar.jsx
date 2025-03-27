import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useStateContext } from '../context';
import { CustomButton } from './';
import { logo, menu, search, thirdweb } from '../assets';
import { navlinks } from '../constants';

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { connectWallet, address } = useStateContext();

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 bg-background-950 flex items-center justify-between px-6 py-2"
      style={{ 
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      {/* Logo and Brand */}
      <div className="flex items-center">
        <Link to="/" className="flex items-center space-x-3 ml-3">
          <img 
            src={logo} 
            alt="CrowdChain Logo" 
            className="w-8 h-8 object-contain" 
          />
          <span className="text-text font-bold text-xl tracking-wider">
            CrowdChain
          </span>
        </Link>
      </div>

      {/* Right Side Container */}
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="flex flex-row max-w-[300px] py-1 px-3 bg-background rounded-full border border-[rgba(255,255,255,0.1)]">
          <input 
            type="text" 
            placeholder="Search campaigns" 
            className="flex-grow bg-transparent text-white text-sm outline-none placeholder-gray-500" 
          />
          <div className="ml-2 p-1.5 bg-primary rounded-full cursor-pointer transition hover:bg-primary-400">
            <img src={search} alt="search" className="w-4 h-4 object-contain" />
          </div>
        </div>

        {/* Wallet Connection Button */}
        <div className="flex items-center">
          {address ? (
            <button 
              onClick={() => navigate('create-campaign')}
              className="flex items-center bg-primary text-background px-4 py-2 rounded-full font-medium space-x-2 transition hover:bg-primary-600"
            >
              <span>Create Campaign</span>
            </button>
          ) : (
            <button 
              onClick={connectWallet}
              className="flex items-center bg-primary text-background px-4 py-2 rounded-full font-medium space-x-2 transition hover:bg-primary-400"
            >
              <img src="/src/assets/connect.svg" alt="Connect" className="w-5 h-5" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
