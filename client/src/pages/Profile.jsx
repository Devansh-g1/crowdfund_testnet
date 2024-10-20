import React, { useState, useEffect } from 'react';
import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context';
import { daysLeft } from '../utils'; // Import the daysLeft function

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getUserCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getUserCampaigns();

    // Filter out campaigns based on remaining days and target amount
    const activeCampaigns = data.filter(campaign => {
      const remainingDays = daysLeft(campaign.deadline); // Calculate remaining days
      return remainingDays > 0 && parseFloat(campaign.amountCollected) < parseFloat(campaign.target);
    });

    setCampaigns(activeCampaigns);
    setIsLoading(false);
  }

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  return (
    <DisplayCampaigns 
      title="Your Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  )
}

export default Profile;
