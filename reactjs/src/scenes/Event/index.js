import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Modal, Table, Dropdown, Menu, Row, Col, Collapse } from 'antd';
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

const success = Modal.success;
const error = Modal.error;
const { Panel } = Collapse;
const Player = () => {
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
  };

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [eventList, setEventList] = useState([]);
  // const [visible, setIsSetDrawerVisible] = useState(false);
  const [editEvent, setEditEvent] = useState({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

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
    eventType: Yup.string().required('Required'),
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
    };

    console.log('Player Object', eventObject);
    eventService.createOrUpdate(eventObject).then((res) => {
      res.success ? success({ title: res.successMessage }) : error({ title: res.successMessage });
      setIsOpenModal(false);
      getAll();
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
  }, []);

  const getAll = (filter) => {
    eventService
      .getPaginatedAll({
        maxResultCount: pagination.maxResultCount,
        skipCount: filter ? 0 : pagination.skipCount,
        name: filter ? filter.name : undefined,
        type: filter ? filter.type : undefined,
        startDate: filter && filter.startDate ? moment(filter.startDate).valueOf() : undefined,
        endDate: filter && filter.endDate ? moment(filter.endDate).valueOf() : undefined,
      })
      .then((res) => {
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
    setIsOpenModal(true);
  };

  const handleChange = (value, key) => {

    eventFormik.setValues({ ...eventFormik.values, [key]: value });
  };

  const handleEditEvent = (item) => {
    setIsOpenModal(true);
    eventService.getById(item.id).then((res) => {
      res.success || error({ title: res.successMessage });
      setEditEvent(res.result);
      console.log('player', res);
      eventFormik.setValues({
        ...eventFormik.values,
        ...res.result,
      });
    });
  };

  const columns = [
    {
      title: 'Name',
      width: 250,
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
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
      title: 'Type',
      width: 250,
      dataIndex: 'eventType',
      key: 'eventType',
      fixed: 'left',
      render: (text, item) => {
        console.log('Event Type', item);
        let event = 'N/A',
          tournament = 'N/A';
        if (text > 0) event = eventTypes.filter((i) => i.id == text)[0].name || 'N/A';
        if (item.tournamentType > 0) tournament = tournamentTypes.filter((k) => k.id == item.tournamentType)[0].name || 'N/A';
        return `${event} -- ${tournament}`;
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
                    <Link to={'/bracket/' + item.id}>{L('Fixture Generator')}</Link>
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
      <Table pagination={pagination} columns={columns} dataSource={eventList} scroll={{ x: 1500}} onChange={handleTableChange} />
      <CustomModal
        title={Object.keys(editEvent).length ? 'Edit Event' : 'Add Event'}
        isModalVisible={isOpenModal}
        handleCancel={() => {
          setIsOpenModal(false);
        }}
        handleSubmit={handleSubmit}
      >
        <Form>
          <Row gutter={16}>
            <Col span={12}>
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
                value={eventFormik.values.startDate}
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
                value={eventFormik.values.endDate}
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
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={eventFormik.handleSubmit}>
              {Object.keys(editEvent).length ? 'Update' : 'Add'}
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
export default Player;
