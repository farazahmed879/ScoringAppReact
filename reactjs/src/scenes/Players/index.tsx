import React, { useEffect, useState } from 'react';

import { Button, Card, Col, Dropdown, Input, Menu, Row, Table } from 'antd';
//import CreateOrUpdateRole from './components/createOrUpdateRole';
import { L } from '../../lib/abpUtility';
import playerService from '../../services/player/playerService';


export interface IPlayerState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  roleId: number;
  filter: string;
}

//const confirm = Modal.confirm;
const Search = Input.Search;
const PLayer = (props: any) => {
  //const [modalVisible, setModalVisible] = useState(false);
  const [maxResultCount] = useState(10);
  const [skipCount] = useState(0);
  const [filter] = useState('');

  useEffect(() => {
    getAll();
  }, []);


  const getAll = () => {
    let result = playerService.getPaginatedAll({ maxResultCount: maxResultCount, skipCount: skipCount, name: filter });
    console.log("result",result);
  }

  // const handleTableChange = (pagination: any) => {
  //   setState({ skipCount: (pagination.current - 1) * maxResultCount! }, async () => await getAll());
  // };

  // const Modal = () => {
  //     setModalVisible(!modalVisible);
  // };

  // async createOrUpdateModalOpen(entityDto: CreateOrUpdatePlayerDto) {
  //   if (entityDto.id === 0) {
  //     this.props.roleStore.createRole();
  //     await this.props.roleStore.getAllPermissions();
  //   } else {
  //     await this.props.roleStore.getRoleForEdit(entityDto);
  //     await this.props.roleStore.getAllPermissions();
  //   }

  //   this.setState({ roleId: entityDto.id });
  //   this.Modal();

  //   this.formRef.props.form.setFieldsValue({
  //     ...this.props.roleStore.roleEdit.role,
  //     grantedPermissions: this.props.roleStore.roleEdit.grantedPermissionNames,
  //   });
  // }

  // delete (input: EntityDto) {
  //   const self = this;
  //   confirm({
  //     title: 'Do you Want to delete these items?',
  //     onOk() {
  //       self.props.roleStore.delete(input);
  //     },
  //     onCancel() { },
  //   });
  // }

  // handleCreate = () => {
  //   const form = this.formRef.props.form;
  //   form.validateFields(async (err: any, values: any) => {
  //     if (err) {
  //       return;
  //     } else {
  //       if (roleId === 0) {
  //         await this.props.roleStore.create(values);
  //       } else {
  //         await this.props.roleStore.update({ id: roleId, ...values });
  //       }
  //     }

  //     await this.getAll();
  //     this.setState({ modalVisible: false });
  //     form.resetFields();
  //   });
  // };

  // saveFormRef = (formRef: any) => {
  //   this.formRef = formRef;
  // };

  // handleSearch = (value: string) => {
  //   this.setState({ filter: value }, async () => await this.getAll());
  // };
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
          <Button type="primary" shape="circle" icon="plus"
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

      {/* <CreateOrUpdateRole
        wrappedComponentRef={this.saveFormRef}
        visible={modalVisible}
        onCancel={() =>
          this.setState({
            modalVisible: false,
          })
        }
        modalType={roleId === 0 ? 'edit' : 'create'}
        onOk={this.handleCreate}
        permissions={allPermissions}
        roleStore={this.props.roleStore}
      /> */}
    </Card>
  );
}

export default PLayer;


