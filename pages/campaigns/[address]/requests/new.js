import React, { useState } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import { getCampaignByAddress } from '../../../../ethereum/campaign';
import web3 from '../../../../ethereum/web3';
import { useRouter } from 'next/router';
import factory from '../../../../ethereum/factory';
import Link from 'next/link';

export default function RequestNewForm({ address }) {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [recipient, setRecipient] = useState('');
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
      const weiValue = web3.utils.toWei(value, 'ether');

      await campaign.methods.createRequest(description, weiValue, recipient).send({
        from: accounts[0],
      });
      router.push(`/campaigns/${address}/requests`);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Link href={`/campaigns/${address}/requests`}>
        <a>Back</a>
      </Link>

      <h3>Create a request</h3>
      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Description</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            type="text"
          />
        </Form.Field>
        <Form.Field>
          <label>Value in ETH</label>
          <Input value={value} onChange={(e) => setValue(e.target.value)} type="number" />
        </Form.Field>

        <Form.Field>
          <label>Recipient</label>
          <Input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            type="text"
          />
        </Form.Field>

        <Message error header="Oops!" content={errorMessage} />
        <Button primary loading={isLoading}>
          Send Request
        </Button>
      </Form>
    </>
  );
}

// If a page has dynamic routes,
// Next.js need to define a list of paths that have to be rendered to HTML at build time.
export async function getStaticPaths() {
  const addresses = await factory.methods.getDeployedCampaigns().call();

  // Get the paths we want to pre-render based on posts
  // 如果你的 [param] 叫 id，這邊回傳的時候 key 就要寫 id
  const paths = addresses.map((address) => ({
    params: { address },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { address } = params;

  return {
    props: {
      address,
    }, // will be passed to the page component as props
  };
}
