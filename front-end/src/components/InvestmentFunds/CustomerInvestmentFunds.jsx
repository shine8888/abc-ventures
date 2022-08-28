import React, { useState } from 'react';

import { Table } from 'antd';
import UserService from '../../services/user.service';
import { isEmpty } from 'lodash';
import Loader from '../NavBar/Loader';
import { useEffect } from 'react';

const CustomerInvestmentFunds = () => {
  // USESTATE
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const data = await UserService.getCustomerInvestmentDetails();
      setData(data.data);
    };
    getData();
  }, []);

  const columns = [
    {
      title: 'Customer ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Customer Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Account Wallet Amount',
      dataIndex: 'accountWalletAmount',
      key: 'accountWalletAmount',
    },
    {
      title: 'List Customer Investment Funds',
      key: 'funds',
      dataIndex: 'funds',
      render: (_, { funds }) => {
        return funds.map(({ name, investmentBalance }) => {
          return (
            <h5>
              Fund Name: {name} - Amount: {investmentBalance}
            </h5>
          );
        });
      },
    },
  ];

  if (isEmpty(data)) return <Loader />;

  return <Table columns={columns} dataSource={data} scroll={{ y: 240 }} />;
};

export default CustomerInvestmentFunds;
