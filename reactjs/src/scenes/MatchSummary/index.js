import React, { useEffect, useState } from 'react';
import { Card, PageHeader, Tabs, Icon, Collapse, Row, Col, Radio, Result, Button, Empty, Skeleton } from 'antd';
import { Link, useParams, useHistory } from 'react-router-dom';
import AppConsts from '../../lib/appconst';
import { Label } from 'recharts';
import Scorecard from './scoreacard';
import ScoreCardService from '../../services/scoreCard/ScoreCardService';
import PlayerViewBox from '../../components/PlayerViewBox';
import moment from 'moment';
import GalleryService from '../../services/gallery/GalleryService';
import ViewGallery from '../../components/ViewGallery/ViewGallery';
import getImage from '../../lib/getImage';
import AssignAdmin from '../../components/AssignAdmin';
import Summary from './summary';
const MatchSummary = () => {
  const [firstInningBatsman, setFirstInningBatsman] = useState([]);
  const [secondInningBatsman, setSecondInningBatsman] = useState([]);
  const [firstInningBowler, setFirstInningBowler] = useState([]);
  const [secondInningBowler, setSecondInningBowler] = useState([]);

  const [firstInningTop3Batsman, setFirstInningTop3Batsman] = useState([]);
  const [secondInningTop3Batsman, setSecondInningTop3Batsman] = useState([]);
  const [firstInningTop3Bowler, setFirstInningTop3Bowler] = useState([]);
  const [secondInningTop3Bowler, setSecondInningTop3Bowler] = useState([]);

  const [team1Score, setTeam1Score] = useState({});
  const [team2Score, setTeam2Score] = useState({});
  const [matchDetails, setMatchDetails] = useState({
    matchResult: '',
    matchDate: 0,
    toss: '',
    stadium: '',
    matchType: '',
  });

  const [team1PlayerList, setTeam1PlayerList] = useState([]);
  const [team2PlayerList, setTeam2PlayerList] = useState([]);

  const [selectedInning, setInning] = useState(1);

  const [loading, setLoading] = useState(true);
  const [playersLoading, setPlayersLoading] = useState(true);

  const [gallery, setGAllery] = useState([]);

  const { TabPane } = Tabs;
  const { Panel } = Collapse;
  const param = useParams();
  const history = useHistory();

  const handleRadio = (e) => {
    setInning(e.target.value);
  };

  const callback = (key) => {
    console.log(key);
  };

  useEffect(() => {
    getGallery(param.matchId);
    getTeamScorecard();
    getTeamPlayersByMatchId();
  }, []);

  const getTeamScorecard = () => {
    ScoreCardService.getTeamScorecard(+param.team1Id, +param.team2Id, param.matchId).then((res) => {
      if (res.success) {
        setLoading(false);
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
          matchType: res.result.matchType,
        });
        setFirstInningTop3Batsman(res.result.firstInningTop3Batsman);
        setSecondInningTop3Batsman(res.result.secondInningTop3Batsman);
        setFirstInningTop3Bowler(res.result.firstInningTop3Bowler);
        setSecondInningTop3Bowler(res.result.secondInningTop3Bowler);
      }
    });
  };

  const getTeamPlayersByMatchId = () => {
    ScoreCardService.getTeamPlayersByMatchId(param.matchId).then((res) => {
      if (res) {
        setPlayersLoading(false);
        let tp1 = res.filter((i) => i.teamId == +param.team1Id);
        let tp2 = res.filter((i) => i.teamId == +param.team2Id);
        setTeam1PlayerList(tp1);
        setTeam2PlayerList(tp2);
      }
    });
  };
  const getGallery = (id) => {
    GalleryService.getAllByEntity(undefined, undefined, undefined, id, undefined).then((res) => {
      if (res.success) {
        setGAllery(res.result);
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
        <Skeleton loading={loading}>
          <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h1>{moment(matchDetails.date).format('DD MMM YYYY')}</h1>
            </div>
            <div>
              {' '}
              <AssignAdmin entityId={param.matchId} title={'Assign Match'} entityName="matchId" />
            </div>
          </Row>

          <Row style={{ margin: '100px', textAlign: 'center' }}>
            <Col span={6}>
              <div>
                <img src={getImage(team1Score.profileUrl)} height={50} width={50} />
              </div>
              <Link to={'/teamProfile/' + team1Score.id}>
                <h1>{team1Score.name}</h1>
              </Link>
            </Col>
            <Col span={6}>
              <h1>
                {team1Score.score || 0}/{team1Score.wickets || 0}
              </h1>
            </Col>
            <Col span={6}>
              <h1>
                {team2Score.score || 0}/{team2Score.wickets || 0}
              </h1>
            </Col>
            <Col span={6}>
              <div>
                <img src={getImage(team2Score.profileUrl)} height={50} width={50} />
              </div>
              <Link to={'/teamProfile/' + team2Score.id}>
                <h1>{team2Score.name}</h1>
              </Link>
            </Col>
          </Row>
          <Row style={{ textAlign: 'center' }}>
            <h1>{matchDetails.matchResult}</h1>
          </Row>

          <Row style={{ textAlign: 'center' }}>
            <h1>{matchDetails.matchType}</h1>
          </Row>
        </Skeleton>
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
          <Summary
            loading={loading}
            team1Score={team1Score}
            team2Score={team2Score}
            firstInningTop3Batsman={firstInningTop3Batsman}
            firstInningTop3Bowler={firstInningTop3Bowler}
            secondInningTop3Batsman={secondInningTop3Batsman}
            secondInningTop3Bowler={secondInningTop3Bowler}
            matchDetails={matchDetails}
            isShowResult={false}
          />
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
          <Skeleton loading={loading}>
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
              matchDetails={matchDetails}
            ></Scorecard>
          </Skeleton>
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="android" />
              Plot
            </span>
          }
          key="3"
        >
          <Result
            status="warning"
            title="Coming Soon"
            extra={
              <Button type="primary" key="console">
                Go Console
              </Button>
            }
          ></Result>
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="android" />
              Teams
            </span>
          }
          key="4"
        >
          <Skeleton loading={playersLoading}>
            <Collapse defaultActiveKey={['1']} onChange={callback}>
              <Panel header={team1Score.name} key="1">
                <PlayerViewBox data={team1PlayerList}></PlayerViewBox>
              </Panel>
              <Panel header={team2Score.name} key="2">
                <PlayerViewBox data={team2PlayerList}></PlayerViewBox>
              </Panel>
            </Collapse>
          </Skeleton>
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="android" />
              Gallery
            </span>
          }
          key="5"
        >
          <ViewGallery data={gallery}></ViewGallery>
        </TabPane>
      </Tabs>
    </Card>
  );
};
export default MatchSummary;
