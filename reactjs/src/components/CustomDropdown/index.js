import React from 'react';
import { Menu, Dropdown, Icon } from 'antd';
import { Link } from 'react-router-dom';

const CustomDropdown = ({ obj,editMatch }) => {

    const menuItems = (item) => {
        return <Menu>
            <Menu.Item>
                <div onClick={editMatch}>Edit</div>
            </Menu.Item>
            <Menu.Item>
                <Link to={'/scoreCard/team1/' + item.team1Id + '/team2/' + item.team2Id + '/match/' + item.id}>{'Add Score'}</Link>
            </Menu.Item>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                    Delete
                </a>
            </Menu.Item>
        </Menu>
    }

    return <Dropdown overlay={menuItems(obj)}>
        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            <Icon type="dash" />
        </a>
    </Dropdown>
}
export default CustomDropdown;