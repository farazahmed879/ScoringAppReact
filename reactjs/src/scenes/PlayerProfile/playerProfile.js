import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import playerService from '../../services/player/playerService';
import TeamService from '../../services/team/TeamService';
import matchService from '../../services/match/matchService';
import { truncateText } from '../../helper/helper';
import { Col, Row, Drawer, Divider, Card, Tabs, Icon, Collapse, Empty, Tooltip, Tag } from 'antd';
import './style.css';
import AppConsts from '../../lib/appconst';
const { TabPane } = Tabs;
const { Panel } = Collapse;
const pStyle = {
  fontSize: 16,
  color: 'rgba(0,0,0,0.85)',
  lineHeight: '24px',
  display: 'block',
  marginBottom: 16,
};

const gridStyle = {
  width: '12%',
  textAlign: 'center',
  margin: '10px',
  cursor: 'pointer',
};

const gridStyle1 = {
  width: '20%',
  textAlign: 'center',
  cursor: 'pointer',
};

const PlayerProfile = () => {
  const [stats, setPlayerStats] = useState({});
  const [teams, setTeamList] = useState([]);
  const [matches, setMatchList] = useState([]);
  const [mom, setMOMList] = useState([]);
  const param = useParams();
  useEffect(() => {
    playerStatistics(param.playerId);
    getAllTeamsByPlayerId(param.playerId);
    getMatchesByPlayerId(param.playerId);
    getMOMByPlayerId(param.playerId);
  }, []);

  const playerStatistics = (id) => {
    let req = {
      playerId: id,
    };
    playerService.playerStatistics(req).then((res) => {
      console.log('setPlayerStats', res);
      setPlayerStats(res);
    });
  };

  const getAllTeamsByPlayerId = (id) => {
    TeamService.getAllTeamsByPlayerId(id).then((res) => {
      console.log('Player Teams', res);
      setTeamList(res);
    });
  };

  const getMatchesByPlayerId = (id) => {
    matchService.getAllMatchesByPlayerId(id).then((res) => {
      console.log('Player Matches', res);
      setMatchList(res);
    });
  };

  const getMOMByPlayerId = (id) => {
    matchService.getMOMByPlayerId(id).then((res) => {
      console.log('MOM', res);
      setMOMList(res);
    });
  };

  const callback = (key) => {
    console.log(key);
  };

  return (
    <Card>
      <div>
        <Card
          hoverable
          style={{ width: '100%', height: '200%', marginBottom: '-220px' }}
          cover={<img alt="example" src={AppConsts.dummyImage} height={500} width={150} />}
        ></Card>
        <Card
          hoverable
          style={{ width: '150px', height: '150px', marginLeft: '20px', marginTop: '50px' }}
          cover={<img alt="example" src={AppConsts.dummyImage} height={150} width={150} />}
        ></Card>
      </div>
      <Tabs defaultActiveKey="1" style={{ marginTop: '50px' }}>
        <TabPane
          tab={
            <span>
              <Icon type="apple" />
              Stats
            </span>
          }
          key="1"
        >
          {Object.keys(stats).length ? (
            <div>
              <Card title="Batting">
                <Card.Grid style={gridStyle}>
                  <h2>Matches</h2>
                  <h4>{stats.totalMatch || 'N/A'}</h4>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                  <h2>Innings</h2>
                  <h4>{stats.totalInnings || 'N/A'}</h4>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                  <h2>Runs</h2>
                  <h4>{stats.totalBatRuns || 'N/A'}</h4>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                  <h2>Balls</h2>
                  <h4>{stats.totalBatBalls || 'N/A'}</h4>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                  <h2>Average</h2>
                  <h4>{stats.battingAverage || 'N/A'}</h4>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                  <h2>Strike Rate</h2>
                  <h4>{stats.strikeRate || 'N/A'}</h4>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                  <h2>Best</h2>
                  <h4>{stats.hightScore || 'N/A'}</h4>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                  <h2>Fours</h2>
                  <h4>{stats.totalFours || 'N/A'}</h4>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                  <h2>Sixes</h2>
                  <h4>{stats.totalSixes || 'N/A'}</h4>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                  <h2>Fifties</h2>
                  <h4>{stats.numberOf50s || 'N/A'}</h4>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                  <h2>Centuries</h2>
                  <h4>{stats.numberOf100s || 'N/A'}</h4>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                  <h2>Out</h2>
                  <h4>{stats.totalMatch || 'N/A'}</h4>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                  <h2>Not Out</h2>
                  <h4>{stats.totalMatch || 'N/A'}</h4>
                </Card.Grid>
              </Card>
              <Card title="Bowling">
                <Card.Grid style={gridStyle}>
                  <h2>Overs</h2>
                  <h4>{stats.totalOvers || 'N/A'}</h4>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                  <h2>Wickets</h2>
                  <h4>{stats.totalWickets || 'N/A'}</h4>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                  <h2>Runs</h2>
                  <h4>{stats.totalBallRuns || 'N/A'}</h4>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                  <h2>5 Wickets</h2>
                  <h4>{stats.fiveWickets || 'N/A'}</h4>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                  <h2>Maidens</h2>
                  <h4>{stats.totalMaidens || 'N/A'}</h4>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                  <h2>Average</h2>
                  <h4>{stats.bowlingAvg || 'N/A'}</h4>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                  <h2>Economy</h2>
                  <h4>{stats.economy || 'N/A'}</h4>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                  <h2>BBI</h2>
                  <h4>{stats.bestBowlingFigureRuns || 'N/A'}</h4>
                </Card.Grid>
              </Card>
              <Card title="Fielding">
                <Card.Grid style={gridStyle}>
                  <h2>Catches</h2>
                  <h4>{stats.onFieldCatch || 'N/A'}</h4>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                  <h2>Runouts</h2>
                  <h4>{stats.onFieldStump || 'N/A'}</h4>
                </Card.Grid>
                <Card.Grid style={gridStyle}>
                  <h2>Stumps</h2>
                  <h4>{stats.onFieldRunOut || 'N/A'}</h4>
                </Card.Grid>
              </Card>
            </div>
          ) : (
            <Empty />
          )}
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="android" />
              Matches
            </span>
          }
          key="2"
        >
          {Object.keys(matches).length ? (
            <Card>
              {matches.map((e, index2) => (
                <Card.Grid>
                  <Card title={e.tournament} key={index2} hoverable={false}>
                    <div style={{ margin: '10px' }}>
                      <Tag color="orange">
                        {e.ground},{e.date}
                      </Tag>
                      <Tooltip title={e.team1}>
                        <h2>
                          {truncateText(e.team1, 20)} : {e.team1Score + '/' + e.team1Wickets}
                        </h2>
                      </Tooltip>

                      <h3>vs</h3>
                      <Tooltip title={e.team2}>
                        <h2>
                          {truncateText(e.team2, 20)} : {e.team2Score + '/' + e.team2Wickets}
                        </h2>
                      </Tooltip>
                    </div>
                    <div style={{ width: '100%', border: '1px solid lightgray', padding: '10px' }}>Man of the match: {e.mom}</div>
                  </Card>
                </Card.Grid>
              ))}
            </Card>
          ) : (
            <Empty />
          )}
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="android" />
              MOM
            </span>
          }
          key="3"
        >
          {Object.keys(mom).length ? (
            <Card>
              {mom.map((e, index2) => (
                <Card title={e.tournament} style={gridStyle1} key={index2} hoverable={false}>
                  <Tag color="orange">
                    {e.ground},{e.date}
                  </Tag>
                  <Tooltip title={e.team1}>
                    <h2>
                      {truncateText(e.team1, 12)} : {e.team1Score + '/' + e.team1Wickets}
                    </h2>
                  </Tooltip>

                  <h3>vs</h3>
                  <Tooltip title={e.team2}>
                    <h2>
                      {truncateText(e.team2, 12)} : {e.team2Score + '/' + e.team2Wickets}
                    </h2>
                  </Tooltip>
                  <div style={{ width: '100%', border: '1px solid lightgray', padding: '10px' }}>Man of the match: {e.mom}</div>
                </Card>
              ))}
            </Card>
          ) : (
            <Empty />
          )}
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
          {Object.keys(teams).length ? (
            <Card>
              {teams.map((e, index2) => (
                <Link to={'/teamProfile/' + e.id}>
                  <Card.Grid hoverable={false} style={gridStyle} key={index2}>
                    <h2>{e.name}</h2>
                  </Card.Grid>
                </Link>
              ))}
            </Card>
          ) : (
            <Empty />
          )}
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
export default PlayerProfile;
