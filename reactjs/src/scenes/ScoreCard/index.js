import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Modal, Table, Dropdown, Menu, Row, Tabs, Divider, Drawer, Col, DatePicker, Input, Space } from 'antd';
import { L } from '../../lib/abpUtility';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import CustomModal from '../../components/Modal';
import CustomInput from '../../components/Input';
import matchService from '../../services/match/matchService';
import TeamService from '../../services/team/TeamService';
import playerService from '../../services/player/playerService';
import { howOutOptions, positions } from '../../components/Enum/enum';
import GroundService from '../../services/ground/GroundService';
import ScoreCardService from '../../services/scoreCard/ScoreCardService';
import { useHistory, useParams } from 'react-router-dom';
import TeamScoreCardService from '../../services/teamScore/TeamScoreCardService';
import TeamScoreDrawer from './teamScore';

const { TabPane } = Tabs;

const success = Modal.success;
const error = Modal.error;
const ScoreCard = (prop) => {
  const teamScoreInitial = {
    id: 0,
    totalScore: null,
    overs: null,
    wickets: null,
    wideballs: null,
    noBalls: null,
    byes: null,
    legByes: null,
    teamId: null,
    matchId: null,
    tenantId: null,
  };

  const [filter] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [visible, setIsTeamScoreModal] = useState(false);
  const [scoreCardListTeam1, setScoreCardListTeam1] = useState([]);
  const [scoreCardListTeam2, setScoreCardListTeam2] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [groundList, setGroundList] = useState([]);
  const [playerList, setPlayerList] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [modalMode, setModalMode] = useState();
  const [activeTag, setActiveTag] = useState('1');

  const [teamScore, setTeam1Score] = useState({});

  //const history = useHistory();
  const param = useParams();

  const scoreCardInitial = {
    id: 0,
    playerId: '',
    position: null,
    matchId: '',
    teamId: '',
    bowlerId: '',
    bat_Runs: null,
    bat_Balls: null,
    howOutId: 1,
    ball_Runs: null,
    overs: null,
    wickets: null,
    stump: null,
    catches: null,
    maiden: null,
    runOut: null,
    four: null,
    six: null,
    fielder: null,
    isPlayedInning: false,
  };

  const handleSubmit = (e) => {
    if (!scoreCardFormik.isValid) return;
    let req = {
      id: scoreCardFormik.values.id,
      playerId: scoreCardFormik.values.playerId,
      position: scoreCardFormik.values.position,
      matchId: +param.matchId,
      teamId: activeTag == 1 ? +param.team1Id : activeTag == 2 ? +param.team2Id : null,
      bowlerId: scoreCardFormik.values.bowlerId,
      bat_Runs: scoreCardFormik.values.bat_Runs,
      bat_Balls: scoreCardFormik.values.bat_Balls,
      howOutId: scoreCardFormik.values.howOutId,
      ball_Runs: scoreCardFormik.values.ball_Runs,
      overs: scoreCardFormik.values.overs,
      wickets: scoreCardFormik.values.wickets,
      stump: scoreCardFormik.values.stump,
      catches: scoreCardFormik.values.catches,
      maiden: scoreCardFormik.values.maiden,
      runOut: scoreCardFormik.values.runOut,
      four: scoreCardFormik.values.four,
      six: scoreCardFormik.values.six,
      fielder: scoreCardFormik.values.fielder,
      isPlayedInning: scoreCardFormik.values.isPlayedInning,
    };

    console.log('Match Object', req);
    ScoreCardService.createOrUpdate(req).then((res) => {
      res.success ? success({ title: res.successMessage }) : error({ title: res.successMessage });
      setIsOpenModal(false);
      getAllTeam1();
      getAllTeam2();
    });
  };

  const scoreCardValidation = Yup.object().shape({
    playerId: Yup.string().required('Required'),
    howOutId: Yup.string().required('Required'),
  });

  const scoreCardFormik = useFormik({
    enableReinitialize: true,
    initialValues: scoreCardInitial,
    validationSchema: scoreCardValidation,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (activeTag == 1) {
      getAllTeam1(+param.team1Id, +param.matchId);
      getTeamScore(+param.team1Id, +param.matchId);
    }
    if (activeTag == 2) {
      getAllTeam2(+param.team2Id, +param.matchId);
      getTeamScore(+param.team2Id, +param.matchId);
    }
  }, [activeTag]);

  useEffect(() => {
    if (isOpenModal) {
      getAllPlayers();
    }
  }, [isOpenModal]);

  console.log('teamScore', teamScore);
  const getAllTeam1 = (teamId, matchId) => {
    ScoreCardService.getAll(teamId, matchId).then((res) => {
      if (!res.items) return;
      console.log('PLayer Scores 1', res.items);
      setScoreCardListTeam1(
        res.items.map((r) => ({
          ...r,
          key: r.id,
        }))
      );
    });
    //
  };

  const getTeamScore = (teamId, matchId) => {
    TeamScoreCardService.getByTeamIdAndMatchId(teamId, matchId).then((res) => {
      if (!res) return;
      console.log('PLayer Scores 1', res);
      setTeam1Score(res);
      teamScoreFormik.setValues({
        ...teamScoreFormik.values,
        ...res,
      });
    });
    //
  };

  const getAllTeam2 = (teamId, matchId) => {
    ScoreCardService.getAll(teamId, matchId).then((res) => {
      if (!res.items) return;
      console.log('PLayer Scores 2', res.items);
      setScoreCardListTeam2(
        res.items.map((r) => ({
          ...r,
          key: r.id,
        }))
      );
    });
    //
  };

  const openModal = () => {
    setIsOpenModal(true);
    setModalMode('Add Score');
  };

  const onClose = () => {
    setIsTeamScoreModal(false);
  };
  const onTabChange = (e) => {
    setActiveTag(e);
  };

  const opemTeamScoreModal = () => {
    setIsTeamScoreModal(true);
  };

  const getAllPlayers = () => {
    playerService.getAllByTeamId(activeTag == 1 ? +param.team1Id : activeTag == 2 ? +param.team2Id : null).then((res) => {
      console.log('Players', res);
      setPlayerList(res);
    });
  };

  const handleChange = (value, key) => {
    scoreCardFormik.setValues({ ...scoreCardFormik.values, [key]: value });
  };

  const teamScoreCardInitial = {
    totalScore: '',
    overs: '',
    wickets: '',
    wideballs: '',
    noBalls: '',
    byes: '',
    legByes: '',
  };

  const teamScoreCardhandleSubmit = (e) => {
    let req = {
      id: teamScore.id || 0,
      totalScore: teamScoreFormik.values.totalScore,
      overs: +teamScoreFormik.values.overs,
      wickets: +teamScoreFormik.values.wickets,
      wideballs: teamScoreFormik.values.wideballs,
      noBalls: teamScoreFormik.values.noBalls,
      byes: teamScoreFormik.values.byes,
      legByes: teamScoreFormik.values.legByes,
      teamId: activeTag == '1' ? +param.team1Id : activeTag == '2' ? +param.team2Id : 0,
      matchId: +param.matchId,
    };

    console.log('Team SCore Object', req);
    TeamScoreCardService.createOrUpdate(req).then((res) => {
      res.success ? success({ title: res.successMessage }) : error({ title: res.successMessage });
      getTeamScore(+param.team1Id, +param.matchId);
      setIsTeamScoreModal(false);
    });
  };

  const teamScoreCardValidation = Yup.object().shape({
    totalScore: Yup.string().required('Required'),
    overs: Yup.string().required('Required'),
    wickets: Yup.string().required('Required'),
  });

  const teamScoreFormik = useFormik({
    enableReinitialize: true,
    initialValues: teamScoreCardInitial,
    validationSchema: teamScoreCardValidation,
    onSubmit: teamScoreCardhandleSubmit,
  });

  const handleChangeTeamScore = (value, key) => {
    teamScoreFormik.setValues({ ...teamScoreFormik.values, [key]: value });
  };

  const columns = [
    {
      title: 'Position',
      width: 250,
      dataIndex: 'position',
      key: 'position',
      fixed: 'left',
      render: (text, item) => {
        return item;
      },
    },
    {
      title: 'Player',
      width: 250,
      dataIndex: 'team1',
      key: 'team1',
      fixed: 'left',
    },

    {
      title: 'How-out',
      width: 250,
      dataIndex: 'howOutId',
      key: 'howOutId',
      fixed: 'left',
    },
    {
      title: 'Runs',
      width: 250,
      dataIndex: 'bat_Runs',
      key: 'bat_Runs',
    },
    {
      title: 'Wickets',
      width: 250,
      dataIndex: 'wickets',
      key: 'Wickets',
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
                <Menu.Item>{L('Edit')}</Menu.Item>
                <Menu.Item>{L('Delete')}</Menu.Item>
                <Menu.Item>{L('Score Card')}</Menu.Item>
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
  console.log('scoreCardFormik', scoreCardFormik);
  console.log('param', param);

  const { tabPosition } = { tabPosition: 'left' };
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px' }}>
        <h1>Scorecard</h1>{' '}
        {/* <Button type="primary" shape="round" icon="plus" onClick={openModal}>
          Add
        </Button> */}
      </div>
      <Tabs tabPosition={tabPosition} onChange={onTabChange}>
        <TabPane tab="Team-1" key="1">
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px' }}>
            <h1>
              {teamScore.teamId || 'N/A'} Score {teamScore.totalScore ? teamScore.totalScore : 'N/A'} runs in{' '}
              {teamScore.overs ? teamScore.overs : 'N/A'} overs and lost
              {teamScore.wickets ? teamScore.wickets : 'N/A'} wickets
            </h1>
            <Button type="primary" shape="round" icon="plus" onClick={openModal}>
              Add
            </Button>
            <Button type="primary" shape="round" icon="plus" onClick={opemTeamScoreModal}>
              {Object.keys(teamScore).length ? 'Edit Team Score' : 'Add Team Score'}
            </Button>
          </div>
          <Table columns={columns} dataSource={scoreCardListTeam1} scroll={{ x: 1500, y: 1000 }} />
        </TabPane>
        <TabPane tab="Team-2" key="2">
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px' }}>
            <h1>
              {teamScore.teamId ? teamScore.teamId : 'N/A'} Score {teamScore.totalScore ? teamScore.totalScore : 'N/A'} runs in{' '}
              {teamScore.overs ? teamScore.overs : 'N/A'} overs and lost
              {teamScore.wickets ? teamScore.wickets : 'N/A'} wickets
            </h1>
            <Button type="primary" shape="round" icon="plus" onClick={openModal}>
              Add
            </Button>
            <Button type="primary" shape="round" icon="plus" onClick={opemTeamScoreModal}>
              {Object.keys(teamScore).length ? 'Add Team Score' : 'Edit Team Score'}
            </Button>
          </div>
          <Table columns={columns} dataSource={scoreCardListTeam2} scroll={{ x: 1500, y: 1000 }} />
        </TabPane>
        <TabPane tab="Match Result" key="3"></TabPane>
      </Tabs>

      <CustomModal
        title={modalMode}
        isModalVisible={isOpenModal}
        handleCancel={() => {
          setIsOpenModal(false);
        }}
      >
        <Form className="form" onSubmit={scoreCardFormik.handleSubmit}>
          <Row>
            <CustomInput
              title="Player"
              type="select"
              options={playerList}
              handleChange={handleChange}
              value={scoreCardFormik.values.playerId}
              stateKey="playerId"
              placeholder="Select"
              errorMessage={scoreCardFormik.errors.playerId}
            />
            <CustomInput
              title="How Out"
              type="select"
              options={howOutOptions}
              handleChange={handleChange}
              value={scoreCardFormik.values.howOutId}
              stateKey="howOutId"
              placeholder="Select"
              errorMessage={scoreCardFormik.errors.howOutId}
            />
            {scoreCardFormik.values.howOutId == 2 ||
            scoreCardFormik.values.howOutId == 3 ||
            scoreCardFormik.values.howOutId == 4 ||
            scoreCardFormik.values.howOutId == 5 ||
            scoreCardFormik.values.howOutId == 6 ? (
              <CustomInput
                title="Got out by"
                type="select"
                options={playerList}
                handleChange={handleChange}
                value={scoreCardFormik.values.bowlerId}
                stateKey="bowlerId"
                placeholder="Select"
                errorMessage={scoreCardFormik.errors.bowlerId}
              />
            ) : null}

            {scoreCardFormik.values.howOutId == 3 || scoreCardFormik.values.howOutId == 4 || scoreCardFormik.values.howOutId == 7 ? (
              <CustomInput
                title="Fielder"
                type="text"
                handleChange={handleChange}
                value={scoreCardFormik.values.fielder}
                stateKey="fielder"
                placeholder=""
                errorMessage={scoreCardFormik.errors.fielder}
              />
            ) : null}
            <CustomInput
              title="Inning"
              type="checkbox"
              handleChange={handleChange}
              value={scoreCardFormik.values.isPlayedInning}
              stateKey="isPlayedInning"
              placeholder=""
              errorMessage={scoreCardFormik.errors.isPlayedInning}
            />
            <Divider orientation="left">Batting</Divider>
            <CustomInput
              title="Position"
              type="select"
              options={positions}
              handleChange={handleChange}
              value={scoreCardFormik.values.position}
              stateKey="position"
              placeholder=""
              errorMessage={scoreCardFormik.errors.position}
            />

            <CustomInput
              title="Runs"
              type="number"
              handleChange={handleChange}
              value={scoreCardFormik.values.bat_Runs}
              stateKey="bat_Runs"
              placeholder=""
              errorMessage={scoreCardFormik.errors.bat_Runs}
            />
            <CustomInput
              title="Balls"
              type="number"
              handleChange={handleChange}
              value={scoreCardFormik.values.bat_Balls}
              stateKey="bat_Balls"
              placeholder=""
              errorMessage={scoreCardFormik.errors.bat_Balls}
            />
            <CustomInput
              title="Four"
              type="number"
              handleChange={handleChange}
              value={scoreCardFormik.values.four}
              stateKey="four"
              placeholder=""
              errorMessage={scoreCardFormik.errors.four}
            />
            <CustomInput
              title="Six"
              type="number"
              handleChange={handleChange}
              value={scoreCardFormik.values.six}
              stateKey="six"
              placeholder=""
              errorMessage={scoreCardFormik.errors.six}
            />
            <Divider orientation="left">Bowling</Divider>
            <CustomInput
              title="Overs"
              type="number"
              handleChange={handleChange}
              value={scoreCardFormik.values.overs}
              stateKey="overs"
              placeholder=""
              errorMessage={scoreCardFormik.errors.overs}
            />
            <CustomInput
              title="Runs"
              type="number"
              handleChange={handleChange}
              value={scoreCardFormik.values.ball_Runs}
              stateKey="ball_Runs"
              placeholder=""
              errorMessage={scoreCardFormik.errors.ball_Runs}
            />
            <CustomInput
              title="Wickets"
              type="number"
              handleChange={handleChange}
              value={scoreCardFormik.values.wickets}
              stateKey="wickets"
              placeholder=""
              errorMessage={scoreCardFormik.errors.wickets}
            />
            <CustomInput
              title="Maiden"
              type="number"
              handleChange={handleChange}
              value={scoreCardFormik.values.maiden}
              stateKey="maiden"
              placeholder=""
              errorMessage={scoreCardFormik.errors.maiden}
            />

            <Divider orientation="left">Fielding</Divider>
            <CustomInput
              title="Catches"
              type="number"
              handleChange={handleChange}
              value={scoreCardFormik.values.catches}
              stateKey="catches"
              placeholder=""
              errorMessage={scoreCardFormik.errors.catches}
            />
            <CustomInput
              title="runOut"
              type="number"
              handleChange={handleChange}
              value={scoreCardFormik.values.runOut}
              stateKey="runOut"
              placeholder=""
              errorMessage={scoreCardFormik.errors.runOut}
            />
            <CustomInput
              title="stump"
              type="number"
              handleChange={handleChange}
              value={scoreCardFormik.values.stump}
              stateKey="stump"
              placeholder=""
              errorMessage={scoreCardFormik.errors.stump}
            />
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add
            </Button>
            <Button htmlType="button" onClick={() => setIsOpenModal(false)}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </CustomModal>

      <TeamScoreDrawer visible={visible} onClose={onClose} formikData={teamScoreFormik} />
    </Card>
  );
};
export default ScoreCard;
