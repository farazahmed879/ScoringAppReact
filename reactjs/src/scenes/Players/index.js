import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Modal, Table, Dropdown, Menu } from 'antd';
import { L } from '../../lib/abpUtility';
import playerService from '../../services/player/playerService';
import CustomModal from '../../components/Modal';
import { battingStyleOptions, bowlingStyleOptions, genderOptions, playingRoleOptions } from '../../components/Enum/enum';
import CustomInput from '../../components/Input';
//import { CreateOrUpdatePlayerDto } from '../../services/player/dto/CreateOrUpdatePlayerDto';
import moment from 'moment';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TeamService from '../../services/team/TeamService';

//const { Option } = Select;
const playerInitial = {
  name: "",
  contact: "",
  gender: {
    id: 1,
    name: 'Male'
  },
  address: "",
  cnic: "",
  battingStyle: {
    id: 0,
    name: 'Right-Handed'
  },
  bowlingStyle: {
    id: 0,
    name: 'Right-Arm-Fast'
  },
  playingRole: {
    id: 0,
    name: 'Batsman'
  },
  team: {
    id: 0,
    name: 'Select Team'
  },
  dob: Date(),
  fileName: ''
}

const playerValidation = Yup.object().shape({
  name: Yup.string().required("Required"),
  gender: Yup.object().required("Required")
})



const success = Modal.success;
const error = Modal.error;

//const confirm = Modal.confirm;
//const Search = Input.Search;
const Player = (props) => {
  //const [modalVisible, setModalVisible] = useState(false);
  const [maxResultCount] = useState(10);
  const [skipCount] = useState(0);
  const [filter] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [player, setPlayer] = useState(playerInitial);
  const [playerList, setPlayerList] = useState([]);
  const [teamList, setTeamList] = useState([]);
  //const [players, setPlayers] = useState(playerInitial[]);

  const handleSubmit = () => {
    if (!playerFormik.isValid)
      return;
    let playerObject = {
      name: playerFormik.values.name,
      address: playerFormik.values.address,
      cnic: playerFormik.values.cnic,
      contact: playerFormik.values.contact,
      dob: moment(playerFormik.values.dob).valueOf(),
      gender: playerFormik.values.gender.id,
      playerRoleId: playerFormik.values.playingRole.id,
      battingStyleId: playerFormik.values.battingStyle.id,
      bowlingStyleId: playerFormik.values.bowlingStyle.id,
      isDeactivated: false,
      isGuestOrRegisterd: "Registered",
      teamId: playerFormik.values.team.id,
      fileName: playerFormik.values.fileName
    }

    console.log("Player Object", playerObject);
    playerService.createOrUpdate(playerObject).then(res => {
      res.success ?
        success({ title: res.successMessage }) :
        error({ title: res.successMessage });
      setIsOpenModal(false);
    });
  }

  const playerFormik = useFormik(
    {
      enableReinitialize: true,
      initialValues: playerInitial,
      validationSchema: playerValidation,
      onSubmit: handleSubmit
    }
  );

  useEffect(() => {
    getAll();
  }, []);

  useEffect(() => {
    if (isOpenModal)
      getAllTeams();
  }, [isOpenModal]);


  const getAll = () => {
    playerService.getPaginatedAll({ maxResultCount: maxResultCount, skipCount: skipCount, name: filter }).then(res => {
      console.log("Players", res.items);
      setPlayerList(res.items.map((r) => ({
        ...r, key: r.id
      })));
    });
    //  
  }


  const getAllTeams = () => {
    TeamService.getAll().then(res => {
      console.log("Teams", res);
      setTeamList(res);
    })
  }

  const handleChange = (value, key) => {
    if (key == "gender") {
      var genderObj = genderOptions.filter(i => i.id == value)[0];
      playerFormik.setValues({ ...playerFormik.values, [key]: { id: genderObj.id, name: genderObj.name } })
      return;
    }
    if (key == "battingStyle") {
      var selectedBattingStyle = battingStyleOptions.filter(i => i.id == value)[0];
      playerFormik.setValues({ ...playerFormik.values, [key]: { id: selectedBattingStyle.id, name: selectedBattingStyle.name } })
      return;
    }

    if (key == "bowlingStyle") {
      var selectedBowlingStyle = bowlingStyleOptions.filter(i => i.id == value)[0];
      playerFormik.setValues({ ...playerFormik.values, [key]: { id: selectedBowlingStyle.id, name: selectedBowlingStyle.name } })
      return;
    }

    if (key == "playingRole") {
      var selectedPlayingRole = playingRoleOptions.filter(i => i.id == value)[0];
      playerFormik.setValues({ ...playerFormik.values, [key]: { id: selectedPlayingRole.id, name: selectedPlayingRole.name } })
      return;
    }

    if (key == "team") {
      var selectedTeam = teamList.filter((i) => i.id == value)[0];
      playerFormik.setValues({ ...playerFormik.values, [key]: { id: selectedTeam.id, name: selectedTeam.name } })
      return;
    }
    //console.log("value", e.target.name, e.target.value);
    playerFormik.setValues({ ...playerFormik.values, [key]: value })
  }

  const handleChangeDatePicker = (date, dateString) => {
    setPlayer({ ...player, dob: date })
  }

  const columns = [
    {
      title: 'Full Name',
      width: 250,
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
    },
    {
      title: 'Team',
      width: 250,
      dataIndex: 'team',
      key: 'team',
      fixed: 'left',
    },
    {
      title: 'Contact',
      width: 250,
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: 'Birth',
      width: 250,
      dataIndex: 'dob',
      key: 'dob',
    },

    {
      title: 'Playing Role',
      width: 250,
      dataIndex: 'playerRoleId',
      key: 'playerRoleId',
    },
    {
      title: 'Batting Style',
      width: 250,
      dataIndex: 'battingStyleId',
      key: 'battingStyleId',
    },
    {
      title: 'Bowling Style',
      width: 250,
      dataIndex: 'bowlingStyleId',
      key: 'bowlingStyleId',
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
                <Menu.Item >{L('Edit')}</Menu.Item>
                <Menu.Item >{L('Delete')}</Menu.Item>
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

  // const { getFieldDecorator } = this.props.form;
  console.log("validations", playerFormik);

  return (
    <Card>
       <div style={{display : 'flex' , justifyContent: 'space-between' , margin: '10px'}}>
               <h1>Manage Players</h1> <Button type="primary" shape="round" icon="plus" onClick={() => setIsOpenModal(true)} >Add</Button>
            </div>
      <Table columns={columns} dataSource={playerList} scroll={{ x: 1500 , y: 1000}} />

      <CustomModal title="Create Player" isModalVisible={isOpenModal} handleCancel={() => { setIsOpenModal(false) }} handleSubmit={handleSubmit} >
        <Form>
          <CustomInput title="Name" type="text" handleChange={handleChange} value={playerFormik.values.name} stateKey="name" placeholder="" errorMessage={playerFormik.errors.name} />
          <CustomInput title="Gender" type="select" options={genderOptions} handleChange={handleChange} value={playerFormik.values.gender.id} stateKey="gender" />
          <CustomInput title="Contact" type="text" handleChange={handleChange} value={playerFormik.values.contact} stateKey="contact" placeholder="" />
          <CustomInput title="Address" type="text" handleChange={handleChange} value={playerFormik.values.address} stateKey="address" placeholder="" />
          <CustomInput title="Cnic" type="text" handleChange={handleChange} value={playerFormik.values.cnic} stateKey="cnic" placeholder="" />
          <CustomInput title="Birth" type="datePicker" handleChange={handleChangeDatePicker} value={playerFormik.values.dob} stateKey="dob" placeholder="" />
          <CustomInput title="Team" type="select" options={teamList} handleChange={handleChange} value={playerFormik.values.team.name} stateKey="team" placeholder="" />
          <CustomInput title="Player Role" type="select" options={playingRoleOptions} handleChange={handleChange} value={playerFormik.values.playingRole.name} stateKey="playingRole" placeholder="" />
          <CustomInput title="Batting Style" type="select" options={battingStyleOptions} handleChange={handleChange} value={playerFormik.values.battingStyle.name} stateKey="battingStyle" placeholder="" />
          <CustomInput title="Bowling Style" type="select" options={bowlingStyleOptions} handleChange={handleChange} value={playerFormik.values.bowlingStyle.name} stateKey="bowlingStyle" placeholder="" />
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
    </Card >
  );
}

export default Player;


