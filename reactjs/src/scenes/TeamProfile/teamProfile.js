import React, { useEffect, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { Card, Tabs, Icon, Empty, Tooltip, Tag, Row, Skeleton, Form, Button, Radio, PageHeader } from 'antd';
import { truncateText } from '../../helper/helper';
import playerService from '../../services/player/playerService';
import matchService from '../../services/match/matchService';
import EventService from '../../services/event/EventService';
import TeamService from '../../services/team/TeamService';
import AppConsts from '../../lib/appconst';
import getImage from '../../lib/getImage';
import LeaderBoard from '../statistics/leaderBoard';
import ViewMatchBox from '../../components/ViewMatchBox';
import PlayerViewBox from '../../components/PlayerViewBox';
import statisticsService from '../../services/statistics/statistics.service';
import CustomModal from '../../components/Modal';
import { matchTypes } from '../../components/Enum/enum';
import CustomInput from '../../components/Input';
import { preloadAll } from 'react-loadable';
import ViewGallery from '../../components/ViewGallery/ViewGallery';
import GalleryService from '../../services/gallery/GalleryService';

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
const TeamProfile = () => {
  const [players, setPlayerList] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [matchList, setMatchList] = useState([]);
  const [gallery, setGAllery] = useState([]);
  const [stats, setTeamStats] = useState({});
  const [statsLoading, setStatsLoading] = useState(true);
  const [isStatsFilterModal, setIsStatsFilterModal] = useState(false);
  const [matchResultFilter, setMatchResultFilter] = useState(1);
  const [eventFilter, setEventFilter] = useState('');
  const param = useParams();
  const history = useHistory();
  const [statsFilters, setStatsFilters] = useState({
    teamId: param.teamId,
    season: null,
    matchType: null,
    eventId: null,
  });
  useEffect(() => {
    getTeamStats();
    getGallery(param.teamId);
    // getAllEventsByTeamId(param.teamId);
    getAllPlayersByTeamId(param.teamId);
  }, []);

  useEffect(() => {
    getAllMatchesByTeamId(param.teamId);
  }, [matchResultFilter]);

  useEffect(() => {
    getAllEventsByTeamId(param.teamId);
  }, [eventFilter]);


  const getAllPlayersByTeamId = (id) => {
    playerService.getAllByTeamId(id).then((res) => {
      console.log('Team Players', res);
      setPlayerList(res);
    });
  };
  const getAllMatchesByTeamId = (id) => {
    matchService.getAllMatchesByTeamId(id, matchResultFilter).then((res) => {
      console.log('Team Matches', res);
      setMatchList(res);
    });
  };
  const getAllEventsByTeamId = (id) => {
    EventService.getAllEventsByTeamId(id, eventFilter).then((res) => {
      console.log('Team Events', res);

      setEventList(res);
    });
  };
  const getTeamStats = () => {
    TeamService.getTeamStats(statsFilters).then((res) => {
      console.log('Team Stats', res);
      setTeamStats(res);
      setStatsLoading(false);
    });
  };

  const getGallery = (id) => {
    GalleryService.getAllByEntity(id).then((res) => {
      console.log('Gallery', res);
      if (res.success) {
        setGAllery(res.result);
      }
      
    });
  };

  const handleCancelStatsFilter = () => {
    setIsStatsFilterModal(!isStatsFilterModal);
  };

  const handleSubmitStatsFilter = () => {
    setIsStatsFilterModal(!isStatsFilterModal);
    getTeamStats();
  };

  const handleRadio = (e) => {
    setMatchResultFilter(e.target.value);
  };
  const handleEventFilter = (e) => {
    //console.log("event",filtered);
    setEventFilter(e.target.value);
    //setEventList(filtered);
  };

  const handleChange = (value, key) => {
    setStatsFilters({ ...statsFilters, [key]: value });
  };

  const { TabPane } = Tabs;
  const { Meta } = Card;
  return (
    <Card>
      <PageHeader
        style={{
          border: '1px solid rgb(235, 237, 240)',
        }}
        onBack={history.goBack}
        title={stats.name}
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
            <Tooltip title={'Filter'}>
              <Button type="primary" size="large" shape="circle" style={filterButon} onClick={() => handleCancelStatsFilter()}>
                <Icon style={{ marginLeft: '8px', marginTop: '8px' }} type="filter" />
              </Button>
            </Tooltip>
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
            <div style={{ textAlign: 'center' }}>
              <Radio.Group
                onChange={(e) => handleRadio(e)}
                defaultValue="1"
                buttonStyle="solid"
                style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}
              >
                <Radio.Button value="1">All</Radio.Button>
                <Radio.Button value="2">Won</Radio.Button>
                <Radio.Button value="3">Lost</Radio.Button>
                <Radio.Button value="4">Tie</Radio.Button>
              </Radio.Group>
            </div>
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
            <div style={{ textAlign: 'center' }}>
              <Radio.Group
                onChange={(e) => handleEventFilter(e)}
                defaultValue=""
                buttonStyle="solid"
                style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}
              >
                <Radio.Button value="">All</Radio.Button>
                <Radio.Button value="1">Tournament</Radio.Button>
                <Radio.Button value="2">Series</Radio.Button>
              </Radio.Group>
            </div>
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
            <LeaderBoard teamId={param.teamId}></LeaderBoard>
          </TabPane>
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
      <CustomModal
        title="Stats Filter"
        isModalVisible={isStatsFilterModal}
        handleCancel={() => {
          handleCancelStatsFilter();
        }}
      >
        <Form>
          <CustomInput
            title="Match Type"
            type="select"
            options={matchTypes}
            handleChange={handleChange}
            value={statsFilters.matchType}
            stateKey="matchType"
          />
          {statsFilters.matchType && statsFilters.matchType != 1 ? (
            <CustomInput
              title="Event"
              type="select"
              options={eventList}
              handleChange={handleChange}
              value={statsFilters.eventId}
              stateKey="eventId"
            />
          ) : null}

          <CustomInput
            title="Season"
            type="number"
            handleChange={handleChange}
            value={statsFilters.season}
            stateKey="season"
            placeholder="Optional"
          />
          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={handleSubmitStatsFilter}>
              {'Apply Filter'}
            </Button>
            <Button htmlType="button" onClick={() => handleCancelStatsFilter()}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </CustomModal>
    </Card>
  );
};

export default TeamProfile;
