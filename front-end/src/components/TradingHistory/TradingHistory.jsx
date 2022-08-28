import React, { useState } from 'react';

import { LIST_TYPES } from '../../constants/trading.constants';
import { Table, Select } from 'antd';
import UserService from '../../services/user.service';
import { isEmpty } from 'lodash';
import Loader from '../NavBar/Loader';
import { useEffect } from 'react';

import './trading.styles.scss';

const TradingHistory = () => {
  // USESTATE
  const [data, setData] = useState(null);
  const [dataSource, setDataSource] = useState(data);

  useEffect(() => {
    const getData = async () => {
      const data = await UserService.getTradingHistory();
      setData(data.data);
      setDataSource(data.data);
    };
    getData();
  }, []);

  const columns = [
    {
      title: 'Customer ID / Fund ID',
      dataIndex: 'customerId',
      key: 'customerId',
    },
    {
      title: 'Starting Balance',
      dataIndex: 'startingBalance',
      key: 'startingBalance',
    },
    {
      title: 'Ending Balance',
      dataIndex: 'endingBalance',
      key: 'endingBalance',
    },
    {
      title: 'Transaction Amount',
      dataIndex: 'transactionAmount',
      key: 'transactionAmount',
    },
    {
      title: 'Transaction Type',
      key: 'transactionType',
      render: (_, { transactionType }) => {
        if (transactionType === 'WITHDRAWAL')
          return <h5 className="withdrawal-header">{transactionType}</h5>;
        return <h5 className="deposit-header">{transactionType}</h5>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
    },
  ];

  const onSelectTypeValue = (value) => {
    if (value) {
      const filteredData = dataSource.filter(
        (d) => d.transactionType === value
      );
      setData(filteredData);
    } else {
      setData(dataSource);
    }
  };

  if (isEmpty(data)) return <Loader />;

  return (
    <div>
      <div className="searching-container">
        <Select
          style={{ width: 200 }}
          placeholder="Status"
          allowClear
          onChange={(value) => onSelectTypeValue(value)}
        >
          {LIST_TYPES.map((type) => (
            <Select.Option key={type} value={type}>
              {type}
            </Select.Option>
          ))}
        </Select>
      </div>
      <Table columns={columns} dataSource={data} scroll={{ y: 240 }} />
    </div>
  );
};

export default TradingHistory;
