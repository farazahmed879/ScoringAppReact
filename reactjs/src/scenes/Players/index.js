import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Modal, Table, Dropdown, Menu, Row, Col, Collapse, Upload, Popover, Icon, Skeleton } from 'antd';
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
import { getBase64 } from '../../helper/getBase64';

// import './style.css';

//const { Option } = Select;
const baseUrl = 'http://localhost:21021';
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
  dob: null,
  fileName: '',
  profile:'',
  profileUrl:'',
  gallery: [],
};

const playerValidation = Yup.object().shape({
  name: Yup.string().required('Required'),
  gender: Yup.string().required('Required'),
  contact: Yup.string().required('Required').min(11, 'Contact must contain 12 numbers').max(11, 'Contact must contain 12 numbers'),
});

const success = Modal.success;
const error = Modal.error;
const { Panel } = Collapse;

const Player = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditDataLoading, setIsEditDataLoading] = useState(false);
  const [mode, setModalMode] = useState('');
  const [playerList, setPlayerList] = useState([]);
  const [picture, setPicture] = useState(false);
  const [preview, setPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [profile, setProfile] = useState([]);
  const [gallery, setGallery] = useState([]);
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
      profile: playerFormik.values.profile,
      profileUrl: playerFormik.values.profileUrl,
    };

    if (profile && profile[0]) {
      setPicture(false);
      playerObject['profile'] = { name: profile[0].name, blob: profile[0].thumbUrl, url: profile[0].url };
    } else {
      setPicture(true);
      return;
    }

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

  useEffect(() => {
    if (!isOpenModal) {
      playerFormik.setValues({});
      //setProfile([]);
    }
  }, [isOpenModal]);

  useEffect(() => {
    if (profile.length > 0) {
      setPicture(false);
    } else {
      setPicture(true);
    }
  }, [profile]);

  const handleUpload = ({ file, fileList }) => {
    setGallery(fileList);
  };

  const handleProfileUpload = ({ fileList }) => {
    setProfile(fileList);
    //console.log('profile', e.file);
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
    setIsEditDataLoading(true);
    setIsOpenModal(true);
    setModalMode('Edit Player');
    playerService.getPlayerById(item.id).then((res) => {
      if (res) {
        if (!res.success) {
          error({ title: res.successMessage })
          return;
        }
        setEditPlayer(res.result);
        console.log('player', res);
        playerFormik.setValues({
          ...playerFormik.values,
          ...res.result,
        });
        let obj = [];
        if (res.result.pictures)
        res.result.pictures.forEach((element) => {
          var ob = {
            key: element.id,
            name: element.name,
            uid: element.id,
            url: baseUrl + '/' + element.url,
          };
          obj.push(ob);
        });
      setGallery(obj);
      setProfile([{ key: res.result.id, name: res.result.name, uid: res.result.id, url: baseUrl + '/' + res.result.profileUrl }]);
      setIsEditDataLoading(false);
      }
    });
  };

  const addPlayer = () => {
    setProfile([]);
    setGallery([]);
    setIsOpenModal(true);
    setModalMode('Create Player');
  };

  const handleDeletePicture = () => {
    setProfile([]);
  };

  const handlePreviewCancel = () => setPreview(false);

  const handleTableChange = (e) => {
    setPagination({
      current: e.current,
      pageSize: e.pageSize,
    });

    getAll();
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreview(true);
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
      <CustomTable
        loading={loading}
        pagination={pagination}
        columns={columns}
        data={playerList}
        scroll={{ x: 1500 }}
        handleTableChange={handleTableChange}
      />
      <CustomModal
        title={Object.keys(editPlayer).length ? 'Edit Player' : 'Add Player'}
        isModalVisible={isOpenModal}
        handleCancel={() => {
          setIsOpenModal(false);
        }}
        handleSubmit={handleSubmit}
      >
        <Skeleton loading={isEditDataLoading}>
          <Form>
            <Row gutter={16}>
              <Col span={24}>
                <Popover content={!Object.keys(profile).length || <Icon type="delete" onClick={handleDeletePicture} />}>
                  <span style={{ color: '#C9236A', fontStyle: 'italic' }}>{picture ? 'Required' : ''}</span>
                  <Upload
                    multiple={false}
                    listType="picture-card"
                    accept=".png,.jpeg,.jpg"
                    fileList={profile}
                    type="FormFile"
                    stateKey="profile"
                    disabled={!!Object.keys(profile).length}
                    onChange={(e) => handleProfileUpload(e)}
                    beforeUpload={false}
                    onPreview={handlePreview}
                  >
                    Profile
                  </Upload>
                </Popover>
              </Col>
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
                  value={moment(playerFormik.values.dob)}
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
              <Col span={24}>
                <CustomInput
                  title="Team"
                  type="multiple"
                  options={teamList}
                  handleChange={handleChange}
                  value={playerFormik.values.teamIds}
                  stateKey="teamIds"
                  placeholder=""
                />
              </Col>
              <br />
              <Col span={24}>
                <Upload
                  className="Gallery"
                  beforeUpload={() => false}
                  onPreview={handlePreview}
                  value={playerFormik.values.gallery}
                  fileList={gallery}
                  multiple={true}
                  listType="picture-card"
                  onChange={(e) => handleUpload(e)}
                >
                  Gallery
                </Upload>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit" onClick={playerFormik.handleSubmit}>
                {/* {Object.keys(editPlayer).length ? 'Update' : 'Add'} */}
                {mode == 'Create Player' ? 'Add' : 'Update'}
              </Button>
              <Button htmlType="button" onClick={() => setIsOpenModal(false)}>
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Skeleton>
      </CustomModal>
      <PlayerStatsDrawer visible={visible} onClose={onClose} stats={playerStats} />
      <Modal visible={preview} footer={null} onCancel={handlePreviewCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Card>
  );
};

export default Player;
