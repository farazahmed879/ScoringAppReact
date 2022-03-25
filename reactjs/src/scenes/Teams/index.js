import React, { useEffect, useState } from 'react';
import { Button, Card, Dropdown, Menu, Form, Modal, Table, Upload } from 'antd';
import { L } from '../../lib/abpUtility';
import TeamService from '../../services/team/TeamService';
import CustomModal from '../../components/Modal';
//import CustomInput from '../../components/Input';
import { useFormik } from 'formik';
import CustomInput from '../../components/Input';
import { teamTypeOptions } from '../../components/Enum/enum';
import * as Yup from 'yup';

const Team = (Props) => {
  const success = Modal.success;
  const error = Modal.error;

  let teamInitial = {
    id: 0,
    name: '',
    place: '',
    zone: '',
    contact: '',
    isRegistered: true,
    city: '',
    fileName: '',
  };

  const teamFormHandler = () => {
    if (!teamFormik.isValid) return;
    let teamForm = {
      id: 0,
      name: teamFormik.values.name,
      place: teamFormik.values.place,
      zone: teamFormik.values.zone,
      contact: teamFormik.values.contact,
      isRegistered: teamFormik.values.isRegistered,
      city: teamFormik.values.city,
      fileName: teamFormik.values.fileName,
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
  const [maxResultCount] = useState(10);
  const [skipCount] = useState(0);
  const [filter] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [teamList, setTeamList] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  //const [reqPlayer, setReqPlayer] = useState(playerReq);
  //const [validation, setPlayerValidation] = useState(playerValidation);

  const teamFormik = useFormik({
    enableReinitialize: true,
    initialValues: teamInitial,
    validationSchema: teamValidation,
    onSubmit: teamFormHandler,
  });
  useEffect(() => {
    getAll();
  }, [pagination.current]);

//   useEffect(() => {
//     if (isOpenModal) {
//       getAll();
//     }
//   }, [isOpenModal]);

  const getAll = () => {
    TeamService.getPaginatedAll({
      maxResultCount: pagination.pageSize,
      skipCount: (pagination.current - 1) * pagination.pageSize,
      name: filter,
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

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name', width: 250, fixed: 'left' },
    { title: 'Contact', width: 150, dataIndex: 'contact', key: 'contact' },
    { title: 'Place', width: 150, dataIndex: 'place', key: 'place' },
    { title: 'Zone', width: 150, dataIndex: 'zone', key: 'zone' },

    {
      title: L('Actions'),
      width: 150,
      fixed: 'right',
      key: 'action',
      render: () => {
        return (
          <div>
            <Dropdown
              trigger={['click']}
              overlay={
                <Menu>
                  <Menu.Item>{L('Edit')}</Menu.Item>
                  <Menu.Item>{L('Delete')}</Menu.Item>
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

  const handleChange = (value, key) => {
    teamFormik.setValues({ ...teamFormik.values, [key]: value });
  };

  const handleUpload = (e) => {
    debugger;
  };
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

  console.log('validations', teamFormik);

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px' }}>
        <h1>Manage Teams</h1>{' '}
        <Button type="primary" shape="round" icon="plus" onClick={() => setIsOpenModal(true)}>
          Add
        </Button>
      </div>

      <Table pagination={pagination} columns={columns} dataSource={teamList} scroll={{ x: 1500, y: 1000 }} onChange={handleTableChange} />

      <CustomModal
        title="Create Team"
        isModalVisible={isOpenModal}
        handleCancel={() => {
          setIsOpenModal(false);
        }}
        handleSubmit={teamFormHandler}
      >
        <Form className="form" onSubmit={teamFormik.handleSubmit}>
          <CustomInput
            title="Name"
            type="text"
            handleChange={handleChange}
            value={teamFormik.values.name}
            stateKey="name"
            placeholder=""
            errorMessage={teamFormik.errors.name}
          />
          <CustomInput title="Zone" type="number" handleChange={handleChange} value={teamFormik.values.zone} stateKey="zone" placeholder="" />
          <CustomInput
            title="Contact"
            type="number"
            handleChange={handleChange}
            value={teamFormik.values.contact}
            stateKey="contact"
            placeholder=""
          />
          <CustomInput
            title="Type"
            type="select"
            options={teamTypeOptions}
            handleChange={handleChange}
            value={teamFormik.values.type}
            stateKey="type"
            placeholder=""
          />
          <CustomInput title="City" type="text" handleChange={handleChange} value={teamFormik.values.city} stateKey="city" placeholder="" />
          <CustomInput title="Area" type="text" handleChange={handleChange} value={teamFormik.values.place} stateKey="place" placeholder="" />
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

export default Team;
