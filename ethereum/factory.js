import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x6C59c414e3Bc036E105ACF204D0993D0B1b8cCe2'
);

export default instance;
