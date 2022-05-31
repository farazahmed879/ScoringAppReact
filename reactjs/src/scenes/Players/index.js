import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Modal, Table, Dropdown, Menu, Row, Col, Collapse } from 'antd';
import { L } from '../../lib/abpUtility';
import playerService from '../../services/player/playerService';
import CustomModal from '../../components/Modal';
import { Link } from 'react-router-dom';
import { battingStyleOptions, bowlingStyleOptions, genderOptions, playingRoleOptions } from '../../components/Enum/enum';
import CustomInput from '../../components/Input';
//import { CreateOrUpdatePlayerDto } from '../../services/player/dto/CreateOrUpdatePlayerDto';
import moment from 'moment';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TeamService from '../../services/team/TeamService';
import FilterPanel from './filter-panel';
import PlayerStatsDrawer from './player-stats-drawer';
import CustomTable from '../../components/Table';

//const { Option } = Select;
const playerInitial = {
  id: 0,
  name: '',
  contact: '',
  gender: 2,
  address: '',
  cnic: '',
  battingStyleId: 0,
  bowlingStyleId: 0,
  playingRoleId: 0,
  teamIds: [],
  dob: Date(),
  fileName: '',
};

const playerValidation = Yup.object().shape({
  name: Yup.string().required('Required'),
  gender: Yup.string().required('Required'),
  contact: Yup.string().required('Required').min(11, "Contact must contain 12 numbers").max(11, "Contact must contain 12 numbers"),
});

const success = Modal.success;
const error = Modal.error;
const { Panel } = Collapse;

const Player = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [playerList, setPlayerList] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [visible, setIsSetDrawerVisible] = useState(false);
  const [editPlayer, setEditPlayer] = useState({});
  const [playerStats, setPlayerStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const callback = (key) => {
    console.log(key);
  };

  const handleSubmit = () => {
    if (!playerFormik.isValid) return;
    let playerObject = {
      id: playerFormik.values.id || 0,
      name: playerFormik.values.name,
      address: playerFormik.values.address,
      cnic: playerFormik.values.cnic,
      contact: playerFormik.values.contact,
      dob: moment(playerFormik.values.dob).valueOf(),
      gender: playerFormik.values.gender,
      playerRoleId: playerFormik.values.playingRoleId,
      battingStyleId: playerFormik.values.battingStyleId,
      bowlingStyleId: playerFormik.values.bowlingStyleId,
      isDeactivated: false,
      isGuestOrRegisterd: 'Registered',
      teamIds: playerFormik.values.teamIds,
      fileName: playerFormik.values.fileName,
    };

    console.log('Player Object', playerObject);
    playerService.createOrUpdate(playerObject).then((res) => {
      res.success ? success({ title: res.successMessage }) : error({ title: res.successMessage });
      setIsOpenModal(false);
      getAll();
    });
  };

  const playerFormik = useFormik({
    enableReinitialize: true,
    initialValues: playerInitial,
    validationSchema: playerValidation,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    //getAll();
    getAllTeams();
  }, []);

  useEffect(() => {
    getAll();
  }, [pagination.current]);

  // useEffect(() => {
  //   if (isOpenModal) getAllTeams();
  // }, [isOpenModal]);

  const filterHandleSubmit = (event) => {
    getAll(event);
  };
  const getAll = (filter) => {
    setLoading(true);
    playerService
      .getPaginatedAll({
        maxResultCount: pagination.pageSize,
        skipCount: filter ? 0 : (pagination.current - 1) * pagination.pageSize,
        name: filter ? filter.name : undefined,
        teamId: filter ? filter.teamId : undefined,
        playingRole: filter ? filter.playingRole : undefined,
        battingStyle: filter ? filter.battingStyle : undefined,
        bowlingStyle: filter ? filter.bowlingStyle : undefined,
        contact: filter ? filter.contact : undefined,
      })
      .then((res) => {
        console.log('Players', res.items);
        setLoading(false);
        setPlayerList(
          res.items.map((r) => ({
            ...r,
            key: r.id,
          }))
        );
        setPagination({
          ...pagination,
          total: res.totalCount,
        });
      });
    //
  };

  const getAllTeams = () => {
    TeamService.getAll().then((res) => {
      console.log('Teams', res);
      setTeamList(res);
    });
  };

  const playerStatistics = (id) => {
    let req = {
      playerId: id,
    };
    playerService.playerStatistics(req).then((res) => {
      console.log('setPlayerStats', res);
      setPlayerStats(res);
    });
  };

  const handleChange = (value, key) => {
    playerFormik.setValues({ ...playerFormik.values, [key]: value });
  };

  const handleChangeDatePicker = (date, dateString) => {
    //setPlayer({ ...player, dob: date });
  };

  const onClose = () => {
    setIsSetDrawerVisible(false);
  };

  const viewPlayerProfile = (item) => {
    playerStatistics(item.id);
    setIsSetDrawerVisible(true);
  };

  const handleEditPlayer = (item) => {
    setIsOpenModal(true);
    playerService.getPlayerById(item.id).then((res) => {
      if (res) {
        setEditPlayer(res);
        console.log('player', res);
        playerFormik.setValues({
          ...playerFormik.values,
          ...res,
        });
      }
    });
  };

  const addPlayer = () => {
    setIsOpenModal(true);
  };

  const handleTableChange = (e) => {
    setPagination({
      current: e.current,
      pageSize: e.pageSize,
    });

    getAll();
  };

  const columns = [
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
                <Menu.Item>{L('Delete')}</Menu.Item>
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

  console.log('validations', playerFormik);

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px' }}>
        <h1>Manage Players</h1>{' '}
        <Button type="primary" shape="round" icon="plus" onClick={addPlayer}>
          Add
        </Button>
      </div>
      <Collapse onChange={callback} style={{ marginBottom: '10px' }}>
        <Panel header="Advance Filters" key="1">
          <FilterPanel teams={teamList} handleSubmit={filterHandleSubmit}></FilterPanel>
        </Panel>
      </Collapse>
      <CustomTable loading={loading} pagination={pagination} columns={columns} data={playerList} scroll={{ x: 1500 }} handleTableChange={handleTableChange} />
      <CustomModal
        title={Object.keys(editPlayer).length ? 'Edit Player' : 'Add Player'}
        isModalVisible={isOpenModal}
        handleCancel={() => {
          setIsOpenModal(false);
        }}
        handleSubmit={handleSubmit}
      >
        <Form>
          <Row gutter={16}>
            <Col span={12}>
              <CustomInput
                title="Name"
                type="text"
                handleChange={handleChange}
                value={playerFormik.values.name}
                stateKey="name"
                placeholder=""
                errorMessage={playerFormik.errors.name}
              />
            </Col>
            <Col span={12}>
              <CustomInput
                title="Gender"
                type="select"
                options={genderOptions}
                handleChange={handleChange}
                value={playerFormik.values.gender}
                stateKey="gender"
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <CustomInput
                title="Player Role"
                type="select"
                options={playingRoleOptions}
                handleChange={handleChange}
                value={playerFormik.values.playingRoleId}
                stateKey="playingRoleId"
                placeholder=""
              />
            </Col>
            <Col span={8}>
              <CustomInput
                title="Batting Style"
                type="select"
                options={battingStyleOptions}
                handleChange={handleChange}
                value={playerFormik.values.battingStyleId}
                stateKey="battingStyleId"
                placeholder=""
              />
            </Col>
            <Col span={8}>
              <CustomInput
                title="Bowling Style"
                type="select"
                options={bowlingStyleOptions}
                handleChange={handleChange}
                value={playerFormik.values.bowlingStyleId}
                stateKey="bowlingStyleId"
                placeholder=""
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <CustomInput
                title="Contact"
                type="number"
                handleChange={handleChange}
                value={playerFormik.values.contact}
                stateKey="contact"
                placeholder=""
                errorMessage={playerFormik.errors.contact}
              />
            </Col>
            <Col span={8}>
              <CustomInput title="Cnic" type="text" handleChange={handleChange} value={playerFormik.values.cnic} stateKey="cnic" placeholder="" />
            </Col>
            <Col span={8}>
              <CustomInput
                title="Birth"
                type="datePicker"
                handleChange={handleChangeDatePicker}
                value={playerFormik.values.dob}
                stateKey="dob"
                placeholder=""
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <CustomInput
                title="Address"
                type="text"
                handleChange={handleChange}
                value={playerFormik.values.address}
                stateKey="address"
                placeholder=""
              />
            </Col>
          </Row>

          <CustomInput
            title="Team"
            type="multiple"
            options={teamList}
            handleChange={handleChange}
            value={playerFormik.values.teamIds}
            stateKey="teamIds"
            placeholder=""
          />

          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={playerFormik.handleSubmit}>
              {Object.keys(editPlayer).length ? 'Update' : 'Add'}
            </Button>
            <Button htmlType="button" onClick={() => setIsOpenModal(false)}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </CustomModal>
      <PlayerStatsDrawer visible={visible} onClose={onClose} stats={playerStats} />
    </Card>
  );
};

export default Player;
