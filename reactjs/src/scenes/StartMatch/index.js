import { Card, Col, PageHeader, Row, Steps, Button, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import CustomList from '../../components/CustomList';
import { playingRoleOptions } from '../../components/Enum/enum';
import CustomInput from '../../components/Input';
import genderConst from '../../lib/genderConst';
import getImage from '../../lib/getImage';
import playerService from '../../services/player/playerService';
import Team from '../Teams';

const fakeDataUrl = `https://randomuser.me/api/?results=${10}&inc=name,gender,email,nat,picture&noinfo`;

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
  const [form, setForm] = useState({
    striker: 0,
    nonStriker: 0,
    bowler: 0,
  });
  const param = useParams();
  const { Step } = Steps;
  useEffect(() => {
    getAllPlayerByTeamId(param.team1Id);
    getAllPlayerByTeamId(param.team2Id);
  }, []);

  const handleChange = (value, key) => {
    setForm({ ...form, [key]: value });
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

  const handleTeam1PlayerChange = (event, key) => {
    let arra = [...team1SelectedPlayers];
    event ? arra.push(key) : arra.pop(key);
    setTeam1SelectedPlayers(arra);
  };
  const handleTeam2PlayerChange = (event, key) => {
    let arra = [...team2SelectedPlayers];
    event ? arra.push(key) : arra.pop(key);
    setTeam2SelectedPlayers(arra);
  };
  console.log('team1SelectedPlayers', team1SelectedPlayers);
  console.log('team2SelectedPlayers', team2SelectedPlayers);

  const selectTeamPlayers = () => {
    return (
      <>
        <Row justify="space-around" style={{ marginTop: '20px', marginBottom: '20px' }}>
          <Col style={{ display: 'flex', justifyContent: 'center' }} span={10}>
            <div>
              <b>Team1</b>
            </div>
          </Col>
          <Col style={{ display: 'flex', justifyContent: 'center' }} span={4}>
            <div>V/S</div>
          </Col>
          <Col style={{ display: 'flex', justifyContent: 'center' }} span={10}>
            <div>
              <b>Team2</b>
            </div>
          </Col>
        </Row>
        <Row justify="space-around">
          <Col style={{ display: 'flex', justifyContent: 'center', paddingRight: '50px' }} span={12}>
            <div>
              <CustomList title={'Select Players'} list={team1List} initLoading={initLoading} handleChange={handleTeam1PlayerChange} />
            </div>
          </Col>
          <Col style={{ display: 'flex', justifyContent: 'center', paddingLeft: '50px' }} span={12}>
            <div>
              <CustomList title={'Select Players'} list={team2List} initLoading={initLoading} handleChange={handleTeam2PlayerChange} />
            </div>
          </Col>
        </Row>
      </>
    );
  };

  const chooseOppeners = () => {
    return (
      <>
        <Row justify="space-around">
          <Col style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: '50px' }} span={12}>
            <Row gutter={16} className="form-container">
              <Col span={24}>
                <CustomInput
                  type="select"
                  options={team1AllPlayers}
                  title="Choose Striker"
                  stateKey="striker"
                  handleChange={handleChange}
                  value={form.striker}
                />
              </Col>
              <Col span={24}>
                <CustomInput
                  style={{ margin: '50px' }}
                  type="select"
                  options={team1AllPlayers}
                  title="Choose Non Striker"
                  stateKey="nonStriker"
                  handleChange={handleChange}
                  value={form.nonStriker}
                />
              </Col>
            </Row>
          </Col>
          <Col style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '50px' }} span={12}>
            <Row gutter={16} className="form-container">
              <Col span={24}>
                <CustomInput
                  type="select"
                  options={team2AllPlayers}
                  title="Choose Bowler"
                  stateKey="bowler"
                  handleChange={handleChange}
                  value={form.bowler}
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
      title: 'First',
      content: selectTeamPlayers(),
    },
    {
      title: 'Second',
      content: chooseOppeners(),
    },
    {
      title: 'Last',
      content: 'Last-content',
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <>
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
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={''}>
              Done
            </Button>
          )}
          {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              Previous
            </Button>
          )}
        </div>
      </Card>
    </>
  );
};

export default StartMatch;