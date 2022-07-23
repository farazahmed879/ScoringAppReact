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
    console.log('e', e.target.value);
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
      console.log('Gallery', res);
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
          <h1>{moment(matchDetails.date).format('DD MMM YYYY')}</h1>
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
          <Skeleton loading={loading}>
            <Row style={{ textAlign: 'left', marginLeft: '15%', marginRight: '15%' }}>
              <PageHeader
                style={{
                  border: '1px solid rgb(235, 237, 240)',
                }}
                title={team1Score.name + ' - ' + team1Score.score + '/' + team1Score.wickets + '(' + team1Score.overs + ')'}
              />

              <Col span={12} style={{ padding: '10px' }}>
                {firstInningTop3Batsman.map((data, index) => (
                  <Row id={index}>
                    <Col span={20}>
                      <h1>{data.playerName}</h1>
                    </Col>
                    <Col span={4}>
                      <h1>
                        {data.runs} ({data.balls})
                      </h1>
                    </Col>
                  </Row>
                ))}
              </Col>
              <Col span={12} style={{ padding: '10px' }}>
                {firstInningTop3Bowler.map((data, index) => (
                  <Row id={index}>
                    <Col span={20}>
                      <h1>{data.playerName || '-'}</h1>
                    </Col>
                    <Col span={4}>
                      <h1>
                        {data.wickets || '-'}/{data.runs || '-'} ({data.overs || '-'})
                      </h1>
                    </Col>
                  </Row>
                ))}
              </Col>
            </Row>
            <Row style={{ textAlign: 'left', marginLeft: '15%', marginRight: '15%', marginTop: '20px' }}>
              <PageHeader
                style={{
                  border: '1px solid rgb(235, 237, 240)',
                }}
                title={team2Score.name + ' - ' + team2Score.score + '/' + team2Score.wickets + '(' + team2Score.overs + ')'}
              />
              <Col span={12} style={{ padding: '10px' }}>
                {secondInningTop3Batsman.map((data, index) => (
                  <Row id={index}>
                    <Col span={20}>
                      <h1>{data.playerName}</h1>
                    </Col>
                    <Col span={4}>
                      <h1>
                        {data.runs} ({data.balls})
                      </h1>
                    </Col>
                  </Row>
                ))}
              </Col>
              <Col span={12} style={{ padding: '10px' }}>
                {secondInningTop3Bowler.map((data, index) => (
                  <Row id={index}>
                    <Col span={20}>
                      <h1>{data.playerName || '-'}</h1>
                    </Col>
                    <Col span={4}>
                      <h1>
                        {data.wickets || '-'}/{data.runs || '-'} ({data.overs || '-'})
                      </h1>
                    </Col>
                  </Row>
                ))}
              </Col>
            </Row>
            <Row style={{ textAlign: 'left', marginTop: '10px', marginLeft: '15%', marginRight: '15%' }}>
              <h1>Toss: {matchDetails.toss || 'N/A'}</h1>
              <h1>Ground: {matchDetails.ground || 'N/A'}</h1>
            </Row>
          </Skeleton>
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
