import React, { useState, useEffect, useMemo } from 'react';

import { Input, Button, Select, message } from 'antd';
import UserService from '../../services/user.service';

const Option = Select.Option;

const FundAllocation = () => {
  const [listFunds, setListFunds] = useState(null);
  // const [listUser, setListUsers] = useState(null);
  const [sendingFundAddress, setSendingFundAddress] = useState(null);
  const [recipientFundAddress, setRecipientFundAddress] = useState(null);
  const [allocationValue, setAllocationValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const data = await UserService.getListFunds();
      // const users = await UserService.getListUsers();

      setListFunds(data.data);
      // setListUsers(users.data);
    };
    getData();
  }, []);

  // USEMEMO
  const isValidSendingAmount = useMemo(() => {
    if (
      allocationValue <= 0 ||
      allocationValue > maxValue ||
      sendingFundAddress === recipientFundAddress
    )
      return false;

    return true;
  }, [maxValue, allocationValue, sendingFundAddress, recipientFundAddress]);

  const onSetSendingValue = (value) => setAllocationValue(value);

  const onSelectValue = (value, isSender) => {
    if (isSender) {
      setSendingFundAddress(value);
      setMaxValue(
        listFunds?.find(({ _id, name }) => {
          return _id === value;
        }).investmentBalance || 0
      );
    } else {
      setRecipientFundAddress(value);
    }
  };

  const onAllocateFundBalances = async ({
    sendingFundAddress,
    recipientFundAddress,
    allocationValue,
  }) => {
    const result = await UserService.allocateBalancesBetweenFunds({
      sendingFundAddress,
      recipientFundAddress,
      amount: allocationValue,
    });

    if (result.status === 200 || result.status === 201)
      message.success('Allocate funds success ');
  };

  const listOfYourTokens = (isSender) => (
    <>
      {isSender && (
        <Button
          style={{ marginLeft: 0 }}
          type="primary"
          onClick={() => onSetSendingValue(maxValue)}
        >
          Max
        </Button>
      )}
      <Select
        showSearch
        style={{ width: 200 }}
        onChange={(value) => onSelectValue(value, isSender)}
        placeholder="Select Fund Names"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        filterSort={(optionA, optionB) =>
          optionA.children
            .toLowerCase()
            .localeCompare(optionB.children.toLowerCase())
        }
      >
        {listFunds?.map(({ _id, name }) => (
          <Option key={_id} value={_id}>
            {name}
          </Option>
        ))}
      </Select>
    </>
  );

  return (
    <div>
      <div className="sending-container">
        <h3>Allocate Balances Between Funds</h3>
        <span>From</span>
        <Input
          addonAfter={listOfYourTokens(true)}
          placeholder="Amount"
          width={200}
          onChange={(e) => setAllocationValue(e.target.value)}
          defaultValue={allocationValue}
          value={allocationValue}
          allowClear
        />
        <span>To</span>

        <Input
          addonAfter={listOfYourTokens(false)}
          placeholder="Fund Address"
          width={200}
          value={recipientFundAddress}
          allowClear
        />
        {isValidSendingAmount ? (
          <Button
            type="primary"
            style={{ left: '40%', marginTop: 5 }}
            onClick={() =>
              onAllocateFundBalances({
                sendingFundAddress,
                recipientFundAddress,
                allocationValue,
              })
            }
          >
            Sending
          </Button>
        ) : (
          <Button type="primary" style={{ left: '40%', marginTop: 5 }} disabled>
            Sending
          </Button>
        )}
      </div>
    </div>
  );
};

export default FundAllocation;
