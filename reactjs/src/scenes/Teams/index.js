import React, { useEffect, useState } from 'react';
import { Button, Card, Dropdown, Menu, Form, Modal, Table, Upload, Row, Col, Collapse, Popover, Icon, message, Skeleton } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
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
import { env } from 'process';
import { elementType } from 'prop-types';
import { getBase64 } from '../../helper/getBase64';
import { truncateText } from '../../helper/helper';
import ViewImage from '../../components/ViewImage';
import AddOrEditTeamModal from './addOrEditTeamModal';
const baseUrl = 'http://localhost:21021';
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
  const [isEditDataLoading, setIsEditDataLoading] = useState(false);
  const [picture, setPicture] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [preview, setPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  let teamInitial = {
    id: 0,
    name: '',
    profile: '',
    place: '',
    zone: '',
    contact: '',
    isRegistered: true,
    city: '',
    fileName: '',
    type: 0,
    profileUrl: '',
    gallery: [],
  };

  const teamFormHandler = () => {
    if (!teamFormik.isValid) return;
    let teamForm = {
      id: teamFormik.values.id,
      //profile: { name: profile.fileList[0].name, blob: profile.fileList[0].thumbUrl },
      name: teamFormik.values.name,
      place: teamFormik.values.place,
      profile: teamFormik.values.profile,
      contact: teamFormik.values.contact,
      isRegistered: teamFormik.values.isRegistered,
      city: teamFormik.values.city,
      fileName: teamFormik.values.fileName,
      type: teamFormik.values.type,
      profileUrl: teamFormik.values.profileUrl,
      gallery: gallery.map((data) => ({
        id: data.key,
        name: data.name,
        blob: data.thumbUrl,
      })),
    };
    if (profile && profile[0]) {
      setPicture(false);
      teamForm['profile'] = { name: profile[0].name, blob: profile[0].thumbUrl, url: profile[0].url };
    } else {
      //message.error('Profile picture is not uploaded!');
      setPicture(true);
      return;
      //setIsOpenModal(true);
    }
    TeamService.createOrUpdate(teamForm).then((res) => {
      console.log('res', res);
      res.success ? success({ title: res.successMessage }) : error({ title: res.successMessage });
      getAll();
      setIsOpenModal(false);
    });
  };

  const teamValidation = Yup.object().shape({
    name: Yup.string().required('Required'),
    city: Yup.string().required('Required'),
    contact: Yup.string().min(11, 'Contact must contain 11 numbers').max(11, 'Contact must contain 12 numbers')
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
    setLoading(true);
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
      setLoading(false);
    });
  };

  const handleChange = (value, key) => {
    teamFormik.setValues({ ...teamFormik.values, [key]: value });
  };

  useEffect(() => {
    if (!isOpenModal) {
      teamFormik.setValues({});
      //setProfile([]);
    }
  }, [isOpenModal]);

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

  const handleTableChange = (e) => {
    setPagination({
      current: e.current,
      pageSize: e.pageSize,
    });
  };

  const handleEditTeam = (item) => {
    setIsEditDataLoading(true);
    setIsOpenModal(true);
    setModalMode('Edit Team');
    setGallery([]);
    setProfile([]);
    TeamService.getTeamById(item.id).then((res) => {
      if (res) {
        console.log('Team', res);
        teamFormik.setValues({
          ...teamFormik.values,
          ...res,
        });

        let obj = [];
        res.pictures.forEach((element) => {
          var ob = {
            key: element.id,
            name: element.name,
            uid: element.id,
            url: baseUrl + '/' + element.url,
          };
          obj.push(ob);
        });
        setGallery(obj);
        setProfile([{ key: res.id, name: res.name, uid: res.id, url: baseUrl + '/' + res.profileUrl }]);
        setIsEditDataLoading(false);
      }
    });
  };

  const resetForm = () => {};

  const addTeam = () => {
    resetForm();
    setProfile([]);
    setGallery([]);
    setIsOpenModal(true);
    setModalMode('Create Team');
  };

  const handleDeletePicture = () => {
    setProfile([]);
  };

  const handlePreviewCancel = () => setPreview(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreview(true);
  };

  //console.log('gallery', gallery);

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
            <Link to={'/teamProfile/' + item.id}> {truncateText(item.name, 30)}</Link>
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

  //console.log('profile', profile);
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
      <CustomTable
        loading={loading}
        pagination={pagination}
        columns={columns}
        data={teamList}
        scroll={{ x: 1500 }}
        handleTableChange={handleTableChange}
      />
      <AddOrEditTeamModal
      isOpenModal={isOpenModal} 
      teamFormHandler={teamFormHandler} 
      isEditDataLoading={isEditDataLoading}
      teamFormik={teamFormik}
      profile={profile}
      handleDeletePicture={handleDeletePicture}
      handleProfileUpload={handleProfileUpload}
      handleUpload={handleUpload}
      handlePreview={handlePreview}
      handleChange={handleChange}
      teamTypeOptions={teamTypeOptions}
      galler={gallery}
      handleCancel={() => setIsOpenModal(false)}
      picture={picture}
      />
      <ViewImage preview={preview} previewImage={previewImage} handlePreviewCancel={handlePreviewCancel} />
    </Card>
  );
};

export default Team;
