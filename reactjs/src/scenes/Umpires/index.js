// import React from 'react';
// const Umpires = () => {
//   return <>HUmayun NUlla</>;
// };
// export default Umpires;
import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Modal, Table, Dropdown, Menu, Skeleton, Row, Col, Upload, Popover, Icon, Collapse } from 'antd';
import { L } from '../../lib/abpUtility';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomModal from '../../components/Modal';
import CustomInput from '../../components/Input';
import UmpireService from '../../services/Umpire/UmpireService';
import CustomTable from '../../components/Table';
import { getBase64 } from '../../helper/getBase64';
import { Link } from 'react-router-dom';
import ViewImage from '../../components/ViewImage';
import AddOrEditUmpiresModal from './addOrEditUmpiresModal';
import FilterPanel from './filter-panel';
const baseUrl = 'http://localhost:21021';

const umpireValidation = Yup.object().shape({
  name: Yup.string().required('Required'),
  address: Yup.string().required('Required'),
});

const UmpireInitial = {
  id: 0,
  name: '',
  address: '',
  contact: '',
  profileUrl: '',
  profile: [],
};

const success = Modal.success;
const error = Modal.error;
const { Panel } = Collapse;

const Umpires = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditDataLoading, setIsEditDataLoading] = useState(false);
  const [umpireList, setUmpireList] = useState([]);
  const [filterUmpireList, setFilterUmpireList] = useState([]);
  const [picture, setPicture] = useState(false);
  const [preview, setPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [profile, setProfile] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const filterHandleSubmit = (umpire) => {
    getAll(umpire);
  };

  const handleSubmit = (e) => {
    if (!umpireFormik.isValid) return;
    let req = {
      id: umpireFormik.values.id || 0,
      name: umpireFormik.values.name,
      address: umpireFormik.values.address,
      contact: umpireFormik.values.contact,
      profileUrl: umpireFormik.values.profileUrl,
      profile: umpireFormik.values.profile,
      gallery: gallery.map((data) => ({
        id: data.key,
        name: data.name,
        blob: data.thumbUrl,
      })),
    };

    if (profile && profile[0]) {
      setPicture(false);
      req['profile'] = { name: profile[0].name, blob: profile[0].thumbUrl, url: profile[0].url };
    } else {
      setPicture(true);
      return;
    }

    console.log('Umpire Object', req);
    UmpireService.createOrUpdate(req).then((res) => {
      res.success ? success({ title: res.successMessage }) : error({ title: res.successMessage });
      setIsOpenModal(false);
      getAll();
    });
  };

  const umpireFormik = useFormik({
    enableReinitialize: true,
    initialValues: UmpireInitial,
    validationSchema: umpireValidation,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    getAll();
  }, [pagination.current]);

  const handleEditUmpire = (item) => {
    setIsEditDataLoading(true);
    setIsOpenModal(true);
    UmpireService.getById(item.id).then((res) => {
      if (res) {
        if (!res.success) {
          error({ title: res.successMessage });
          return;
        }
        umpireFormik.setValues({
          ...umpireFormik.values,
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

  const addUmpire = () => {
    setProfile([]);
    setGallery([]);
    setIsOpenModal(true);
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
    UmpireService.getPaginatedAll({ maxResultCount: pagination.maxResultCount, skipCount: pagination.skipCount, name: '' }).then((res) => {
      console.log('Matches', res.items);
      setLoading(false);
      setUmpireList(
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
      umpireFormik.setValues({});
      //setProfile([]);
    }
  }, [isOpenModal]);
  const confirm = Modal.confirm;
  const handleDeleteUmpire = (item) => {
    // setDeleteEvent(true);
    confirm({
      title: 'Do you Want to delete these items?',
      onOk() {
        UmpireService.delete(item.id).then((res) => {
          if (res) {
            if (!res.success) {
              error({ title: res.successMessage });
              return;
            } else {
              success({ title: res.successMessage });
              getAll();
            }
          }
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
    console.log(picture);
  };

  useEffect(() => {
    if (profile.length > 0) {
      setPicture(false);
    } else {
      setPicture(true);
    }
  }, [profile]);
  const callback = (key) => {
    console.log(key);
  };

  const handleUpload = ({ file, fileList }) => {
    setGallery(fileList);
  };

  const handleProfileUpload = ({ fileList }) => {
    setProfile(fileList);
    //console.log('profile', e.file);
  };

  const handleChange = (value, key) => {
    umpireFormik.setValues({ ...umpireFormik.values, [key]: value });
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
      title: 'Umpires',
      width: 250,
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      render: (text, item) => {
        return (
          <div>
            <Link to={'/umpire/profile/' + item.id}>{item.name}</Link>
          </div>
        );
      },
    },

    {
      title: 'Address',
      width: 250,
      dataIndex: 'address',
      render: (text, item) => {
        // return item && item.dateOfMatch ? moment(item.dateOfMatch).format('DD MMM YYYY') : 'N/A';
        return (item && item.address) || 'N/A';
      },
    },
    {
      title: 'Contact',
      width: 250,
      dataIndex: 'contact',
      key: 'contact',
      render: (number, item) => {
        // return item && item.dateOfMatch ? moment(item.dateOfMatch).format('DD MMM YYYY') : 'N/A';
        return (item && item.contactg) || 'N/A';
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
                <Menu.Item onClick={(e) => handleEditUmpire(item)}>{L('Edit')}</Menu.Item>
                <Menu.Item onClick={(e) => handleDeleteUmpire(item)}>{L('Delete')}</Menu.Item>
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
  console.log('umpireFormik', umpireFormik);

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px' }}>
        <h1>Manage Umpires</h1>{' '}
        <Button type="primary" shape="round" icon="plus" onClick={addUmpire}>
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
        data={umpireList}
        scroll={{ x: 1500 }}
        handleTableChange={handleTableChange}
      />
      <ViewImage previewImage={previewImage} preview={preview} handlePreviewCancel={handlePreviewCancel} />
      <AddOrEditUmpiresModal
        isOpenModal={isOpenModal}
        isEditDataLoading={isEditDataLoading}
        handleDeletePicture={handleDeletePicture}
        handlePreview={handlePreview}
        umpireFormik={umpireFormik}
        handleCancel={() => setIsOpenModal(false)}
        handleSubmit={handleSubmit}
        handleUpload={handleUpload}
        gallery={gallery}
        handleChange={handleChange}
        handleProfileUpload={handleProfileUpload}
        profile={profile}
        picture={picture}
      />
    </Card>
  );
};
export default Umpires;
