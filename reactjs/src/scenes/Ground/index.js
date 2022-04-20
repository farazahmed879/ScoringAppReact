import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Button, Card, Form, Modal, Table, Dropdown, Menu, Row } from 'antd';
import { Link } from 'react-router-dom';
import { L } from '../../lib/abpUtility';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import CustomModal from '../../components/Modal';
import CustomInput from '../../components/Input';
import groundService from '../../services/ground/GroundService';
import matchService from '../../services/match/matchService';
import TeamService from '../../services/team/TeamService';
import playerService from '../../services/player/playerService';
import { matchType, eventStage } from '../../components/Enum/enum';
import GroundService from '../../services/ground/GroundService';
const matchValidation = Yup.object().shape({
  team1: Yup.string().required('Required'),
  team2: Yup.string().required('Required'),
  matchTypeId: Yup.string().required('Required')
});

const matchInitial = {

  Id: '',
  Name: "",
  Location: ""
};

const success = Modal.success;
const error = Modal.error;

const Ground = () => {
  const [maxResultCount] = useState(10);
  const [skipCount] = useState(0);
  const [filter] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [matchList, setMatchList] = useState([]);
  // const [match, setPlayer] = useState(matchInitial);
  const [teamList, setTeamList] = useState([]);
  const [groundList, setGroundList] = useState([]);
  const [playerList, setPlayerList] = useState([]);
  const [eventList, setEventList] = useState([]);

  const handleSubmit = (e) => {
    debugger;
    // if (!matchFormik.isValid) return;
    let req = {
      id: 0,
      groundName: matchFormik.values.name,
      groundLocation: matchFormik.values.Location,
    };

    console.log('Match Object', req);
    groundService.createOrUpdate(req).then((res) => {
      res.success ? success({ title: res.successMessage }) : error({ title: res.successMessage });
      setIsOpenModal(false);
      getAll();
    });
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
    GroundService.getAll().then((res) => {
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
      render: (text, item) => {
        return item && item.ground ? item.ground : 'N/A';
      }
    },

    {
      title: 'Type',
      width: 250,
      dataIndex: 'matchType',
      render: (text, item) => {
        debugger;
        // return item && item.dateOfMatch ? moment(item.dateOfMatch).format('DD MMM YYYY') : 'N/A';
        return item && item.matchType ? matchType.filter(i => i.id == item.matchType)[0].name : 'N/A';
      },
    },
    {
      title: 'Date',
      width: 250,
      dataIndex: 'date',
      render: (text, item) => {
        debugger;
        // return item && item.dateOfMatch ? moment(item.dateOfMatch).format('DD MMM YYYY') : 'N/A';
        return item && item.dateOfMatch ? moment(item.dateOfMatch).format('DD MMM YYYY') : 'N/A';
      },
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
                <Menu.Item> <Link to="/scoreCard">{L('Score Card')}</Link></Menu.Item>
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
        <h1>Ground</h1>{' '}
        <Button type="primary" shape="round" icon="plus" onClick={() => setIsOpenModal(true)}>
          Add
        </Button>
      </div>
      <Table columns={columns} dataSource={matchList} scroll={{ x: 1500, y: 1000 }} />

      <CustomModal
        title="Add new Ground"
        isModalVisible={isOpenModal}
        handleCancel={() => {
          setIsOpenModal(false);
        }}
      >
        <Form className="form" onSubmit={matchFormik.handleSubmit}>
          <Row>
            <CustomInput
              title="Ground"
              type="text"
              handleChange={handleChange}
              value={matchFormik.values.groundId}
              stateKey="groundId"
              placeholder="Ground Name"
            />
            <CustomInput
              title="Location"
              type="text"
              handleChange={handleChange}
              value={matchFormik.values.locationId}
              stateKey="locationId"
              placeholder="Location"
            />
            {matchFormik.values.matchType == 2 ? (
              <CustomInput
                title="Event"
                type="select"
                handleChange={handleChange}
                options={eventList}
                value={matchFormik.values.eventId}
                stateKey="eventId"
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
                stateKey="eventStage"
                placeholder="Select Stage"
              />
            ) : null}
            {matchFormik.values.team1 && matchFormik.values.team2 ? (
              <CustomInput
                title="Toss Winning Team"
                type="select"
                handleChange={handleChange}
                options={teamList.filter((i) => i.id == matchFormik.values.team1 || i.id == matchFormik.values.team2)}
                value={matchFormik.values.tossWinningTeam}
                stateKey="tossWinningTeam"
                placeholder="Select Team"
              />
            ) : null}
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
              Add
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
export default Ground;
