import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';

export default function NewPage() {
  const [minimumContribution, setMinimumContribution] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const accounts = await web3.eth.getAccounts();
    try {
      setIsLoading(true);
      await factory.methods.createCampaign(minimumContribution).send({
        from: accounts[0],
      });
      router.push('/');
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h3>Create a Campaign</h3>
      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Minimun Contribution</label>
          <Input
            value={minimumContribution}
            onChange={(e) => setMinimumContribution(e.target.value)}
            label="wei"
            type="number"
            labelPosition="right"
            placeholder="200,000,000"
          />
        </Form.Field>
        <Message error header="Oops!" content={errorMessage} />
        <Button primary loading={isLoading}>
          Create
        </Button>
      </Form>
    </>
  );
}
