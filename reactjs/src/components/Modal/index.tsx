import * as React from 'react';
import { Modal } from 'antd';

type Props = {
    title: string,
    isModalVisible: boolean,
    handleSubmit: Function,
    handleCancel: Function,
    children: JSX.Element
};

const CustomModal: React.FC<Props> = ({ children, title="Add Score" ,
 isModalVisible = true, handleSubmit = () => { }, handleCancel = (e: boolean) => { } }) => {


    return (
        <Modal footer={null} title={title} visible={isModalVisible} onOk={() => handleSubmit()} onCancel={() => handleCancel(false)}>
            {children}
        </Modal>

    );
}
export default CustomModal;