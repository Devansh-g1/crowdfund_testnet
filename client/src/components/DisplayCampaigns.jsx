import React from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
import FundCard from './FundCard';
import { loader } from '../assets';
import { daysLeft } from '../utils';  // Assuming you have a function to calculate days left

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };

  // Filter campaigns based on whether they are within the deadline or collected amount is less than the target
  const filteredCampaigns = campaigns.filter(campaign => {
    const remainingDays = daysLeft(campaign.deadline); // Calculate remaining days
    //console.log(campaign.amountCollected, campaign.target);
    return remainingDays > 0 && parseFloat(campaign.amountCollected) < parseFloat(campaign.target);
  });

  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-texttext-left">{title} ({filteredCampaigns.length})</h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        )}

        {!isLoading && filteredCampaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-text-300">
            There are no active campaigns at the moment.
          </p>
        )}

        {!isLoading && filteredCampaigns.length > 0 && filteredCampaigns.map((campaign) => (
          <FundCard 
            key={uuidv4()}
            {...campaign}
            handleClick={() => handleNavigate(campaign)}
          />
        ))}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
