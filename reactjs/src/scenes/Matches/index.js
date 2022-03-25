import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Button, Card, Form, Modal, Table, Dropdown, Menu, Row } from 'antd';
import { L } from '../../lib/abpUtility';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomModal from '../../components/Modal';
import CustomInput from '../../components/Input';
import matchService from '../../services/match/matchService';
import TeamService from '../../services/team/TeamService';
import playerService from '../../services/player/playerService';
import { matchType, eventStage } from '../../components/Enum/enum';
const matchValidation = Yup.object().shape({
  team1: Yup.string().required('Required'),
  team2: Yup.string().required('Required'),
  //gender: Yup.object().required("Required")
});

const matchInitial = {
  matchOvers: 0,
  matchDescription: '',
  season: 0,
  eventId: 0,
  team1: '',
  team2: '',
  groundId: '',
  matchTypeId: '',
  eventType: '',
  eventStage: '',
  date: '',
  TossWinningTeam: '',
  playerOTM: '',
};

const success = Modal.success;
const error = Modal.error;

const Matches = () => {
  const [maxResultCount] = useState(10);
  const [skipCount] = useState(0);
  const [filter] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [matchList, setMatchList] = useState([]);
  const [match, setPlayer] = useState(matchInitial);
  const [teamList, setTeamList] = useState([]);
  const [groundList, setGroundList] = useState([]);
  const [playerList, setPlayerList] = useState([]);
  const [eventList, setEventList] = useState([]);

  const handleSubmit = (e) => {
    console.log('e', e);
  };
  // const handleSubmit = () => {
  //   debugger;
  //   if (!matchFormik.isValid) return;

  //   // let matchObject = {
  //   //   team1: matchFormik.values.team1,
  //   // };

  //   //console.log('Player Object', matchObject);
  //   // matchService.createOrUpdate(matchObject).then(res => {
  //   //     res.success ?
  //   //         success({ title: res.successMessage }) :
  //   //         error({ title: res.successMessage });
  //   //     setIsOpenModal(false);
  //   // });
  // };

  const matchFormik = useFormik({
    enableReinitialize: true,
    initialValues: matchInitial,
    validationSchema: matchValidation,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    getAll();
  }, []);

  useEffect(() => {
    if (isOpenModal) {
      getAllTeams();
      getAllGrounds();
      getAllPlayers();
      getAllEvents();
    }
  }, [isOpenModal]);

  const getAll = () => {
    matchService.getPaginatedAll({ maxResultCount: maxResultCount, skipCount: skipCount, name: filter }).then((res) => {
      console.log('Matches', res.items);
      setMatchList(
        res.items.map((r) => ({
          ...r,
          key: r.id,
        }))
      );
    });
    //
  };

  const getAllTeams = () => {
    TeamService.getAll().then((res) => {
      console.log('Teams', res);
      setTeamList(res);
    });
  };

  const getAllGrounds = () => {
    TeamService.getAll().then((res) => {
      console.log('Grounds', res);
      setGroundList(res);
    });
  };

  const getAllPlayers = () => {
    playerService.getAll().then((res) => {
      console.log('Players', res);
      setPlayerList(res);
    });
  };
  const getAllEvents = () => {
    playerService.getAll().then((res) => {
      console.log('eventList', res);
      setEventList(res);
    });
  };

  const handleChange = (value, key) => {
    debugger;
    // if (key == "team1") {
    //     var selectedTeam = teamList.filter((i) => i.id == value)[0];
    //     matchFormik.setValues({ ...matchFormik.values, [key]: { id: selectedTeam.id, name: selectedTeam.name } })
    //     return;
    // }
    //console.log("value", e.target.name, e.target.value);
    matchFormik.setValues({ ...matchFormik.values, [key]: value });
  };

  const columns = [
    {
      title: 'Ground',
      width: 250,
      dataIndex: 'ground',
      key: 'name',
      fixed: 'left',
    },
    {
      title: 'Team 1',
      width: 250,
      dataIndex: 'team1',
      key: 'team1',
      fixed: 'left',
    },

    {
      title: 'Team 2',
      width: 250,
      dataIndex: 'team2',
      key: 'team2',
      fixed: 'left',
    },
    {
      title: 'Date',
      width: 250,
      dataIndex: 'date',
      key: 'date',
    },

    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (text, item) => (
        <div>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                <Menu.Item>{L('Edit')}</Menu.Item>
                <Menu.Item>{L('Delete')}</Menu.Item>
                <Menu.Item>{L('Score Card')}</Menu.Item>
              </Menu>
            }
            placement="bottomLeft"
          >
            <Button type="primary" icon="setting">
              {L('Actions')}
            </Button>
          </Dropdown>
        </div>
      ),
    },
  ];
  console.log('matchFormik', matchFormik);

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px' }}>
        <h1>Manage Matches</h1>{' '}
        <Button type="primary" shape="round" icon="plus" onClick={() => setIsOpenModal(true)}>
          Add
        </Button>
      </div>
      <Table columns={columns} dataSource={matchList} scroll={{ x: 1500, y: 1000 }} />

      <CustomModal
        title="Add a new Match"
        isModalVisible={isOpenModal}
        handleCancel={() => {
          setIsOpenModal(false);
        }}
      >
        <Form className="form" onSubmit={matchFormik.handleSubmit}>
          <Row>
            <CustomInput
              title="Team 1"
              type="select"
              options={teamList.filter((i) => i.id != matchFormik.values.team2)}
              handleChange={handleChange}
              value={matchFormik.values.team1}
              stateKey="team1"
              placeholder="Select Team"
              errorMessage={matchFormik.errors.team1}
            />
            <CustomInput
              title="Team 2"
              type="select"
              options={teamList.filter((i) => i.id != matchFormik.values.team1)}
              handleChange={handleChange}
              value={matchFormik.values.team2}
              stateKey="team2"
              placeholder="Select Team"
              errorMessage={matchFormik.errors.team2}
            />
            <CustomInput
              title="Ground"
              type="select"
              options={groundList}
              handleChange={handleChange}
              value={matchFormik.values.ground}
              stateKey="ground"
              placeholder="Select Ground"
            />
            <CustomInput
              title="Description"
              type="text"
              handleChange={handleChange}
              value={matchFormik.values.description}
              stateKey="description"
              placeholder="Optional"
            />
            <CustomInput
              title="Date of Match"
              type="datePicker"
              handleChange={handleChange}
              value={matchFormik.values.date}
              stateKey="datePicker"
              placeholder="Select Date"
            />
            <CustomInput
              title="Season"
              type="number"
              handleChange={handleChange}
              value={matchFormik.values.season}
              stateKey="season"
              placeholder="Optional"
              width="40%"
            />

            <CustomInput
              title="Overs"
              type="number"
              handleChange={handleChange}
              value={matchFormik.values.overs}
              stateKey="season"
              placeholder="Optional"
              width="40%"
            />

            <CustomInput
              title="Match Type"
              type="select"
              options={matchType}
              handleChange={handleChange}
              value={matchFormik.values.matchType}
              stateKey="matchType"
              placeholder="Select Type"
            />
            {matchFormik.values.matchType == 2 ? (
              <CustomInput
                title="Event"
                type="select"
                handleChange={handleChange}
                options={eventList}
                value={matchFormik.values.date}
                stateKey="select"
                placeholder="Select Event"
              />
            ) : null}
            {matchFormik.values.matchType == 2 ? (
              <CustomInput
                title="Event Stage"
                type="select"
                handleChange={handleChange}
                options={eventStage}
                value={matchFormik.values.eventStage}
                stateKey="select"
                placeholder="Select Stage"
              />
            ) : null}

            <CustomInput
              title="Toss Winning Team"
              type="select"
              handleChange={handleChange}
              options={teamList}
              value={matchFormik.values.TossWinningTeam}
              stateKey="select"
              placeholder="Select Team"
            />

            <CustomInput
              title="Player Of the Match"
              type="select"
              handleChange={handleChange}
              options={playerList}
              value={matchFormik.values.playerOTM}
              stateKey="select"
              placeholder="Man of the match"
            />
          </Row>
          {/* <CustomInput title="Overs" type="number" handleChange={handleChange} 
                    value={playerFormik.values.overs} stateKey="overs" placeholder="" /> */}
          {/* <CustomInput title="Gender" type="select" options={genderOptions} handleChange={handleChange} value={playerFormik.values.gender.id} stateKey="gender" />
                    <CustomInput title="Contact" type="text" handleChange={handleChange} value={playerFormik.values.contact} stateKey="contact" placeholder="" />
                    <CustomInput title="Address" type="text" handleChange={handleChange} value={playerFormik.values.address} stateKey="address" placeholder="" />
                    <CustomInput title="Cnic" type="text" handleChange={handleChange} value={playerFormik.values.cnic} stateKey="cnic" placeholder="" />
                    <CustomInput title="Birth" type="datePicker" handleChange={handleChangeDatePicker} value={playerFormik.values.dob} stateKey="dob" placeholder="" />
                    <CustomInput title="Team" type="select" options={teamList} handleChange={handleChange} value={playerFormik.values.team.name} stateKey="team" placeholder="" />
                    <CustomInput title="Player Role" type="select" options={playingRoleOptions} handleChange={handleChange} value={playerFormik.values.playingRole.name} stateKey="playingRole" placeholder="" />
                    <CustomInput title="Batting Style" type="select" options={battingStyleOptions} handleChange={handleChange} value={playerFormik.values.battingStyle.name} stateKey="battingStyle" placeholder="" />
                    <CustomInput title="Bowling Style" type="select" options={bowlingStyleOptions} handleChange={handleChange} value={playerFormik.values.bowlingStyle.name} stateKey="bowlingStyle" placeholder="" /> */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Book Now
            </Button>
            <Button htmlType="button" onClick={() => setIsOpenModal(false)}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </CustomModal>
    </Card>
  );
};
export default Matches;
