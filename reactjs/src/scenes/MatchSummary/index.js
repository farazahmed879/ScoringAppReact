import React, { useEffect, useState } from 'react';
import { Card, PageHeader, Tabs, Icon, Collapse, Row, Col, Radio } from 'antd';
import { Link, useParams, useHistory } from 'react-router-dom';
import AppConsts from '../../lib/appconst';
import { Label } from 'recharts';
import Scorecard from './scoreacard';
import ScoreCardService from '../../services/scoreCard/ScoreCardService';
import PlayerViewBox from '../../components/PlayerViewBox';
import moment from 'moment';
const MatchSummary = () => {
  const [firstInningBatsman, setFirstInningBatsman] = useState([]);
  const [secondInningBatsman, setSecondInningBatsman] = useState([]);
  const [firstInningBowler, setFirstInningBowler] = useState([]);
  const [secondInningBowler, setSecondInningBowler] = useState([]);
  const [team1Score, setTeam1Score] = useState({});
  const [team2Score, setTeam2Score] = useState({});
  const [matchDetails, setMatchDetails] = useState({
    matchResult: '',
    matchDate: 0,
    toss: '',
    stadium: '',
    matchType: ''
  });

  const [team1PlayerList, setTeam1PlayerList] = useState([]);
  const [team2PlayerList, setTeam2PlayerList] = useState([]);

  const [selectedInning, setInning] = useState(1);

  const { TabPane } = Tabs;
  const { Panel } = Collapse;
  const param = useParams();
  const history = useHistory();

  const handleRadio = (e) => {
    console.log('e', e.target.value);
    setInning(e.target.value);
  };

  const callback = (key) => {
    console.log(key);
  };

  useEffect(() => {
    getTeamScorecard();
    getTeamPlayersByMatchId();
  }, []);

  const getTeamScorecard = () => {
    ScoreCardService.getTeamScorecard(+param.team1Id, +param.team2Id, param.matchId).then((res) => {
      if (res.success) {
        console.log('scorecard', res);
        setFirstInningBatsman(res.result.firstInningBatsman);
        setSecondInningBatsman(res.result.secondInningBatsman);
        setFirstInningBowler(res.result.firstInningBowler);
        setSecondInningBowler(res.result.secondInningBowler);
        setTeam1Score(res.result.team1Score);
        setTeam2Score(res.result.team2Score);
        setMatchDetails({
          matchResult: res.result.matchResult,
          matchDate: res.result.date,
          toss: res.result.toss,
          stadium: res.result.ground,
          matchType: res.result.matchType
        });
      }
    });
  };

  const getTeamPlayersByMatchId = () => {
    ScoreCardService.getTeamPlayersByMatchId(param.matchId).then((res) => {
      if (res) {
        let tp1 = res.filter((i) => i.teamId == +param.team1Id);
        let tp2 = res.filter((i) => i.teamId == +param.team2Id);
        setTeam1PlayerList(tp1);
        setTeam2PlayerList(tp2);
      }
    });
  };

  return (
    <Card>
      <PageHeader
        style={{
          border: '1px solid rgb(235, 237, 240)',
        }}
        onBack={history.goBack}
        title={'Match Summary'}
      />
      <Card>
        <h1>{moment(matchDetails.date).format('DD MMM YYYY')}</h1>
        <Row style={{ margin: '100px', textAlign: 'center' }}>
          <Col span={6}>
            <div>
              <img src={AppConsts.dummyImage} height={50} width={50} />
            </div>
            <h1>{team1Score.name}</h1>
          </Col>
          <Col span={6}>
            <h1>
              {team1Score.score}/{team1Score.wickets}
            </h1>
          </Col>
          <Col span={6}>
            <h1>
              {team2Score.score}/{team2Score.wickets}
            </h1>
          </Col>
          <Col span={6}>
            <div>
              <img src={AppConsts.dummyImage} height={50} width={50} />
            </div>
            <h1>{team2Score.name}</h1>
          </Col>
        </Row>
        <Row style={{ textAlign: 'center' }}>
          <h1>{matchDetails.matchResult}</h1>
        </Row>

        <Row style={{ textAlign: 'center' }}>
          <h1>{matchDetails.matchType}</h1>
        </Row>
      </Card>
      <Tabs defaultActiveKey="1" style={{ marginTop: '5px', textAlign: 'center' }}>
        <TabPane
          tab={
            <span>
              <Icon type="apple" />
              Summary
            </span>
          }
          key="1"
        >
          <Row style={{ textAlign: 'left', marginLeft: '15%', marginRight: '15%' }}>
            <PageHeader
              style={{
                border: '1px solid rgb(235, 237, 240)',
              }}
              title={'Pakistan - 162/8 (20)'}
            />
            <Col span={12}>
              <Col span={20}>
                <h1>Babar Azam</h1>
                <h1>Khushdil Shah</h1>
                <h1>Muhammad Rizwan</h1>
              </Col>
              <Col span={4}>
                <h1>66 (46)</h1>
                <h1>24 (21)</h1>
                <h1>23 (19)</h1>
              </Col>
            </Col>
            <Col span={12}>
              <Col span={18}>
                <h1>Nathan Ellis</h1>
                <h1>Cameron Green</h1>
                <h1>Sean Abbot</h1>
              </Col>
              <Col span={6}>
                <h1>4/48 (4)</h1>
                <h1>2/16 (3)</h1>
                <h1>1/28 (4)</h1>
              </Col>
            </Col>
          </Row>
          <Row style={{ textAlign: 'left', marginLeft: '15%', marginRight: '15%', marginTop: '20px' }}>
            <PageHeader
              style={{
                border: '1px solid rgb(235, 237, 240)',
              }}
              title={'Australia - 163/7 (19.1)'}
            />
            <Col span={12}>
              <Col span={20}>
                <h1>Babar Azam</h1>
                <h1>Khushdil Shah</h1>
                <h1>Muhammad Rizwan</h1>
              </Col>
              <Col span={4}>
                <h1>66 (46)</h1>
                <h1>24 (21)</h1>
                <h1>23 (19)</h1>
              </Col>
            </Col>
            <Col span={12}>
              <Col span={18}>
                <h1>Nathan Ellis</h1>
                <h1>Cameron Green</h1>
                <h1>Sean Abbot</h1>
              </Col>
              <Col span={6}>
                <h1>4/48 (4)</h1>
                <h1>2/16 (3)</h1>
                <h1>1/28 (4)</h1>
              </Col>
            </Col>
          </Row>
          <Row style={{ marginTop: '10px' }}>
            <h2>Toss: Australia won the toss and decided to bat first</h2>
            <h2>Ground: Pak Star</h2>
          </Row>
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="android" />
              Scorecard
            </span>
          }
          key="2"
        >
          <div style={{ textAlign: 'center' }}>
            <Radio.Group
              onChange={(e) => handleRadio(e)}
              defaultValue="1"
              buttonStyle="solid"
              style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}
            >
              <Radio.Button value="1">{team1Score.name}</Radio.Button>
              <Radio.Button value="2">{team2Score.name}</Radio.Button>
            </Radio.Group>
          </div>
          <Scorecard
            batsman={selectedInning == 1 ? firstInningBatsman : secondInningBatsman}
            bowler={selectedInning == 1 ? firstInningBowler : secondInningBowler}
            teamScore={selectedInning == 1 ? team1Score : team2Score}
            matchDetails = {matchDetails}
          ></Scorecard>
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="android" />
              Plot
            </span>
          }
          key="3"
        ></TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="android" />
              Teams
            </span>
          }
          key="4"
        >
          <Collapse defaultActiveKey={['1']} onChange={callback}>
            <Panel header="Team1" key="1">
              <PlayerViewBox data={team1PlayerList}></PlayerViewBox>
            </Panel>
            <Panel header="Team2" key="2">
              <PlayerViewBox data={team2PlayerList}></PlayerViewBox>
            </Panel>
          </Collapse>
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="android" />
              Gallery
            </span>
          }
          key="5"
        ></TabPane>
      </Tabs>
    </Card>
  );
};
export default MatchSummary;
