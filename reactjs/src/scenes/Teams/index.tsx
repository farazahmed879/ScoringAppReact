import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Dropdown,Input,Menu, Row, Table } from 'antd';
import { L } from '../../lib/abpUtility';
import teamService from '../../services/team/teamService';

const Team = (Props: any) => {

    const [maxResultCount] = useState(10);
    const [skipCount] = useState(0);
    const [filter] = useState('');
    //const [isOpenModal, setIsOpenModal] = useState(false);
    //const [player, setPlayer] = useState(playerInitial);
    //const [reqPlayer, setReqPlayer] = useState(playerReq);
    //const [validation, setPlayerValidation] = useState(playerValidation);

    const Search = Input.Search;
    useEffect(() => {
        getAll();
      }, []);

      const getAll = () => {
        let result = teamService.getPaginatedAll({ maxResultCount: maxResultCount, skipCount: skipCount, name: filter });
        console.log("result", result);
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
                    {/* <Button type="primary" shape="circle" icon="plus" onClick={() => setIsOpenModal(true)}
                    /> */}
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

            {/*   
  
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
        </CustomModal> */}
        </Card >
    );
}

export default Team;