import React from 'react';
import factory from '../../../../ethereum/factory';
import { getCampaignByAddress } from '../../../../ethereum/campaign';
import { Button, Table } from 'semantic-ui-react';
import Link from 'next/link';
import RequestRow from '../../../../components/RequestRow';

export default function RequestsPage({ requests, address, approversCount }) {
  return (
    <div>
      <Link href={`/campaigns/${address}`}>
        <a href="">Back</a>
      </Link>

      <h3>Requests</h3>
      <Link href={`/campaigns/${address}/requests/new`}>
        <a>
          <Button floated="right" primary style={{ marginBottom: '10px' }}>
            Add Request
          </Button>
        </a>
      </Link>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Recipient</Table.HeaderCell>
            <Table.HeaderCell>Approval Count</Table.HeaderCell>
            <Table.HeaderCell>Approve</Table.HeaderCell>
            <Table.HeaderCell>Finalize</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {requests.map((request, index) => {
            return (
              <Table.Row key={index}>
                <RequestRow
                  key={index}
                  index={index}
                  id={index + 1}
                  request={request}
                  address={address}
                  approversCount={approversCount}
                />
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
      <div style={{ textAlign: 'center' }}>Found {requests.length} requests.</div>
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

  // 會取回一個字串，要小心
  const requestsCount = await campaign.methods.getRequestsCount().call();
  const approversCount = await campaign.methods.approversCount().call();

  const result = await Promise.all(
    Array(parseInt(requestsCount))
      .fill()
      .map((element, idx) => {
        // element 會是 undefined，只是填充物而已
        return campaign.methods.requests(idx).call();
      })
  );

  const requests = result.map((request) => {
    const { description, value, recipient, complete, approvalCount } = request;
    return { description, value, recipient, complete, approvalCount };
  });

  return {
    props: {
      requests,
      address,
      approversCount,
    }, // will be passed to the page component as props
  };
}
