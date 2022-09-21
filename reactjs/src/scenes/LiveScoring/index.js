import { Button, Card, Col, Divider, Icon, Menu, PageHeader, Radio, Row } from 'antd';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { set } from 'lodash';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { byOptions, legByOptions, noBallOptions, wicketOptions, wideOptions } from '../../components/Enum/enum';
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



  //update state

  const handleExtras = (runs, ballType) => {
    debugger
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
        updateBatsmanScore(0);
        break;
      case Extras.LEG_BYES:
        updateTeamScore(runs);
        updateBowlerScore(runs, Extras.LEG_BYES);
        updateBatsmanScore(0);
        break;
    }

    if (runs % 2 != 0) handleChangeStrike(runs);
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
    debugger
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

  const handleBattingTimeLine = (runs) => { };

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
  const handleUndoRedo = (event) => { };
  const handleWicket = (wicket) => {
    console.log('wicket');
  };
  const calculateExtras = (data) => {
    const sumValues = Object.values(data).reduce((a, b) => a + b);
    return sumValues;
  };

  console.log("calculateOvers", calculateOvers(bowler));

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
          {/* Card1 */}
          <Col span={12}>
            <Card style={{ height: '200px' }}>
              <Col span={24}>
                <Col span={12}>
                  <h4>
                    India, 1<sup>st</sup> Inning
                  </h4>
                  <section style={{ fontSize: '30px' ,display: 'flex' ,alignItems: 'center' }}>
                    <h2>
                      {team.runs}/{team.wickets}
                    </h2>
                    <h4> ({team.overs + '.' + calculateOvers(bowler)?.balls}) ov</h4>
                  </section>
                  <h4>
                    Pakistan <sub>(Yet to bat)</sub>
                  </h4>
                </Col>
                <Col span={12}>
                  <section style={{ fontSize: '20px' }}>
                    <h4> CRR: {calculateCRR(team.runs, team.overs)?.toFixed(2)} |</h4>
                    <h4> RRR: {'11'} |</h4>
                    <h4> Extras: {calculateExtras(extras)}</h4>
                  </section>
                </Col>
              </Col>
            </Card>
          </Col>


          {/* Card2 */}
          <Col span={12}>
            {' '}
            <Card style={{ height: '200px' }}>
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

        </Row>
        <Row gutter={[16, 16]}>
          {/* Card3 */}
          <Col span={12}>
            <Card style={{ height: '250px' }}>
              <section style={{ display: 'flex' }}>
                <div style={{ width: '50%' }}>
                  <h3>{'Batsman'}</h3>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', alignItems: 'center' }}>
                  <h4>Runs</h4>
                  <h4>Balls</h4>
                  <h4>Fours</h4>
                  <h4>Sixes</h4>
                  <h4>S/R</h4>
                </div>
              </section>
              {Object.keys(batsmans).map((key) => {
                let temp = batsmans[key];
                return (
                  <section
                    style={{
                      display: 'flex',
                      borderRadius: 5,
                      background: temp.id == striker ? '#eb4034' : 'white',
                      paddingLeft: 10,
                      cursor: 'pointer',
                    }}
                    onClick={handleChangeStrike}
                  >
                    <div style={{ width: '50%', color: temp.id == striker ? 'white' : 'black', }}>
                      <h3 onPress={() => setStriker(temp.id.toString())}>{temp.name}</h3>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', alignItems: 'center', color: temp.id == striker ? 'white' : 'black', }}>
                      <h4>{temp.runs}</h4>
                      <h4>{temp.balls}</h4>
                      <h4>{temp.fours}</h4>
                      <h4>{temp.sixes}</h4>
                      <h4>{calculateStrikeRate(temp)?.toFixed(2)}</h4>
                    </div>
                  </section>
                );
              })}

              {/* Batting Time Line */}
              {Object.keys(batsmans).map((key) => {
                let currentBatsman = batsmans[key];
                return (
                  <section style={styles.timeline}>
                    <span style={styles.timeline}>
                      {currentBatsman.name} Time Line:
                    </span>
                    {currentBatsman.timeline.map((el, index) => (
                      <span style={styles.timeline}> {el} </span>
                    )).reverse()}
                  </section>
                );
              })}

              <section style={{ display: 'flex' }}>
                <div style={{ width: '50%' }}>
                  <h3>{'Bowler'}</h3>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', alignItems: 'center' }}>
                  <h4>Overs</h4>
                  <h4>Runs</h4>
                  <h4>Wickets</h4>
                  <h4>Maiden</h4>
                  <h4>Econ</h4>
                </div>
              </section>


              <section
                style={{
                  display: 'flex',
                  borderRadius: 5,
                  background: '#eb4034',
                  paddingLeft: 10,
                  cursor: 'pointer',
                }}
              >
                <div style={{ width: '50%', color: 'white' }}>
                  <h3 onPress={() => setStriker(bowler.id.toString())}>{bowler.name}</h3>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', alignItems: 'center', color: bowler.id == striker ? 'white' : 'black', }}>
                  <h4>{calculateOvers(bowler)?.overs + '.' + calculateOvers(bowler)?.balls}</h4>
                  <h4>{bowler.runs}</h4>
                  <h4>{bowler.balls}</h4>
                  <h4>{bowler.fours}</h4>
                  <h4>{bowler.sixes}</h4>
                  <h4>{calculateEconomyRate(bowler)?.toFixed(2)}</h4>
                </div>
              </section>

              {/* Bowling Time Line */}
              <section style={styles.timeline}>
                <span style={styles.timeline}>This Over: </span>
                {bowler.timeline.map((el) => (
                  <span style={styles.timeline}> 0 </span>
                ))}
              </section>
            </Card>
          </Col>
          {/* Card4 */}
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

                <DropDown options={byOptions} title="B" handleChange={(runs) => handleExtras(runs, Extras.BYES)} />
                <DropDown options={legByOptions} title="Lb" handleChange={(runs) => handleExtras(runs, Extras.LEG_BYES)} />
                <DropDown options={wideOptions} title="W" handleChange={(runs) => handleExtras(runs, Extras.WIDE)} />
                <DropDown options={noBallOptions} title="N" handleChange={(runs) => handleExtras(runs, Extras.NO_BALLS)} />
                <DropDown options={wicketOptions} title="Wk" handleChange={(runs) => handleExtras(runs, Extras.WIDE)} />
                <DropDown options={wicketOptions} title="..." handleChange={(runs) => handleExtras(runs, Extras.WIDE)} />

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
  timeline: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "flex-start",
    marginLeft: 5,
    fontSize: 12,
  },
};
