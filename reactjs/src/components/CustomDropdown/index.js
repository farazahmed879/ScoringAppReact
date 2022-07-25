import React from 'react';
import { Menu, Dropdown, Icon } from 'antd';

const items = (
    <Menu>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                1st menu item
            </a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                2nd menu item
            </a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                3rd menu item
            </a>
        </Menu.Item>
    </Menu>
);

const CustomDropdown = () => {
    return <Dropdown overlay={items}>
        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            Hover me <Icon type="down" />
        </a>
    </Dropdown>
}
export default CustomDropdown;