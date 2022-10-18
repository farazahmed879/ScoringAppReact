import { Button, Card, Col, Divider, Icon, List, Menu, Modal, PageHeader, Progress, Radio, Row } from 'antd';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { set } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import CustomList from '../../components/CustomList';
import { byOptions, legByOptions, noBallOptions, playingRoleOptions, WICKETCONST, wicketOptions, wideOptions } from '../../components/Enum/enum';
import CustomModal from '../../components/Modal';
import UserList from '../../components/UserList/indes';
import { ERRORMESSAGE, Extras } from '../../lib/appconst';
import genderConst from '../../lib/genderConst';
import liveScoringService from '../../services/live-scoring/liveScoringService';
import playerService from '../../services/player/playerService';
import CeleberationDialog from './celeberationDialog';
import DropDown from './dropDown';
import RunOutDialog from './runoutDialog';

const dummyData = {
  currentInning: '',
  playingTeamId: 0,
  bowlingTeamId: 0,
  strikerId: 0,
  nonStrikerId: 0,
  batsmans: {
    1: {
      runs: 0,
      id: 0,
      name: '',
      sixes: 0,
      fours: 0,
      balls: 0,
      timeline: [],
    },
    2: {
      runs: 0,
      id: 0,
      name: '',
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
    id: 0,
    name: '',
    newOver: false,
  },
  team1: {
    runs: 0,
    teamId: 0,
    overs: 0,
    wickets: 0,
    name: '',
  },
  team2: {
    name: '',
    runs: 0,
    id: 0,
    wickets: 0,
    overs: 0,
  },
  partnership: {
    matchId: 0,
    teamId: 0,
    wicketNo: 0,
    totalRuns: 0,
    startTime: 0,
    endTime: 0,
    extras: 0,
    six: 0,
    four: 0,
    playerOutId: 0,
    //player2
    player1Id: 0,
    player1Name: 0,
    player1Runs: 0,
    player1Balls: 0,
    player1Six: 0,
    player1Four: 0,

    //player2
    player2Id: 0,
    player2Name: 0,
    player2Runs: 0,
    player2Balls: 0,
    player2Six: 0,
    player2Four: 0,
  },
  extras: {
    wides: 0,
    legByes: 0,
    byes: 0,
    NoBalls: 0,
  },
};

const success = Modal.success;
const error = Modal.error;

const LiveScoring = () => {
  const history = useHistory();
  const param = useParams();
  const [data, setData] = React.useState(dummyData);

  const [strikerId, setStrikerId] = React.useState(dummyData.strikerId);
  const [nonStrikerId, setNonStrikerId] = React.useState(dummyData.nonStrikerId);
  const [playingTeamId, setPlayingTeamId] = useState();
  const [bowlingTeamId, setBowlingTeamId] = useState();
  const [currentInning, setCurrentInning] = useState(dummyData.currentInning);
  const [team1, setTeam1] = useState(dummyData.team1);
  const [team2, setTeam2] = useState(dummyData.team2);
  const [batsmans, setBatsmans] = useState(dummyData.batsmans);
  const [bowler, setBowler] = useState(dummyData.bowler);
  const [extras, setExtras] = useState(dummyData.extras);
  const [partnership, setPartnership] = useState(dummyData.partnership);

  //
  const [isCeleberationVisible, setIsCeleberationVisible] = useState(false);
  const [isNewBowler, setIsNewBowler] = useState(false);
  const [isNewBatsman, setIsNewBatsman] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const [isRunOutDialog, setIsRunOutDialog] = useState(false);

  //
  const [team1AllPlayers, setTeam1AllPlayers] = useState([]);
  const [team2AllPlayers, setTeam2AllPlayers] = useState([]);
  const [team2Bowlers, setTeam2Bowlers] = useState([]);

  useEffect(() => {
    getLiveScoringData(param.matchId);
  }, []);

  useEffect(() => {
    if (bowler.totalBalls % 6 == 0 && bowler.totalBalls != 0 && !bowler.newOver) {
      setIsNewBowler(true);
      getAllBowlers(bowlingTeamId);
    }
  }, [bowler]);

  const getAllBowlers = (teamId) => {
    setInitLoading(true);
    if (team2AllPlayers.length == 0)
      playerService.getAllByTeamId(teamId).then((res) => {
        console.log('Team Player', res);
        setInitLoading(false);
        if (teamId == playingTeamId) {
          setTeam1AllPlayers(res);
        }
        if (teamId == bowlingTeamId) {
          setTeam2AllPlayers(res);
        }
      });
  };

  const getBatsmanOrBowlers = (teamId) => {
    setInitLoading(true);
    playerService.getTeamPlayersByMatchId(param.matchId, teamId).then((res) => {
      console.log('Team Player', res);
    });
  };

  const getLiveScoringData = (id) => {
    liveScoringService.Get(id).then((res) => {
      debugger;
      if (!res.success) return error({ title: res.successMessage });
      // if(res.result.errorMessage == ERRORMESSAGE.STRIKER_NOT_FOUND || res.result.errorMessage == ERRORMESSAGE.NON_STRIKER_NOT_FOUND){
      //   setTeam1AllPlayers(res.result.playerList.filter(i=> i.howOutId == WICKETCONST.Not_Out));
      //   setIsNewBatsman(true);
      //   return
      // }
      const data = res.result;
      mappData(data);
    });
  };

  const mappData = (data) => {
    debugger;
    if (data.strikerId) setStrikerId(data.strikerId);
    if (data.nonStrikerId) setNonStrikerId(data.nonStrikerId);
    if (data.playingTeamId) setPlayingTeamId(data.playingTeamId);
    if (data.bowlingTeamId) setBowlingTeamId(data.bowlingTeamId);
    if (data.currentInning) setCurrentInning(data.currentInning);
    if (data.team1) setTeam1(data.team1);
    if (data.team2) setTeam2(data.team2);
    if (data.batsmans) setBatsmans(data.batsmans);
    if (data.bowler) setBowler(data.bowler);
    if (data.extras) setExtras(data.extras);
    if (data.partnership) setPartnership(data.partnership);

    if (Object.keys(data.batsmans).length < 2) {
      setTeam1AllPlayers(data.players);
      setIsNewBatsman(true);
    }
  };

  const handleSubmit = (runs, ballType) => {
    const req = {
      runs: runs,
      team1Id: team1.teamId,
      team2Id: team2.teamId,
      matchId: param.matchId,
      batsmanId: strikerId,
      nonStrikerId: nonStrikerId,
      bowlerId: bowler.id,
      extras: ballType,
    };
    liveScoringService.updateLiveScore(req).then((res) => {
      //res.success && ? success({ title: res.successMessage }) : error({ title: res.successMessage });
      console.log(res);
      mappData(res.result);
    });
  };

  //update state
  const handleRuns = (runs, ballType) => {
    handleSubmit(runs, ballType);
    // switch (ballType) {
    //   case Extras.WIDE:
    //     updateTeamScore(runs);
    //     updateBowlerScore(runs++, Extras.WIDE);
    //     break;
    //   case Extras.NO_BALLS:
    //     updateTeamScore(runs);
    //     updateBatsmanScore(runs);
    //     updateBowlerScore(runs++, Extras.NO_BALLS);
    //     break;
    //   case Extras.BYES:
    //     updateTeamScore(runs);
    //     updateBowlerScore(runs, Extras.BYES);
    //     updateBatsmanScore(0);
    //     break;
    //   case Extras.LEG_BYES:
    //     updateTeamScore(runs);
    //     updateBowlerScore(runs, Extras.LEG_BYES);
    //     updateBatsmanScore(0);
    //     break;
    // }

    // handleSubmit(strikerId);
    // if (runs % 2 != 0) handleChangeStrike(runs);
  };

  const handleWicket = (howOutId) => {
    console.log(howOutId);
    if (howOutId == WICKETCONST.Run_Out) {
      let currentBatsmans = [];
      getAllBowlers(bowlingTeamId);
      Object.keys(batsmans).map((el) => {
        currentBatsmans.push(batsmans[el]);
      });
      setTeam1AllPlayers(currentBatsmans);
      return setIsRunOutDialog(true);
    }
    const batmanId = strikerId;
    const req = {
      strikerId: strikerId,
      howOutId: howOutId,
      batsmanId: batmanId,
      matchId: param.matchId,
      team1Id: playingTeamId,
      team2Id: bowlingTeamId,
      bowlerId: bowler.id,
      fielderId: 0,
      runs: 0,
      extra: 0,
      isByeOrLegBye: false,
    };
    handleWicketSubmit(req);
  };

  const handleRunOut = (e) => {
    debugger;
    const req = {
      strikerId: strikerId,
      howOutId: WICKETCONST.Run_Out,
      batsmanId: e?.batsman?.id,
      matchId: param.matchId,
      team1Id: playingTeamId,
      team2Id: bowlingTeamId,
      bowlerId: bowler.id,
      fielderId: e.fielderId,
      runs: e.runs,
      wideOrNoBall: e.wideOrNoBall,
      buyOrlegBye: e.buyOrlegBye,
    };
    handleWicketSubmit(req);
  };

  const handleWicketSubmit = (req) => {
    liveScoringService.changeBatsman(req).then((res) => {
      if (!res.success) return error({ title: res.successMessage });
      setTeam1AllPlayers(res.data.filter((i) => i.howOutId == 1));
      setIsNewBatsman(true);
      setIsRunOutDialog(false);
    });
  };

  const updateTeamScore = (runs) => {
    setTeam1({ ...team1, runs: team1.runs + runs });
    runs % 2 != 0 && handleChangeStrike(runs);
  };

  const updateBatsmanScore = (runs) => {
    if (runs == 6) setIsCeleberationVisible(true);
    const batsman = batsmans[strikerId];
    let timeLine = batsman.timeline;
    console.log('timeLine', timeLine);
    timeLine.push(runs);
    setBatsmans({
      ...batsmans,
      [strikerId]: {
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
    const balls = (bowler.totalBalls + toAddBalls) % 6;
    console.log(balls);
    setBowler({
      ...bowler,
      runs: bowler.runs + toAddRuns,
      totalBalls: bowler.totalBalls + toAddBalls,
      balls: balls,
    });
  };

  // const handleRuns = (runs) => {
  //   // updateScore(runs);
  //   // handleSubmit(strikerId);
  //   // if (runs % 2 != 0) handleChangeStrike(runs);
  // };

  const handleChangeStrike = () => {
    setStrikerId(Object.keys(batsmans).filter((i) => i != strikerId)[0]);
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
      obj.overs = +data.totalBalls / 6;
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

  const calculateExtras = (data) => {
    const sumValues = Object.values(data).reduce((a, b) => a + b);
    return sumValues;
  };

  const handleSelectNewBatsman = (event) => {
    debugger;
    var req = {
      batsmanId: event.id,
      matchId: param.matchId,
      teamId: playingTeamId,
    };
    liveScoringService.updateNewBatsman(req).then((res) => {
      if (!res.success) return error({ title: res.successMessage });
      const data = res.result;
      setIsNewBatsman(false);
      mappData(data);
    });
  };

  const handleSelectedBowler = (event) => {
    var req = {
      prevBowlerId: bowler.id,
      newBowlerId: event.id,
      matchId: param.matchId,
      teamId: bowlingTeamId,
    };
    liveScoringService.changeBowler(req).then((res) => {
      if (!res.success) return error({ title: res.successMessage });
      const data = res.result;
      setIsNewBowler(false);
      mappData(data);
    });
  };

  const calculatePercentage = (total, obtain) => {
    return (obtain * 100) / total;
  };

  //s console.log('data', data);
  console.log('batsman', batsmans);
  console.log('team1AllPlayers', team1AllPlayers);
  console.log('bowler', bowler);

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
                    {team1.name},{' '}
                    {currentInning == 1 ? (
                      <>
                        1<sup>st</sup> Inning
                      </>
                    ) : (
                      <>
                        2<sup>nd</sup> Inning
                      </>
                    )}
                  </h4>
                  <section style={{ fontSize: '30px', display: 'flex', alignItems: 'center' }}>
                    <h2>
                      {team1.runs}/{team1.wickets}
                    </h2>
                    <h4> ({team1.overs}) ov</h4>
                  </section>
                  <h4>
                    {team2.name} <sub>(Yet to bat)</sub>
                  </h4>
                </Col>
                <Col span={12}>
                  <section style={{ fontSize: '20px' }}>
                    <h4> CRR: {calculateCRR(team1.runs, team1.overs)?.toFixed(2)} |</h4>
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
              {currentInning == 1 && (
                <>
                  <Row>
                    <h1>
                      Inning : 1<sup>st</sup>
                    </h1>
                  </Row>
                </>
              )}
              {currentInning == 2 && (
                <>
                  <Row>
                    <h1>
                      Inning : 2<sup>nd</sup>
                    </h1>
                  </Row>
                  <Row>
                    <h1> Target : {team2.runs}</h1>
                  </Row>
                </>
              )}
              {currentInning == 2 && (
                <Row>
                  <h1>Required Run Rate : {'22'}</h1>
                </Row>
              )}
              <Row>
                <section style={{ display: 'flex' }}>
                  <div style={{ width: '10%' }}>
                    <h3>{'Partnership:'}</h3>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-around', width: '80%', alignItems: 'center' }}>
                    <h4>
                      {partnership?.player1Name}{' '}
                      <Progress showInfo={false} percent={calculatePercentage(partnership.totalRuns, partnership.player1Runs)} status="active" />
                      {partnership?.player1Runs}
                    </h4>
                    <h4>
                      {partnership?.player2Name}{' '}
                      <Progress showInfo={false} percent={calculatePercentage(partnership.totalRuns, partnership.player1Runs)} status="active" />
                      {partnership?.player2Runs}
                    </h4>
                  </div>
                </section>
              </Row>

              <Col span={6}>
                <div style={{ width: '50%', marginLeft: '10px' }}>
                  <h3 style={{ fontSize: '40px' }}>{partnership.totalRuns}*</h3>
                </div>
              </Col>
              <Col span={15}>
                <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', alignItems: 'center' }}>
                  <h4>Balls</h4>
                  <h4>Fours</h4>
                  <h4>Sixes</h4>
                  <h4>S/R</h4>
                </div>

                <div style={{ width: '50%' }}></div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    width: '100%',
                    alignItems: 'center',
                  }}
                >
                  <h4>{partnership?.player1Balls + partnership?.player2Balls}</h4>
                  <h4>{partnership?.four}</h4>
                  <h4>{partnership?.six}</h4>
                  <h4>{}</h4>
                </div>
              </Col>
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
                      background: temp.id == strikerId ? '#eb4034' : 'white',
                      paddingLeft: 10,
                      cursor: 'pointer',
                    }}
                    onClick={handleChangeStrike}
                  >
                    <div style={{ width: '50%', color: temp.id == strikerId ? 'white' : 'black' }}>
                      <h3 onPress={() => setStrikerId(temp.id.toString())}>{temp.name}</h3>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        width: '100%',
                        alignItems: 'center',
                        color: temp.id == strikerId ? 'white' : 'black',
                      }}
                    >
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
                    <span style={styles.timeline}>{currentBatsman.name} Time Line:</span>
                    {currentBatsman.timeline.map((el, index) => <span style={styles.timeline}> {el} </span>).reverse()}
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
                  <h3 onPress={() => setStrikerId(bowler.id.toString())}>{bowler.name}</h3>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    width: '100%',
                    alignItems: 'center',
                    color: bowler.id == strikerId ? 'white' : 'black',
                  }}
                >
                  <h4>{parseInt(calculateOvers(bowler)?.overs || 0) + '.' + bowler.balls}</h4>
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
            <Card style={{ height: '250px' }}>
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
                  <Button
                    key={index}
                    style={{ margin: '10px', height: '60px', width: '60px' }}
                    value="1"
                    onClick={() => handleRuns(el, Extras.NO_EXTRA)}
                  >
                    {el}
                  </Button>
                ))}

                <DropDown options={byOptions} title="B" handleChange={(runs) => handleRuns(runs, Extras.BYES)} />
                <DropDown options={legByOptions} title="Lb" handleChange={(runs) => handleRuns(runs, Extras.LEG_BYES)} />
                <DropDown options={wideOptions} title="W" handleChange={(runs) => handleRuns(runs, Extras.WIDE)} />
                <DropDown options={noBallOptions} title="N" handleChange={(runs) => handleRuns(runs, Extras.NO_BALLS)} />
                <DropDown options={wicketOptions} title="Wk" handleChange={(wicket) => handleWicket(wicket)} />
                <DropDown options={wicketOptions} title="..." handleChange={(runs) => handleRuns(runs, Extras.WIDE)} />
              </Col>
            </Card>
          </Col>
        </Row>
        <CustomModal title="Select Bowler" isModalVisible={isNewBowler}>
          <UserList data={team2AllPlayers.filter((i) => i.id != bowler.id)} handleResponse={handleSelectedBowler} />
        </CustomModal>
        <CustomModal title="Select Batsman" isModalVisible={isNewBatsman}>
          <UserList data={team1AllPlayers} handleResponse={handleSelectNewBatsman} />
        </CustomModal>
        <RunOutDialog isOpen={isRunOutDialog} handleSubmit={handleRunOut} team1Players={team1AllPlayers} team2Players={team2AllPlayers} />
        <CeleberationDialog handleOk={() => setIsCeleberationVisible(false)} isVisible={isCeleberationVisible} />
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
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: 5,
    fontSize: 12,
  },
};
