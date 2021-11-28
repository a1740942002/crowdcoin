import React, { useState } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import { getCampaignByAddress } from '../ethereum/campaign';

export default function RequestRow({ request, address, index, id, approversCount }) {
  const { description, value, recipient, approvalCount, complete } = request;
  const ethValue = web3.utils.fromWei(value, 'ether');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onApprove = async () => {
    const campaign = getCampaignByAddress(address);
    const accounts = await web3.eth.getAccounts();

    try {
      setIsLoading(true);
      await campaign.methods.approveRequest(index).send({
        from: accounts[0],
      });
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
      window.location.reload();
    }
  };

  const onFinalize = async () => {
    const campaign = getCampaignByAddress(address);
    const accounts = await web3.eth.getAccounts();
    try {
      setIsLoading(true);
      await campaign.methods.finalizeRequest(index).send({
        from: accounts[0],
      });
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
      window.location.reload();
    }
  };

  return (
    <>
      <Table.Cell>{id}</Table.Cell>
      <Table.Cell>{description}</Table.Cell>
      <Table.Cell>{ethValue}</Table.Cell>
      <Table.Cell>{recipient}</Table.Cell>
      <Table.Cell>
        {approvalCount} / {approversCount}
      </Table.Cell>

      {complete ? (
        <>
          <Table.Cell>
            <Button>已完成</Button>
          </Table.Cell>
          <Table.Cell>
            <Button>已完成</Button>
          </Table.Cell>
        </>
      ) : (
        <>
          <Table.Cell>
            <Button loading={isLoading} color="green" basic onClick={onApprove}>
              Approve
            </Button>
          </Table.Cell>
          <Table.Cell>
            <Button loading={isLoading} color="blue" basic onClick={onFinalize}>
              Finalize
            </Button>
          </Table.Cell>
        </>
      )}
    </>
  );
}
