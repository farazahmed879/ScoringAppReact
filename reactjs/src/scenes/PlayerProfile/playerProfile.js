import React, { useEffect, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import playerService from '../../services/player/playerService';
import TeamService from '../../services/team/TeamService';
import matchService from '../../services/match/matchService';
import { truncateText } from '../../helper/helper';
import { Col, Row, Drawer, Divider, Card, Tabs, Icon, Collapse, Empty, Tooltip, Tag, Form, Skeleton, Button, Radio, PageHeader } from 'antd';
import './style.css';
import getImage from '../../lib/getImage';
import ViewMatchBox from '../../components/ViewMatchBox';
import TeamViewBox from '../../components/TeamViewBox';
import CustomModal from '../../components/Modal';
import { battingStyleOptions, bowlingStyleOptions, matchTypes, playingRoleOptions } from '../../components/Enum/enum';
import CustomInput from '../../components/Input';
import ViewGallery from '../../components/ViewGallery/ViewGallery';
import GalleryService from '../../services/gallery/GalleryService';
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

const filterButon = {
  position: 'fixed',
  transition:'transform 0.5s',
  right: '32px',
  bottom: '102px',
  Zindex: '2147483640',
  display: 'flex',
  flexDirection: 'column',
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
  const [gallery, setGAllery] = useState([]);
  const [mom, setMOMList] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [isFilterModal, setIsFilterModal] = useState(false);
  const [matchResultFilter, setMatchResultFilter] = useState(1);
  const param = useParams();
  const history = useHistory();
  const [filters, setFilters] = useState({
    playerId: param.playerId,
    teamId: null,
    season: null,
    matchType: null,
  });

  useEffect(() => {
    playerStatistics();
    getGallery(param.playerId);
    getAllTeamsByPlayerId(param.playerId);
    //getMatchesByPlayerId(param.playerId);
    getMOMByPlayerId(param.playerId);
  }, []);

  const playerStatistics = () => {
    playerService.playerStatistics(filters).then((res) => {
      console.log('setPlayerStats', res);
      setPlayerStats(res);
      setStatsLoading(false);
    });
  };

  const getAllTeamsByPlayerId = (id) => {
    TeamService.getAllTeamsByPlayerId(id).then((res) => {
      console.log('Player Teams', res);
      setTeamList(res);
    });
  };

  const getMatchesByPlayerId = (id) => {
    matchService.getAllMatchesByPlayerId(id, matchResultFilter).then((res) => {
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

  const getGallery = (id) => {
    GalleryService.getAllByEntity(undefined, undefined, id).then((res) => {
      console.log('Gallery', res);
      if (res.success) {
        setGAllery(res.result);
      }
    });
  };
  const callback = (key) => {
    console.log(key);
  };

  const filterModal = () => {
    setIsFilterModal(!isFilterModal);
  };

  const handleChange = (value, key) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleSubmit = () => {
    setStatsLoading(true);
    playerStatistics(filters);
    filterModal();
  };

  useEffect(() => {
    getMatchesByPlayerId(param.playerId);
  }, [matchResultFilter]);

  const handleRadio = (e) => {
    setMatchResultFilter(e.target.value);
  };

  return (
    <Card>
      <PageHeader
        style={{
          border: '1px solid rgb(235, 237, 240)',
        }}
        onBack={history.goBack}
        title={stats.playerName}
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
            <h2 style={{ color: 'white', marginBottom: '0' }}>{stats.playerName || 'N/A'}</h2>
            <h4 style={{ color: 'white', marginBottom: '0' }}>{stats.dob || 'N/A'}</h4>
            <h4 style={{ color: 'white', marginBottom: '0' }}>{playingRoleOptions.filter((i) => i.id == stats.playerRole).name || 'N/A'}</h4>
            <h4 style={{ color: 'white', marginBottom: '0' }}>{battingStyleOptions.filter((i) => i.id == stats.battingStyle).name || 'N/A'}</h4>
            <h4 style={{ color: 'white', marginBottom: '0' }}>{bowlingStyleOptions.filter((i) => i.id == stats.bowlingStyle).name || 'N/A'}</h4>
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
                      <h2>S/R</h2>
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
            </Skeleton>
            <Tooltip title={'Filter'}>
              <Button type="primary" size="large" shape="circle" style={filterButon} className="filterButton" onClick={() => filterModal()}>
                <Icon className='icon-style' type="filter" />
              </Button>
            </Tooltip>
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
            <ViewMatchBox data={matches}></ViewMatchBox>
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
            <ViewMatchBox data={mom}></ViewMatchBox>
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
            <TeamViewBox data={teams}></TeamViewBox>
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="android" />
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
        title="Apply Filter"
        isModalVisible={isFilterModal}
        handleCancel={() => {
          filterModal();
        }}
      >
        <Form>
          <CustomInput
            title="Match Type"
            type="select"
            options={matchTypes}
            handleChange={handleChange}
            value={filters.matchType}
            stateKey="matchType"
          />
          <CustomInput title="Team" type="select" options={teams} handleChange={handleChange} value={filters.teamId} stateKey="teamId" />

          <CustomInput title="Season" type="number" handleChange={handleChange} value={filters.season} stateKey="season" placeholder="Optional" />
          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
              {'Apply Filter'}
            </Button>
            <Button htmlType="button" onClick={() => filterModal()}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </CustomModal>
    </Card>
  );
};
export default PlayerProfile;
