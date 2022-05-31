import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, Row, Col, Tooltip, Empty, Icon, Badge, Modal } from 'antd';
import { truncateText } from '../../helper/helper';
import { useFormik } from 'formik';
import './style.css';
import moment from 'moment';
import CreateOrUpdateKnockOutMatch from './createOrUpdateKnockOutMatch';
import matchService from '../../services/match/matchService';
import playerService from '../../services/player/playerService';
import EventService from '../../services/event/EventService';
import TeamService from '../../services/team/TeamService';
import GroundService from '../../services/ground/GroundService';
import * as Yup from 'yup';
import AppConsts from '../../lib/appconst';

const hr1 = {
  width: '100%',
  marginTop: '15px',
  marginLeft: '0',
  marginRight: '0',
};

const hr2 = {
  width: '100%',
  marginTop: '15px',
  marginLeft: '0',
  marginRight: '0',
};

const column = {
  display: 'grid',
  gridGap: '40px',
  alignItems: 'center',
};

const success = Modal.success;
const error = Modal.error;

const ViewBracket1 = ({ formikData,event }) => {
  console.log('viewBracketsFormik', formikData);
  const [column1Teams, setColumn1Teams] = useState([]);
  const [column2Teams, setColumn2Teams] = useState([]);

  //editMatch
  const [playerList, setPlayerList] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [groundList, setGroundList] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [editMatch, setEditMatch] = useState({});
  const param = useParams();
  const arr = [4, 8, 16, 32, 64, 128];

  let column1 = [];
  let column2 = [];
  useEffect(() => {
    formikData.matches.forEach((element) => {
      if (element) {
        let col1 = element.matches.splice(0, element.matches.length / 2);
        column1.push(col1);
        column2.push(element.matches);
      }
    });
    setColumn1Teams(column1);
    setColumn2Teams(column2);
    console.log('c1', column1);
    console.log('c2', column2);
  }, [formikData]);

  const calculateColumns = (num) => {
    let css = [num];
    let x = num;
    while (x != 1) {
      x = x / 2;
      css.push(x);
    }
    return css;
  };

  const checkConditionTeam = (matches, index, index2) => {
    return matches && matches[index] && matches[index][index2];
  };

  const createBadge = (data) => {
    if (data) {
      if (data.id) {
        return data.dateOfMatch ? (
          <Badge
            count={moment(data.dateOfMatch).format('MM/DD/YYYY')}
            style={{ backgroundColor: '#52c41a', cursor: 'pointer' }}
            onClick={() => viewMatchModal(data)}
          ></Badge>
        ) : (
          <Tooltip title={'Date Missing'}>
            <Badge count={'Schedule'} style={{ backgroundColor: 'orange', cursor: 'pointer' }} onClick={() => viewMatchModal(data)}></Badge>
          </Tooltip>
        );
      }
      return (
        <Tooltip title={'Create Match'}>
          <Badge count={'?'} onClick={() => viewMatchModal(data || null)} style={{ cursor: 'pointer' }} />
        </Tooltip>
      );
    } else {
      return (
        <Tooltip title={'N/A'}>
          <Badge count={'N/A'} style={{ cursor: 'pointer' }} />
        </Tooltip>
      );
    }
  };

  const checkConditionDate = (matches, index, index2) => {
    let data = matches && matches[index] && matches[index][index2] ? matches[index][index2] : null;
    return createBadge(data);
  };

  const generateUperBar = (index) => {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
        {Array.from(Array(index + 1), (e, index3) => (
          <span style={{ marginTop: '10.5px' }}>|</span>
        ))}
      </div>
    );
  };

  const generateLowerBar = (index) => {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
        {Array.from(Array(index + 1), (e, index3) => (
          <span style={{ marginTop: index3 == 0 ? '-3px' : index3 == 1 ? '-50px' : '-80px' }}>|</span>
        ))}
      </div>
    );
  };

  const generateBracket = (matches = []) => {
    if (matches.length == 0) return;
    let assignedTeams = JSON.parse(JSON.stringify(matches));
    console.log('assignedTeams', assignedTeams);
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: calculateColumns(matches[0].length * 2)
            .map((i) => '1fr')
            .join(' '),
        }}
      >
        {calculateColumns(matches[0].length).map((i, index) => (
          <div style={column}>
            {Array.from(Array(i), (e, index2) => (
              <div>
                <div style={{ display: 'flex' }}>
                  <Tooltip title={checkConditionTeam(assignedTeams, index, index2) ? assignedTeams[index][index2].team1 : 'Upcoming'}>
                    <Button dir="LTR" style={{ width: '120px' }}>
                      {checkConditionTeam(assignedTeams, index, index2) ? truncateText(assignedTeams[index][index2].team1, 10) : 'Unknown Team'}
                    </Button>
                  </Tooltip>

                  <span style={{ fontSize: '15px' }}>{checkConditionDate(assignedTeams, index, index2)}</span>
                  <hr style={hr1} />
                  {generateUperBar(index)}
                </div>

                <div style={{ display: 'flex', marginTop: index == 0 ? '75px' : index == 1 ? '115px' : '275px' }}>
                  <Tooltip title={checkConditionTeam(assignedTeams, index, index2) ? assignedTeams[index][index2].team2 : 'Upcoming'}>
                    <Button dir="LTR" style={{ width: '120px' }}>
                      {checkConditionTeam(assignedTeams, index, index2) ? truncateText(assignedTeams[index][index2].team2, 10) : 'Unknown Team'}
                    </Button>
                  </Tooltip>
                  <hr style={hr2} />
                  {generateLowerBar(index)}
                </div>
              </div>
            ))}
          </div>
        ))}{' '}
        <div style={{ display: 'grid', alignItems: 'center' }}>
          <Tooltip title="Finalist">
            <div style={{ display: 'flex' }}>
              <Button dir="LTR" style={{ width: '120px' }}>
                {truncateText('Finalist1', 10)}
              </Button>
              <hr style={{ width: '100%', marginTop: '15px', marginLeft: '0', marginRight: '0' }} />
            </div>
          </Tooltip>
        </div>
      </div>
    );
  };

  const matchValidation = Yup.object().shape({
    team1Id: Yup.string().required('Required'),
    team2Id: Yup.string().required('Required'),
    matchTypeId: Yup.string().required('Required'),
    dateOfMatch: Yup.string().required('Required'),
  });

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

  const handleSubmit = (e) => {
    if (!matchFormik.isValid) return;
    let req = {
      id: matchFormik.values.id,
      groundId: matchFormik.values.groundId,
      matchOvers: matchFormik.values.matchOvers,
      matchDescription: matchFormik.values.matchDescription,
      season: matchFormik.values.season,
      eventId: matchFormik.values.eventId,
      tossWinningTeam: matchFormik.values.tossWinningTeam,
      team1Id: matchFormik.values.team1Id,
      team2Id: matchFormik.values.team2Id,
      matchTypeId: matchFormik.values.matchTypeId,
      eventType: matchFormik.values.eventType,
      eventStage: matchFormik.values.eventStage,
      dateOfMatch: moment(matchFormik.values.dateOfMatch).valueOf(),
      playerOTM: matchFormik.values.playerOTM,
    };

    console.log('Match Object', req);
    matchService.createOrUpdate(req).then((res) => {
      res.success ? success({ title: res.successMessage }) : error({ title: res.successMessage });
      setIsOpenModal(false);
    //  createBadge()
    });
  };

  const handleCancel = (e) => {
    setIsOpenModal(e);
  };

  const matchFormik = useFormik({
    enableReinitialize: true,
    initialValues: matchInitial,
    validationSchema: matchValidation,
    onSubmit: handleSubmit,
  });

  const handleEditMatch = (id) => {
    setIsOpenModal(true);
    matchService.EditEventMatch(id).then((res) => {
      if (res) {
        setEditMatch(res);
        matchFormik.setValues({
          ...matchFormik.values,
          ...res,
        });
      }
    });
  };

  const getAllPlayersByMatchId = (id) => {
    playerService.getAllByMatchId(id).then((res) => {
      console.log('Players', res);
      setPlayerList(res);
    });
  };

  const getMatchTeams = (id) => {
    TeamService.getMatchTeams(id).then((res) => {
      console.log('Event Teams', res);
      setTeamList(res);
    });
  };

  const getAllGrounds = () => {
    GroundService.getAll().then((res) => {
      console.log('Grounds', res);
      setGroundList(res);
    });
  };

  const viewMatchModal = (match) => {
    if (!match) return;
    if (match.id) {
      handleEditMatch(match.id);
      //getMatchTeams(match.id);
      getAllPlayersByMatchId(match.id);
      getAllGrounds();
    } else {
      match.matchTypeId = AppConsts.tournament;
      match.eventId = param.eventId;
      match.eventStage = 2;
      match.event = event;
      matchFormik.setValues({
        ...matchFormik.values,
        ...match,
      });
    }
    var teams = [];
    teams.push({ id: match.team1Id, name: match.team1 }, { id: match.team2Id, name: match.team2 });
    setTeamList(teams);
    getAllGrounds();
    setIsOpenModal(true);
  };

  return (
    <Card>
      {arr.includes(formikData.selectedTeams.length) ? (
        <Row>
          {Array.from(Array(2), (e, index) => (
            <Col span={12} dir={index == 0 ? 'LTR' : 'RTL'}>
              {generateBracket(index == 0 ? column1Teams : column2Teams)}
            </Col>
          ))}
        </Row>
      ) : (
        <Empty />
      )}
      {!isOpenModal || (
        <CreateOrUpdateKnockOutMatch
          matchFormik={matchFormik}
          handleCancel={handleCancel}
          editMatch={editMatch}
          teamList={teamList}
          playerList={playerList}
          groundList={groundList}
        ></CreateOrUpdateKnockOutMatch>
      )}
    </Card>
  );
};

export default ViewBracket1;
