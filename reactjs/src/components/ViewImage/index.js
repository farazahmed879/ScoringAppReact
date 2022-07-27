import { Modal } from 'antd';
import React from 'react';
import getImage from '../../lib/getImage';
const ViewImage = ({ previewImage, preview, handlePreviewCancel }) => {
  return (
    <>
      {' '}
      <Modal visible={preview} footer={null} onCancel={handlePreviewCancel}>
        <img alt="example" style={{ width: '100%' }} src={getImage(previewImage)} />
      </Modal>
    </>
  );
};
export default ViewImage;
