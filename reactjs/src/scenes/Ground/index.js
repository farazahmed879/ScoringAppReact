import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Modal, Table, Dropdown, Menu, Row } from 'antd';
import { L } from '../../lib/abpUtility';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomModal from '../../components/Modal';
import CustomInput from '../../components/Input';
import groundService from '../../services/ground/GroundService';
const groundValidation = Yup.object().shape({
  name: Yup.string().required('Required'),
  location: Yup.string().required('Required'),
});

const groundInitial = {
  id: 0,
  name: '',
  location: '',
};

const success = Modal.success;
const error = Modal.error;

const Ground = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [groundList, setGroundList] = useState([]);
  const [editGround, setEditGround] = useState({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  
  const handleSubmit = (e) => {
    // if (!groundFormik.isValid) return;
    let req = {
      id: 0,
      name: groundFormik.values.name,
      location: groundFormik.values.location,
    };

    console.log('Ground Object', req);
    groundService.createOrUpdate(req).then((res) => {
      res.success ? success({ title: res.successMessage }) : error({ title: res.successMessage });
      setIsOpenModal(false);
      getAll();
    });
  };

  const groundFormik = useFormik({
    enableReinitialize: true,
    initialValues: groundInitial,
    validationSchema: groundValidation,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    getAll();
  }, []);

  const handleEditGround = (item) => {
    groundService.getById(item.id).then((res) => {
      res.success || error({ title: res.successMessage });
      setEditGround(res.result);
      setIsOpenModal(true);
      groundFormik.setValues({
        ...groundFormik.values,
        ...res.result,
      });
    });
  };

  const handleTableChange = (e) => {
    setPagination({
      current: e.current,
      pageSize: e.pageSize,
    });
  };

  // useEffect(() => {
  //   if (isOpenModal) {
  //   }
  // }, [isOpenModal]);

  const getAll = () => {
    groundService.getPaginatedAll({ maxResultCount: pagination.maxResultCount, skipCount: pagination.skipCount, name: "" }).then((res) => {
      console.log('Matches', res.items);
      setGroundList(
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

  const handleChange = (value, key) => {
    groundFormik.setValues({ ...groundFormik.values, [key]: value });
  };

  const columns = [
    {
      title: 'Ground',
      width: 250,
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      render: (text, item) => {
        return (item && item.name) || 'N/A';
      },
    },

    {
      title: 'Location',
      width: 250,
      dataIndex: 'location',
      render: (text, item) => {
        // return item && item.dateOfMatch ? moment(item.dateOfMatch).format('DD MMM YYYY') : 'N/A';
        return (item && item.location) || 'N/A';
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
                <Menu.Item onClick={(e) => handleEditGround(item)}>{L('Edit')}</Menu.Item>
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
      ),
    },
  ];
  console.log('groundFormik', groundFormik);

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px' }}>
        <h1>Ground</h1>{' '}
        <Button type="primary" shape="round" icon="plus" onClick={() => setIsOpenModal(true)}>
          Add
        </Button>
      </div>
      <Table pagination={pagination} columns={columns} dataSource={groundList} scroll={{ x: 1500 }} onChange={handleTableChange} />

      <CustomModal
        title={Object.keys(editGround).length ? 'Edit Ground' : 'Add Ground'}
        isModalVisible={isOpenModal}
        handleCancel={() => {
          setIsOpenModal(false);
        }}
      >
        <Form>
          <Row>
            <CustomInput
              title="Ground"
              type="text"
              handleChange={handleChange}
              value={groundFormik.values.name}
              stateKey="groundId"
              placeholder="Ground Name"
              errorMessage={groundFormik.errors.name}
            />
            <CustomInput
              title="Location"
              type="text"
              handleChange={handleChange}
              value={groundFormik.values.location}
              stateKey="locationId"
              placeholder="Location"
              errorMessage={groundFormik.errors.location}
            />
          </Row>
          <Form.Item gutter={16}>
            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
              {Object.keys(editGround).length ? 'Update' : 'Add'}
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
export default Ground;
