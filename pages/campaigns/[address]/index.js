import React from 'react';
import { useRouter } from 'next/router';
import factory from '../../../ethereum/factory';
import { getCampaignByAddress } from '../../../ethereum/campaign';
import { Card, Grid, Button } from 'semantic-ui-react';
import web3 from '../../../ethereum/web3';
import ContributeForm from '../../../components/ContributeForm';
import Link from 'next/link';

export default function CampaignShow({
  minimumContribution,
  balance,
  requestsCount,
  approversCount,
  manager,
}) {
  const router = useRouter();
  const { address } = router.query;

  const items = [
    { header: manager, meta: 'Manager', style: { overflowWrap: 'break-word' }, key: 0 },
    {
      header: requestsCount,
      meta: 'Numbers of Requests',
      style: { overflowWrap: 'break-word' },
      key: 1,
    },
    {
      header: web3.utils.fromWei(minimumContribution, 'ether'),
      meta: 'Minimum Contribution ( ETH )',
      style: { overflowWrap: 'break-word' },
      key: 2,
    },
    {
      header: approversCount,
      meta: 'Numbers of Approvers',
      description: 'Numbers of people who already donated to this campaign.',
      style: { overflowWrap: 'break-word' },
      key: 3,
    },
    {
      header: web3.utils.fromWei(balance, 'ether'),
      meta: 'Campaign Balance ( ETH )',
      style: { overflowWrap: 'break-word' },
      key: 4,
    },
  ];

  return (
    <div>
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <h3>Campaign Show : {address}</h3>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={10}>
            <Card.Group items={items} />
          </Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm address={address} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${address}/requests`}>
              <a>
                <Button primary>View Requests</Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
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
  const campaign = await getCampaignByAddress(address);
  const result = await campaign.methods.getSummary().call();

  return {
    props: {
      minimumContribution: result[0],
      balance: result[1],
      requestsCount: result[2],
      approversCount: result[3],
      manager: result[4],
    }, // will be passed to the page component as props
  };
}
