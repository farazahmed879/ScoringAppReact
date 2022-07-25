import React, { useEffect, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { Card, Tabs, Icon, Empty, Tooltip, Tag, Row, Skeleton, PageHeader, Button, Modal } from 'antd';
import { truncateText } from '../../helper/helper';
import playerService from '../../services/player/playerService';
import matchService from '../../services/match/matchService';
import EventService from '../../services/event/EventService';
import TeamService from '../../services/team/TeamService';
import LeaderBoard from '../statistics/leaderBoard';
import ViewMatchBox from '../../components/ViewMatchBox';
import PlayerViewBox from '../../components/PlayerViewBox';
import TeamViewBox from '../../components/TeamViewBox';
import moment from 'moment';
import ViewBracket2 from './viewBracket2';
import PointsTable from './points-table';
import CreateOrUpdateLeagueBasedMatch from './createOrUpdateLeagueBasedMatch';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import GroundService from '../../services/ground/GroundService';
import { tournamentTypes } from '../../components/Enum/enum';
import eventTypeConst from '../../lib/eventTypeConst';
import matchTypeConst from '../../lib/matchTypeConst';
import getImage from '../../lib/getImage';
import ViewGallery from '../../components/ViewGallery/ViewGallery';
import GalleryService from '../../services/gallery/GalleryService';
import { handleSubmitMatch } from '../Matches/handleSubmitMatch';
import tournamentTypeConst from '../../lib/tournamentTypeConst';

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
  cursor: 'pointer',
};

const matchInitial = {
  id: 0,
  matchOvers: 0,
  matchDescription: '',
  season: 0,
  eventId: '',
  team1Id: '',
  team2Id: '',
  groundId: '',
  matchTypeId: '',
  eventType: '',
  eventStage: '',
  dateOfMatch: '',
  tossWinningTeam: '',
  playerOTM: '',
};

const matchValidation = Yup.object().shape({
  team1Id: Yup.number().required('Required'),
  team2Id: Yup.number().required('Required'),
  dateOfMatch: Yup.string().required('Required'),
});

const success = Modal.success;
const error = Modal.error;
const EventProfile = () => {
  const [teamList, setTeamList] = useState([]);
  const [matchList, setMatchList] = useState([]);
  const [gallery, setGAllery] = useState([]);
  const [stats, setEventStats] = useState({});
  const [pointsTable, setPointsTable] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [isOpenMatchModal, setIsOpenMatchModal] = useState(false);
  const [bracketsData, setBracketsData] = useState({ matches: [], winner: {}, selectedTeamsLen: 0 });
  const [editMatch, setEditMatch] = useState({});
  const [groups, setGroups] = useState([]);
  const [filterTeamList, setFilterTeamList] = useState([]);
  const [groundList, setGrounds] = useState([]);
  const [isBracketLoading, setIsBracketLoading] = useState(true);

  const param = useParams();
  const history = useHistory();
  useEffect(() => {
    getGallery(param.eventId);
    getEventStats(param.eventId);
    getAllTeamsByEventId(param.eventId, undefined);
    getMatchesViewByEventId(param.eventId);
    getAllMatchesByEventId(param.eventId);
    getPointsTable(param.eventId);
  }, []);

  const getMatchesViewByEventId = (id) => {
    matchService.getMatchesViewByEventId(id).then((res) => {
      console.log('Event Matches', res);
      setMatchList(res);
    });
  };
  const getAllTeamsByEventId = (id, group) => {
    TeamService.getAllEventTeams(id, group).then((res) => {
      console.log('Event Teams', res);
      if (group) {
        setFilterTeamList(res);
        return;
      }
      setTeamList(res);
    });
  };

  const getEventStats = (id) => {
    EventService.getEventStats(id).then((res) => {
      console.log('Event Stats', res);
      setEventStats(res);
      setStatsLoading(false);
    });
  };

  const getAllGrouds = () => {
    GroundService.getAll().then((res) => {
      console.log('Grounds', res);
      setGrounds(res);
    });
  };

  const getAllMatchesByEventId = () => {
    setIsBracketLoading(true);
    matchService.getAllMatchesByEventId(param.eventId).then((res) => {
      if (res) {
        let noOfTeams = 0;
        if (res.eventMatches && res.eventMatches[0] && res.eventMatches[0].matches) {
          noOfTeams = res.eventMatches[0].matches.length * 2;
        }
        setBracketsData({ matches: res.eventMatches, winner: res.winner, noOfTeams: noOfTeams });
      }
      setIsBracketLoading(false);
    });
  };

  const getPointsTable = () => {
    EventService.getPointsTable(param.eventId).then((res) => {
      if (res.success) {
        setPointsTable(res.result);
      }
    });
  };
  const getGallery = (id) => {
    GalleryService.getAllByEntity(undefined, id, undefined, undefined, undefined).then((res) => {
      console.log('Gallery', res);
      if (res.success) {
        setGAllery(res.result);
      }
    });
  };

  //Add-league-based
  const handleAddMatch = () => {
    setIsOpenMatchModal(true);
  };

  const handleCancel = (e) => {
    setIsOpenMatchModal(e);
  };

  const handleSubmit = () => {
    let match = matchFormik;
    match.values.matchTypeId = matchTypeConst.tournament;
    match.values.eventId = param.eventId;
    const response = handleSubmitMatch(match);
    debugger
    if (response) {
      setIsOpenMatchModal(false);
      getMatchesViewByEventId(param.eventId);
    }
  }

  // const handleSubmit = (e) => {
  //   if (!matchFormik.isValid) return;
  //   let req = {
  //     id: matchFormik.values.id,
  //     groundId: matchFormik.values.groundId,
  //     matchOvers: +matchFormik.values.matchOvers,
  //     matchDescription: matchFormik.values.matchDescription,
  //     season: +matchFormik.values.season,
  //     eventId: +param.eventId,
  //     tossWinningTeam: matchFormik.values.tossWinningTeam,
  //     team1Id: matchFormik.values.team1Id,
  //     team2Id: matchFormik.values.team2Id,
  //     matchTypeId: matchTypeConst.tournament,
  //     eventType: eventTypeConst.tournament,
  //     eventStage: matchFormik.values.eventStage,
  //     dateOfMatch: moment(matchFormik.values.dateOfMatch).valueOf(),
  //     playerOTM: matchFormik.values.playerOTM,
  //   };

  //   console.log('Match Object', req);
  //   matchService.createOrUpdate(req).then((res) => {
  //     res.success ? success({ title: res.successMessage }) : error({ title: res.successMessage });
  //     setIsOpenMatchModal(false);
  //     getMatchesViewByEventId(param.eventId);
  //   });
  // };

  const handleEditMatch = (id) => {
    setIsOpenMatchModal(true);
    matchService.EditEventMatch(id).then((res) => {
      if (res) {
        let match = res;
        match.matchTypeId = matchTypeConst.tournament;
        match.eventId = param.eventId;
        setEditMatch(res);
        matchFormik.setValues({
          ...matchFormik.values,
          ...match,
        });
      }
    });
  };

  const calculateGroups = (num) => {
    let group = [];
    for (let i = 1; i <= num; i++) {
      group.push({ id: i, name: i });
    }
    setGroups(group);

    console.log('groups', groups);
  };

  useEffect(() => {
    if (stats.type == 2 && stats.groups > 1) {
      calculateGroups(stats.groups);
    }
  }, [stats.type]);

  useEffect(() => {
    if (isOpenMatchModal) {
      getAllGrouds();
    }
    if (!isOpenMatchModal) {
      matchFormik.setValues({});
    }
  }, [isOpenMatchModal]);

  const matchFormik = useFormik({
    enableReinitialize: true,
    initialValues: matchInitial,
    validationSchema: matchValidation,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (matchFormik.values.group && matchFormik.values.group > 0) {
      getAllTeamsByEventId(param.eventId, matchFormik.values.group);
    }
  }, [matchFormik.values.group]);

  const handleBracketUpdate = (e) => {
    console.log('handleBracketUpdate', e);
    if (e) {
      getAllMatchesByEventId(param.eventId);
    }
  };

  const { TabPane } = Tabs;
  const { Meta } = Card;
  return (
    <>
      {' '}
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
            cover={<img alt="example" src={getImage(stats.profileUrl)} height={500} width={150} />}
          ></Card>
          <Row style={{ marginLeft: '20px', marginTop: '50px', display: 'flex' }}>
            <Card
              hoverable
              style={{ width: '150px', height: '150px' }}
              cover={<img alt="example" src={getImage(stats.profileUrl)} height={150} width={150} />}
            ></Card>
            <Skeleton loading={statsLoading}>
              <div style={{ marginLeft: '10px', marginTop: '5px' }}>
                <h1 style={{ color: 'white', fontSize: '33px', marginBottom: '0' }}>Name: {stats.event}</h1>
                <h1 style={{ color: 'white', marginBottom: '0' }}>Organizor: {stats.organizor || 'N/A'}</h1>
                <h1 style={{ color: 'white', marginBottom: '0' }}>
                  {moment(stats.startDate).format('MM/DD/YYYY') || 'N/A'} to {moment(stats.endDate).format('MM/DD/YYYY') || 'N/A'}
                </h1>
                <h1 style={{ color: 'white', marginTop: '-5px' }}>{stats.type == 1 ? 'Knock-out' : stats.type == 2 ? 'League Based' : ''}</h1>
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
              {stats.type == tournamentTypeConst.leagueBased ? (
                <Tooltip title={'Add Match'}>
                  <Button type="primary" size="large" shape="circle" icon="plus" style={filterButon} onClick={handleAddMatch}>
                    {/* <Icon style={{ marginLeft: '8px', marginTop: '8px' }} type="plus" /> */}
                  </Button>
                  {/* <Button type="primary" shape="circle" icon="download" size={size} /> */}
                </Tooltip>
              ) : null}
              <CreateOrUpdateLeagueBasedMatch
                isOpenModal={isOpenMatchModal}
                editMatch={editMatch}
                matchFormik={matchFormik}
                handleCancel={handleCancel}
                stats={stats}
                groups={groups}
                teamList={filterTeamList}
                groundList={groundList}
              ></CreateOrUpdateLeagueBasedMatch>
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
              {stats.type == 2 ? (
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
                  Leader Board
                </span>
              }
              key="5"
            >
              <LeaderBoard eventId={param.eventId}></LeaderBoard>
            </TabPane>

            {stats.type == 1 ? (
              <TabPane
                tab={
                  <span>
                    <Icon type="apple" />
                    Brackets
                  </span>
                }
                key="6"
              >
                <ViewBracket2
                  formikData={bracketsData}
                  event={stats.event}
                  handleBracketUpdate={handleBracketUpdate}
                  loading={isBracketLoading}
                ></ViewBracket2>
              </TabPane>
            ) : (
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
            )}
            <TabPane
              tab={
                <span>
                  <Icon type="apple" />
                  Gallery
                </span>
              }
              key="6"
            >
              <ViewGallery data={gallery}></ViewGallery>
            </TabPane>
          </Tabs>
        </div>
      </Card>
    </>
  );
};

export default EventProfile;
