import React, { useState } from 'react';

import { Table } from 'antd';
import UserService from '../../services/user.service';
import { isEmpty } from 'lodash';
import Loader from '../NavBar/Loader';
import { useEffect } from 'react';

const InvestmentFunds = () => {
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
      title: 'Fund Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Min Investment Amount',
      dataIndex: 'minInvestAmount',
      key: 'minInvestAmount',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Investment Balance',
      dataIndex: 'investmentBalance',
      key: 'investmentBalance',
    },
    {
      title: 'customerId',
      key: 'transactionType',
      render: (_, { transactionType }) => {
        if (transactionType === 'WITHDRAWAL')
          return <h5 className="withdrawal-header">{transactionType}</h5>;
        return <h5 className="deposit-header">{transactionType}</h5>;
      },
    },
  ];

  if (isEmpty(data)) return <Loader />;

  return <Table columns={columns} dataSource={data} scroll={{ y: 240 }} />;
};

export default InvestmentFunds;
