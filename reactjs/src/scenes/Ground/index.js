import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Modal, Table, Dropdown, Menu, Skeleton, Row, Col, Upload, Popover, Icon } from 'antd';
import { L } from '../../lib/abpUtility';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomModal from '../../components/Modal';
import CustomInput from '../../components/Input';
import groundService from '../../services/ground/GroundService';
import CustomTable from '../../components/Table';
import { getBase64 } from '../../helper/getBase64';
const baseUrl = 'http://localhost:21021';

const groundValidation = Yup.object().shape({
  name: Yup.string().required('Required'),
  location: Yup.string().required('Required'),
});

const groundInitial = {
  id: 0,
  name: '',
  location: '',
  profileUrl: '',
  profile: [],
};

const success = Modal.success;
const error = Modal.error;

const Ground = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditDataLoading, setIsEditDataLoading] = useState(false);
  const [groundList, setGroundList] = useState([]);
  const [mode, setModalMode] = useState('');
  const [picture, setPicture] = useState(false);
  const [preview, setPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [profile, setProfile] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [editGround, setEditGround] = useState({});
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const handleSubmit = (e) => {
    if (!groundFormik.isValid) return;
    let req = {
      id: groundFormik.values.id || 0,
      name: groundFormik.values.name,
      location: groundFormik.values.location,
      profileUrl: groundFormik.values.profileUrl,
      profile: groundFormik.values.profile,
    };

    if (profile && profile[0]) {
      setPicture(false);
      req['profile'] = { name: profile[0].name, blob: profile[0].thumbUrl, url: profile[0].url };
    } else {
      setPicture(true);
      return;
    }

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
  }, [pagination.current]);

  const handleEditGround = (item) => {
    setIsEditDataLoading(true);
    setIsOpenModal(true);
    setModalMode('Edit Ground');
    groundService.getById(item.id).then((res) => {
      if (res) {
        if (!res.success) {
          error({ title: res.successMessage });
          return;
        }
        setEditGround(res.result);
        groundFormik.setValues({
          ...groundFormik.values,
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

  const addGround = () => {
    setProfile([]);
    setGallery([]);
    setIsOpenModal(true);
    setModalMode('Create Ground');
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

  // useEffect(() => {
  //   if (isOpenModal) {
  //   }
  // }, [isOpenModal]);

  const getAll = () => {
    setLoading(true);
    groundService.getPaginatedAll({ maxResultCount: pagination.maxResultCount, skipCount: pagination.skipCount, name: '' }).then((res) => {
      console.log('Matches', res.items);
      setLoading(false);
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

  useEffect(() => {
    if (!isOpenModal) {
      groundFormik.setValues({});
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

  const handleChange = (value, key) => {
    groundFormik.setValues({ ...groundFormik.values, [key]: value });
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreview(true);
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
        <Button type="primary" shape="round" icon="plus" onClick={addGround}>
          Add
        </Button>
      </div>
      <CustomTable
        loading={loading}
        pagination={pagination}
        columns={columns}
        data={groundList}
        scroll={{ x: 1500 }}
        handleTableChange={handleTableChange}
      />
      <CustomModal
        title={Object.keys(editGround).length ? 'Edit Ground' : 'Add Ground'}
        isModalVisible={isOpenModal}
        handleCancel={() => {
          setIsOpenModal(false);
        }}
      >
        <Skeleton loading={isEditDataLoading}>
          <Form>
            <Row>
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
              <CustomInput
                title="Ground"
                type="text"
                value={groundFormik.values.name}
                stateKey="name"
                placeholder="Ground Name"
                handleChange={handleChange}
                errorMessage={groundFormik.errors.name}
              />
              <CustomInput
                title="Location"
                type="text"
                value={groundFormik.values.location}
                stateKey="location"
                placeholder="Location"
                handleChange={handleChange}
                errorMessage={groundFormik.errors.location}
              />
              <Col span={24}>
                <Upload
                  className="Gallery"
                  beforeUpload={() => false}
                  onPreview={handlePreview}
                  value={groundFormik.values.gallery}
                  fileList={gallery}
                  multiple={true}
                  listType="picture-card"
                  onChange={(e) => handleUpload(e)}
                >
                  Gallery
                </Upload>
              </Col>
            </Row>
            <Form.Item gutter={16}>
              <Button type="primary" htmlType="submit" onClick={handleSubmit}>
                {/* {Object.keys(editGround).length ? 'Update' : 'Add'} */}
                {mode == 'Create Ground' ? 'Add' : 'Update'}
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
export default Ground;
