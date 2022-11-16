import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Dropdown, Menu, Row, Tabs, Divider, Col, Card, PageHeader, Skeleton } from 'antd';
import { L } from '../../lib/abpUtility';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomModal from '../../components/Modal';
import CustomInput from '../../components/Input';
import playerService from '../../services/player/playerService';
import { howOutOptions, positions } from '../../components/Enum/enum';
import ScoreCardService from '../../services/scoreCard/ScoreCardService';
import { useHistory, useParams } from 'react-router-dom';
import TeamScoreCardService from '../../services/teamScore/TeamScoreCardService';
import FallofWicketService from '../../services/fallofWicket/TeamScoreCardService';
import TeamScoreDrawer from './teamScore';
import ViewTeamScore from './viewTeamScore';
import FallofWicket from './fallofWicket';
import ViewFallOfWicket from './viewFallofWicket';
import CustomTable from '../../components/Table';
import { IsLiveOrMannual } from '../../lib/appconst';

const { TabPane } = Tabs;

const success = Modal.success;
const error = Modal.error;
const AddScore = (prop) => {
  const fallofWicketInitial = {
    id: 0,
    first: null,
    second: null,
    third: null,
    fourth: null,
    fifth: null,
    sixth: null,
    seventh: null,
    eight: null,
    ninth: null,
    tenth: null,
    teamId: null,
    matchId: null,
  };

  const scoreCardInitial = {
    id: 0,
    playerId: '',
    playerName: '',
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

  const teamScoreCardInitial = {
    id: 0,
    totalScore: '',
    overs: '',
    wickets: '',
    wideballs: '',
    noBalls: '',
    byes: '',
    legByes: '',
  };

  //const [filter] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [teamScoreModal, setIsTeamScoreModal] = useState(false);
  const [fallofwciketModal, setIsFallofWicketModal] = useState(false);

  const [scoreCardListTeam1, setScoreCardListTeam1] = useState([]);
  const [scoreCardListTeam2, setScoreCardListTeam2] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [groundList, setGroundList] = useState([]);
  const [playerList, setPlayerList] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [modalMode, setModalMode] = useState();
  const [activeTag, setActiveTag] = useState('1');

  const [team1Score, setTeam1Score] = useState({});
  const [team2Score, setTeam2Score] = useState({});

  const [team1FallofWicket, setTeam1FallofWicket] = useState([]);
  const [team2FallofWicket, setTeam2FallofWicket] = useState([]);

  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');

  const [editScoreCard, setEditScoreCard] = useState({});
  const [loading, setLoading] = useState(true);
  //const history = useHistory();
  const param = useParams();
  const history = useHistory();
  //yup Validations
  const scoreCardValidation = Yup.object().shape({
    playerId: Yup.string().required('Required'),
    howOutId: Yup.string().required('Required'),
  });

  const teamScoreCardValidation = Yup.object().shape({
    totalScore: Yup.string().required('Required'),
    overs: Yup.string().required('Required'),
    wickets: Yup.string().required('Required'),
  });

  //UseEffects
  useEffect(() => {
    getFullScoreCard(+param.team1Id, +param.team2Id, +param.matchId);
  }, []);

  const callback = (key) => {
    console.log(key);
  };

  //handle Submit
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

    //console.log('Match Object', req);
    ScoreCardService.createOrUpdate(req).then((res) => {
      res.success ? success({ title: res.successMessage }) : error({ title: res.successMessage });
      setIsOpenModal(false);
      getScoreCard(+param.team1Id, +param.matchId);
      getScoreCard(+param.team2Id, +param.matchId);

      scoreCardFormik.setValues({});
      // setScoreCardListTeam1({});
      // setScoreCardListTeam2({});
    });
  };

  const teamScoreCardhandleSubmit = (e) => {
    let req = {
      id: e.id || 0,
      totalScore: e.totalScore,
      overs: +e.overs,
      wickets: +e.wickets,
      wideballs: e.wideballs,
      noBalls: e.noBalls,
      byes: e.byes,
      legByes: e.legByes,
      teamId: e.teamId || activeTag == 1 ? +param.team1Id : +param.team2Id,
      matchId: +param.matchId,
      IsLiveOrMannual: IsLiveOrMannual.MANNUAL
    };

    //console.log('Team SCore Object', req);
    TeamScoreCardService.createOrUpdate(req).then((res) => {
      res.success ? success({ title: res.successMessage }) : error({ title: res.successMessage });
      setTeamScoreStateUpdate(res.result);
      setIsTeamScoreModal(false);
    });
  };

  const fallofWicketHandleSubmit = (e) => {
    let req = {
      id: e.id || 0,
      first: +e.first,
      second: +e.second,
      third: +e.third,
      fourth: +e.fourth,
      fifth: +e.fifth,
      sixth: +e.sixth,
      seventh: +e.seventh,
      eight: +e.eight,
      ninth: +e.ninth,
      tenth: +e.tenth,
      teamId: e.team1Id,
      matchId: +param.matchId,
    };
    //console.log('Team SCore Object', req);
    FallofWicketService.createOrUpdate(req).then((res) => {
      res.success ? success({ title: res.successMessage }) : error({ title: res.successMessage });
      setFallofWicketStateUpdate(res.result || res.array);
      setIsFallofWicketModal(false);
    });
  };

  //Formik Objects
  const scoreCardFormik = useFormik({
    enableReinitialize: true,
    initialValues: scoreCardInitial,
    validationSchema: scoreCardValidation,
    onSubmit: handleSubmit,
  });

  const team1ScoreFormik = useFormik({
    enableReinitialize: true,
    initialValues: teamScoreCardInitial,
    validationSchema: teamScoreCardValidation,
    onSubmit: teamScoreCardhandleSubmit,
  });

  const team2ScoreFormik = useFormik({
    enableReinitialize: true,
    initialValues: teamScoreCardInitial,
    validationSchema: teamScoreCardValidation,
    onSubmit: teamScoreCardhandleSubmit,
  });

  const fallofWicketTeam1Formik = useFormik({
    enableReinitialize: true,
    initialValues: fallofWicketInitial,
    validationSchema: '',
    onSubmit: fallofWicketHandleSubmit,
  });

  const fallofWicketTeam2Formik = useFormik({
    enableReinitialize: true,
    initialValues: fallofWicketInitial,
    validationSchema: '',
    onSubmit: fallofWicketHandleSubmit,
  });

  //get Calls
  const getFullScoreCard = (team1Id, team2Id, matchId) => {
    setLoading(true);
    ScoreCardService.getFullScorecard(team1Id, team2Id, matchId).then((res) => {
      if (res.success) {
        var result = res.result;
        if (!result) return;
        var team1Playerscores = result.team1Playerscore;
        var team2Playerscores = result.team2Playerscore;

        var team1FallofWickets = result.team1FallofWicket;
        var team2FallofWickets = result.team2FallofWicket;

        var team1Score = result.team1Score;
        var team2Score = result.team2Score;

        setTeam1(result.team1);
        setTeam2(result.team2);

        if (team1Playerscores && team1Playerscores.length > 0) {
          setScoreCardListTeam1(
            team1Playerscores.map((r) => ({
              ...r,
              key: r.id,
            }))
          );
        }

        if (team2Playerscores && team2Playerscores.length > 0) {
          setScoreCardListTeam2(
            team2Playerscores.map((r) => ({
              ...r,
              key: r.id,
            }))
          );
        }

        if (team1Score) {
          setTeam1Score(team1Score);
          team1ScoreFormik.setValues({
            ...team1ScoreFormik.values,
            ...team1Score,
          });
        }

        if (team2Score) {
          setTeam2Score(team2Score);
          team2ScoreFormik.setValues({
            ...team2ScoreFormik.values,
            ...team2Score,
          });
        }

        if (team1FallofWickets && team1FallofWickets[0]) {
          fallofWicketTeam1Formik.setValues({
            ...fallofWicketTeam1Formik.values,
            ...team1FallofWickets[0],
          });
          setTeam1FallofWicket(
            team1FallofWickets.map((r) => ({
              ...r,
              key: r.id,
            }))
          );
        }

        if (team2FallofWickets && team2FallofWickets[0]) {
          fallofWicketTeam2Formik.setValues({
            ...fallofWicketTeam2Formik.values,
            ...team2FallofWickets[0],
          });
          setTeam2FallofWicket(
            team2FallofWickets.map((r) => ({
              ...r,
              key: r.id,
            }))
          );
        }

        setLoading(false);
        //setScoreCardStateUpdate(res, teamId);
      }
    });
    //
  };

  const getScoreCard = (teamId, matchId) => {
    ScoreCardService.getAll(teamId, matchId).then((res) => {
      //console.log('PLayer Scores 1', res);
      if (!res) return;
      setScoreCardStateUpdate(res, teamId);
    });
    //
  };

  const getTeamScore = (teamId, matchId) => {
    TeamScoreCardService.getByTeamIdAndMatchId(teamId, matchId).then((res) => {
      if (!res) return;
      console.log('PLayer Scores 1', res);
      setTeamScoreStateUpdate(res);
    });
    //
  };

  const getFallofWicket = (teamId, matchId) => {
    FallofWicketService.getByTeamIdAndMatchId(teamId, matchId).then((res) => {
      if (!res) return;
      //console.log('Fall of wickets', res);
      setFallofWicketStateUpdate(res);
    });
    //
  };

  // const getAllTeam2 = (teamId, matchId) => {
  //   ScoreCardService.getAll(teamId, matchId).then((res) => {
  //     if (!res.items) return;
  //     //console.log('PLayer Scores 2', res.items);
  //     setScoreCardListTeam2(
  //       res.items.map((r) => ({
  //         ...r,
  //         key: r.id,
  //       }))
  //     );
  //   });
  //   //
  // };

  const getAllPlayers = () => {
    playerService.getAllByTeamId(activeTag == 1 ? +param.team1Id : activeTag == 2 ? +param.team2Id : null).then((res) => {
      // console.log('Players', res);
      setPlayerList(res);
    });
  };

  const getPlayeScore = (id) => {
    //setIsOpenModal(true);
    ScoreCardService.getPlayerScoreById(id).then((res) => {
      if (!res) return;
      //res.success ? success({ title: res.successMessage }) : error({ title: res.successMessage });
      setEditScoreCard(res);
      scoreCardFormik.setValues({
        ...scoreCardFormik.values,
        ...res,
      });
    });
  };

  //handleChange
  const handleChange = (value, key) => {
    scoreCardFormik.setValues({ ...scoreCardFormik.values, [key]: value });
  };

  const handleChangeTeamScore = (value, key) => {
    team1ScoreFormik.setValues({ ...team1ScoreFormik.values, [key]: value });
  };

  useEffect(() => {
    if (isOpenModal) {
      getAllPlayers();
    }
  }, [isOpenModal]);

  //set States

  const setTeamScoreStateUpdate = (res) => {
    if (res.teamId == +param.team1Id) {
      setTeam1Score(res);
      team1ScoreFormik.setValues({
        ...team1ScoreFormik.values,
        ...res,
      });
    }
    if (res.teamId == +param.team2Id) {
      setTeam2Score(res);
      team2ScoreFormik.setValues({
        ...team2ScoreFormik.values,
        ...res,
      });
    }
  };

  const setFallofWicketStateUpdate = (res) => {
    if (!res || !res[0]) return;
    if (res[0].teamId == +param.team1Id) {
      // setTeam1FallofWicket(res[0]);
      fallofWicketTeam1Formik.setValues({
        ...fallofWicketTeam1Formik.values,
        ...res[0],
      });
      setTeam1FallofWicket(
        res.map((r) => ({
          ...r,
          key: r.id,
        }))
      );
    }
    if (res[0].teamId == +param.team2Id) {
      fallofWicketTeam2Formik.setValues({
        ...fallofWicketTeam2Formik.values,
        ...res[0],
      });
      setTeam2FallofWicket(
        res.map((r) => ({
          ...r,
          key: r.id,
        }))
      );
    }
  };

  const setScoreCardStateUpdate = (res, teamId) => {
    if (teamId == +param.team1Id) {
      setScoreCardListTeam1(
        res.map((r) => ({
          ...r,
          key: r.id,
        }))
      );
    }
    if (teamId == +param.team2Id) {
      setScoreCardListTeam2(
        res.map((r) => ({
          ...r,
          key: r.id,
        }))
      );
    }
  };

  const openModal = () => {
    setIsOpenModal(true);
    setModalMode('Add Score');
  };

  const onTeamScoreModalClose = () => {
    setIsTeamScoreModal(false);
  };

  const onFallofWicketModalClose = () => {
    setIsFallofWicketModal(false);
  };
  const onTabChange = (e) => {
    setActiveTag(e);
  };

  const opemTeamScoreModal = () => {
    setIsTeamScoreModal(true);
  };

  const editPlayerScore = (item) => {
    setIsOpenModal(true);
    getPlayeScore(item.id);
  };

  const openFallofWicketDrawer = () => {
    setIsFallofWicketModal(true);
  };

  const columns = [
    {
      title: 'Position',
      width: 250,
      dataIndex: 'position',
      key: 'position',
      fixed: 'left',
    },
    {
      title: 'Player',
      width: 250,
      dataIndex: 'playerName',
      key: 'playerName',
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
                <Menu.Item onClick={() => editPlayerScore(item)}>{L('Edit')}</Menu.Item>
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
  //console.log('fallofWicketTeam1Formik', fallofWicketTeam2Formik);
  console.log('team1ScoreFormik', team1ScoreFormik.values);
  console.log('team2ScoreFormik', team2ScoreFormik.values);
  console.log('activeTag', activeTag);

  const { tabPosition } = { tabPosition: 'top' };
  return (
    <Card>
      <PageHeader
        style={{
          border: '1px solid rgb(235, 237, 240)',
        }}
        onBack={history.goBack}
        title={'Create Scorecard'}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px' }}>
        {/* <Button type="primary" shape="round" icon="plus" onClick={openModal}>
          Add
        </Button> */}
      </div>
      <Tabs tabPosition={tabPosition} onChange={onTabChange}>
        <TabPane tab={team1} key="1">
          <Skeleton loading={loading}>
            <ViewTeamScore data={team1Score} teamName={team1} opemTeamScoreModal={opemTeamScoreModal}></ViewTeamScore>
          </Skeleton>

          <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px' }}>
            <Button type="primary" shape="round" icon="plus" onClick={openModal}>
              Add
            </Button>
          </div>
          <CustomTable loading={loading} data={scoreCardListTeam1} columns={columns}></CustomTable>
          <Skeleton loading={loading}>
            <ViewFallOfWicket data={team1FallofWicket} visible={openFallofWicketDrawer} openModal={openModal}></ViewFallOfWicket>
          </Skeleton>
        </TabPane>
        <TabPane tab={team2} key="2">
          <Skeleton loading={loading}>
            <ViewTeamScore data={team2Score} teamName={team2} opemTeamScoreModal={opemTeamScoreModal}></ViewTeamScore>
          </Skeleton>
          <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px' }}>
            <Button type="primary" shape="round" icon="plus" onClick={openModal}>
              Add
            </Button>
          </div>
          <CustomTable loading={loading} data={scoreCardListTeam2} columns={columns}></CustomTable>
          <Skeleton loading={loading}>
            <ViewFallOfWicket data={team2FallofWicket} visible={openFallofWicketDrawer} openModal={openModal}></ViewFallOfWicket>
          </Skeleton>
        </TabPane>
      </Tabs>

      <CustomModal
        title={Object.keys(editScoreCard).length ? 'Edit Player Score' : 'Add Player Score'}
        isModalVisible={isOpenModal}
        handleCancel={() => {
          setIsOpenModal(false);
        }}
      >
        <Form className="form" onSubmit={scoreCardFormik.handleSubmit}>
          <Row gutter={16}>
            <Col span={8}>
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
            </Col>
            <Col span={8}>
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
            </Col>
            <Col span={8}>
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
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
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
            </Col>
            <Col span={12}>
              <CustomInput
                title="Inning"
                type="switch"
                handleChange={handleChange}
                value={scoreCardFormik.values.isPlayedInning}
                stateKey="isPlayedInning"
                placeholder=""
                errorMessage={scoreCardFormik.errors.isPlayedInning}
              />
            </Col>
          </Row>

          <Divider orientation="left">Batting</Divider>
          <Row gutter={16}>
            <Col span={8}>
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
            </Col>
            <Col span={8}>
              <CustomInput
                title="Runs"
                type="number"
                handleChange={handleChange}
                value={scoreCardFormik.values.bat_Runs}
                stateKey="bat_Runs"
                placeholder=""
                errorMessage={scoreCardFormik.errors.bat_Runs}
              />
            </Col>
            <Col span={8}>
              <CustomInput
                title="Balls"
                type="number"
                handleChange={handleChange}
                value={scoreCardFormik.values.bat_Balls}
                stateKey="bat_Balls"
                placeholder=""
                errorMessage={scoreCardFormik.errors.bat_Balls}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <CustomInput
                title="Four"
                type="number"
                handleChange={handleChange}
                value={scoreCardFormik.values.four}
                stateKey="four"
                placeholder=""
                errorMessage={scoreCardFormik.errors.four}
              />
            </Col>
            <Col span={8}>
              {' '}
              <CustomInput
                title="Six"
                type="number"
                handleChange={handleChange}
                value={scoreCardFormik.values.six}
                stateKey="six"
                placeholder=""
                errorMessage={scoreCardFormik.errors.six}
              />
            </Col>
            <Col span={8}></Col>
          </Row>

          <Divider orientation="left">Bowling</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <CustomInput
                title="Overs"
                type="number"
                handleChange={handleChange}
                value={scoreCardFormik.values.overs}
                stateKey="overs"
                placeholder=""
                errorMessage={scoreCardFormik.errors.overs}
              />
            </Col>
            <Col span={12}>
              {' '}
              <CustomInput
                title="Runs"
                type="number"
                handleChange={handleChange}
                value={scoreCardFormik.values.ball_Runs}
                stateKey="ball_Runs"
                placeholder=""
                errorMessage={scoreCardFormik.errors.ball_Runs}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <CustomInput
                title="Wickets"
                type="number"
                handleChange={handleChange}
                value={scoreCardFormik.values.wickets}
                stateKey="wickets"
                placeholder=""
                errorMessage={scoreCardFormik.errors.wickets}
              />
            </Col>
            <Col span={12}>
              <CustomInput
                title="Maiden"
                type="number"
                handleChange={handleChange}
                value={scoreCardFormik.values.maiden}
                stateKey="maiden"
                placeholder=""
                errorMessage={scoreCardFormik.errors.maiden}
              />
            </Col>
          </Row>

          <Divider orientation="left">Fielding</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <CustomInput
                title="Catches"
                type="number"
                handleChange={handleChange}
                value={scoreCardFormik.values.catches}
                stateKey="catches"
                placeholder=""
                errorMessage={scoreCardFormik.errors.catches}
              />
            </Col>
            <Col span={8}>
              {' '}
              <CustomInput
                title="runOut"
                type="number"
                handleChange={handleChange}
                value={scoreCardFormik.values.runOut}
                stateKey="runOut"
                placeholder=""
                errorMessage={scoreCardFormik.errors.runOut}
              />
            </Col>
            <Col span={8}>
              <CustomInput
                title="stump"
                type="number"
                handleChange={handleChange}
                value={scoreCardFormik.values.stump}
                stateKey="stump"
                placeholder=""
                errorMessage={scoreCardFormik.errors.stump}
              />
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {Object.keys(editScoreCard).length ? 'Update' : 'Add'}
            </Button>
            <Button htmlType="button" onClick={() => setIsOpenModal(false)}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </CustomModal>

      <TeamScoreDrawer
        data={activeTag == 1 ? team1Score : team2Score}
        visible={teamScoreModal}
        onClose={onTeamScoreModalClose}
        formikData={activeTag == 1 ? team1ScoreFormik : team2ScoreFormik}
      />
      <FallofWicket
        data={activeTag == 1 ? team1FallofWicket : team2FallofWicket}
        visible={fallofwciketModal}
        onClose={onFallofWicketModalClose}
        formikData={activeTag == 1 ? fallofWicketTeam1Formik : fallofWicketTeam2Formik}
      ></FallofWicket>
    </Card>
  );
};
export default AddScore;
