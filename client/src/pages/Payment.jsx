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
    <div className="min-h-screen py-10 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-background-900 rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-6 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-text-50 tracking-wide">
              Your Donations
            </h1>
          </div>

          {/* Content */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-500"></div>
              </div>
            ) : userDonations.length > 0 ? (
              <div className="space-y-6">
                {userDonations.map(({ campaignTitle, imageUrl, target, donations }) => {
                  const progress = calculateProgressPercentage(donations, target);

                  return (
                    <div
                      key={campaignTitle}
                      className="bg-background-800 rounded-lg shadow-md overflow-hidden"
                    >
                      <div 
                        className="h-24 bg-cover bg-center opacity-50"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                      />
                      <div className="p-6 -mt-12 relative z-10">
                        <div className="bg-background-900 rounded-lg shadow-lg p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-grow">
                              <h3 className="text-xl font-semibold text-text-50 mb-2">{campaignTitle}</h3>
                              <p className="text-text-300 mb-3">
                                Total Donated: {totalDonationAmount(donations)} ETH
                              </p>
                              <div className="w-full bg-background-700 rounded-full h-2.5 mb-3">
                                <div
                                  className="bg-accent-500 h-2.5 rounded-full"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              {progress === 100 && (
                                <p className="text-accent-400 font-bold">Campaign Completed!</p>
                              )}
                            </div>
                            <button
                              className="ml-4 bg-primary-600 hover:bg-primary-700 text-text-50 p-2 rounded-md transition-colors"
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
                                  className="flex justify-between items-center bg-background-800 p-3 rounded-md"
                                >
                                  <span className="text-text-200">
                                    {donation.amount.toFixed(3)} ETH
                                  </span>
                                  <span className="text-sm text-text-300">{donation.timestamp}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-5 rounded-lg text-center">
                <p className="text-xl text-text-200 mb-5">
                  You haven't made any donations yet.
                </p>
                <button
                  className="bg-accent-600 hover:bg-accent-700 text-text-50 px-6 py-3 mt-5 rounded-md transition-colors"
                  onClick={() => navigate('/')}
                >
                  Explore Campaigns
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
