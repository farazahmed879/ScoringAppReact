import React, { useEffect, useState } from 'react';
import { Radio, Tooltip, Button, Icon, Row, Form } from 'antd';
import CustomTable from '../../components/Table';
import statisticsService from '../../services/statistics/statistics.service';
import CustomModal from '../../components/Modal';
import CustomInput from '../../components/Input';
import { matchTypes, playingRoleOptions, positions } from '../../components/Enum/enum';
import TeamService from '../../services/team/TeamService';
import EventService from '../../services/event/EventService';

const filterButon = {
  position: 'fixed',
  right: '32px',
  bottom: '102px',
  Zindex: '2147483640',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
};

const resetButton = {
  position: 'fixed',
  right: '32px',
  bottom: '50px',
  Zindex: '100',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
};

const LeaderBoard = ({ teamId = null, eventId = null }) => {
  const [leaderStats, setLeaderStats] = useState([]);
  const [leaderType, setLeaderType] = useState(1);
  const [filters, setFilters] = useState({
    teamId: teamId,
    matchType: null,
    eventId: eventId,
    season: null,
    position: null,
    overs: null,
    playerRoleId: null,
  });
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterModal, setIsFilterModal] = useState(false);
  //
  const [teamList, setTeamList] = useState([]);
  const [eventList, setEventList] = useState([]);
  const mostRuns = () => {
    setLoading(true);
    statisticsService.mostRuns(filters).then((res) => {
      setLoading(false);
      console.log('mostRuns', res);
      setLeaderStats(res);
      setColumns([
        {
          title: 'Name',
          width: 250,
          dataIndex: 'playerName',
          key: 'playerName',
        },
        {
          title: 'Match',
          width: 250,
          dataIndex: 'totalMatch',
          key: 'totalMatch',
        },
        {
          title: 'Inning',
          width: 250,
          dataIndex: 'totalInnings',
          key: 'totalInnings',
        },
        {
          title: 'Runs',
          width: 250,
          dataIndex: 'totalBatRuns',
          key: 'totalBatRuns',
        },
      ]);
    });
  };

  const mostCenturies = () => {
    setLoading(true);
    statisticsService.mostCenturies(filters).then((res) => {
      setLoading(false);
      console.log('mostCenturies', res);
      setLeaderStats(res);
      setColumns([
        {
          title: 'Name',
          width: 250,
          dataIndex: 'playerName',
          key: 'playerName',
        },
        {
          title: 'Match',
          width: 250,
          dataIndex: 'totalMatch',
          key: 'totalMatch',
        },
        {
          title: 'Inning',
          width: 250,
          dataIndex: 'totalInnings',
          key: 'totalInnings',
        },
        {
          title: '100s',
          width: 250,
          dataIndex: 'mumberOf100s',
          key: 'numberOf100s',
        },
      ]);
    });
  };

  const mostFifties = () => {
    setLoading(true);
    statisticsService.mostFifties(filters).then((res) => {
      setLoading(false);
      console.log('mostFifties', res);
      setLeaderStats(res);
      setColumns([
        {
          title: 'Name',
          width: 250,
          dataIndex: 'playerName',
          key: 'playerName',
        },
        {
          title: 'Match',
          width: 250,
          dataIndex: 'totalMatch',
          key: 'totalMatch',
        },
        {
          title: 'Inning',
          width: 250,
          dataIndex: 'totalInnings',
          key: 'totalInnings',
        },
        {
          title: '50s',
          width: 250,
          dataIndex: 'mumberOf50s',
          key: 'mumberOf50s',
        },
      ]);
    });
  };

  const mostFours = () => {
    setLoading(true);
    statisticsService.mostFours(filters).then((res) => {
      setLoading(false);
      console.log('mostFours', res);
      setLeaderStats(res);
      setColumns([
        {
          title: 'Name',
          width: 250,
          dataIndex: 'playerName',
          key: 'playerName',
        },
        {
          title: 'Match',
          width: 250,
          dataIndex: 'totalMatch',
          key: 'totalMatch',
        },
        {
          title: 'Inning',
          width: 250,
          dataIndex: 'totalInnings',
          key: 'totalInnings',
        },
        {
          title: 'Fours',
          width: 250,
          dataIndex: 'mostFours',
          key: 'mostFours',
        },
      ]);
    });
  };

  const mostSixes = () => {
    setLoading(true);
    statisticsService.mostSixes(filters).then((res) => {
      setLoading(false);
      console.log('mostSixes', res);
      setLeaderStats(res);
      setColumns([
        {
          title: 'Name',
          width: 250,
          dataIndex: 'playerName',
          key: 'playerName',
        },
        {
          title: 'Match',
          width: 250,
          dataIndex: 'totalMatch',
          key: 'totalMatch',
        },
        {
          title: 'Inning',
          width: 250,
          dataIndex: 'totalInnings',
          key: 'totalInnings',
        },
        {
          title: 'Sixes',
          width: 250,
          dataIndex: 'mostSixes',
          key: 'mostSixes',
        },
      ]);
    });
  };

  const mostWickets = () => {
    setLoading(true);
    statisticsService.mostWickets(filters).then((res) => {
      setLoading(false);
      console.log('mostWickets', res);
      setLeaderStats(res);
      setColumns([
        {
          title: 'Name',
          width: 250,
          dataIndex: 'playerName',
          key: 'playerName',
        },
        {
          title: 'Match',
          width: 250,
          dataIndex: 'totalMatch',
          key: 'totalMatch',
        },
        {
          title: 'Wickets',
          width: 250,
          dataIndex: 'mostWickets',
          key: 'mostWickets',
        },
      ]);
    });
  };

  const mostCatches = () => {
    setLoading(true);
    statisticsService.mostCatches(filters).then((res) => {
      setLoading(false);
      console.log('mostCatches', res);
      setLeaderStats(res);
      setColumns([
        {
          title: 'Name',
          width: 250,
          dataIndex: 'playerName',
          key: 'playerName',
        },
        {
          title: 'Match',
          width: 250,
          dataIndex: 'totalMatch',
          key: 'totalMatch',
        },
        {
          title: 'Catches',
          width: 250,
          dataIndex: 'mostCatches',
          key: 'mostCatches',
        },
      ]);
    });
  };

  const mostStumps = () => {
    setLoading(true);
    statisticsService.mostStumps(filters).then((res) => {
      setLoading(false);
      console.log('mostStumps', res);
      setLeaderStats(res);
      setColumns([
        {
          title: 'Name',
          width: 250,
          dataIndex: 'playerName',
          key: 'playerName',
        },
        {
          title: 'Match',
          width: 250,
          dataIndex: 'totalMatch',
          key: 'totalMatch',
        },
        {
          title: 'Stumps',
          width: 250,
          dataIndex: 'mostStumps',
          key: 'mostStumps',
        },
      ]);
    });
  };

  const mostMaidens = () => {
    setLoading(true);
    statisticsService.mostMaidens(filters).then((res) => {
      setLoading(false);
      console.log('mostMaidens', res);
      setLeaderStats(res);
      setColumns([
        {
          title: 'Name',
          width: 250,
          dataIndex: 'playerName',
          key: 'playerName',
        },
        {
          title: 'Match',
          width: 250,
          dataIndex: 'totalMatch',
          key: 'totalMatch',
        },
        {
          title: 'Maiden',
          width: 250,
          dataIndex: 'maidens',
          key: 'maidens',
        },
      ]);
    });
  };
  const mostRunOuts = () => {
    setLoading(true);
    statisticsService.mostRunOuts(filters).then((res) => {
      setLoading(false);
      console.log('mostRunOuts', res);
      setLeaderStats(res);
      setColumns([
        {
          title: 'Name',
          width: 250,
          dataIndex: 'playerName',
          key: 'playerName',
        },
        {
          title: 'Match',
          width: 250,
          dataIndex: 'totalMatch',
          key: 'totalMatch',
        },
        {
          title: 'Run-outs',
          width: 250,
          dataIndex: 'runouts',
          key: 'runouts',
        },
      ]);
    });
  };

  const highestWicketsInAnInning = () => {
    setLoading(true);
    statisticsService.highestWicketsInAnInning(filters).then((res) => {
      setLoading(false);
      console.log('highestWicketsInAnInning', res);
      setLeaderStats(res);
      setColumns([
        {
          title: 'Name',
          width: 250,
          dataIndex: 'playerName',
          key: 'playerName',
        },
        {
          title: 'Match',
          width: 250,
          dataIndex: 'totalMatch',
          key: 'totalMatch',
        },
        {
          title: 'Highest Wickets',
          width: 250,
          dataIndex: 'highest',
          key: 'highest',
        },
      ]);
    });
  };

  const highestRunsInAnInning = () => {
    setLoading(true);
    statisticsService.highestRunsInAnInning(filters).then((res) => {
      setLoading(false);
      console.log('highestRunsInAnInning', res);
      setLeaderStats(res);
      setColumns([
        {
          title: 'Name',
          width: 250,
          dataIndex: 'playerName',
          key: 'playerName',
        },
        {
          title: 'Match',
          width: 250,
          dataIndex: 'totalMatch',
          key: 'totalMatch',
        },
        {
          title: 'Highest Runs',
          width: 250,
          dataIndex: 'highest',
          key: 'highest',
        },
      ]);
    });
  };

  const handleRadio = (e) => {
    setLeaderType(e.target.value);
  };

  useEffect(() => {
    handleSubmitStatsFilter();
  }, [leaderType]);

  //filter Section
  const filterModal = () => {
    setIsFilterModal(!isFilterModal);
    getAllTeams();
    getEvents();
  };

  const empltyFilterState = () => {
    setFilters({ teamId: null, matchType: null, eventId: null, season: null, position: null, overs: null, playerRoleId: null });
  };

  const handleCancelStatsFilter = () => {
    setIsFilterModal(!isFilterModal);
    empltyFilterState();
    //handleSubmitStatsFilter();
  };

  const handleSubmitStatsFilter = () => {
    setIsFilterModal(false);
    if (leaderType == 1) mostRuns();
    if (leaderType == 2) mostWickets();
    if (leaderType == 3) mostCenturies();
    if (leaderType == 4) mostFifties();
    if (leaderType == 5) mostCatches();
    if (leaderType == 6) mostStumps();
    if (leaderType == 7) mostFours();
    if (leaderType == 8) mostSixes();
    if (leaderType == 9) mostMaidens();
    if (leaderType == 10) mostRunOuts();
    if (leaderType == 11) highestRunsInAnInning();
    if (leaderType == 12) highestWicketsInAnInning();
  };

  const reset = () => {
    empltyFilterState();
    handleSubmitStatsFilter();
  };

  console.log(leaderType, filters);

  const handleChange = (value, key) => {
    setFilters({ ...filters, [key]: value });
  };

  const getAllTeams = () => {
    //setLoading(true);
    TeamService.getAll().then((res) => {
      // setLoading(false);
      console.log('getAll', res);
      setTeamList(res);
    });
  };

  const getEvents = () => {
    //setLoading(true);
    EventService.getAll().then((res) => {
      //setLoading(false);
      console.log('Events', res);
      setEventList(res);
    });
  };

  return (
    <>
      <Row>
        <div style={{ textAlign: 'center' }}>
          <Radio.Group onChange={(e) => handleRadio(e)} defaultValue="1" buttonStyle="solid" style={{ margin: '20px' }}>
            <Radio.Button value="1">Most Runs</Radio.Button>
            <Radio.Button value="2">Most Wickets</Radio.Button>
            <Radio.Button value="3">Most 100s</Radio.Button>
            <Radio.Button value="4">Most 50s</Radio.Button>
            <Radio.Button value="5">Most Catches</Radio.Button>
            <Radio.Button value="6">Most Stumps</Radio.Button>
            <Radio.Button value="7">Most 4s</Radio.Button>
            <Radio.Button value="8">Most 6s</Radio.Button>
            <Radio.Button value="9">Most Maidens</Radio.Button>
            <Radio.Button value="10">Most RunOuts</Radio.Button>
            <Radio.Button value="11">Highest Runs </Radio.Button>
            <Radio.Button value="12">Highest Wickets In Inning</Radio.Button>
          </Radio.Group>
        </div>
      </Row>
      <div>
        
        <div>
          <CustomTable loading={loading} columns={columns} data={leaderStats} paggination={false}></CustomTable>;
        </div>
      </div>
      <Tooltip title={'Filter'}>
          <Button type="primary" size="large" shape="circle" style={filterButon} className="filterButton" onClick={() => filterModal()}>
            <Icon className="icon-style" type="filter" />
          </Button>
        </Tooltip>
        <Tooltip title={'Reset'}>
          <Button type="primary" size="large" shape="circle" style={resetButton} className="filterButton" onClick={() => reset()}>
            <Icon className="icon-style" type="sync" />
          </Button>
        </Tooltip>

      <CustomModal
        title="Leaderboard filters"
        isModalVisible={isFilterModal}
        handleCancel={() => {
          handleCancelStatsFilter();
        }}
      >
        <Form>
          <CustomInput title="Team" type="select" options={teamList} handleChange={handleChange} value={filters.teamId} stateKey="teamId" />
          <CustomInput
            title="Match Type"
            type="select"
            options={matchTypes}
            handleChange={handleChange}
            value={filters.matchType}
            stateKey="matchType"
            placeholder="Select"
          />
          {filters.matchType && filters.matchType != 1 ? (
            <CustomInput title="Event" type="select" options={eventList} handleChange={handleChange} value={filters.eventId} stateKey="eventId" />
          ) : null}

          <CustomInput
            title="Playing Role"
            type="select"
            options={playingRoleOptions}
            handleChange={handleChange}
            value={filters.playerRoleId}
            stateKey="playerRoleId"
            placeholder="Select"
          />
          <CustomInput title="Season" type="number" handleChange={handleChange} value={filters.season} stateKey="season" placeholder="Optional" />
          {leaderType == 1 || leaderType == 3 || leaderType == 4 || leaderType == 7 || leaderType == 8 || leaderType == 11 ? (
            <CustomInput
              title="Position"
              type="select"
              options={positions}
              handleChange={handleChange}
              value={filters.position}
              stateKey="position"
              placeholder="Select"
            />
          ) : null}
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
    </>
  );
};
export default LeaderBoard;
