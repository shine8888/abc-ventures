import React, { useState, useEffect } from 'react';
import { Button, Menu, Typography, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import {
  MoneyCollectOutlined,
  FundOutlined,
  MenuOutlined,
  DollarOutlined,
  TrademarkCircleOutlined,
} from '@ant-design/icons';
import icon from '../..//images/aave-logo-icon-ghost.png';

const Navbar = () => {
  // USESTATE
  const [activeMenu, setActiveMenu] = useState(true);
  const [screenSize, setScreenSize] = useState(null);

  // USEEFFECT
  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (screenSize < 800) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  return (
    <div className="nav-container">
      <div className="logo-container">
        <Avatar src={icon} size="large" />
        <Typography.Title level={2} className="logo">
          <Link to="/" style={{ color: '#fff', fontSize: 16 }}>
            ABC Ventures
          </Link>
        </Typography.Title>
        <Button
          className="menu-control-container"
          onClick={() => setActiveMenu(!activeMenu)}
        >
          <MenuOutlined />
        </Button>
      </div>

      {activeMenu && (
        <Menu theme="dark" style={{ backgroundColor: '#2ebac6' }}>
          <Menu.Item icon={<FundOutlined />}>
            <Link to="/balance-tables" style={{ color: '#fff' }}>
              Add Fund Balances
            </Link>
          </Menu.Item>
          <Menu.Item icon={<TrademarkCircleOutlined />}>
            <Link to="/fund-allocations" style={{ color: '#fff' }}>
              Fund Allocations
            </Link>
          </Menu.Item>
          <Menu.Item icon={<DollarOutlined />}>
            <Link to="/trading-history" style={{ color: '#fff' }}>
              Trading History
            </Link>
          </Menu.Item>
          <Menu.Item icon={<MoneyCollectOutlined />}>
            <Link to="/customer-investment" style={{ color: '#fff' }}>
              Customer Investment
            </Link>
          </Menu.Item>
        </Menu>
      )}
    </div>
  );
};

export default Navbar;
