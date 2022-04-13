import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Button, Card, Form, Modal, Table, Dropdown, Menu, Row, Col } from 'antd';
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
import { matchType, eventStage } from '../../components/Enum/enum';
import GroundService from '../../services/ground/GroundService';
const matchValidation = Yup.object().shape({
  team1: Yup.string().required('Required'),
  team2: Yup.string().required('Required'),
  matchTypeId: Yup.string().required('Required'),
});

const matchInitial = {
  id: 0,
  matchOvers: 0,
  matchDescription: '',
  season: 0,
  eventId: '',
  team1Id: '',
  team2Id: '',
  groundId: '',
  matchTypeId: '',
  eventType: '',
  eventStage: '',
  dateOfMatch: '',
  tossWinningTeam: '',
  playerOTM: '',
};

const success = Modal.success;
const error = Modal.error;

const Matches = () => {
  const [maxResultCount] = useState(10);
  const [skipCount] = useState(0);
  const [filter] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [matchList, setMatchList] = useState([]);
  // const [match, setPlayer] = useState(matchInitial);
  const [teamList, setTeamList] = useState([]);
  const [groundList, setGroundList] = useState([]);
  const [playerList, setPlayerList] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [mode, setModalMode] = useState('');

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

    console.log('Match Object', req);
    matchService.createOrUpdate(req).then((res) => {
      res.success ? success({ title: res.successMessage }) : error({ title: res.successMessage });
      setIsOpenModal(false);
      getAll();
    });
  };

  const matchFormik = useFormik({
    enableReinitialize: true,
    initialValues: matchInitial,
    validationSchema: matchValidation,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    getAll();
  }, []);

  useEffect(() => {
    if (isOpenModal) {
      getAllTeams();
      getAllGrounds();
      getAllPlayers();
      getAllEvents();
    }
  }, [isOpenModal]);

  const getAll = () => {
    matchService.getPaginatedAll({ maxResultCount: maxResultCount, skipCount: skipCount, name: filter }).then((res) => {
      console.log('Matches', res.items);
      setMatchList(
        res.items.map((r) => ({
          ...r,
          key: r.id,
        }))
      );
    });
    //
  };

  const getAllTeams = () => {
    TeamService.getAll().then((res) => {
      console.log('Teams', res);
      setTeamList(res);
    });
  };

  const getAllGrounds = () => {
    GroundService.getAll().then((res) => {
      console.log('Grounds', res);
      setGroundList(res);
    });
  };

  const getAllPlayers = () => {
    playerService.getAll().then((res) => {
      console.log('Players', res);
      setPlayerList(res);
    });
  };
  const getAllEvents = () => {
    playerService.getAll().then((res) => {
      console.log('eventList', res);
      setEventList(res);
    });
  };

  const handleChange = (value, key) => {
    matchFormik.setValues({ ...matchFormik.values, [key]: value });
  };

  const editMatch = (item) => {
    setIsOpenModal(true);
    setModalMode('Edit Match');
    matchService.getMatchById(item.id).then((res) => {
      if (res) {
        matchFormik.setValues({
          ...matchFormik.values,
          ...res,
        });
        debugger
      }
    });
  };

  const addMatch = () => {
    setIsOpenModal(true);
    setModalMode('Add Match');
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
      dataIndex: 'matchType',
      render: (text, item) => {
        // return item && item.dateOfMatch ? moment(item.dateOfMatch).format('DD MMM YYYY') : 'N/A';
        return item && item.matchType ? matchType.filter((i) => i.id == item.matchType)[0].name : 'N/A';
      },
    },
    {
      title: 'Date',
      width: 250,
      dataIndex: 'date',
      render: (text, item) => {
        // return item && item.dateOfMatch ? moment(item.dateOfMatch).format('DD MMM YYYY') : 'N/A';
        return item && item.dateOfMatch ? moment(item.dateOfMatch).format('DD MMM YYYY') : 'N/A';
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
                <Menu.Item onClick={() => editMatch(item)}>{L('Edit')}</Menu.Item>
                <Menu.Item>{L('Delete')}</Menu.Item>
                <Menu.Item>
                  {' '}
                  <Link to={'/scoreCard/team1/' + item.team1Id + '/team2/' + item.team2Id + '/match/' + item.id}>{L('Score Card')}</Link>
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
  console.log('matchFormik', matchFormik);

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px' }}>
        <h1>Manage Matches</h1>{' '}
        <Button type="primary" shape="round" icon="plus" onClick={() => addMatch()}>
          Add
        </Button>
      </div>
      <Table columns={columns} dataSource={matchList} scroll={{ x: 1500, y: 1000 }} />

      <CustomModal
        title={mode}
        isModalVisible={isOpenModal}
        handleCancel={() => {
          setIsOpenModal(false);
        }}
      >
        <Form className="form" onSubmit={matchFormik.handleSubmit}>
          <Row gutter={16}>
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
          <Row gutter={16}>
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
                value={matchFormik.values.date}
                stateKey="datePicker"
                placeholder="Select Date"
              />
            </Col>
          </Row>

          <Row gutter={16}>
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
          <Row gutter={16}>
            <Col span={8}>
              <CustomInput
                title="Match Type"
                type="select"
                options={matchType}
                handleChange={handleChange}
                value={matchFormik.values.matchTypeId}
                stateKey="matchTypeId"
                placeholder="Select Type"
                errorMessage={matchFormik.errors.matchTypeId}
              />
            </Col>
            <Col span={8}>
              {matchFormik.values.matchTypeId == 2 ? (
                <CustomInput
                  title="Event"
                  type="select"
                  handleChange={handleChange}
                  options={eventList}
                  value={matchFormik.values.eventId}
                  stateKey="eventId"
                  placeholder="Select Event"
                />
              ) : null}
            </Col>
            <Col span={8}>
              {matchFormik.values.matchTypeId == 2 && matchFormik.values.eventId ? (
                <CustomInput
                  title="Event Stage"
                  type="select"
                  handleChange={handleChange}
                  options={eventStage}
                  value={matchFormik.values.eventStage}
                  stateKey="eventStage"
                  placeholder="Select Stage"
                />
              ) : null}
            </Col>
          </Row>
          <Row span={16}>
            <Col gutter={8}>
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
            <Col gutter={8}>
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
          </Row>
          <Row span={16}>
            <CustomInput
              title="Description"
              type="text"
              handleChange={handleChange}
              value={matchFormik.values.matchDescription}
              stateKey="matchDescription"
              placeholder="Optional"
            />
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {mode == 'Add Match' ? 'Add' : 'Update'}
            </Button>
            <Button htmlType="button" onClick={() => setIsOpenModal(false)}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </CustomModal>
    </Card>
  );
};
export default Matches;
