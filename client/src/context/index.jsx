import React, { useContext, createContext, useState, useEffect } from 'react';
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
const env = await import.meta.env;

// Create the State Context
const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract('0xa8D644EBE3C6F4B37914f73A7BFe2C7460250D75'); // Replace with your contract address
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

  const address = useAddress();
  const connectWallet = useMetamask();
  const [isConnected, setIsConnected] = useState(false);

  // Check if the wallet is already connected on load
  const checkWalletConnection = () => {
    if (address) {
      setIsConnected(true);
    }
  };

  useEffect(() => {
    checkWalletConnection();
  }, [address]);

  // Function to publish a campaign
  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({
        args: [
          address, // Owner
          form.title,
          form.description,
          form.target,
          new Date(form.deadline).getTime(),
          form.image,
        ],
      });
      console.log('Campaign created:', data);
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  // Fetch all campaigns
  const getCampaigns = async () => {
    try {
      const campaigns = await contract.call('getCampaigns');
      return campaigns.map((campaign, i) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: campaign.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
        image: campaign.image,
        pId: i,
      }));
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      return [];
    }
  };

  // Fetch number of campaigns
  const getNumberOfCampaigns = async () => {
    try {
      const numberOfCampaigns = await contract.call('getCampaigns');
      return numberOfCampaigns.toNumber();
    } catch (error) {
      console.error("Error fetching number of campaigns:", error);
      return 0;
    }
  };
    

  // Fetch campaigns created by the user
  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();
    return allCampaigns.filter((campaign) => campaign.owner === address);
  };

  // Donate to a campaign
  const donate = async (pId, amount) => {
    try {
      const tx = await contract.call('donateToCampaign', [pId], {
        value: ethers.utils.parseEther(amount)
      });
      await tx.wait();
      console.log("Donation successful:", tx);
    } catch (error) {
      console.error("Error donating:", error);
    }
  };
    

  // Get donations for a specific campaign
  const getDonations = async (pId) => {
    try {
      const donations =await contract.call('getDonators', [pId]);
      const numberOfDonations = donations[0].length;

      return Array.from({ length: numberOfDonations }, (_, i) => ({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      }));
    } catch (error) {
      console.error("Error fetching donations:", error);
      return [];
    }
  };
    

  // Get all donations made by the connected user
  const getUserDonations = async (userAddress) => {
    try {
        // Get the user's donation details from the smart contract

        const donationDetails = await contract.call('getUserDonations',[userAddress]);
  
        const campaignsData = await contract.call('getCampaigns');
  
        console.log("Donation details:", donationDetails);
        console.log("Campaigns data:", campaignsData);
        
        const userDonations = donationDetails.map(donation => {
            const campaign = campaignsData[donation.campaignId];
            const totalDonated = donationDetails
                .filter(d => d.campaignId === donation.campaignId)
                .reduce((total, d) => total + parseFloat(ethers.utils.formatEther(d.amount)), 0);
  
            return {
                campaignTitle: campaign.title,
                target: ethers.utils.formatEther(campaign.target),
                imageUrl: campaign.image,
                donations: donationDetails.filter(d => d.campaignId === donation.campaignId),
                totalDonated,
            };
        });
  
        return userDonations;
    } catch (error) {
        console.error("Error fetching user donations:", error);
        return [];
    }
  };

  // Function to disconnect the wallet
  const disconnectWallet = () => {
    setIsConnected(false);
    alert('Wallet disconnected!');
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connectWallet,
        disconnectWallet,
        isConnected,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        getUserDonations,
        getNumberOfCampaigns, // Expose the new function
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

/**
 * @dev Custom hook to use the StateContext
 */
export const useStateContext = () => useContext(StateContext);




// INDEX FOR GANACHE


// import React, { useContext, createContext, useEffect, useState } from 'react';
// import { ethers } from 'ethers';

// // Import your contract's ABI

// import CampaignABIdata from 'C:/Users/Admin/CNN/CrowdFunding-Holesky/truffle web3/build/contracts/CrowdFunding.json'; 
// const CampaignABI = CampaignABIdata.abi;
// const ContractAdd= CampaignABIdata.networks[5777].address;
// // Create the State Context
// const StateContext = createContext();

// /**
//  * @dev Provider component that wraps the application with state and functions
//  */
// export const StateContextProvider = ({ children }) => {
//   const [provider, setProvider] = useState(null);
//   const [signer, setSigner] = useState(null);
//   const [contract, setContract] = useState(null);
//   const [address, setAddress] = useState('');


//   // Initialize the provider, signer, and contract
//   useEffect(() => {
//     const init = async () => {
//       if (window.ethereum) {
//         try {
//           const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
//           await tempProvider.send("eth_requestAccounts", []);

//           const tempSigner = tempProvider.getSigner();
//           const userAddress = await tempSigner.getAddress();

//           const tempContract = new ethers.Contract(
//             ContractAdd,
//             CampaignABI,
//             tempSigner
//           );

//           setProvider(tempProvider);
//           setSigner(tempSigner);
//           setAddress(userAddress);
//           setContract(tempContract);
//         } catch (error) {
//           console.error("Initialization error:", error);
//         }
//       } else {
//         console.error("Please install MetaMask!");
//       }
//     };

//     init();
//   }, []);

//   /**
//    * @dev Connect MetaMask wallet
//    */
//   const connectWallet = async () => {
//     if (!window.ethereum) {
//       alert("Please install MetaMask!");
//       return;
//     }

//     try {
//       const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
//       await tempProvider.send("eth_requestAccounts", []);

//       const tempSigner = tempProvider.getSigner();
//       const userAddress = await tempSigner.getAddress();

//       const tempContract = new ethers.Contract(
//         ContractAdd,
//         CampaignABI,
//         tempSigner
//       );

//       setProvider(tempProvider);
//       setSigner(tempSigner);
//       setAddress(userAddress);
//       setContract(tempContract);
//     } catch (error) {
//       console.error("Connection error:", error);
//     }
//   };

//   const disconnectWallet = () => {
//     // Resetting the state variables to their initial values
//     setProvider(null);
//     setSigner(null);
//     setAddress(null);
//     setContract(null);

//     // Optionally, you can add any additional cleanup or logic here
//     alert("Wallet disconnected!");
// };


//   /**
//    * @dev Create a new campaign
//    */
//   const createCampaign = async (form) => {
//     try {
//       const tx = await contract.createCampaign(
//         address, 
//         form.title, 
//         form.description, 
//         form.target, 
//         new Date(form.deadline).getTime(), 
//         form.image
//       );
//       await tx.wait();
//       console.log("Campaign created:", tx);
//     } catch (error) {
//       console.error("Error creating campaign:", error);
//     }
//   };

//   /**
//    * @dev Fetch all campaigns
//    */
  
//   const getCampaigns = async () => {
//     try {
//       const campaigns = await contract.getCampaigns();
//       return campaigns.map((campaign, i) => ({
//         owner: campaign.owner,
//         title: campaign.title,
//         description: campaign.description,
//         target: ethers.utils.formatEther(campaign.target.toString()),
//         deadline: campaign.deadline.toNumber(),
//         amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
//         image: campaign.image,
//         pId: i
//       }));
//     } catch (error) {
//       console.error("Error fetching campaigns:", error);
//       return [];
//     }
//   };

//   /**
//    * @dev Fetch campaigns created by the user
//    */
//   const getUserCampaigns = async () => {
//     const allCampaigns = await getCampaigns();
//     return allCampaigns.filter(campaign => campaign.owner === address);
//   };

//   /**
//    * @dev Donate to a campaign
//    */
//   const donate = async (pId, amount) => {
//     try {
//       const tx = await contract.donateToCampaign(pId, {
//         value: ethers.utils.parseEther(amount)
//       });
//       await tx.wait();
//       console.log("Donation successful:", tx);
//     } catch (error) {
//       console.error("Error donating:", error);
//     }
//   };

//   /**
//    * @dev Get donations for a specific campaign
//    */
//   const getDonations = async (pId) => {
//     try {
//       const donations = await contract.getDonators(pId);
//       const numberOfDonations = donations[0].length;

//       return Array.from({ length: numberOfDonations }, (_, i) => ({
//         donator: donations[0][i],
//         donation: ethers.utils.formatEther(donations[1][i].toString())
//       }));
//     } catch (error) {
//       console.error("Error fetching donations:", error);
//       return [];
//     }
//   };

//   // Fetch number of campaigns
//   const getNumberOfCampaigns = async () => {
//     try {
//       const numberOfCampaigns = await contract.getNumberOfCampaigns();
//       return numberOfCampaigns.toNumber();
//     } catch (error) {
//       console.error("Error fetching number of campaigns:", error);
//       return 0;
//     }
//   };

//   // Function to get donations made by the connected user


//   // Assuming you're using ethers.js or web3.js for interacting with the smart contract

// const getUserDonations = async (userAddress) => {
//   try {
//       // Get the user's donation details from the smart contract
//       const donationDetails = await contract.getUserDonations(userAddress);

//       const campaignsData = await contract.getCampaigns();

//       console.log("Donation details:", donationDetails);
//       console.log("Campaigns data:", campaignsData);
      
//       const userDonations = donationDetails.map(donation => {
//           const campaign = campaignsData[donation.campaignId];
//           const totalDonated = donationDetails
//               .filter(d => d.campaignId === donation.campaignId)
//               .reduce((total, d) => total + parseFloat(ethers.utils.formatEther(d.amount)), 0);

//           return {
//               campaignTitle: campaign.title,
//               target: ethers.utils.formatEther(campaign.target),
//               imageUrl: campaign.image,
//               donations: donationDetails.filter(d => d.campaignId === donation.campaignId),
//               totalDonated,
//           };
//       });

//       return userDonations;
//   } catch (error) {
//       console.error("Error fetching user donations:", error);
//       return [];
//   }
// };


//   return (
//     <StateContext.Provider
//       value={{
//         address,
//         contract,
//         connectWallet,
//         createCampaign,
//         getCampaigns,
//         getUserCampaigns,
//         donate,
//         getDonations,
//         getNumberOfCampaigns,
//         getUserDonations,
//         disconnectWallet
//       }}
//     >
//       {children}
//     </StateContext.Provider>
//   );
// };

// /**
//  * @dev Custom hook to use the StateContext
//  */
// export const useStateContext = () => useContext(StateContext);

