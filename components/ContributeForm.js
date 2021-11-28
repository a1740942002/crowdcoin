import React, { useState } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import { getCampaignByAddress } from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { useRouter } from 'next/router';

export default function ContributeForm({ address }) {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const campaign = getCampaignByAddress(address);
    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(value, 'ether'),
      });
      router.push(`/campaigns/${address}`);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit} error={!!errorMessage}>
      <Form.Field>
        <h3>Amount to Contribue</h3>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          label="ETH"
          labelPosition="right"
          type="number"
        />
      </Form.Field>
      <Message error header="Oops!" content={errorMessage} />
      <Button primary loading={isLoading}>
        Contribute
      </Button>
    </Form>
  );
}
