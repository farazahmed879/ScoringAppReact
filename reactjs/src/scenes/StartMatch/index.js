import { Card, Col, PageHeader, Row, Steps, Button, Select, Form, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams} from 'react-router-dom';
import CustomList from '../../components/CustomList';
import { playingRoleOptions } from '../../components/Enum/enum';
import CustomInput from '../../components/Input';
import genderConst from '../../lib/genderConst';
import getImage from '../../lib/getImage';
import playerService from '../../services/player/playerService';
import matchService from '../../services/match/matchService';
import Team from '../Teams';
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';
import { get } from 'lodash';
import { MatchStatus, ScoringBy } from '../../lib/appconst';

const fakeDataUrl = `https://randomuser.me/api/?results=${10}&inc=name,gender,email,nat,picture&noinfo`;
const success = Modal.success;
const error = Modal.error;
const startMatchInitial = {
  striker: '',
  nonStriker: '',
  bowler: '',
};

const startMatchValidation = Yup.object().shape({
  striker: Yup.string().required('Required'),
  nonStriker: Yup.string().required('Required'),
  bowler: Yup.string().required('Required'),
});

const StartMatch = () => {
  const [current, setCurrent] = useState(0);
  const history = useHistory();
  const [initLoading, setInitLoading] = useState([]);
  const [team1List, setTeam1List] = useState([]);
  const [team2List, setTeam2List] = useState([]);
  const [team1AllPlayers, setTeam1AllPlayers] = useState([]);
  const [team2AllPlayers, setTeam2AllPlayers] = useState([]);
  const [team1SelectedPlayers, setTeam1SelectedPlayers] = useState([]);
  const [team2SelectedPlayers, setTeam2SelectedPlayers] = useState([]);

  const param = useParams();
  const { Step } = Steps;
  useEffect(() => {
    getAllPlayerByTeamId(param.team1Id);
    getAllPlayerByTeamId(param.team2Id);
  }, []);

  const handleSubmit = () => {
    const teamPlayers = [];

    team1SelectedPlayers.forEach((playerId) => {
      const teamPlayer = {
        playerId: playerId,
        position: startMatchFormik.values.striker == playerId ? 1 : startMatchFormik.values.nonStriker == playerId ? 2 : null,
        matchId: param.matchId,
        teamId: param.team1Id,
        isPlayedInning: startMatchFormik.values.striker == playerId || startMatchFormik.values.nonStriker == playerId ? true : false,
      };
      teamPlayers.push(teamPlayer);
    });
    team2SelectedPlayers.forEach((playerId) => {
      const teamPlayer = {
        playerId: playerId,
        position: null,
        matchId: param.matchId,
        teamId: param.team2Id,
        isPlayedInning: false,
      };
      teamPlayers.push(teamPlayer);
    });
    console.log('teamplayers', teamPlayers);

    var model = {
      status: MatchStatus.STARTED,
      matchId: param.matchId,
      scoringBy: ScoringBy.WEBAPP,
      isLiveStreaming: false,
      players: teamPlayers,
    };
    matchService.startMatch(model).then((res) => {
      res.success
        ? history.push(
            '/liveScoring/team1/' + param.team1Id + '/' + param.team1 + '/team2/' + param.team2Id + '/' + param.team2 + '/match/' + param.id
          )
        : error({ title: res.successMessage });
    });
  };

  const startMatchFormik = useFormik({
    enableReinitialize: true,
    initialValues: startMatchInitial,
    validationSchema: startMatchValidation,
    onSubmit: handleSubmit,
  });

  const handleChange = (value, key) => {
    startMatchFormik.setValues({ ...startMatchFormik.values, [key]: value });
  };

  const getAllPlayerByTeamId = (id) => {
    setInitLoading(true);
    playerService.getAllByTeamId(id).then((res) => {
      console.log('Team Player', res);

      let array = [];
      res.forEach((el, index) => {
        let ob = {
          id: el.id,
          email: el.email || 'N/A',
          gender: el.gender == genderConst.female ? 'Female' : el.gender == genderConst.male ? 'Male' : 'N/A',
          playerRole: playingRoleOptions.find((i) => i.id == el.playerRoleId)?.name || 'N/A',
          checked: false,
          name: {
            title: el.name,
            first: el.name.split(' ')[0],
            last: el.name.split(' ')[1],
          },
          nat: 'RS',
          picture: {
            large: getImage(el.profileUrl),
            medium: getImage(el.profileUrl),
            thumbnail: getImage(el.profileUrl),
          },
        };
        array.push(ob);
      });
      setInitLoading(false);
      if (id == param.team1Id) {
        setTeam1List(array);
        setTeam1AllPlayers(res);
      }
      if (id == param.team2Id) {
        setTeam2List(array);
        setTeam2AllPlayers(res);
      }
    });
  };

  const handleTeam1PlayerChange = (event, key, index) => {
    team1List[index].checked = event;
    setTeam1List(team1List);
    let arra = [...team1SelectedPlayers];
    event ? arra.push(key) : arra.pop(key);
    setTeam1SelectedPlayers(arra);
  };
  const handleTeam2PlayerChange = (event, key, index) => {
    team2List[index].checked = event;
    setTeam2List(team2List);
    let arra = [...team2SelectedPlayers];
    event ? arra.push(key) : arra.pop(key);
    setTeam2SelectedPlayers(arra);
  };
  console.log('team1SelectedPlayers', team1SelectedPlayers);
  console.log('team2SelectedPlayers', team2SelectedPlayers);
  console.log('startMatchFormik', startMatchFormik);

  const selectTeamPlayers = () => {
    return (
      <>
        <Row justify="space-around" style={{ marginTop: '20px', marginBottom: '20px' }}>
          <Col style={{ display: 'flex', justifyContent: 'center' }} span={10}>
            <div>
              <b>{param.team1}</b>
            </div>
          </Col>
          <Col style={{ display: 'flex', justifyContent: 'center' }} span={4}>
            <div>V/S</div>
          </Col>
          <Col style={{ display: 'flex', justifyContent: 'center' }} span={10}>
            <div>
              <b>{param.team2}</b>
            </div>
          </Col>
        </Row>
        <Row justify="space-around">
          <Col style={{ display: 'flex', justifyContent: 'center', paddingRight: '50px' }} span={12}>
            <div>
              <CustomList
                title={'Select Players'}
                list={team1List}
                initLoading={initLoading}
                handleChange={handleTeam1PlayerChange}
                stateKey="Player"
                value={startMatchFormik.values.Players}
              />
            </div>
          </Col>
          <Col style={{ display: 'flex', justifyContent: 'center', paddingLeft: '50px' }} span={12}>
            <div>
              <CustomList
                title={'Select Players'}
                list={team2List}
                initLoading={initLoading}
                handleChange={handleTeam2PlayerChange}
                stateKey="Players"
                value={startMatchFormik.values.Players}
              />
            </div>
          </Col>
        </Row>
      </>
    );
  };

  const chooseOppeners = () => {
    return (
      <>
        {' '}
        <Row justify="space-around">
          <Col style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: '50px' }} span={12}>
            <Row gutter={16} className="form-container">
              <Col span={24}>
                <CustomInput
                  style={{ margin: '50px' }}
                  type="select"
                  options={team1AllPlayers.filter((i) => team1SelectedPlayers.includes(i.id) && i.id != startMatchFormik.values.nonStriker)}
                  title="Choose Striker"
                  stateKey="striker"
                  handleChange={handleChange}
                  value={startMatchFormik.values.striker}
                  errorMessage={startMatchFormik.errors.striker}
                />
              </Col>
              <Col span={24}>
                <CustomInput
                  type="select"
                  options={team1AllPlayers.filter((i) => team1SelectedPlayers.includes(i.id) && i.id != startMatchFormik.values.striker)}
                  title="Choose Non Striker"
                  stateKey="nonStriker"
                  handleChange={handleChange}
                  value={startMatchFormik.values.nonStriker}
                  errorMessage={startMatchFormik.errors.nonStriker}
                />
              </Col>
            </Row>
          </Col>
          <Col style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '50px' }} span={12}>
            <Row gutter={16} className="form-container">
              <Col span={24}>
                <CustomInput
                  type="select"
                  options={team2AllPlayers.filter((i) => team2SelectedPlayers.includes(i.id))}
                  title="Choose Bowler"
                  stateKey="bowler"
                  handleChange={handleChange}
                  value={startMatchFormik.values.bowler}
                  errorMessage={startMatchFormik.errors.bowler}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );
  };
  const steps = [
    {
      title: 'Select Players',
      content: selectTeamPlayers(),
    },
    {
      title: 'Select Oppeners',
      content: chooseOppeners(),
    },
  ];

  const prev = () => {
    setCurrent(current - 1);
  };

  const next = () => {
    setCurrent(current + 1);
  };

  return (
    <Form onSubmit={startMatchFormik.handleSubmit}>
      {' '}
      <Card>
        <PageHeader
          style={{
            border: '1px solid rgb(235, 237, 240)',
          }}
          onBack={history.goBack}
          title={'Start Match'}
        />
        <Steps style={{ marginTop: '10px' }} current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">{steps[current].content}</div>
        <div className="steps-action">
          {current > 0 && <Button onClick={() => prev()}>Previous</Button>}

          {current < steps.length - 1 && (
            <Button style={{ display: 'flex', float: 'right' }} htmlType="submit" type="primary" onClick={next}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Form.Item>
              {/* <Link to={'/liveScoring/team1/' + param.team1Id + '/' + param.team1 + '/team2/' + param.team2Id + '/' + param.team2 + '/match/' + param.id}>
                  <Button style={{ display: 'flex', float: 'right' }} htmlType="submit" type="primary">{('Start Match')}</Button>
                </Link> */}
              <Button style={{ display: 'flex', float: 'right' }} htmlType="submit" type="primary">
                {'Start Match'}
              </Button>
            </Form.Item>
          )}
        </div>
      </Card>
    </Form>
  );
};

export default StartMatch;
