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

const gridStyle = {
  width: '20%',
  textAlign: 'center',
  margin: '10px',
  cursor: 'pointer',
};
const TeamProfile = () => {
  const [players, setPlayerList] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [matchList, setMatchList] = useState([]);
  const [stats, setTeamStats] = useState({});
  const [statsLoading, setStatsLoading] = useState(true);

  const param = useParams();
  useEffect(() => {
    getTeamStats(param.teamId);
    getAllEventsByTeamId(param.teamId);
    getAllMatchesByTeamId(param.teamId);
    getAllPlayersByTeamId(param.teamId);
  }, []);
  const getAllPlayersByTeamId = (id) => {
    playerService.getAllByTeamId(id).then((res) => {
      console.log('Team Players', res);
      setPlayerList(res);
    });
  };
  const getAllMatchesByTeamId = (id) => {
    matchService.getAllMatchesByTeamId(id).then((res) => {
      console.log('Team Matches', res);
      setMatchList(res);
    });
  };
  const getAllEventsByTeamId = (id) => {
    EventService.getAllEventsByTeamId(id).then((res) => {
      console.log('Team Events', res);
      setEventList(res);
    });
  };
  const getTeamStats = (id) => {
    TeamService.getTeamStats(id).then((res) => {
      console.log('Team Stats', res);
      setTeamStats(res);
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
                      <h2>Won</h2>
                      <h4>{stats.won || 'N/A'}</h4>
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                      <h2>Lost</h2>
                      <h4>{stats.lost || 'N/A'}</h4>
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                      <h2>Tie</h2>
                      <h4>{stats.tie || 'N/A'}</h4>
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                      <h2>No Result</h2>
                      <h4>{stats.noResult || 'N/A'}</h4>
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                      <h2>Toss Won</h2>
                      <h4>{stats.tossWon || 'N/A'}</h4>
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                      <h2>Bat First</h2>
                      <h4>{stats.batFirst || 'N/A'}</h4>
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                      <h2>Field First</h2>
                      <h4>{stats.fieldFirst || 'N/A'}</h4>
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
                Players
              </span>
            }
            key="2"
          >
            <PlayerViewBox data={players}></PlayerViewBox>
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="apple" />
                Matches
              </span>
            }
            key="3"
          >
            <ViewMatchBox data={matchList}></ViewMatchBox>
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="apple" />
                Events
              </span>
            }
            key="4"
          >
            <Card>
              <div style={{ display: 'flex', margin: '10px' }}>
                {Object.keys(eventList).length ? (
                  eventList.map((e, index) => (
                    <Tooltip title={e.name} key={index}>
                      <Link to={'/eventProfile/' + e.id}>
                        <Card hoverable style={{ width: 200, margin: '10px' }} cover={<img alt="example" src={AppConsts.dummyImage} />}>
                          <Meta title={e.name} description={e.startDate + ' To ' + e.endDate} />
                        </Card>
                      </Link>
                    </Tooltip>
                  ))
                ) : (
                  <Empty />
                )}
              </div>
            </Card>
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

export default TeamProfile;
