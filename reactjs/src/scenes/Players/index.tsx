import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Dropdown, Form, Input, Menu, Row, Table } from 'antd';
//import CreateOrUpdateRole from './components/createOrUpdateRole';
import { L } from '../../lib/abpUtility';
import playerService from '../../services/player/playerService';
import CustomModal from '../../components/Modal';
import { battingStyleOptions, bowlingStyleOptions, genderOptions, playingRoleOptions, teamOptions } from '../../components/Enum/enum';
import CustomInput from '../../components/Input';
import { CreateOrUpdatePlayerDto } from '../../services/player/dto/CreateOrUpdatePlayerDto';
import moment from 'moment';
//import FormItem from 'antd/lib/form/FormItem';
//import players from './createOrUpdatePlayer.validation';

//const { Option } = Select;
export interface IPlayerState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  roleId: number;
  filter: string;
};
const playerValidation: any = {
  nameErrorMsg: "",
  playerRoleErrorMsg: "",
  genderErrorMsg: ""
}

const playerReq: CreateOrUpdatePlayerDto = {
  id: 0,
  name: "",
  contact: "",
  gender: 1,
  address: "",
  cnic: "",
  battingStyleId: 0,
  bowlingStyleId: 0,
  playerRoleId: 0,
  dob: 0,
  isGuestOrRegisterd: "",
  isDeactivated: false,
  fileName: "",
  teamId: 0,
};
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
    id: 1,
    name: 'A'
  },
  dob: Date()
}

//const confirm = Modal.confirm;
const Search = Input.Search;
const Player = (props: any) => {
  //const [modalVisible, setModalVisible] = useState(false);
  const [maxResultCount] = useState(10);
  const [skipCount] = useState(0);
  const [filter] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [player, setPlayer] = useState(playerInitial);
  const [reqPlayer, setReqPlayer] = useState(playerReq);
  const [validation, setPlayerValidation] = useState(playerValidation);

  useEffect(() => {
    getAll();
  }, []);


  const getAll = () => {
    let result = playerService.getPaginatedAll({ maxResultCount: maxResultCount, skipCount: skipCount, name: filter });
    console.log("result", result);
  }


  const handleChange = (value: any, key: any) => {
    debugger
    if (key == "gender") {
      var genderObj = genderOptions.filter(i => i.id == value)[0];
      setPlayer({ ...player, [key]: { id: genderObj.id, name: genderObj.name } })
      return;
    }
    if (key == "battingStyle") {
      var selectedBattingStyle = battingStyleOptions.filter(i => i.id == value)[0];
      setPlayer({ ...player, [key]: { id: selectedBattingStyle.id, name: selectedBattingStyle.name } })
      return;
    }

    if (key == "bowlingStyle") {
      var selectedBowlingStyle = bowlingStyleOptions.filter(i => i.id == value)[0];
      setPlayer({ ...player, [key]: { id: selectedBowlingStyle.id, name: selectedBowlingStyle.name } })
      return;
    }

    if (key == "playingRole") {
      var selectedPlayingRole = playingRoleOptions.filter(i => i.id == value)[0];
      setPlayer({ ...player, [key]: { id: selectedPlayingRole.id, name: selectedPlayingRole.name } })
      return;
    }

    if (key == "team") {
      var selectedTeam = teamOptions.filter(i => i.id == value)[0];
      setPlayer({ ...player, [key]: { id: selectedTeam.id, name: selectedTeam.name } })
      return;
    }
    //console.log("value", e.target.name, e.target.value);
    setPlayer({ ...player, [key]: value, [key + 'Error']: "" })
  }

  const handleChangeDatePicker = (date: any, dateString: any) => {
    setPlayer({ ...player, dob: date })
  }

  const handleSubmit = () => {
    if (!player.name || player.name == "") {
      setPlayerValidation({ ...validation, nameErrorMsg: "Player Name Required" });
    }

    if (!player.playingRole) {
      setPlayerValidation({ ...validation, playerRoleErrorMsg: "Player Role Required" });
    }


    if (!player.gender) {
      setPlayerValidation({ ...validation, genderErrorMsg: "Gender Required" });
    }
    if (!player.name || player.name == "" || !player.playingRole || !player.gender)
      return;

    setReqPlayer({
      ...reqPlayer,
      name: player.name,
      address: player.address,
      cnic: player.cnic,
      contact: player.contact,
      dob: moment(player.dob).valueOf(),
      gender: player.gender.id,
      playerRoleId: player.playingRole.id,
      battingStyleId: player.battingStyle.id,
      bowlingStyleId: player.bowlingStyle.id,
      isDeactivated: false,
      isGuestOrRegisterd: "Registered",
      teamId: 1,
      fileName: ''
    });
    debugger
    console.log("reqPlayer", reqPlayer);
    playerService.createOrUpdate(reqPlayer);
    console.log("Yes", player);
  }


  const columns = [
    { title: L('Name'), dataIndex: 'name', key: 'name', width: 150, render: (text: string) => <div>{text}</div> },
    { title: L('Contact'), dataIndex: 'displayName', key: 'displayName', width: 150, render: (text: string) => <div>{text}</div> },
    {
      title: L('Actions'),
      width: 150,
      render: (text: string, item: any) => (
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
            <Button type="danger" icon="setting">
              {L('Actions')}
            </Button>
          </Dropdown>
        </div>
      ),
    },
  ];
  // const formItemLayout = {
  //   labelCol: {
  //     xs: { span: 6 },
  //     sm: { span: 6 },
  //     md: { span: 6 },
  //     lg: { span: 6 },
  //     xl: { span: 6 },
  //     xxl: { span: 6 },
  //   },
  //   wrapperCol: {
  //     xs: { span: 18 },
  //     sm: { span: 18 },
  //     md: { span: 18 },
  //     lg: { span: 18 },
  //     xl: { span: 18 },
  //     xxl: { span: 18 },
  //   },
  // };

  // const { getFieldDecorator } = this.props.form;


  return (
    <Card>
      <Row>
        <Col
          xs={{ span: 4, offset: 0 }}
          sm={{ span: 4, offset: 0 }}
          md={{ span: 4, offset: 0 }}
          lg={{ span: 2, offset: 0 }}
          xl={{ span: 2, offset: 0 }}
          xxl={{ span: 2, offset: 0 }}
        >
          <h2>{L('Players')}</h2>
        </Col>
        <Col
          xs={{ span: 14, offset: 0 }}
          sm={{ span: 15, offset: 0 }}
          md={{ span: 15, offset: 0 }}
          lg={{ span: 1, offset: 21 }}
          xl={{ span: 1, offset: 21 }}
          xxl={{ span: 1, offset: 21 }}
        >
          <Button type="primary" shape="circle" icon="plus" onClick={() => setIsOpenModal(true)}
          />
        </Col>
      </Row>
      <Row>
        <Col sm={{ span: 10, offset: 0 }}>
          <Search placeholder={L('Filter')} />
        </Col>
      </Row>
      <Row style={{ marginTop: 20 }}>
        <Col
          xs={{ span: 24, offset: 0 }}
          sm={{ span: 24, offset: 0 }}
          md={{ span: 24, offset: 0 }}
          lg={{ span: 24, offset: 0 }}
          xl={{ span: 24, offset: 0 }}
          xxl={{ span: 24, offset: 0 }}
        >
          <Table
            rowKey="id"
            size={'default'}
            bordered={true}
            pagination={{ pageSize: maxResultCount, total: 1 }}
            columns={columns}
          // loading={roles === undefined ? true : false}
          // dataSource={roles === undefined ? [] : roles.items}
          // onChange={this.handleTableChange}
          />
        </Col>
      </Row>



      <CustomModal title="Create Player" isModalVisible={isOpenModal} handleCancel={() => { setIsOpenModal(false) }} handleSubmit={handleSubmit} >
        <Form>

          <CustomInput title="Name" type="text" handleChange={handleChange} value={player.name} stateKey="name" placeholder="" errorMessage={validation.nameErrorMsg} />
          <CustomInput title="Gender" type="select" options={genderOptions} handleChange={handleChange} value={player.gender.name.toString()} stateKey="gender" />
          <CustomInput title="Contact" type="text" handleChange={handleChange} value={player.contact} stateKey="contact" placeholder="" />
          <CustomInput title="Address" type="text" handleChange={handleChange} value={player.address} stateKey="address" placeholder="" />
          <CustomInput title="Cnic" type="text" handleChange={handleChange} value={player.cnic} stateKey="cnic" placeholder="" />
          <CustomInput title="Birth" type="datePicker" handleChange={handleChangeDatePicker} value={player.dob} stateKey="dob" placeholder="" />
          <CustomInput title="Team" type="select" options={teamOptions} handleChange={handleChange} value={player.team.name} stateKey="team" placeholder="" />
          <CustomInput title="Player Role" type="select" options={playingRoleOptions} handleChange={handleChange} value={player.playingRole.name} stateKey="playingRole" placeholder="" />
          <CustomInput title="Batting Style" type="select" options={battingStyleOptions} handleChange={handleChange} value={player.battingStyle.name} stateKey="battingStyle" placeholder="" />
          <CustomInput title="Bowling Style" type="select" options={bowlingStyleOptions} handleChange={handleChange} value={player.bowlingStyle.name} stateKey="bowlingStyle" placeholder="" />

        </Form>
      </CustomModal>
    </Card >
  );
}

export default Player;


