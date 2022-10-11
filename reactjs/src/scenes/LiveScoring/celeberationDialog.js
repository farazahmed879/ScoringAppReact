import { Button, Card, Modal } from 'antd';
import React, { useState } from 'react';

const CeleberationDialog = ({ handleOk, isVisible }) => {
  return (
    <div>
      <Modal closable={true} footer={null} visible={isVisible} onCancel={handleOk}>
        <Card hoverable  cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}></Card>
      </Modal>
    </div>
  );
};
export default CeleberationDialog;
