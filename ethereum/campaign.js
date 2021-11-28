import web3 from './web3';
import Campaign from './build/Campaign.json';

export const getCampaignByAddress = (address) => {
  const campaign = new web3.eth.Contract(JSON.parse(Campaign.interface), address);
  return campaign;
};
