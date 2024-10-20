// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CrowdFunding {
    struct DonationDetail {
        uint256 campaignId;
        uint256 amount;
        uint256 timestamp;
    }

    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
        uint256[] timestamps;
    }

    // Track all donations for each user
    mapping(address => DonationDetail[]) public userDonations;

    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns = 0;

    // Create a new campaign
    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        require(_deadline > block.timestamp, "The deadline should be a date in the future.");

        // Initialize the campaign with proper array allocations
        campaigns[numberOfCampaigns] = Campaign({
            owner: _owner,
            title: _title,
            description: _description,
            target: _target,
            deadline: _deadline,
            amountCollected: 0,
            image: _image,
            donators: new address[](0), // Initialize as an empty array
            donations: new uint256[](0), // Initialize as an empty array
            timestamps: new uint256[](0)  // Initialize as an empty array
        });

        numberOfCampaigns++;
        return numberOfCampaigns - 1;
    }

    // Donate to a campaign
    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;
        Campaign storage campaign = campaigns[_id];

        require(block.timestamp < campaign.deadline, "Campaign has ended.");

        // Record donation details in the campaign
        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);
        campaign.timestamps.push(block.timestamp);

        // Track the user's donation
        userDonations[msg.sender].push(DonationDetail({
            campaignId: _id,
            amount: amount,
            timestamp: block.timestamp
        }));

        // Transfer the donation amount to the campaign owner
        (bool sent, ) = payable(campaign.owner).call{value: amount}("");
        require(sent, "Failed to transfer donation.");

        campaign.amountCollected += amount;
    }

    // Retrieve all donations made by a user across campaigns
    function getUserDonations(address _user) 
        public 
        view 
        returns (DonationDetail[] memory) 
    {
        return userDonations[_user];
    }

    // Retrieve campaigns
    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            allCampaigns[i] = campaigns[i];
        }

        return allCampaigns;
    }

    // Get donators and donations for a specific campaign
    function getDonators(uint256 _id) 
        public 
        view 
        returns (address[] memory, uint256[] memory, uint256[] memory) 
    {
        Campaign storage campaign = campaigns[_id];
        return (campaign.donators, campaign.donations, campaign.timestamps);
    }

    function getNumberOfCampaigns() public view returns (uint256) {
        return numberOfCampaigns;
    }
}
