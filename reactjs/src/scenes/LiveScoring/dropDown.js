import { Button, Dropdown, Icon, Menu } from 'antd';
import React, { useState } from 'react';

const DropDown = ({ options = [], title = '', handleMenuClick }) => {
  const menu = () => (
    <Menu onClick={handleMenuClick}>
      {options.map((el, index) => (
        <Menu.Item value={el.id} key={index}>
          {el.name}
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <Dropdown overlay={menu} onChange>
      <Button style={{ margin: '10px', height: '60px', width: '60px' }}>
        {title} <Icon type="down" />
      </Button>
    </Dropdown>
  );
};
export default DropDown;
