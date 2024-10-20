import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useStateContext } from '../context';
import { useNavigate } from 'react-router-dom'; 

const Payment = () => {
  const navigate = useNavigate();
  const { getUserDonations, address } = useStateContext();
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const [userDonations, setUserDonations] = useState([]);
  const [expandedCampaigns, setExpandedCampaigns] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (!address) return;
      setIsLoading(true); // Start loading
      try {
        const donations = await getUserDonations(address);
        console.log('Fetched donations:', donations);

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
        setIsLoading(false); // End loading
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
    const percentage = Math.min((total / target) * 100, 100);
    return percentage;
  };

  return (
    <div className="relative container mx-auto p-4">
      <div className="bg-[#1c1c24] rounded-lg shadow-lg max-w-4xl mx-auto relative z-0">
        <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#8c6dfd] rounded-[10px]">
          <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
            Your Donations
          </h1>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : userDonations.length > 0 ? (
            <div className="space-y-6">
              {userDonations.map(({ campaignTitle, imageUrl, target, donations }) => {
                const progress = calculateProgressPercentage(donations, target);

                return (
                  <div
                    key={campaignTitle}
                    className="relative bg-white p-6 rounded-lg shadow-md z-10 overflow-hidden"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${imageUrl})` }}
                    />
                    <div className="relative z-20 bg-white bg-opacity-80 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">{campaignTitle}</h3>
                          <p className="text-gray-600 mt-1">
                            Total Donated: {totalDonationAmount(donations)} ETH
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                            <div
                              className="bg-blue-500 h-2.5 rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          {progress === 100 && (
                            <p className="text-green-600 font-bold text-lg">Completed!</p>
                          )}
                        </div>
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                          onClick={() => toggleCampaignExpansion(campaignTitle)}
                        >
                          {expandedCampaigns[campaignTitle] ? <ChevronUp /> : <ChevronDown />}
                        </button>
                      </div>
                      {expandedCampaigns[campaignTitle] && (
                        <div className="mt-4 space-y-2">
                          {donations.map((donation, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center bg-gray-100 p-2 rounded"
                            >
                              <span className="text-gray-800">
                                {donation.amount.toFixed(3)} ETH
                              </span>
                              <span className="text-sm text-gray-600">{donation.timestamp}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg text-center">
              <p className="text-xl text-gray-800">You haven't made any donations yet.</p>
              <button
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors duration-200"
                onClick={() => navigate('/')}
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
