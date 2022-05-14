import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, Tabs, Icon, Empty, Tooltip, Tag, Row, Skeleton } from 'antd';
import { truncateText } from '../../helper/helper';
import playerService from '../../services/player/playerService';
import matchService from '../../services/match/matchService';
import EventService from '../../services/event/EventService';
import TeamService from '../../services/team/TeamService';
import AppConsts from '../../lib/appconst';
import LeaderBoard from '../statistics/leaderBoard';
import ViewMatchBox from '../../components/ViewMatchBox';
import PlayerViewBox from '../../components/PlayerViewBox';
import TeamViewBox from '../../components/TeamViewBox';

const gridStyle = {
  width: '20%',
  textAlign: 'center',
  margin: '10px',
  cursor: 'pointer',
};
const EventProfile = () => {
  const [players, setPlayerList] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [matchList, setMatchList] = useState([]);
  const [stats, setEventStats] = useState({});
  const [statsLoading, setStatsLoading] = useState(true);

  const param = useParams();
  useEffect(() => {
    //getEventStats(param.eventId);
    getAllTeamsByEventId(param.eventId);
    getAllMatchesByEventId(param.eventId);
    getAllPlayersByEventId(param.eventId);
  }, []);
  const getAllPlayersByEventId = (id) => {
    playerService.getAllByTeamId(id).then((res) => {
      console.log('Team Players', res);
      setPlayerList(res);
    });
  };
  const getAllMatchesByEventId = (id) => {
    matchService.getMatchesViewByEventId(id).then((res) => {
      console.log('Event Matches', res);
      setMatchList(res);
    });
  };
  const getAllTeamsByEventId = (id) => {
    TeamService.getAllEventTeams(id).then((res) => {
      console.log('Event Teams', res);
      setTeamList(res);
    });
  };

  const getEventStats = (id) => {
    EventService.getEventStats(id).then((res) => {
      console.log('Team Stats', res);
      setEventStats(res);
      setStatsLoading(false);
    });
  };

  const { TabPane } = Tabs;
  const { Meta } = Card;
  return (
    <Card>
      {' '}
      <div>
        <Card
          hoverable
          style={{ width: '100%', height: '200%', marginBottom: '-220px' }}
          cover={<img alt="example" src={AppConsts.dummyImage} height={500} width={150} />}
        ></Card>
        <Row style={{ marginLeft: '20px', marginTop: '50px', display: 'flex' }}>
          <Card
            hoverable
            style={{ width: '150px', height: '150px' }}
            cover={<img alt="example" src={AppConsts.dummyImage} height={150} width={150} />}
          ></Card>
          <div style={{ marginLeft: '10px', marginTop: '5px' }}>
            <h1 style={{ color: 'white', fontSize: '33px', marginBottom: '0' }}>Name: {stats.name}</h1>
            <h1 style={{ color: 'white', marginBottom: '0' }}>Location: {stats.area || 'N/A'}</h1>
            <h1 style={{ color: 'white', marginBottom: '0' }}>{stats.type || 'N/A'}</h1>
          </div>
        </Row>

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
            <Skeleton loading={statsLoading} active avatar>
              {Object.keys(stats).length ? (
                <div>
                  <Card>
                    <Card.Grid style={gridStyle}>
                      <h2>Matches</h2>
                      <h4>{stats.matches || 'N/A'}</h4>
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                      <h2>Best Batsman</h2>
                      <h4>{stats.batsman || 'N/A'}</h4>
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                      <h2>Best Bowler</h2>
                      <h4>{stats.bowler || 'N/A'}</h4>
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                      <h2>Best Player</h2>
                      <h4>{stats.pot || 'N/A'}</h4>
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                      <h2>Sixes</h2>
                      <h4>{stats.six || 'N/A'}</h4>
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                      <h2>Fours</h2>
                      <h4>{stats.fours || 'N/A'}</h4>
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                      <h2>Wickets</h2>
                      <h4>{stats.wickets || 'N/A'}</h4>
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                      <h2>Catches</h2>
                      <h4>{stats.catches || 'N/A'}</h4>
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                      <h2>Stumps</h2>
                      <h4>{stats.stumps || 'N/A'}</h4>
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                      <h2>Run-out</h2>
                      <h4>{stats.runouts || 'N/A'}</h4>
                    </Card.Grid>
                  </Card>
                </div>
              ) : (
                <Empty />
              )}
            </Skeleton>
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="apple" />
                Matches
              </span>
            }
            key="2"
          >
            <ViewMatchBox data={matchList}></ViewMatchBox>
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="apple" />
                Teams
              </span>
            }
            key="3"
          >
            <TeamViewBox data={teamList}></TeamViewBox>
          </TabPane>

          <TabPane
            tab={
              <span>
                <Icon type="apple" />
                Players
              </span>
            }
            key="4"
          >
            <PlayerViewBox data={players}></PlayerViewBox>
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="apple" />
                Leader Board
              </span>
            }
            key="5"
          >
            <LeaderBoard data={[]} columns={[]}></LeaderBoard>
          </TabPane>
        </Tabs>
      </div>
    </Card>
  );
};

export default EventProfile;
