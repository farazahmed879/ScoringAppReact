import { Button, Col, Form, Icon, Popover, Row, Skeleton, Upload } from 'antd';

import React from 'react';
import CustomInput from '../../components/Input';
import CustomModal from '../../components/Modal';

const AddOrEditTeamModal = ({
  isOpenModal,
  teamFormHandler,
  isEditDataLoading,
  teamFormik,
  profile,
  handleDeletePicture,
  handleProfileUpload,
  handleUpload,
  handlePreview,
  handleChange,
  teamTypeOptions,
  gallery,
  handleCancel,
  picture,
}) => {
  return (
    <CustomModal
      title={Object.keys(teamFormik.values).length ? 'Edit Team' : 'Add Team'}
      isModalVisible={isOpenModal}
      handleCancel={handleCancel}
      handleSubmit={teamFormHandler}
    >
      <Skeleton loading={isEditDataLoading}>
        <Form className="form" onSubmit={teamFormik.handleSubmit}>
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
            <Col span={12}>
              <CustomInput
                title="Contact"
                type="number"
                handleChange={handleChange}
                value={teamFormik.values.contact}
                stateKey="contact"
                placeholder=""
                errorMessage={teamFormik.errors.contact}
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
            <Col span={12}>
              {' '}
              <CustomInput
                title="City"
                type="text"
                handleChange={handleChange}
                value={teamFormik.values.city}
                stateKey="city"
                placeholder=""
                errorMessage={teamFormik.errors.city}
              />
            </Col>
            <Col span={12}>
              <CustomInput title="Area" type="text" handleChange={handleChange} value={teamFormik.values.place} stateKey="place" placeholder="" />
            </Col>
            <Col span={24}>
              <Upload
                beforeUpload={() => false}
                onPreview={handlePreview}
                value={teamFormik.values.gallery}
                fileList={gallery}
                multiple={true}
                listType="picture-card"
                onChange={(e) => handleUpload(e)}
              >
                Gallery
              </Upload>
            </Col>
            {/* <Col span={12}>
           <CustomInput
             title="Registered"
             type="checkbox"
             handleChange={handleChange}
             value={teamFormik.values.isRegistered}
             stateKey="isRegistered"
             placeholder=""
           />
         </Col> */}
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={!teamFormik.isValid} onClick={teamFormik.handleSubmit}>
              {Object.keys(teamFormik.values).length ? 'Update' : 'Add'}
            </Button>
            <Button htmlType="button" onClick={handleCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Skeleton>
    </CustomModal>
  );
};

export default AddOrEditTeamModal;
