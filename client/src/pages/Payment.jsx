import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useStateContext } from '../context';
import { useNavigate } from 'react-router-dom'; 

const Payment = () => {
  const navigate = useNavigate();
  const { getUserDonations, address } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [userDonations, setUserDonations] = useState([]);
  const [expandedCampaigns, setExpandedCampaigns] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (!address) return; // Avoid fetching if no address is provided
      setIsLoading(true);
      try {
        const donations = await getUserDonations(address);
        console.log('Fetched donations:', donations);

        // Group donations by campaignId
        const groupedDonations = donations.reduce((acc, { campaignTitle, imageUrl, target, totalDonated, donations }) => {
          const campaignKey = campaignTitle;
          if (!acc[campaignKey]) {
            acc[campaignKey] = {
              campaignTitle,
              imageUrl,
              target: parseFloat(target),
              totalDonated: parseFloat(totalDonated),
              donations: [],
            };
          }

          donations.forEach(({ amount, timestamp }) => {
            acc[campaignKey].donations.push({
              amount: parseFloat(amount) / (10 ** 18),
              timestamp: new Date(timestamp * 1000).toLocaleString(),
            });
          });

          return acc;
        }, {});

        console.log('Grouped donations:', groupedDonations);
        setUserDonations(Object.values(groupedDonations));
      } catch (error) {
        console.error('Error fetching donations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [address, getUserDonations]);

  const toggleCampaignExpansion = (campaignTitle) => {
    setExpandedCampaigns((prev) => ({
      ...prev,
      [campaignTitle]: !prev[campaignTitle],
    }));
  };

  const totalDonationAmount = (donations) =>
    donations.reduce((total, { amount }) => total + amount, 0).toFixed(3);

  const calculateProgressPercentage = (donations, target) => {
    const total = totalDonationAmount(donations);
    return Math.min((total / target) * 100, 100);
  };

  return (
    <div className="relative container mx-auto p-4">
      <div className="bg-gray-900 rounded-lg shadow-lg max-w-4xl mx-auto relative z-10">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-3xl font-bold text-center text-white">Your Donations</h1>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : userDonations.length > 0 ? (
            <div className="space-y-6">
              {userDonations.map(({ campaignTitle, imageUrl, target, totalDonated, donations }) => (
                <div key={campaignTitle} className="relative bg-gray-800 p-6 rounded-lg shadow-md">
                  {/* Faded background image for each campaign */}
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-20 rounded-lg"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                  />
                  <div className="relative z-10"> {/* Content above the background */}
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{campaignTitle}</h3>
                        <p className="text-gray-400 mt-1">
                          Total Donated: {totalDonationAmount(donations)} ETH
                        </p>
                        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${calculateProgressPercentage(donations, target)}%` }}
                          />
                        </div>
                      </div>
                      <button
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                        onClick={() => toggleCampaignExpansion(campaignTitle)}
                      >
                        {expandedCampaigns[campaignTitle] ? <ChevronUp /> : <ChevronDown />}
                      </button>
                    </div>
                    {expandedCampaigns[campaignTitle] && (
                      <div className="mt-4 space-y-2">
                        {donations.map((donation, index) => (
                          <div key={index} className="flex justify-between items-center bg-gray-700 p-2 rounded">
                            <span>{donation.amount.toFixed(3)} ETH</span>
                            <span className="text-sm text-gray-400">{donation.timestamp}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <p className="text-xl text-white">You haven't made any donations yet.</p>
              <button
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
                onClick={() => navigate('/')} // Replace '/your-desired-link' with the actual link
              >
                Explore Campaigns
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
