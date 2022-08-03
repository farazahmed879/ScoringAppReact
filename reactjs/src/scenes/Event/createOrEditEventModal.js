import { Button, Col, Icon, Popover, Row, Skeleton, Upload, Form } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { eventTypes } from '../../components/Enum/enum';
import CustomInput from '../../components/Input';
import CustomModal from '../../components/Modal';

const CreateOrEditEventModal = ({
  handleSubmit,
  isEditDataLoading,
  profile,
  handlePreview,
  isOpenModal,
  eventFormik,
  tournamentTypes,
  gallery,
  handleCancel,
  handleChange,
  handleDeletePicture,
  picture,
  handleProfileUpload,
  handleUpload,
}) => {
  return (
    <>
      <CustomModal
        title={Object.keys(eventFormik.values).length ? 'Edit Event' : 'Add Event'}
        isModalVisible={isOpenModal}
        handleCancel={handleCancel}
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
                  errorMessage={eventFormik.errors.eventType}
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
                {Object.keys(eventFormik.values).length ? 'Update' : 'Add'}
              </Button>
              <Button htmlType="button" onClick={handleCancel}>
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Skeleton>
      </CustomModal>
    </>
  );
};

export default CreateOrEditEventModal;
