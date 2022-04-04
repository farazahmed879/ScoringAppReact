import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Button, Card, Form, Modal, Table, Dropdown, Menu, Row } from 'antd';
import { L } from '../../lib/abpUtility';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import CustomModal from '../../components/Modal';
import CustomInput from '../../components/Input';
import matchService from '../../services/match/matchService';
import TeamService from '../../services/team/TeamService';
import playerService from '../../services/player/playerService';
import { matchType, eventStage } from '../../components/Enum/enum';
import GroundService from '../../services/ground/GroundService';
import ScoreCardService from '../../services/scoreCard/ScoreCardService';


const success = Modal.success;
const error = Modal.error;

const ScoreCard = () => {
  const [filter] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [scoreCardList, setScoreCardList] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [groundList, setGroundList] = useState([]);
  const [playerList, setPlayerList] = useState([]);
  const [eventList, setEventList] = useState([]);

  const handleSubmit = (e) => {
    debugger;
    if (!scoreCardFormik.isValid) return;
    let req = {
      id: 0,
      matchOvers: scoreCardFormik.values.matchOvers
    };

    console.log('Match Object', req);
    matchService.createOrUpdate(req).then((res) => {
      res.success ? success({ title: res.successMessage }) : error({ title: res.successMessage });
      setIsOpenModal(false);
      getAll();
    });
  };
  

  const scoreCardFormik = useFormik({
    enableReinitialize: true,
    initialValues: '',
    validationSchema: '',
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    getAll();
  }, []);

  useEffect(() => {
    if (isOpenModal) {
    //  getAllTeams();
    //  getAllGrounds();
    //  getAllPlayers();
    //  getAllEvents();
    }
  }, [isOpenModal]);

  const getAll = (teamId,matchId) => {
    ScoreCardService.getAll(teamId,matchId).then((res) => {
      console.log('Matches', res.items);
      setScoreCardList(
        res.items.map((r) => ({
          ...r,
          key: r.id,
        }))
      );
    });
    //
  };



  const getAllPlayers = () => {
    playerService.getAll().then((res) => {
      console.log('Players', res);
      setPlayerList(res);
    });
  };
  

  const handleChange = (value, key) => {
    scoreCardFormik.setValues({ ...scoreCardFormik.values, [key]: value });
  };

  const columns = [
    {
      title: 'Ground',
      width: 250,
      dataIndex: 'ground',
      key: 'name',
      fixed: 'left',
      render: (text,item) => {
        return item && item.ground ? item.ground : 'N/A';
      }
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
      title: 'Type',
      width: 250,
      dataIndex: 'matchType',
      render: (text,item) => {
        debugger;
       // return item && item.dateOfMatch ? moment(item.dateOfMatch).format('DD MMM YYYY') : 'N/A';
        return item && item.matchType ? matchType.filter(i=> i.id == item.matchType)[0].name  : 'N/A';
      },
    },
    {
      title: 'Date',
      width: 250,
      dataIndex: 'date',
      render: (text,item) => {
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
  console.log('scoreCardFormik', scoreCardFormik);

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px' }}>
        <h1>ScoreCard</h1>{' '}
        <Button type="primary" shape="round" icon="plus" onClick={() => setIsOpenModal(true)}>
          Add
        </Button>
      </div>
      <Table columns={columns} dataSource={scoreCardList} scroll={{ x: 1500, y: 1000 }} />

      <CustomModal
        title="Add a new Match"
        isModalVisible={isOpenModal}
        handleCancel={() => {
          setIsOpenModal(false);
        }}
      >
        <Form className="form" onSubmit={scoreCardFormik.handleSubmit}>
          <Row>
            <CustomInput
              title="Team 1"
              type="select"
              options={teamList.filter((i) => i.id != scoreCardFormik.values.team2)}
              handleChange={handleChange}
              value={scoreCardFormik.values.team1}
              stateKey="team1"
              placeholder="Select Team"
              errorMessage={scoreCardFormik.errors.team1}
            />
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
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
export default ScoreCard;
