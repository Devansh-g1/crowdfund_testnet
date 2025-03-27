import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { XCircle } from 'lucide-react';

import { useStateContext } from '../context';
import { CountBox, CustomButton, Loader } from '../components';
import { calculateBarPercentage, daysLeft } from '../utils';
import { thirdweb } from '../assets';

const CampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { donate, getDonations, contract, address } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [donators, setDonators] = useState([]);

  const remainingDays = daysLeft(state.deadline);

  const fetchDonators = async () => {
    const data = await getDonations(state.pId);
    setDonators(data);
  }

  useEffect(() => {
    if(contract) fetchDonators();
  }, [contract, address])

  const handleDonate = async () => {
    const remainingAmount = parseFloat(state.target) - parseFloat(state.amountCollected);
  
    if (parseFloat(amount) > remainingAmount) {
      alert(`Donation amount exceeds the remaining goal. Please enter an amount less than or equal to ${remainingAmount.toFixed(4)} ETH.`);
      return;
    }
  
    try {
      setIsLoading(true);
      await donate(state.pId, amount); 
      navigate('/');
    } catch (error) {
      console.error("Donation failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4">
      {isLoading && <Loader />}

      <div className="container mx-auto max-w-6xl">
        {/* Campaign Header */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Campaign Image */}
          <div className="relative">
            <img 
              src={state.image} 
              alt="campaign" 
              className="w-full h-[500px] object-cover rounded-xl shadow-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-background-700 rounded-full overflow-hidden">
  <div 
    className="h-full bg-gradient-to-r from-accent-400 to-accent-600 transition-all duration-500 ease-in-out" 
    style={{ 
      width: `${calculateBarPercentage(state.target, state.amountCollected)}%`, 
      maxWidth: '100%'
    }}
  />
</div>

          </div>

          {/* Campaign Metrics */}
          <div className="bg-background-900 rounded-xl p-6 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <CountBox title="Days Left" value={remainingDays} />
              <CountBox title={`Raised of ${state.target}`} value={state.amountCollected} />
              <CountBox title="Total Backers" value={donators.length} />
            </div>

            {/* Donation Section */}
            <div className="bg-background-800 rounded-lg p-6">
              <h4 className="text-xl font-bold text-text-200 mb-4">Fund Campaign</h4>
              <input 
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                className="w-full py-3 px-4 bg-background-700 border-2 border-background-600 text-text-100 rounded-lg focus:ring-2 focus:ring-accent-500 outline-none"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className="mt-4 bg-background-700 rounded-lg p-4">
                <h5 className="text-text-200 font-semibold mb-2">Support the Project</h5>
                <p className="text-text-300 text-sm">
                  Back it because you believe in it. Support the project for no reward, just because it speaks to you.
                </p>
              </div>

              <CustomButton 
                btnType="button"
                title="Fund Campaign"
                styles="w-full mt-4 bg-primary text-accent-900 hover:bg-primary-400"
                handleClick={handleDonate}
              />
            </div>
          </div>
        </div>

        {/* Campaign Details */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Creator & Story */}
          <div className="space-y-8">
            {/* Story Section */}
            <div className="bg-background-900 rounded-xl p-6">
              <h4 className="text-xl font-bold text-text-200 uppercase mb-4">{state.title}</h4>
              <p className="text-text-300 leading-relaxed text-justify">
                {state.description}
              </p>
            </div>            
            
            {/* Creator Section */}
            <div className="bg-background-900 rounded-xl p-6">
              <h4 className="text-xl font-bold text-text-200 uppercase mb-4">Creator</h4>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-background-800 rounded-full flex items-center justify-center">
                  <img 
                    src={thirdweb} 
                    alt="user" 
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div>
                  <h5 className="text-text-100 font-semibold">{state.owner}</h5>
                  <p className="text-text-300 text-sm">10 Campaigns</p>
                </div>
              </div>
            </div>


          </div>

          {/* Right Column - Donators */}
          <div className="bg-background-900 rounded-xl p-6">
            <h4 className="text-xl font-bold text-text-200 uppercase mb-4">Donators</h4>
            <div className="space-y-4">
              {donators.length > 0 ? (
                donators.map((item, index) => (
                  <div 
                    key={`${item.donator}-${index}`} 
                    className="flex justify-between items-center bg-background-800 p-3 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-text-300">{index + 1}.</span>
                      <p className="text-text-100 truncate max-w-[200px]">
                        {item.donator}
                      </p>
                    </div>
                    <p className="text-text-200 font-semibold">{item.donation} ETH</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <XCircle className="mx-auto mb-2 text-text-300" size={48} />
                  <p className="text-text-300">No donators yet. Be the first one!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails;