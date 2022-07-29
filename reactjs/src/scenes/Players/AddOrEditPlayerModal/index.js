import React from 'react';
import CustomModal from '../../../components/Modal';


const AddOrEditPlayerModal = ({isModalVisible,handleCancel}) => {
  return <>
  <CustomModal
  title= "demo"
  isModalVisible = {isModalVisible}
  handleCancel = {handleCancel}
  >
    <div>ashir</div>
  </CustomModal>
  </>;
};

export default AddOrEditPlayerModal;