import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Button, Card, Form, Modal, Table, Dropdown, Menu, Row, Col, Collapse, Divider, Icon, Popover, Upload, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import { L } from '../../lib/abpUtility';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import CustomModal from '../../components/Modal';
import CustomInput from '../../components/Input';
import matchService from '../../services/match/matchService';
import TeamService from '../../services/team/TeamService';
import playerService from '../../services/player/playerService';
import { matchTypes, eventStage } from '../../components/Enum/enum';
import GroundService from '../../services/ground/GroundService';
import FilterPanel from './filter-panel';
import EventService from '../../services/event/EventService';
import CustomTable from '../../components/Table';
import { getBase64 } from '../../helper/getBase64';
import matchTypeConst from '../../lib/matchTypeConst';
import AppConsts, { IsLiveOrMannual, MatchStatus } from '../../lib/appconst';
import tournamentTypeConst from '../../lib/tournamentTypeConst';
import ViewImage from '../../components/ViewImage';
import AddOrEditMatchModal from './addOrEditMatchModal';
import StartMatch from '../StartMatch';
import { matches } from 'lodash';
import { link } from 'fs';

const baseUrl = 'http://localhost:21021';
const matchValidation = Yup.object().shape({
  team1Id: Yup.string().required('Required'),
  team2Id: Yup.string().required('Required'),
  matchOvers: Yup.number().required('Required'),
  matchTypeId: Yup.string().required('Required'),
});

const matchInitial = {
  id: 0,
  matchOvers: 0,
  matchDescription: '',
  season: 0,
  eventId: '',
  team1Id: null,
  team2Id: null,
  groundId: '',
  matchTypeId: '',
  eventType: '',
  eventStage: '',
  dateOfMatch: null,
  tossWinningTeam: '',
  playerOTM: '',
  group: 0,
};

const success = Modal.success;
const error = Modal.error;
const { Panel } = Collapse;

const Matches = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [matchList, setMatchList] = useState([]);
  // const [match, setPlayer] = useState(matchInitial);
  const [isEditDataLoading, setIsEditDataLoading] = useState(false);
  const [teamList, setTeamList] = useState([]);
  const [filterTeamList, setFilterTeamList] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groundList, setGroundList] = useState([]);
  const [playerList, setPlayerList] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [picture, setPicture] = useState(false);
  const [preview, setPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [profile, setProfile] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [mode, setModalMode] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

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
      profile: matchFormik.values.profile,
      profileUrl: matchFormik.values.profileUrl,
      gallery: gallery.map((data) => ({
        id: data.key,
        name: data.name,
        blob: data.thumbUrl,
      })),
    };

    if (profile && profile[0]) {
      setPicture(false);
      req['profile'] = { name: profile[0].name, blob: profile[0].thumbUrl, url: profile[0].url };
    } else {
      setPicture(true);
      return;
    }

    matchService.createOrUpdate(req).then((res) => {
      res.success ? success({ title: res.successMessage }) : error({ title: res.successMessage });
      setIsOpenModal(false);
      getAll();
      reset();
    });
  };

  const filterHandleSubmit = (event) => {
    getAll(event);
  };

  const matchFormik = useFormik({
    enableReinitialize: true,
    initialValues: matchInitial,
    validationSchema: matchValidation,
    onSubmit: handleSubmit,
  });

  const callback = (key) => {
    console.log(key);
  };

  const handleDeletePicture = () => {
    setProfile([]);
  };

  const handlePreviewCancel = () => setPreview(false);

  const handleTableChange = (e) => {
    setPagination({
      current: e.current,
      pageSize: e.pageSize,
    });
  };

  useEffect(() => {
    getAllTeams();
    getAllGrounds();
  }, []);

  useEffect(() => {
    getAll();
  }, [pagination.current]);

  useEffect(() => {
    if (matchFormik.values.eventId) {
      matchFormik.setValues({ ...matchFormik.values, group: 0 });
      setTeamList([]);
      let currentEvent = eventList.filter((i) => i.id == matchFormik.values.eventId)[0];
      if (!currentEvent || !currentEvent.numberOfGroup || currentEvent.numberOfGroup <= 1) {
        getAllTeamsByEventId(matchFormik.values.eventId);
        setGroups([]);
        return;
      }
      calculateGruops(currentEvent.numberOfGroup);
    }
  }, [matchFormik.values.eventId]);

  useEffect(() => {
    if (matchFormik.values.group && matchFormik.values.group > 0) {
      getAllTeamsByEventId(matchFormik.values.eventId, matchFormik.values.group);
    }
  }, [matchFormik.values.group]);

  useEffect(() => {
    if (matchFormik.values.matchTypeId == matchTypeConst.friendly) {
      var obj = matchFormik.values;
      obj.eventId = '';
      obj.group = 0;
      matchFormik.setValues({ ...matchFormik.values, obj });
      setTeamList(filterTeamList);
    }
    if (matchFormik.values.matchTypeId == matchTypeConst.tournament || matchFormik.values.matchTypeId == matchTypeConst.series) {
      if (!matchFormik.values.event) {
        var a = matchFormik.values;
        a.team1Id = '';
        a.team2Id = '';
        matchFormik.setValues({ ...matchFormik.values, a });
      }
      getAllEvents();
      setTeamList([]);
    }
  }, [matchFormik.values.matchTypeId]);

  useEffect(() => {
    if (matchFormik.values.team1Id && matchFormik.values.team2Id) {
      AllPlayersByTeamIds();
    }
  }, [matchFormik.values.team1Id, matchFormik.values.team2Id]);

  const calculateGruops = (num) => {
    let group = [];
    for (let i = 1; i <= num; i++) {
      group.push({ id: i, name: i });
    }
    setGroups(group);

  };

  const getAll = (filter) => {
    setLoading(true);
    matchService
      .getPaginatedAll({
        maxResultCount: pagination.pageSize,
        skipCount: filter ? 0 : (pagination.current - 1) * pagination.pageSize,
        team1Id: filter ? filter.team1 : undefined,
        team2Id: filter ? filter.team2 : undefined,
        type: filter ? filter.type : undefined,
        groundId: filter ? filter.groundId : undefined,
        date: filter && filter.date ? moment(filter.date).valueOf() : undefined,
      })
      .then((res) => {
        setLoading(false);
        setMatchList(
          res.items.map((r) => ({
            ...r,
            key: r.id,
          }))
        );
        setPagination({
          ...pagination,
          total: res.totalCount,
        });
      });
    //
  };

  const getAllTeamsByEventId = (id, group) => {
    TeamService.getAllEventTeams(id, group).then((res) => {
      setTeamList(res);
    });
  };

  const getAllTeams = () => {
    TeamService.getAll().then((res) => {
      setFilterTeamList(res);
    });
  };

  const getAllGrounds = () => {
    GroundService.getAll().then((res) => {
      setGroundList(res);
    });
  };

  const AllPlayersByTeamIds = () => {
    var teamIds = [];
    teamIds.push(matchFormik.values.team1Id);
    teamIds.push(matchFormik.values.team2Id);
    playerService.AllPlayersByTeamIds(teamIds).then((res) => {
      setPlayerList(res);
    });
  };
  const getAllEvents = () => {
    EventService.getAll().then((res) => {
      setEventList(res);
    });
  };

  useEffect(() => {
    if (profile.length > 0) {
      setPicture(false);
    } else {
      setPicture(true);
    }
  }, [profile]);

  const handleUpload = ({ file, fileList }) => {
    setGallery(fileList);
  };

  const handleProfileUpload = ({ fileList }) => {
    setProfile(fileList);
    //console.log('profile', e.file);
  };

  const handleChange = (value, key) => {
    matchFormik.setValues({ ...matchFormik.values, [key]: value });
  };
  const confirm = Modal.confirm;
  const handleDeleteMatch = (item) => {
    // setDeleteEvent(true);
    confirm({
      title: 'Do you Want to delete these items?',
      onOk() {
        matchService.delete(item.id).then((res) => {
          if (res) {
            if (!res.success) {
              error({ title: res.successMessage });
              return;
            } else {
              success({ title: res.successMessage });
              getAll();
            }
          }
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleEditMatch = (item) => {
    setIsEditDataLoading(true);
    setIsOpenModal(true);
    setModalMode('Edit Match');
    matchService.EditEventMatch(item.id).then((res) => {
      if (res) {
        if (!res.success) {
          error({ title: res.successMessage });
          return;
        }
        matchFormik.setValues({
          ...matchFormik.values,
          ...res.result,
        });
        let obj = [];
        if (res.result.pictures)
          res.result.pictures.forEach((element) => {
            var ob = {
              key: element.id,
              name: element.name,
              uid: element.id,
              url: baseUrl + '/' + element.url,
            };
            obj.push(ob);
          });
        setGallery(obj);
        setProfile([{ key: res.result.id, name: res.result.name, uid: res.result.id, url: baseUrl + '/' + res.result.profileUrl }]);
        setIsEditDataLoading(false);
      }
    });
  };

  const addMatch = () => {
    matchFormik.setValues({});
    setIsOpenModal(true);
    setProfile([]);
    setGallery([]);
    setModalMode('Add Match');
  };

  const reset = () => {
    matchFormik.setValues({});
  };


  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreview(true);
  };

  const columns = [
    {
      title: 'Ground',
      width: 250,
      dataIndex: 'ground',
      key: 'name',
      fixed: 'left',
      render: (text, item) => {
        return item && item.name ? item.name : 'N/A';
      },
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
      key: 'type',
      dataIndex: 'matchType',
      render: (item) => {
        if (item) {
          var matchType = matchTypes.filter((i) => i.id == item)[0];
          return matchType ? matchType.name : 'N/A';
        }
      },
    },
    {
      title: 'Event',
      width: 250,
      key: 'eventName',
      dataIndex: 'eventName',
    },
    {
      title: 'Date',
      width: 250,
      dataIndex: 'date',
      key: 'date',
      render: (item) => {
        return moment(item).format('MM/DD/YYYY');
      },
    },
    {
      title: 'Scorecard',
      key: 'operation',
      width: 100,
      fixed: 'left',
      render: (text, item) => {
        return (
          <Link to={'/summary/' + item.id + '/team1/' + item.team1Id + '/team2/' + item.team2Id}>
            <div style={{ cursor: 'pointer' }}>
              <Icon type="calculator" />
            </div>
          </Link>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (text, item) => (
        <div>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                <Menu.Item onClick={() => handleEditMatch(item)}>{L('Edit')}</Menu.Item>
                <Menu.Item onClick={(e) => handleDeleteMatch(item)}>{L('Delete')}</Menu.Item>
                {item && item.isLiveOrMannual != IsLiveOrMannual.LIVE && (
                  <Menu.Item>
                    {' '}
                    <Link to={'/scoreCard/team1/' + item.team1Id + '/team2/' + item.team2Id + '/match/' + item.id}>{L('Add Score Manually')}</Link>
                  </Menu.Item>
                )}

                {item && item.isLiveOrMannual != IsLiveOrMannual.MANNUAL && (
                  <Menu.Item>
                    {item && !item.status && (
                      <Link
                        to={
                          '/startMatch/team1/' + item.team1Id + '/' + item.team1 + '/team2/' + item.team2Id + '/' + item.team2 + '/match/' + item.id
                        }
                      >
                        {L('Start Live Scoring')}
                      </Link>
                    )}
                    {item && item.status == MatchStatus.STARTED && (
                      <Link
                        to={
                          '/liveScoring/team1/' + item.team1Id + '/' + item.team1 + '/team2/' + item.team2Id + '/' + item.team2 + '/match/' + item.id
                        }
                      >
                        {L('Resume')}
                      </Link>
                    )}
                  </Menu.Item>
                )}
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

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px' }}>
        <h1>Manage Matches</h1>{' '}
        <Button type="primary" shape="round" icon="plus" onClick={() => addMatch()}>
          Add
        </Button>
      </div>

      <Collapse onChange={callback} style={{ marginBottom: '10px' }}>
        <Panel header="Advance Filters" key="1">
          <FilterPanel teams={filterTeamList} grounds={groundList} handleSubmit={filterHandleSubmit}></FilterPanel>
        </Panel>
      </Collapse>
      <CustomTable
        loading={loading}
        pagination={pagination}
        columns={columns}
        data={matchList}
        scroll={{ x: 1500 }}
        handleTableChange={handleTableChange}
      />
      <AddOrEditMatchModal
        isOpenModal={isOpenModal}
        isEditDataLoading={isEditDataLoading}
        matchFormik={matchFormik}
        profile={profile}
        handleDeletePicture={handleDeletePicture}
        picture={picture}
        handleProfileUpload={handleProfileUpload}
        handlePreview={handlePreview}
        matchTypes={matchTypes}
        handleChange={handleChange}
        teamList={teamList}
        groundList={groundList}
        playerList={playerList}
        gallery={gallery}
        handleCancel={() => setIsOpenModal(false)}
        handleUpload={handleUpload}
        groups={groups}
        eventList={eventList}
      />
      <ViewImage preview={preview} previewImage={previewImage} handlePreviewCancel={handlePreviewCancel} />
    </Card>
  );
};
export default Matches;
