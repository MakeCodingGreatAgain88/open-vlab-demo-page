import React from 'react';
import { Layout, Menu } from 'antd';
import './Header.css';

const { Header: AntHeader } = Layout;

const Header: React.FC = React.memo(() => {
  const leftMenuItems = [
    { key: 'market', label: '市场' },
    { key: 'quote', label: '行情' },
    { key: 'volatility', label: '波动率' },
    { key: 'unusual', label: '异动' },
    { key: 'strategy', label: '策略' },
    { key: 'trade', label: '交易' },
    { key: 'education', label: '教学' },
    { key: 'community', label: '社区' },
  ];

  const rightMenuItems = [
    { key: 'waitlist', label: '等待列表' },
    { key: 'contact', label: '联系我们' },
    { key: 'invite', label: '邀请好友' },
    { key: 'profile', label: 'myProfile' },
  ];

  return (
    <AntHeader className="app-header">
      <div className="header-left">
        <div className="logo">OpenVLab</div>
        <Menu
          mode="horizontal"
          items={leftMenuItems}
          className="header-menu-left"
          selectable={false}
        />
      </div>
      <Menu
        mode="horizontal"
        items={rightMenuItems}
        className="header-menu-right"
        selectable={false}
      />
    </AntHeader>
  );
});

Header.displayName = 'Header';

export default Header;

