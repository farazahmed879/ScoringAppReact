import React, { useEffect, useState } from 'react';
import { Transfer, Button, Card, Modal, PageHeader } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getBase64 } from '../../helper/getBase64';
import playerService from '../../services/player/playerService';
import TeamService from '../../services/team/TeamService';
import AddOrEditPlayerModal from '../Players/addOrEditPlayerModal';
import { bowlingStyleOptions } from '../../components/Enum/enum';
import moment from 'moment';
const TeamPlayers = () => {
  const success = Modal.success;
  const error = Modal.error;
  const param = useParams();
  const [teamName, setTeamName] = useState([]);
  const [playerList, setPlayerList] = useState([]);
  const [selectedPlayerList, setSelectedPlayerList] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const history = useHistory();
  const [profile, setProfile] = useState([]);
  const [picture, setPicture] = useState(false);
  const [teamList, setTeamList] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [isEditDataLoading, setIsEditDataLoading] = useState(false);
  const [editPlayer, setEditPlayer] = useState({});
  const [preview, setPreview] = useState(false);
  const [state, setState] = useState({
    mockData: [],
    targetKeys: [],
  });
  const playerInitial = {
    id: 0,
    name: '',
    contact: '',
    gender: '',
    address: '',
    cnic: '',
    battingStyleId: 0,
    bowlingStyleId: 0,
    playerRoleId: 0,
    teamIds: [param.teamId],
    dob: null,
    fileName: '',
    profile: '',
    profileUrl: '',
    gallery: [],
  };

  useEffect(() => {
    getAllPlayers();
    setTeamName(param.teamName);
  }, []);

  const getAllTeams = () => {
    TeamService.getAll().then((res) => {
      setTeamList(res);
    });
  };

  const getAllPlayers = () => {
    playerService.getAll().then((res) => {
      setPlayerList(res);
      getAllPlayersByTeamId(res);
    });
  };
  const handleProfileUpload = ({ fileList }) => {
    setProfile(fileList);
    //console.log('profile', e.file);
  };
  const handleDeletePicture = () => {
    setProfile([]);
  };
  const handleChangeDatePicker = (date, dateString) => {
    //setPlayer({ ...player, dob: date });
  };
  const handlePreviewCancel = () => setPreview(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
  };
  const handleUpload = ({ file, fileList }) => {
    setGallery(fileList);
  };

  const handleTeamPlayerSubmit = (e) => {
    let req = {
      teamId: +param.teamId,
      playerIds: state.targetKeys,
    };
    TeamService.createTeamPlayers(req).then((res) => {
      res.success ? success({ title: res.successMessage }) : error({ title: res.successMessage });
    });
  };

  const playerValidation = Yup.object().shape({
    name: Yup.string().required('Required'),
    gender: Yup.string().required('Required'),
    contact: Yup.string().required('Required').min(11, 'Contact must contain 12 numbers').max(11, 'Contact must contain 12 numbers'),
  });

  const handleSubmit = () => {
    if (!playerFormik.isValid) return;
    let playerObject = {
      id: playerFormik.values.id || 0,
      name: playerFormik.values.name,
      address: playerFormik.values.address,
      cnic: playerFormik.values.cnic,
      contact: playerFormik.values.contact,
      dob: moment(playerFormik.values.dob).valueOf(),
      gender: playerFormik.values.gender,
      playerRoleId: playerFormik.values.playingRoleId,
      battingStyleId: playerFormik.values.battingStyleId,
      bowlingStyleId: playerFormik.values.bowlingStyleId,
      isDeactivated: false,
      isGuestOrRegisterd: 'Registered',
      teamIds: playerFormik.values.teamIds,
      fileName: playerFormik.values.fileName,
      profile: playerFormik.values.profile,
      profileUrl: playerFormik.values.profileUrl,
      gallery: gallery.map((data) => ({
        id: data.key,
        name: data.name,
        blob: data.thumbUrl,
      })),
    };

    if (profile && profile[0]) {
      setPicture(false);
      playerObject['profile'] = { name: profile[0].name, blob: profile[0].thumbUrl, url: profile[0].url };
    } else {
      setPicture(true);
      return;
    }

    playerService.createOrUpdate(playerObject).then((res) => {
      res.success ? success({ title: res.successMessage }) : error({ title: res.successMessage });
      setIsOpenModal(false);
      getAllPlayers();
    });
  };

  const playerFormik = useFormik({
    enableReinitialize: true,
    initialValues: playerInitial,
    validationSchema: playerValidation,
    onSubmit: handleSubmit,
  });

  const floatingButton = {
    position: 'fixed',
    right: '32px',
    bottom: '20%',
    Zindex: '2147483640',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    cursor: 'pointer',
  };

  const getAllPlayersByTeamId = (allPlayers) => {
    playerService.getAllByTeamId(+param.teamId).then((res) => {
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

  const addPlayer = () => {
    playerFormik.setValues({});
    setProfile([]);
    setGallery([]);
    setIsOpenModal(!isOpenModal);
  };

  const handleModalVisibleFalse = (e) => {
    setIsOpenModal(e);
  };

  const handleChange = (value, key) => {
    playerFormik.setValues({ ...playerFormik.values, [key]: value });
  };
  //   const renderFooter = () => (
  //     <Button size="small" style={{ float: 'right', margin: 5 }} onClick={getMock}>
  //       reload
  //     </Button>
  //   );

  const handleChangeTransfer = (data) => {
    setState((prev) => ({
      ...prev,
      targetKeys: data,
    }));
  };
  return (
    <Card>
      <PageHeader
        style={{
          border: '1px solid rgb(235, 237, 240)',
        }}
        onBack={history.goBack}
        title={teamName + ' Players'}
      />
      <Button style={floatingButton} className="filterButton" type="primary" shape="circle" icon="plus" onClick={addPlayer} />
      {/* <h3>{teamName} Players</h3>{' '} */}
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
        onChange={handleChangeTransfer}
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
        <Button onClick={handleTeamPlayerSubmit} type="primary">
          Submit
        </Button>
        <AddOrEditPlayerModal
          isModalVisible={isOpenModal}
          isOpenModal={isOpenModal}
          handleCancel={() => setIsOpenModal(false)}
          handleSubmit={handleSubmit}
          editPlayer={editPlayer}
          isEditDataLoading={isEditDataLoading}
          playerFormik={playerFormik}
          handleUpload={handleUpload}
          gallery={gallery}
          handlePreview={handlePreview}
          handleChange={handleChange}
          teamList={teamList}
          handleChangeDatePicker={handleChangeDatePicker}
          bowlingStyleOptions={bowlingStyleOptions}
          picture={picture}
          handleDeletePicture={handleDeletePicture}
          handleProfileUpload={handleProfileUpload}
          profile={profile}
          teamName={teamName}
        />
      </div>
    </Card>
  );
};
export default TeamPlayers;
