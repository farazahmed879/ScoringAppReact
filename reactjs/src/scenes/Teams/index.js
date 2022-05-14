import React, { useEffect, useState } from 'react';
import { Button, Card, Dropdown, Menu, Form, Modal, Table, Upload, Row, Col, Collapse } from 'antd';
import { Link } from 'react-router-dom';
import { L } from '../../lib/abpUtility';
import TeamService from '../../services/team/TeamService';
import CustomModal from '../../components/Modal';
import { useFormik } from 'formik';
import CustomInput from '../../components/Input';
import { teamTypeOptions } from '../../components/Enum/enum';
import * as Yup from 'yup';
import FilterPanel from './filter-panel';
import CustomTable from '../../components/Table';

const Team = () => {
  const success = Modal.success;
  const error = Modal.error;
  const { Panel } = Collapse;

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [teamList, setTeamList] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [mode, setModalMode] = useState('');
  const [editTeam, setEditTeam] = useState({});
  //const [validation, setPlayerValidation] = useState(playerValidation);

  let teamInitial = {
    id: 0,
    name: '',
    place: '',
    zone: '',
    contact: '',
    isRegistered: true,
    city: '',
    fileName: '',
    type: 0,
  };

  const teamFormHandler = () => {
    if (!teamFormik.isValid) return;
    let teamForm = {
      id: teamFormik.values.id,
      name: teamFormik.values.name,
      place: teamFormik.values.place,
      zone: teamFormik.values.zone,
      contact: teamFormik.values.contact,
      isRegistered: teamFormik.values.isRegistered,
      city: teamFormik.values.city,
      fileName: teamFormik.values.fileName,
      type: teamFormik.values.type,
    };

    TeamService.createOrUpdate(teamForm).then((res) => {
      console.log('res', res);
      res.success ? success({ title: res.successMessage }) : error({ title: res.successMessage });
      getAll();
      setIsOpenModal(false);
    });
  };

  const teamValidation = Yup.object().shape({
    name: Yup.string().required('Required'),
  });

  const filterHandleSubmit = (event) => {
    getAll(event);
  };

  const teamFormik = useFormik({
    enableReinitialize: true,
    initialValues: teamInitial,
    validationSchema: teamValidation,
    onSubmit: teamFormHandler,
  });

  const callback = (key) => {
    console.log(key);
  };

  useEffect(() => {
    getAll();
  }, [pagination.current]);

  const getAll = (filter) => {
    TeamService.getPaginatedAll({
      maxResultCount: pagination.pageSize,
      skipCount: filter ? 0 : (pagination.current - 1) * pagination.pageSize,
      name: filter ? filter.name : undefined,
      type: filter ? filter.type : undefined,
    }).then((res) => {
      if (res) {
        console.log('Teams', res);
        setTeamList(
          res.items.map((r) => ({
            ...r,
            key: r.id,
          }))
        );
        setPagination({
          ...pagination,
          total: res.totalCount,
        });
      }
    });
  };

  const handleChange = (value, key) => {
    teamFormik.setValues({ ...teamFormik.values, [key]: value });
  };

  const handleUpload = (e) => {};
  const fileList = [
    {
      uid: '-1',
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-2',
      name: 'yyy.png',
      status: 'error',
    },
  ];

  const handleTableChange = (e) => {
    setPagination({
      current: e.current,
      pageSize: e.pageSize,
    });
  };

  const handleEditTeam = (item) => {
    setIsOpenModal(true);
    setModalMode('Edit Team');
    TeamService.getTeamById(item.id).then((res) => {
      if (res) {
        setEditTeam(res);
        console.log('player', res);
        teamFormik.setValues({
          ...teamFormik.values,
          ...res,
        });
      }
    });
  };

  const addTeam = () => {
    setIsOpenModal(true);
    setModalMode('Create Team');
  };

  console.log('validations', teamFormik);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      fixed: 'left',
      render: (text, item) => {
        return (
          <div>
            <Link to={'/teamProfile/' + item.id}>{item.name}</Link>
          </div>
        );
      },
    },
    { title: 'Contact', width: 150, dataIndex: 'contact', key: 'contact' },
    { title: 'Place', width: 150, dataIndex: 'place', key: 'place' },
    { title: 'Zone', width: 150, dataIndex: 'zone', key: 'zone' },
    {
      title: 'Type',
      width: 150,
      dataIndex: 'type',
      key: 'type',
      render: (text, item) => {
        if (text) return teamTypeOptions.filter((i) => i.id == text)[0].name || 'N/A';
      },
    },
    {
      title: L('Actions'),
      width: 150,
      fixed: 'right',
      key: 'action',
      render: (text, item) => {
        return (
          <div>
            <Dropdown
              trigger={['click']}
              overlay={
                <Menu>
                  <Menu.Item onClick={() => handleEditTeam(item)}>{L('Edit')}</Menu.Item>
                  <Menu.Item>{L('Delete')}</Menu.Item>
                  <Menu.Item>
                    <Link to={'/team-player/' + item.id + '/' + item.name}>{L('Players')}</Link>
                  </Menu.Item>
                </Menu>
              }
              placement="bottomLeft"
            >
              <Button type="primary" icon="setting">
                {L('Actions')}
              </Button>
            </Dropdown>
          </div>
        );
      },
    },
  ];

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px' }}>
        <h1>Manage Teams</h1>{' '}
        <Button type="primary" shape="round" icon="plus" onClick={addTeam}>
          Add
        </Button>
      </div>
      <Collapse onChange={callback} style={{ marginBottom: '10px' }}>
        <Panel header="Advance Filters" key="1">
          <FilterPanel teams={teamList} handleSubmit={filterHandleSubmit}></FilterPanel>
        </Panel>
      </Collapse>
      <CustomTable pagination={pagination} columns={columns} data={teamList} scroll={{ x: 1500 }} handleTableChange={handleTableChange} />

      <CustomModal
        title={Object.keys(editTeam).length ? 'Edit Team' : 'Add Team'}
        isModalVisible={isOpenModal}
        handleCancel={() => {
          setIsOpenModal(false);
        }}
        handleSubmit={teamFormHandler}
      >
        <Form className="form" onSubmit={teamFormik.handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <CustomInput
                title="Name"
                type="text"
                handleChange={handleChange}
                value={teamFormik.values.name}
                stateKey="name"
                placeholder=""
                errorMessage={teamFormik.errors.name}
              />
            </Col>
            <Col span={12}>
              <CustomInput title="Zone" type="number" handleChange={handleChange} value={teamFormik.values.zone} stateKey="zone" placeholder="" />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <CustomInput
                title="Contact"
                type="number"
                handleChange={handleChange}
                value={teamFormik.values.contact}
                stateKey="contact"
                placeholder=""
              />
            </Col>
            <Col span={12}>
              {' '}
              <CustomInput
                title="Type"
                type="select"
                options={teamTypeOptions}
                handleChange={handleChange}
                value={teamFormik.values.type}
                stateKey="type"
                placeholder=""
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              {' '}
              <CustomInput title="City" type="text" handleChange={handleChange} value={teamFormik.values.city} stateKey="city" placeholder="" />
            </Col>
            <Col span={12}>
              <CustomInput title="Area" type="text" handleChange={handleChange} value={teamFormik.values.place} stateKey="place" placeholder="" />
            </Col>
          </Row>

          <Upload
            action="https://run.mocky.io/v3/418c5840-7f93-4be9-833f-fe11c4d47116"
            listType="picture"
            defaultFileList={fileList}
            onChange={(e) => handleUpload(e)}
          >
            <Button>Image</Button>
          </Upload>
          <CustomInput
            title="Registered"
            type="checkbox"
            handleChange={handleChange}
            value={teamFormik.values.isRegistered}
            stateKey="isRegistered"
            placeholder=""
          />
          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={!teamFormik.isValid} onClick={teamFormik.handleSubmit}>
              {mode == 'Create Team' ? 'Add' : 'Update'}
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

export default Team;
