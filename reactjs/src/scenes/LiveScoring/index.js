import { Button, Card, Col, Divider, Icon, Menu, PageHeader, Radio, Row } from 'antd';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { set } from 'lodash';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { byOptions } from '../../components/Enum/enum';
import { Extras } from '../../lib/appconst';
import DropDown from './dropDown';

const dummyData = {
  currentInning: 'FirstInning',
  playingTeamId: 1,
  striker: 1,
  batsmans: {
    1: {
      runs: 0,
      id: 1,
      name: 'Faraz',
      sixes: 0,
      fours: 0,
      balls: 0,
      timeline: [],
    },
    2: {
      runs: 0,
      id: 2,
      name: 'Samad',
      sixes: 0,
      fours: 0,
      balls: 0,
      timeline: [],
    },
  },
  bowler: {
    runs: 0,
    overs: 0,
    balls: 0,
    totalBalls: 0,
    wickets: 0,
    maidens: 0,
    timeline: [],
    id: 43,
    name: 'Ashir',
  },
  team: {
    runs: 0,
    teamId: 1,
    overs: 0,
    wickets: 0,
    name: 'Gulzar Cricket Club',
  },
  team2: {
    name: 'Inqilab Cricket Club',
    runs: 222,
    id: 2,
    wickets: 9,
    overs: 20,
  },
  extras: {
    wides: 10,
    legByes: 2,
    byes: 3,
    NoBalls: 1,
  },
};

const LiveScoring = () => {
  const history = useHistory();

  const [striker, setStriker] = React.useState(dummyData.striker);
  const [playingTeamId, setPlayingTeamId] = useState(1);
  const [currentInning, setCurrentInning] = useState(dummyData.currentInning);
  const [team, setTeam] = useState(dummyData.team);
  const [prevTeam, setPrevTeam] = useState(dummyData.team2);
  const [batsmans, setBatsmans] = useState(dummyData.batsmans);
  const [bowler, setBowler] = useState(dummyData.bowler);
  const [extras, setExtras] = useState(dummyData.extras);

  // const [score, setScore] = useState(0);
  // const [plyOne, setPlyOne] = useState([]); //ply one
  // const [plyTwo, setPlyTwo] = useState([]); //ply two
  // const [bowler, setBowler] = useState([]);
  // const [currentRate, setCurrentRate] = useState(0);
  // const [requiredRate, setRequiredRate] = useState(0);
  // const [target, setTarget] = useState(200);
  // const [inning, setInning] = useState(1);
  // const [wicket, setWicket] = useState(0);
  // const [plyOneId, setPlyOneId] = useState(1);
  // const [plyTwoId, setPlyTwoId] = useState(2);
  // const [strike, setStrike] = useState(plyOneId);
  // const [remainingBalls, setRemainingBalls] = useState(totalOvers * 6);
  // const [balls, setBalls] = useState(0);

  let totalOvers = 5;

  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };

  function handleMenuClick(e) {
    console.log('click', e);
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">1st item</Menu.Item>
      <Menu.Item key="2">2nd item</Menu.Item>
      <Menu.Item key="3">3rd item</Menu.Item>
    </Menu>
  );

  // let handleOver = (ball) => {
  //   let valueAfterPoint = ball.toString().split('.')[1];
  //   if (valueAfterPoint === undefined ? valueAfterPoint : valueAfterPoint.toString().split('')[0] == 5) {
  //     setBalls(Math.round(ball));
  //   } else {
  //     setBalls(ball + 0.1);
  //   }
  //   setRemainingBalls(remainingBalls - 1);
  // };

  // let handlePlayerSwitch = (num) => {
  //   if (strike === plyOneId) {
  //     if (num === 3 || num === 1 || num === 5) {
  //       setStrike(plyTwoId);
  //     }
  //     setPlyOne([...plyOne, num]);
  //   } else if (strike === plyTwoId) {
  //     if (num === 3 || num === 1 || num === 5) {
  //       setStrike(plyOneId);
  //     }
  //     setPlyTwo([...plyTwo, num]);
  //   }
  // };

  // let updateScore = (btnclicked) => {
  //   let runsRequired = target - score;

  //   setScore(score + btnclicked);
  //   setCurrentRate(score / balls);
  //   handleOver(balls);
  //   setRequiredRate(runsRequired / remainingBalls);
  //   setBowler([...bowler, btnclicked]);
  //   handlePlayerSwitch(btnclicked);
  // };

  //update state

  const handleExtras = (runs, ballType) => {
    switch (ballType) {
      case Extras.WIDE:
        updateTeamScore(runs);
        updateBowlerScore(runs++, Extras.WIDE);
        break;
      case Extras.NO_BALLS:
        updateTeamScore(runs);
        updateBatsmanScore(runs);
        updateBowlerScore(runs++, Extras.NO_BALLS);
        break;
      case Extras.BYES:
        updateTeamScore(runs);
        updateBowlerScore(runs, Extras.BYES);
        break;
      case Extras.LEG_BYES:
        updateTeamScore(runs);
        updateBowlerScore(runs, Extras.LEG_BYES);
        break;
    }
  };

  const updateTeamScore = (runs) => {
    setTeam({ ...team, runs: team.runs + runs });
    runs % 2 != 0 && handleChangeStrike(runs);
  };

  const updateBatsmanScore = (runs) => {
    const batsman = batsmans[striker];
    let timeLine = batsman.timeline;
    console.log('timeLine', timeLine);
    timeLine.push(runs);
    setBatsmans({
      ...batsmans,
      [striker]: {
        ...batsman,
        runs: batsman.runs + runs,
        sixes: runs == 6 ? batsman.sixes + 1 : batsman.sixes,
        fours: runs == 4 ? batsman.fours + 1 : batsman.fours,
        balls: batsman.balls + 1,
        timeline: timeLine,
      },
    });
  };

  const updateBowlerScore = (runs, extra) => {
    const toAddBalls = extra === Extras.WIDE || extra === Extras.NO_BALLS ? 0 : 1;
    const toAddRuns = extra === Extras.BYES || extra === Extras.LEG_BYES ? 0 : runs;
    setBowler({
      ...bowler,
      runs: bowler.runs + toAddRuns,
      totalBalls: bowler.totalBalls + toAddBalls,
    });
  };

  const handleRuns = (runs) => {
    updateScore(runs);
    if (runs % 2 != 0) handleChangeStrike(runs);
  };

  const handleChangeStrike = () => {
    setStriker(Object.keys(batsmans).filter((i) => i != striker)[0]);
  };

  const handleBattingTimeLine = (runs) => {};

  const updateScore = (runs) => {
    updateTeamScore(runs);
    updateBatsmanScore(runs);
    updateBowlerScore(runs, null);
  };

  //calculations

  const calculateOvers = (data) => {
    let obj = {
      overs: 0,
      balls: 0,
    };
    if (data.totalBalls >= 6) {
      obj.overs = data.totalBalls / 6;
    }

    obj.balls = data.totalBalls % 6;
    return obj;
  };

  const calculateStrikeRate = (data) => {
    return (data.runs * 100) / data.balls;
  };

  const calculateEconomyRate = (data) => {
    return data.runs / (data.totalBalls / 6);
  };

  const calculateCRR = (runs, overs) => {
    return overs > 0 ? runs / overs : 0;
  };
  const calculateRRR = () => {
    return 0;
  };
  const handleUndoRedo = (event) => {};
  const handleWicket = (wicket) => {
    console.log('wicket');
  };
  const calculateExtras = (data) => {
    const sumValues = Object.values(data).reduce((a, b) => a + b);
    return sumValues;
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
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card style={{ height: '200px' }}>
              <Col span={24}>
                <Col span={12}>
                  <h4>
                    India, 1<sup>st</sup> Inning
                  </h4>
                  <section style={{ fontSize: '30px' }}>
                    <h2>
                      {team.runs}/{team.wickets}
                      {/* ({state.oppTeamOvers}.{state.currentOverBalls}) ov */}
                    </h2>
                  </section>
                  <h4>
                    Pakistan <sub>(Yet to bat)</sub>
                  </h4>
                </Col>
                <Col span={12}>
                  <h4>CRR :</h4>
                  <section style={{ fontSize: '20px' }}>
                    <h4> CRR: {calculateCRR(team.runs, team.overs)?.toFixed(2)} |</h4>
                    <h4> RRR: {'11'} |</h4>
                    <h4> Extras: {calculateExtras(extras)}</h4>
                  </section>
                </Col>
              </Col>
            </Card>
          </Col>
          <Col span={12}>
            <Card style={{ height: '200px' }}>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '50%' }}>
                  <h2>{'Batsman'}</h2>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', alignItems: 'center' }}>
                  <h3>Runs</h3>
                  <h3>Balls</h3>
                  <h3>Fours</h3>
                  <h3>Sixes</h3>
                  <h3>S/R</h3>
                </div>
              </div>
              {Object.keys(batsmans).map((key) => {
                let temp = batsmans[key];
                return (
                  <div
                    style={{
                      display: 'flex',
                      borderRadius: 1,
                      background: temp.id == striker ? '#eb4034' : 'white',
                      paddingLeft: 10,
                      cursor: 'pointer',
                    }}
                    onClick={handleChangeStrike}
                  >
                    <div style={{ width: '50%' }}>
                      <h2 onPress={() => setStriker(temp.id.toString())}>{temp.name}</h2>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', alignItems: 'center' }}>
                      <h3>{temp.runs}</h3>
                      <h3>{temp.balls}</h3>
                      <h3>{temp.fours}</h3>
                      <h3>{temp.sixes}</h3>
                      <h3>{calculateStrikeRate(temp)?.toFixed(2)}</h3>
                    </div>
                  </div>
                );
              })}
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            {' '}
            <Card>
              <Row>
                <h1>
                  {' '}
                  Inning : 1<sup>st</sup>
                </h1>
              </Row>
              <Row>
                <h1> Target : {'876'}</h1>
              </Row>
              <Row>
                <h1>Runs : {'123'}</h1>
              </Row>
              <Row>
                <h1>Run Rate : {'123'}</h1>
              </Row>
              <Row>
                <h1>Required Run Rate : {'22'}</h1>
              </Row>
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              {' '}
              <Col
                style={{
                  margin: '5px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-evenly',
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((el, index) => (
                  <Button key={index} style={{ margin: '10px', height: '60px', width: '60px' }} value="1" onClick={() => handleRuns(el)}>
                    {el}
                  </Button>
                ))}

                <DropDown options={byOptions} title="B" handleMenuClick={() => console.log('handleMenuClick')} />

                {/* <Dropdown overlay={menu} onChange>
                  <Button style={{ margin: '10px', height: '60px', width: '60px' }}>
                    B <Icon type="down" />
                  </Button>
                </Dropdown>

                <Dropdown overlay={menu}>
                  <Button style={{ margin: '10px', height: '60px', width: '60px' }}>
                    LB <Icon type="down" />
                  </Button>
                </Dropdown>
                <Dropdown overlay={menu}>
                  <Button style={{ margin: '10px', height: '60px', width: '60px' }}>
                    W <Icon type="down" />
                  </Button>
                </Dropdown>
                <Dropdown overlay={menu}>
                  <Button style={{ margin: '10px', height: '60px', width: '60px' }}>
                    N <Icon type="down" />
                  </Button>
                </Dropdown> */}
              </Col>
            </Card>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default LiveScoring;

const styles = {
  container: {
    padding: 20,
    backgroundColor: '#d9d9d9',
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
};
