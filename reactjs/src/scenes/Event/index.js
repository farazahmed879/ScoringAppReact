import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Modal, Table, Dropdown, Menu, Row, Col, Collapse, Skeleton, Upload, Popover, Icon } from 'antd';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import eventService from '../../services/event/EventService';
import CustomModal from '../../components/Modal';
import CustomInput from '../../components/Input';
import { L } from '../../lib/abpUtility';
import { tournamentTypes, eventTypes } from '../../components/Enum/enum';
import moment from 'moment';
import FilterPanel from './filter-panel';
import CustomTable from '../../components/Table';
import { getBase64 } from '../../helper/getBase64';
import './style.css';
import './add-team.css';
const baseUrl = 'http://localhost:21021';
const success = Modal.success;
const error = Modal.error;
const { Panel } = Collapse;
const Event = () => {
  const eventInitial = {
    id: 0,
    name: '',
    organizor: '',
    organizorContact: '',
    startDate: 0,
    endDate: 0,
    eventType: '',
    tournamentType: 0,
    numberOfGroup: 0,
    profile: '',
    profileUrl: '',
    gallery: [],
  };

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [eventList, setEventList] = useState([]);
  // const [visible, setIsSetDrawerVisible] = useState(false);
  const [mode, setModalMode] = useState('');
  const [isEditDataLoading, setIsEditDataLoading] = useState(false);
  const [picture, setPicture] = useState(false);
  const [preview, setPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [profile, setProfile] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [editEvent, setEditEvent] = useState({});
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    if (!isOpenModal) {
      eventFormik.setValues({});
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

  const eventValidation = Yup.object().shape({
    name: Yup.string().required('Required'),
    startDate: Yup.string().required('Required'),
    endDate: Yup.string().required('Required'),
    eventType: Yup.number().required('Required'),
  });

  const callback = (key) => {
    console.log(key);
  };

  const filterHandleSubmit = (event) => {
    getAll(event);
  };

  const handleSubmit = () => {
    if (!eventFormik.isValid) return;
    let eventObject = {
      id: eventFormik.values.id || 0,
      name: eventFormik.values.name,
      startDate: moment(eventFormik.values.startDate).valueOf(),
      endDate: moment(eventFormik.values.endDate).valueOf(),
      eventType: eventFormik.values.eventType,
      tournamentType: eventFormik.values.tournamentType,
      numberOfGroup: eventFormik.values.numberOfGroup,
      profile: eventFormik.values.profile,
      profileUrl: eventFormik.values.profileUrl,
      gallery: gallery.map((data) => ({
        id: data.key,
        name: data.name,
        blob: data.thumbUrl,
      })),
    };
    debugger;
    if (profile && profile[0]) {
      setPicture(false);
      eventObject['profile'] = { name: profile[0].name, blob: profile[0].thumbUrl, url: profile[0].url };
    } else {
      // message.error('Profile picture is not uploaded!');
      setPicture(true);
      return;
      //setIsOpenModal(true);
    }

    console.log('Event Object', eventObject);
    eventService.createOrUpdate(eventObject).then((res) => {
      res.success ? success({ title: res.successMessage }) : error({ title: res.successMessage });
      getAll();
      setIsOpenModal(false);
    });
  };

  const eventFormik = useFormik({
    enableReinitialize: true,
    initialValues: eventInitial,
    validationSchema: eventValidation,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    getAll();
  }, [pagination.current]);

  const getAll = (filter) => {
    setLoading(true);
    eventService
      .getPaginatedAll({
        maxResultCount: pagination.pageSize,
        skipCount: filter ? 0 : (pagination.current - 1) * pagination.pageSize,
        name: filter ? filter.name : undefined,
        type: filter ? filter.type : undefined,
        startDate: filter && filter.startDate ? moment(filter.startDate).valueOf() : undefined,
        endDate: filter && filter.endDate ? moment(filter.endDate).valueOf() : undefined,
      })
      .then((res) => {
        setLoading(false);
        console.log('Events', res.items);
        setEventList(
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

  const handleAddEvent = () => {
    setProfile([]);
    setGallery([]);
    setIsOpenModal(true);
    setModalMode('Create Event');
  };

  const handleChange = (value, key) => {
    eventFormik.setValues({ ...eventFormik.values, [key]: value });
  };

  const handleEditEvent = (item) => {
    setIsEditDataLoading(true);
    setModalMode('Edit Event');
    setIsOpenModal(true);
    // setGallery([]);
    console.log(picture);
    eventService.getById(item.id).then((res) => {
      if (res) {
        if (!res.success) {
          error({ title: res.successMessage });
          return;
        }
        setEditEvent(res.result);
        console.log('Event', res);
        eventFormik.setValues({
          ...eventFormik.values,
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

  console.log('Edit Event', eventFormik.values);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreview(true);
  };

  const columns = [
    {
      title: 'Name',
      width: 250,
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      render: (text, item) => {
        return (
          <div>
            <Link to={'/eventProfile/' + item.id}>{item.name}</Link>
          </div>
        );
      },
    },
    {
      title: 'Type',
      width: 250,
      dataIndex: 'eventType',
      key: 'eventType',
      fixed: 'left',
      render: (text, item) => {
        let event = 'N/A',
          tournament = 'N/A';
        if (text > 0) event = eventTypes.filter((i) => i.id == text)[0].name || 'N/A';
        if (item.tournamentType > 0) tournament = tournamentTypes.filter((k) => k.id == item.tournamentType)[0].name || 'N/A';
        return `${event} -- ${tournament}`;
      },
    },
    {
      title: 'Start Date',
      width: 250,
      dataIndex: 'startDate',
      key: 'startDate',
      fixed: 'left',
      render: (item) => {
        return moment(item).format('MM/DD/YYYY') || 'N/A';
      },
    },
    {
      title: 'End Date',
      width: 250,
      dataIndex: 'endDate',
      key: 'endDate',
      fixed: 'left',
      render: (item) => {
        return moment(item).format('MM/DD/YYYY') || 'N/A';
      },
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
                <Menu.Item onClick={(e) => handleEditEvent(item)}>{L('Edit')}</Menu.Item>
                <Menu.Item>{L('Delete')}</Menu.Item>
                {item.eventType == 1 && item.tournamentType == 1 ? (
                  <Menu.Item>
                    <Link to={'/bracket/' + item.name + '/' + item.id}>{L('Fixture Generator')}</Link>
                  </Menu.Item>
                ) : item.eventType == 1 && item.tournamentType == 2 ? (
                  <Menu.Item>
                    <Link to={'/eventTeams/' + item.name + '/' + item.id + '/' + 'groups' + '/' + item.numberOfGroup}>{L('Add Team')}</Link>
                  </Menu.Item>
                ) : null}
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
        <h1>Manage Events</h1>{' '}
        <Button type="primary" shape="round" icon="plus" onClick={handleAddEvent}>
          Add
        </Button>
      </div>
      <Collapse onChange={callback} style={{ marginBottom: '10px' }}>
        <Panel header="Advance Filters" key="1">
          <FilterPanel handleSubmit={filterHandleSubmit}></FilterPanel>
        </Panel>
      </Collapse>
      <CustomTable
        loading={loading}
        pagination={pagination}
        columns={columns}
        data={eventList}
        scroll={{ x: 1500 }}
        handleTableChange={handleTableChange}
      />
      <CustomModal
        title={Object.keys(editEvent).length ? 'Edit Event' : 'Add Event'}
        isModalVisible={isOpenModal}
        handleCancel={() => {
          setIsOpenModal(false);
        }}
        handleSubmit={handleSubmit}
      >
        <Skeleton loading={isEditDataLoading}>
          <Form>
            <Row gutter={16} className="form-container">
              <Col span={24}>
                <Popover content={!Object.keys(profile).length || <Icon type="delete" onClick={handleDeletePicture} />}>
                  <span style={{ color: '#C9236A', fontStyle: 'italic' }}>{picture ? 'Required' : ''}</span>
                  <Upload
                    multiple={false}
                    listType="picture-card"
                    accept=".png,.jpeg,.jpg"
                    fileList={profile}
                    type="FormFile"
                    stateKey="profile"
                    disabled={!!Object.keys(profile).length}
                    onChange={(e) => handleProfileUpload(e)}
                    beforeUpload={false}
                    onPreview={handlePreview}
                  >
                    Profile
                  </Upload>
                </Popover>
              </Col>
              <Col span={24}>
                <CustomInput
                  title="Name"
                  type="text"
                  handleChange={handleChange}
                  value={eventFormik.values.name}
                  stateKey="name"
                  placeholder=""
                  errorMessage={eventFormik.errors.name}
                />
              </Col>
              <Col span={12}>
                <CustomInput
                  title="Organizor"
                  type="text"
                  handleChange={handleChange}
                  value={eventFormik.values.organizor}
                  stateKey="organizor"
                  placeholder=""
                  errorMessage={eventFormik.errors.organizor}
                />
              </Col>
              <Col span={12}>
                <CustomInput
                  title="Organizor Contact"
                  type="text"
                  handleChange={handleChange}
                  value={eventFormik.values.organizorContact}
                  stateKey="organizorContact"
                  placeholder=""
                  errorMessage={eventFormik.errors.organizorContact}
                />
              </Col>
              <Col span={12}>
                <CustomInput
                  title="Start Date"
                  type="datePicker"
                  handleChange={handleChange}
                  value={moment(eventFormik.values.startDate)}
                  stateKey="startDate"
                  placeholder=""
                  errorMessage={eventFormik.errors.startDate}
                />
              </Col>
              <Col span={12}>
                <CustomInput
                  title="End Date"
                  type="datePicker"
                  handleChange={handleChange}
                  value={moment(eventFormik.values.endDate)}
                  stateKey="endDate"
                  placeholder=""
                  errorMessage={eventFormik.errors.endDate}
                />
              </Col>
              <Col span={12}>
                <CustomInput
                  title="Event Type"
                  type="select"
                  handleChange={handleChange}
                  options={eventTypes}
                  value={eventFormik.values.eventType}
                  stateKey="eventType"
                  placeholder=""
                  errorMessage={eventFormik.errors.type}
                />
              </Col>
              {eventFormik.values.eventType == 1 ? (
                <Col span={12}>
                  <CustomInput
                    title="Tournament Type"
                    type="select"
                    handleChange={handleChange}
                    options={tournamentTypes}
                    value={eventFormik.values.tournamentType}
                    stateKey="tournamentType"
                    placeholder=""
                  />
                </Col>
              ) : null}
              {eventFormik.values.eventType == 1 && eventFormik.values.tournamentType == 2 ? (
                <Col span={12}>
                  <CustomInput
                    title="No of Groups"
                    type="number"
                    handleChange={handleChange}
                    value={eventFormik.values.numberOfGroup}
                    stateKey="numberOfGroup"
                    placeholder=""
                  />
                </Col>
              ) : null}
              <Col span={24}>
                <Upload
                  className="Gallery"
                  beforeUpload={() => false}
                  onPreview={handlePreview}
                  value={eventFormik.values.gallery}
                  fileList={gallery}
                  multiple={true}
                  listType="picture-card"
                  onChange={(e) => handleUpload(e)}
                >
                  Gallery
                </Upload>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit" onClick={eventFormik.handleSubmit}>
                {/* {Object.keys(editEvent).length ? 'Update' : 'Add'} */}
                {mode == 'Create Event' ? 'Update' : 'Add'}
              </Button>
              <Button htmlType="button" onClick={() => setIsOpenModal(false)}>
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Skeleton>
      </CustomModal>
      <Modal visible={preview} footer={null} onCancel={handlePreviewCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Card>
  );
};
export default Event;
