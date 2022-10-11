import { Button, Col, Icon, Popover, Row, Skeleton, Upload, Form } from 'antd';
import React from 'react';
import CustomInput from '../../components/Input';
import CustomModal from '../../components/Modal';

const AddOrEditUmpiresModal = ({
  isOpenModal,
  isEditDataLoading,
  handleDeletePicture,
  handlePreview,
  umpireFormik,
  handleCancel,
  handleSubmit,
  handleUpload,
  gallery,
  handleChange,
  handleProfileUpload,
  profile,
  picture,
}) => {
  return (
    <>
      <CustomModal
        title={Object.keys(umpireFormik.values).length ? 'Edit Umpire' : 'Add Umpire'}
        isModalVisible={isOpenModal}
        handleCancel={handleCancel}
      >
        <Skeleton loading={isEditDataLoading}>
          <Form>
            <Row className="form-container">
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
                title="Name"
                type="text"
                value={umpireFormik.values.name}
                stateKey="name"
                placeholder="Umpire Name"
                handleChange={handleChange}
                errorMessage={umpireFormik.errors.name}
              />
              <CustomInput
                title="Address"
                type="text"
                value={umpireFormik.values.address}
                stateKey="address"
                placeholder="Address"
                handleChange={handleChange}
                errorMessage={umpireFormik.errors.address}
              />
              <CustomInput
                title="Contact"
                type="number"
                value={umpireFormik.values.contact}
                stateKey="contact"
                placeholder="Contact"
                handleChange={handleChange}
                errorMessage={umpireFormik.errors.contact}
              />
              <Col span={24}>
                <Upload
                  className="Gallery"
                  beforeUpload={() => false}
                  onPreview={handlePreview}
                  value={umpireFormik.values.gallery}
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
                {/* {Object.keys(groundFormik.values).length ? 'Update' : 'Add'} */}
                {Object.keys(umpireFormik.values).length ? 'Update' : 'Add'}
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

export default AddOrEditUmpiresModal;
