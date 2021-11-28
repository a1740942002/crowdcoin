import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import Link from 'next/link';

export default function CampaignIndex({ campaigns }) {
  const items = campaigns.map((address) => {
    return {
      header: address,
      description: (
        <Link href={`/campaigns/${address}`}>
          <a>View Campaign</a>
        </Link>
      ),
      fluid: true,
    };
  });

  return (
    <>
      <h3>Open Campaigns</h3>
      <Link href="/campaigns/new">
        <a>
          <Button floated="right" content="Create Campaign" icon="add circle" primary />
        </a>
      </Link>
      <Card.Group items={items} />
    </>
  );
}

export async function getStaticProps(context) {
  const campaigns = await factory.methods.getDeployedCampaigns().call();

  return {
    props: { campaigns }, // will be passed to the page component as props
  };
}
