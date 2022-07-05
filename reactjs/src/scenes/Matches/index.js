import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Button, Card, Form, Modal, Table, Dropdown, Menu, Row, Col, Collapse, Divider, Icon, Popover, Upload, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import { L } from '../../lib/abpUtility';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import CustomModal from '../../components/Modal';
import CustomInput from '../../components/Input';
import matchService from '../../services/match/matchService';
import TeamService from '../../services/team/TeamService';
import playerService from '../../services/player/playerService';
import { matchTypes, eventStage } from '../../components/Enum/enum';
import GroundService from '../../services/ground/GroundService';
import FilterPanel from './filter-panel';
import EventService from '../../services/event/EventService';
import CustomTable from '../../components/Table';
import { getBase64 } from '../../helper/getBase64';
import matchTypeConst from '../../lib/matchTypeConst';

const baseUrl = 'http://localhost:21021';
const matchValidation = Yup.object().shape({
  team1Id: Yup.string().required('Required'),
  team2Id: Yup.string().required('Required'),
  matchTypeId: Yup.string().required('Required'),
});

const matchInitial = {
  id: 0,
  matchOvers: 0,
  matchDescription: '',
  season: 0,
  eventId: '',
  team1Id: null,
  team2Id: null,
  groundId: '',
  matchTypeId: '',
  eventType: '',
  eventStage: '',
  dateOfMatch: null,
  tossWinningTeam: '',
  playerOTM: '',
  group: 0,
};

const success = Modal.success;
const error = Modal.error;
const { Panel } = Collapse;

const Matches = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [matchList, setMatchList] = useState([]);
  // const [match, setPlayer] = useState(matchInitial);
  const [isEditDataLoading, setIsEditDataLoading] = useState(false);
  const [teamList, setTeamList] = useState([]);
  const [filterTeamList, setFilterTeamList] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groundList, setGroundList] = useState([]);
  const [playerList, setPlayerList] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [picture, setPicture] = useState(false);
  const [preview, setPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [profile, setProfile] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [editMatch, setEditMatch] = useState({});
  const [mode, setModalMode] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const handleSubmit = (e) => {
    if (!matchFormik.isValid) return;
    let req = {
      id: matchFormik.values.id,
      groundId: matchFormik.values.groundId,
      matchOvers: matchFormik.values.matchOvers,
      matchDescription: matchFormik.values.matchDescription,
      season: matchFormik.values.season,
      eventId: matchFormik.values.eventId,
      tossWinningTeam: matchFormik.values.tossWinningTeam,
      team1Id: matchFormik.values.team1Id,
      team2Id: matchFormik.values.team2Id,
      matchTypeId: matchFormik.values.matchTypeId,
      eventType: matchFormik.values.eventType,
      eventStage: matchFormik.values.eventStage,
      dateOfMatch: moment(matchFormik.values.dateOfMatch).valueOf(),
      playerOTM: matchFormik.values.playerOTM,
    };

    if (profile && profile[0]) {
      setPicture(false);
      req['profile'] = { name: profile[0].name, blob: profile[0].thumbUrl, url: profile[0].url };
    } else {
      setPicture(true);
      return;
    }

    console.log('Match Object', req);
    matchService.createOrUpdate(req).then((res) => {
      res.success ? success({ title: res.successMessage }) : error({ title: res.successMessage });
      setIsOpenModal(false);
      getAll();
      reset();
    });
  };

  const filterHandleSubmit = (event) => {
    getAll(event);
  };

  const matchFormik = useFormik({
    enableReinitialize: true,
    initialValues: matchInitial,
    validationSchema: matchValidation,
    onSubmit: handleSubmit,
  });

  const callback = (key) => {
    console.log(key);
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
  };

  useEffect(() => {
    getAllTeams();
    getAllGrounds();
  }, []);

  useEffect(() => {
    getAll();
  }, [pagination.current]);

  useEffect(() => {
    if (matchFormik.values.eventId) {
      matchFormik.setValues({ ...matchFormik.values, group: 0 });
      setTeamList([]);
      let currentEvent = eventList.filter((i) => i.id == matchFormik.values.eventId)[0];
      if (!currentEvent || !currentEvent.numberOfGroup || currentEvent.numberOfGroup <= 1) {
        getAllTeamsByEventId(matchFormik.values.eventId);
        setGroups([]);
        return;
      }
      calculateGruops(currentEvent.numberOfGroup);
    }
  }, [matchFormik.values.eventId]);

  useEffect(() => {
    if (matchFormik.values.group && matchFormik.values.group > 0) {
      getAllTeamsByEventId(matchFormik.values.eventId, matchFormik.values.group);
    }
  }, [matchFormik.values.group]);

  useEffect(() => {
    if (matchFormik.values.matchTypeId == matchTypeConst.friendly) {
      var obj = matchFormik.values;
      obj.eventId = '';
      obj.group = 0;
      matchFormik.setValues({ ...matchFormik.values, obj });
      setTeamList(filterTeamList);
    }
    if (matchFormik.values.matchTypeId == matchTypeConst.tournament || matchFormik.values.matchTypeId == matchTypeConst.series) {
      if (!matchFormik.values.event) {
        var a = matchFormik.values;
        a.team1Id = '';
        a.team2Id = '';
        matchFormik.setValues({ ...matchFormik.values, a });
      }
      getAllEvents();
      setTeamList([]);
    }
  }, [matchFormik.values.matchTypeId]);

  useEffect(() => {
    if (matchFormik.values.team1Id && matchFormik.values.team2Id) {
      AllPlayersByTeamIds();
    }
  }, [matchFormik.values.team1Id, matchFormik.values.team2Id]);

  const calculateGruops = (num) => {
    let group = [];
    for (let i = 1; i <= num; i++) {
      group.push({ id: i, name: i });
    }
    setGroups(group);

    console.log('groups', groups);
  };

  const getAll = (filter) => {
    setLoading(true);
    matchService
      .getPaginatedAll({
        maxResultCount: pagination.pageSize,
        skipCount: filter ? 0 : (pagination.current - 1) * pagination.pageSize,
        team1Id: filter ? filter.team1 : undefined,
        team2Id: filter ? filter.team2 : undefined,
        type: filter ? filter.type : undefined,
        groundId: filter ? filter.groundId : undefined,
        date: filter && filter.date ? moment(filter.date).valueOf() : undefined,
      })
      .then((res) => {
        console.log('Matches', res.items);
        setLoading(false);
        setMatchList(
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

  const getAllTeamsByEventId = (id, group) => {
    TeamService.getAllEventTeams(id, group).then((res) => {
      console.log('Event Teams', res);
      setTeamList(res);
    });
  };

  const getAllTeams = () => {
    TeamService.getAll().then((res) => {
      console.log('Teams', res);
      setFilterTeamList(res);
    });
  };

  const getAllGrounds = () => {
    GroundService.getAll().then((res) => {
      console.log('Grounds', res);
      setGroundList(res);
    });
  };

  const AllPlayersByTeamIds = () => {
    var teamIds = [];
    teamIds.push(matchFormik.values.team1Id);
    teamIds.push(matchFormik.values.team2Id);
    playerService.AllPlayersByTeamIds(teamIds).then((res) => {
      console.log('Players', res);
      setPlayerList(res);
    });
  };
  const getAllEvents = () => {
    EventService.getAll().then((res) => {
      console.log('eventList', res);
      setEventList(res);
    });
  };

  useEffect(() => {
    if (!isOpenModal) {
      matchFormik.setValues({});
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

  const handleChange = (value, key) => {
    matchFormik.setValues({ ...matchFormik.values, [key]: value });
  };

  const handleEditMatch = (item) => {
    setIsOpenModal(true);
    setModalMode('Edit Match');
    matchService.EditEventMatch(item.id).then((res) => {
      if (res) {
        if (!res.success) {
          error({ title: res.successMessage });
          return;
        }
        setEditMatch(res.result);
        matchFormik.setValues({
          ...matchFormik.values,
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
      }
    });
  };

  const addMatch = () => {
    setIsOpenModal(true);
    setProfile([]);
    setModalMode('Add Match');
  };

  const reset = () => {
    matchFormik.setValues({});
  };

  console.log('matchFormik', matchFormik.values);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreview(true);
  };

  const columns = [
    {
      title: 'Ground',
      width: 250,
      dataIndex: 'ground',
      key: 'name',
      fixed: 'left',
      render: (text, item) => {
        return item && item.ground ? item.ground : 'N/A';
      },
    },
    {
      title: 'Team 1',
      width: 250,
      dataIndex: 'team1',
      key: 'team1',
      fixed: 'left',
    },
    {
      title: 'Team 2',
      width: 250,
      dataIndex: 'team2',
      key: 'team2',
      fixed: 'left',
    },
    {
      title: 'Type',
      width: 250,
      key: 'type',
      dataIndex: 'matchType',
      render: (item) => {
        // return item && item.dateOfMatch ? moment(item.dateOfMatch).format('DD MMM YYYY') : 'N/A';
        return item ? matchTypes.filter((i) => i.id == item)[0].name : 'N/A';
      },
    },
    {
      title: 'Event',
      width: 250,
      key: 'eventName',
      dataIndex: 'eventName',
    },
    {
      title: 'Date',
      width: 250,
      dataIndex: 'date',
      key: 'date',
      render: (item) => {
        return moment(item).format('MM/DD/YYYY');
      },
    },
    {
      title: 'Scorecard',
      key: 'operation',
      width: 100,
      fixed: 'left',
      render: (text, item) => {
        return (
          <Link to={'/summary/' + item.id + '/team1/' + item.team1Id + '/team2/' + item.team2Id}>
            <div style={{ cursor: 'pointer' }}>
              <Icon type="calculator" />
            </div>
          </Link>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (text, item) => (
        <div>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                <Menu.Item onClick={() => handleEditMatch(item)}>{L('Edit')}</Menu.Item>
                <Menu.Item>{L('Delete')}</Menu.Item>
                <Menu.Item>
                  {' '}
                  <Link to={'/scoreCard/team1/' + item.team1Id + '/team2/' + item.team2Id + '/match/' + item.id}>{L('Add Score')}</Link>
                </Menu.Item>
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
  // console.log('matchFormik', matchFormik);

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px' }}>
        <h1>Manage Matches</h1>{' '}
        <Button type="primary" shape="round" icon="plus" onClick={() => addMatch()}>
          Add
        </Button>
      </div>

      <Collapse onChange={callback} style={{ marginBottom: '10px' }}>
        <Panel header="Advance Filters" key="1">
          <FilterPanel teams={filterTeamList} grounds={groundList} handleSubmit={filterHandleSubmit}></FilterPanel>
        </Panel>
      </Collapse>
      <CustomTable
        loading={loading}
        pagination={pagination}
        columns={columns}
        data={matchList}
        scroll={{ x: 1500 }}
        handleTableChange={handleTableChange}
      />
      <CustomModal
        title={Object.keys(editMatch).length ? 'Edit Match' : 'Add Match'}
        isModalVisible={isOpenModal}
        handleCancel={() => {
          setIsOpenModal(false);
        }}
      >
        <Skeleton loading={isEditDataLoading}>
          <Form className="form" onSubmit={matchFormik.handleSubmit}>
            <Row gutter={16} className="form-container">
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
              <Col span={8}>
                <CustomInput
                  title="Match Type"
                  type="select"
                  options={matchTypes}
                  handleChange={handleChange}
                  value={matchFormik.values.matchTypeId}
                  stateKey="matchTypeId"
                  placeholder="Select Type"
                  errorMessage={matchFormik.errors.matchTypeId}
                />
              </Col>
              <Col span={8}>
                {matchFormik.values.matchTypeId == 1 || matchFormik.values.matchTypeId == 2 ? (
                  <CustomInput
                    title="Event"
                    type="select"
                    handleChange={handleChange}
                    options={
                      matchFormik.values.id
                        ? eventList
                        : eventList.filter((i) => i.eventType == matchFormik.values.matchTypeId && i.tournamentType == 2)
                    }
                    value={matchFormik.values.eventId}
                    stateKey="eventId"
                    placeholder="Select Event"
                  />
                ) : null}
              </Col>
              <Col span={8}>
                {matchFormik.values.matchTypeId == 1 && matchFormik.values.eventId && groups.length > 0 ? (
                  <CustomInput
                    title="Group"
                    type="select"
                    handleChange={handleChange}
                    options={groups}
                    value={matchFormik.values.group}
                    stateKey="group"
                    placeholder="Select Group"
                  />
                ) : null}
              </Col>
            </Row>
            <Divider></Divider>
            <Row gutter={16} className="form-container">
              <Col span={12}>
                <CustomInput
                  title="Team 1"
                  type="select"
                  options={teamList.filter((i) => i.id != matchFormik.values.team2Id)}
                  handleChange={handleChange}
                  value={matchFormik.values.team1Id}
                  stateKey="team1Id"
                  placeholder="Select Team"
                  errorMessage={matchFormik.errors.team1Id}
                />
              </Col>
              <Col span={12}>
                <CustomInput
                  title="Team 2"
                  type="select"
                  options={teamList.filter((i) => i.id != matchFormik.values.team1Id)}
                  handleChange={handleChange}
                  value={matchFormik.values.team2Id}
                  stateKey="team2Id"
                  placeholder="Select Team"
                  errorMessage={matchFormik.errors.team2Id}
                />
              </Col>
            </Row>
            <Row gutter={16} className="form-container">
              <Col span={12}>
                <CustomInput
                  title="Ground"
                  type="select"
                  options={groundList}
                  handleChange={handleChange}
                  value={matchFormik.values.groundId}
                  stateKey="groundId"
                  placeholder="Select Ground"
                />
              </Col>
              <Col span={12}>
                <CustomInput
                  title="Date of Match"
                  type="datePicker"
                  handleChange={handleChange}
                  value={moment(matchFormik.values.dateOfMatch)}
                  stateKey="dateOfMatch"
                  placeholder="Select Date"
                />
              </Col>
            </Row>

            <Row gutter={16} className="form-container">
              <Col span={12}>
                <CustomInput
                  title="Season"
                  type="number"
                  handleChange={handleChange}
                  value={matchFormik.values.season}
                  stateKey="season"
                  placeholder="Optional"
                />
              </Col>
              <Col span={12}>
                <CustomInput
                  title="Overs"
                  type="number"
                  handleChange={handleChange}
                  value={matchFormik.values.matchOvers}
                  stateKey="matchOvers"
                  placeholder="Optional"
                />
              </Col>
            </Row>
            <Row gutter={16} className="form-container">
              <Col span={8}>
                {matchFormik.values.team1Id && matchFormik.values.team2Id ? (
                  <CustomInput
                    title="Toss Winning Team"
                    type="select"
                    handleChange={handleChange}
                    options={teamList.filter((i) => i.id == matchFormik.values.team1Id || i.id == matchFormik.values.team2Id)}
                    value={matchFormik.values.tossWinningTeam}
                    stateKey="tossWinningTeam"
                    placeholder="Select Team"
                  />
                ) : null}
              </Col>
              {matchFormik.values.team1Id && matchFormik.values.team2Id ? (
                <Col span={8}>
                  <CustomInput
                    title="Player Of the Match"
                    type="select"
                    handleChange={handleChange}
                    options={playerList}
                    value={matchFormik.values.playerOTM}
                    stateKey="playerOTM"
                    placeholder="Man of the match"
                  />
                </Col>
              ) : null}
            </Row>
            <Row gutter={16} className="form-container">
              <Col>
                <CustomInput
                  title="Description"
                  type="text"
                  handleChange={handleChange}
                  value={matchFormik.values.matchDescription}
                  stateKey="matchDescription"
                  placeholder="Optional"
                />
              </Col>
              <Col span={24}>
                <Upload
                  className="Gallery"
                  beforeUpload={() => false}
                  onPreview={handlePreview}
                  value={matchFormik.values.gallery}
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
              <Button type="primary" htmlType="submit" disabled={!matchFormik.isValid} onClick={matchFormik.handleSubmit}>
                {mode == 'Add Match' ? 'Add' : 'Update'}
              </Button>
              <Button htmlType="button" onClick={() => setIsOpenModal(false)}>
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Skeleton>
      </CustomModal>

      <Modal visible={preview} footer={null} onCancel={handlePreviewCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Card>
  );
};
export default Matches;
