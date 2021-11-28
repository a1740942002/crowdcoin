const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
  'unfold rifle thank long design emerge attitude second match pepper wire earn',
  'https://rinkeby.infura.io/v3/e8f885e31d304914bb5401cf66ccd9df'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: '1000000', from: accounts[0], gasPrice: '5000000000' });

  console.log('Contract deployed to', result.options.address);
};
deploy();
