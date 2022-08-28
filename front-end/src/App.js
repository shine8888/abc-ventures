import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Navbar } from './components';
import { Layout } from 'antd';
import './App.css';
import TradingHistory from './components/TradingHistory/TradingHistory';
import CustomerInvestmentFunds from './components/InvestmentFunds/CustomerInvestmentFunds';
import BalanceTables from './components/FundManagement/BalanceTables';
import FundAllocation from './components/FundManagement/FundAllocation';

const App = () => {
  return (
    <div className="app">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="main">
        <Layout style={{ backgroundColor: '#e6fffd', height: '100%' }}>
          <div className="routes">
            <Switch>
              <Route exact path="/trading-history">
                <TradingHistory />
              </Route>
              <Route exact path="/customer-investment">
                <CustomerInvestmentFunds />
              </Route>
              <Route exact path="/balance-tables">
                <BalanceTables />
              </Route>
              <Route exact path="/fund-allocations">
                <FundAllocation />
              </Route>
            </Switch>
          </div>
        </Layout>
      </div>
    </div>
  );
};

export default App;
