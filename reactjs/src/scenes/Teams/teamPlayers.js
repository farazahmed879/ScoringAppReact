import React, { useEffect, useState } from 'react';
import { Transfer, Button, Card, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import playerService from '../../services/player/playerService';
import TeamService from '../../services/team/TeamService';
const TeamPlayers = () => {
  const success = Modal.success;
  const error = Modal.error;
  const param = useParams();
  const [teamName, setTeamName] = useState([]);
  const [playerList, setPlayerList] = useState([]);
  const [selectedPlayerList, setSelectedPlayerList] = useState([]);
  const [state, setState] = useState({
    mockData: [],
    targetKeys: [],
  });

  useEffect(() => {
    getAllPlayers();
    setTeamName(param.teamName);
  }, []);

  const getAllPlayers = () => {
    playerService.getAll().then((res) => {
      console.log('Players', res);
      setPlayerList(res);
      getAllPlayersByTeamId(res);
    });
  };

  const getAllPlayersByTeamId = (allPlayers) => {
    playerService.getAllByTeamId(+param.teamId).then((res) => {
      console.log('Selected Players', res);
      setSelectedPlayerList(res);
      getMock(allPlayers, res);
    });
  };

  const getMock = (playerList, selectedPlayerList) => {
    const targetKeys = [];
    const mockData = [];
    selectedPlayerList.forEach((item, index) => {
      const data = {
        key: item.id,
        title: `${item.name}`,
        description: `${item.contact || ' -'}`,
      };
      targetKeys.push(data.key);
    });

    playerList.forEach((item, index) => {
      const data = {
        key: item.id,
        title: `${item.name}`,
        description: `${item.contact || ' -'}`,
      };
      mockData.push(data);
    });
    setState({ mockData, targetKeys });
  };

  const handleSubmit = (e) => {
    debugger;
    let req = {
      teamId: +param.teamId,
      playerIds: state.targetKeys,
    };
    TeamService.createTeamPlayers(req).then((res) => {
      res.success ? success({ title: res.successMessage }) : error({ title: res.successMessage });
    });
  };

  //   const renderFooter = () => (
  //     <Button size="small" style={{ float: 'right', margin: 5 }} onClick={getMock}>
  //       reload
  //     </Button>
  //   );

  const handleChange = (data) => {
    setState((prev) => ({
      ...prev,
      targetKeys: data,
    }));
  };
  return (
    <Card>
      <h3>{teamName} Players</h3>{' '}
      <Transfer
        titles={['All Players', 'Selected Players']}
        dataSource={state.mockData}
        showSearch
        listStyle={{
          width: '40%',
          height: '100%',
        }}
        operations={['', '']}
        targetKeys={state.targetKeys}
        onChange={handleChange}
        render={(item) => `${item.title}-${item.description}`}
      />
      <div
        style={{
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button style={{ marginRight: 8 }}>
          <Link to={'/teams'}>Back</Link>
        </Button>
        <Button onClick={handleSubmit} type="primary">
          Submit
        </Button>
      </div>
    </Card>
  );
};
export default TeamPlayers;
