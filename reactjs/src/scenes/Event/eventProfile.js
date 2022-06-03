import React, { useEffect, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { Card, Tabs, Icon, Empty, Tooltip, Tag, Row, Skeleton, PageHeader, Button } from 'antd';
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
import moment from 'moment';
import ViewBracket2 from './viewBracket2';
import PointsTable from './points-table';

const gridStyle = {
  width: '20%',
  textAlign: 'center',
  margin: '10px',
  cursor: 'pointer',
};

const filterButon = {
  position: 'fixed',
  right: '32px',
  bottom: '102px',
  Zindex: '2147483640',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
};
const EventProfile = () => {
  const [players, setPlayerList] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [matchList, setMatchList] = useState([]);
  const [stats, setEventStats] = useState({});
  const [pointsTable, setPointsTable] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [bracketsData, setBracketsData] = useState({ matches: [], winner: {}, selectedTeamsLen: 0 });
  const param = useParams();
  const history = useHistory();
  useEffect(() => {
    getEventStats(param.eventId);
    getAllTeamsByEventId(param.eventId);
    getMatchesViewByEventId(param.eventId);
    getAllPlayersByEventId(param.eventId);
    getAllMatchesByEventId(param.eventId);
    getPointsTable(param.eventId);
  }, []);
  const getAllPlayersByEventId = (id) => {
    playerService.getPlayersByEventId(id).then((res) => {
      console.log('Team Players', res);
      setPlayerList(res);
    });
  };
  const getMatchesViewByEventId = (id) => {
    matchService.getMatchesViewByEventId(id).then((res) => {
      console.log('Event Matches', res);
      setMatchList(res);
    });
  };
  const getAllTeamsByEventId = (id) => {
    TeamService.getAllEventTeams(id, undefined).then((res) => {
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

  const getAllMatchesByEventId = () => {
    matchService.getAllMatchesByEventId(param.eventId).then((res) => {
      if (res) {
        let noOfTeams = 0;
        if (res.eventMatches && res.eventMatches[0] && res.eventMatches[0].matches) {
          noOfTeams = res.eventMatches[0].matches.length * 2;
        }
        setBracketsData({ matches: res.eventMatches, winner: res.winner, noOfTeams: noOfTeams });
      }
    });
  };

  const getPointsTable = () => {
    EventService.getPointsTable(param.eventId).then((res) => {
      if (res.success) {
        setPointsTable(res.result);
      }
    });
  };

  const handleAddMatch = () => {
    
  }

  const { TabPane } = Tabs;
  const { Meta } = Card;
  return (
    <Card>
      <PageHeader
        style={{
          border: '1px solid rgb(235, 237, 240)',
        }}
        onBack={history.goBack}
        title={stats.event}
      />
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
          <Skeleton loading={statsLoading}>
            <div style={{ marginLeft: '10px', marginTop: '5px' }}>
              <h1 style={{ color: 'white', fontSize: '33px', marginBottom: '0' }}>Name: {stats.event}</h1>
              <h1 style={{ color: 'white', marginBottom: '0' }}>Organizor: {stats.organizor || 'N/A'}</h1>
              <h1 style={{ color: 'white', marginBottom: '0' }}>
                {moment(stats.startDate).format('MM/DD/YYYY') || 'N/A'} to {moment(stats.endDate).format('MM/DD/YYYY') || 'N/A'}
              </h1>
            </div>
          </Skeleton>
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
            {stats.groups ? (
              <Tooltip title={'Add Match'}>
                <Button type="primary" size="large" shape="circle" style={filterButon} onClick={handleAddMatch}>
                  <Icon style={{ marginLeft: '8px', marginTop: '8px' }} type="plus" />
                </Button>
              </Tooltip>
            ) : null}
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
            {stats.groups ? (
              <Tooltip title={'Add Team'}>
                <Link to={`/eventTeams/${stats.event}/${param.eventId}/groups/${stats.groups}`}>
                  <Button type="primary" size="large" shape="circle" style={filterButon}>
                    <Icon style={{ marginLeft: '8px', marginTop: '8px' }} type="plus" />
                  </Button>
                </Link>
              </Tooltip>
            ) : null}
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
          <TabPane
            tab={
              <span>
                <Icon type="apple" />
                Brackets
              </span>
            }
            key="6"
          >
            <ViewBracket2 formikData={bracketsData} event={stats.event} loading={false}></ViewBracket2>
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="apple" />
                Points Table
              </span>
            }
            key="7"
          >
            <PointsTable data={pointsTable}></PointsTable>
          </TabPane>
        </Tabs>
      </div>
    </Card>
  );
};

export default EventProfile;
