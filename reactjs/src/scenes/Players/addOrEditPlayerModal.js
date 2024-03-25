import React from 'react';
import { Button, Col, Icon, Popover, Row, Skeleton, Upload, Form } from 'antd';
import moment from 'moment';
import { battingStyleOptions, genderOptions, playingRoleOptions } from '../../components/Enum/enum';
import CustomInput from '../../components/Input';
import CustomModal from '../../components/Modal';

const AddOrEditPlayerModal = ({
  isOpenModal = false,
  handleCancel,
  handleSubmit,
  isEditDataLoading,
  playerFormik,
  handleUpload,
  gallery,
  handlePreview,
  handleChange,
  teamList,
  handleChangeDatePicker,
  bowlingStyleOptions,
  picture,
  handleDeletePicture,
  handleProfileUpload,
  profile = {},
  teamName,
}) => {
  return (
    <>
      <CustomModal
        title={Object.keys(playerFormik.values).length ? 'Edit Player' : 'Add Player'}
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
                  value={playerFormik.values.name}
                  stateKey="name"
                  placeholder=""
                  errorMessage={playerFormik.errors.name}
                />
              </Col>
              <Col span={12}>
                <CustomInput
                  title="Gender"
                  type="select"
                  options={genderOptions}
                  handleChange={handleChange}
                  value={playerFormik.values.gender}
                  errorMessage={playerFormik.errors.gender}
                  stateKey="gender"
                />
              </Col>
            </Row>
            <Row gutter={16} className="form-container">
              <Col span={8}>
                <CustomInput
                  title="Player Role"
                  type="select"
                  options={playingRoleOptions}
                  handleChange={handleChange}
                  value={playerFormik.values.playerRoleId}
                  stateKey="playerRoleId"
                  placeholder=""
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  title="Batting Style"
                  type="select"
                  options={battingStyleOptions}
                  handleChange={handleChange}
                  value={playerFormik.values.battingStyleId}
                  stateKey="battingStyleId"
                  placeholder=""
                />
              </Col>
              <Col span={8}>
                <CustomInput
                  title="Bowling Style"
                  type="select"
                  options={bowlingStyleOptions}
                  handleChange={handleChange}
                  value={playerFormik.values.bowlingStyleId}
                  stateKey="bowlingStyleId"
                  placeholder=""
                />
              </Col>
            </Row>
            <Row gutter={16} className="form-container">
              <Col span={8}>
                <CustomInput
                  title="Contact"
                  type="number"
                  handleChange={handleChange}
                  value={playerFormik.values.contact}
                  stateKey="contact"
                  placeholder=""
                  errorMessage={playerFormik.errors.contact}
                />
              </Col>
              <Col span={8}>
                <CustomInput title="Cnic" type="text" handleChange={handleChange} value={playerFormik.values.cnic} stateKey="cnic" placeholder="" />
              </Col>
              <Col span={8}>
                <CustomInput
                  title="Birth"
                  type="datePicker"
                  handleChange={handleChangeDatePicker}
                  value={moment(playerFormik.values.dob)}
                  stateKey="dob"
                  placeholder=""
                />
              </Col>
            </Row>
            <Row gutter={16} className="form-container">
              <Col span={24}>
                <CustomInput
                  title="Address"
                  type="text"
                  handleChange={handleChange}
                  value={playerFormik.values.address}
                  stateKey="address"
                  placeholder=""
                />
              </Col>
              <Col span={24}>
                {teamName ? (
                  <CustomInput
                    title="Team"
                    type="text"
                    handleChange={handleChange}
                    value={teamName}
                    placeholder="Select Team"
                    disabled = {true}
                  />
                ) : (
                  <CustomInput
                    title="Team"
                    type="multiple"
                    options={teamList}
                    handleChange={handleChange}
                    value={playerFormik.values.teamIds}
                    stateKey="teamIds"
                    placeholder=""
                  />
                )}
              </Col>
              <br />
              <Col span={24}>
                <Upload
                  className="Gallery"
                  beforeUpload={() => false}
                  onPreview={handlePreview}
                  value={playerFormik.values.gallery}
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
              <Button type="primary" htmlType="submit" onClick={playerFormik.handleSubmit}>
                {Object.keys(playerFormik.values).length ? 'Update' : 'Add'}
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

export default AddOrEditPlayerModal;
