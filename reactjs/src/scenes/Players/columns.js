import { Button, Dropdown, Menu } from 'antd';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import { battingStyleOptions, bowlingStyleOptions, playingRoleOptions } from '../../components/Enum/enum';
import { L } from '../../lib/abpUtility';
const PlayerColumns = ({ handleEditPlayer, handleDeletePlayer, viewPlayerProfile }) => {
  return [
    {
      title: 'Full Name',
      width: 250,
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      render: (text, item) => {
        return (
          <div>
            <Link to={'/playerProfile/' + item.id}>{item.name}</Link>
          </div>
        );
      },
    },
    {
      title: 'Team',
      width: 250,
      dataIndex: 'teams',
      fixed: 'left',
      render: (text, item) => {
        if (item && item.teams) {
          Array.from(Array(item.teams), (e, index) => {
            return <div>{e.title}</div>;
          });
        }
      },
    },
    {
      title: 'Contact',
      width: 250,
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: 'Birth',
      width: 250,
      dataIndex: 'dob',
      key: 'dob',
      render: (item) => {
        return moment(item).format('MM/DD/YYYY');
      },
    },
    {
      title: 'Playing Role',
      width: 250,
      dataIndex: 'playerRoleId',
      key: 'playerRoleId',
      render: (text, item) => {
        return text > 0 ? playingRoleOptions.filter((i) => i.id == text)[0].name : 'N/A';
      },
    },
    {
      title: 'Batting Style',
      width: 250,
      dataIndex: 'battingStyleId',
      key: 'battingStyleId',
      render: (text, item) => {
        return text > 0 ? battingStyleOptions.filter((i) => i.id == text)[0].name : 'N/A';
      },
    },
    {
      title: 'Bowling Style',
      width: 250,
      dataIndex: 'bowlingStyleId',
      key: 'bowlingStyleId',
      render: (text, item) => {
        return text > 0 ? bowlingStyleOptions.filter((i) => i.id == text)[0].name : 'N/A';
      },
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (text, item) => (
        <div>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                <Menu.Item onClick={(e) => handleEditPlayer(item)}>{L('Edit')}</Menu.Item>
                <Menu.Item onClick={(e) => handleDeletePlayer(item)}>{L('Delete')}</Menu.Item>
                <Menu.Item onClick={(e) => viewPlayerProfile(item)}>{L('Profile')}</Menu.Item>
              </Menu>
            }
            placement="bottomLeft"
          >
            <Button type="primary" icon="setting">
              {L('Actions')}
            </Button>
          </Dropdown>
        </div>
      ),
    },
  ];
};
export default PlayerColumns;
