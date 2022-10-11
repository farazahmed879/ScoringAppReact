import React, { useState } from "react";
import { Button, Icon, Skeleton, Descriptions, Modal } from "antd";
import CustomModal from "../Modal";
import CustomInput from "../Input";
import abpUserConfigurationService from "../../services/abpUserConfigurationService";
import userService from "../../services/user/userService";
import entityAdminService from "../../services/EntityAdmin/entityAdminService";


const success = Modal.success;
const error = Modal.error;
const AssignAdmin = ({ entityId, title, entityName }) => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [contact, setContact] = useState("");
    const [user, setUser] = useState({
        id: 0,
        fullName: null,
        emailAddress: null,
        userName: null,
        phoneNumber: null,
        address: null,
        name: null,
        surname: null,
    });

    const handleModal = () => {
        setIsOpenModal(!isOpenModal)
    }

    const handleSubmit = () => {
        if (!user.id)
            return
        var req = {
            "userIds": [
                user.id
            ],
            [entityName]: entityId,
        }
        entityAdminService.CreateOrEdit(req).then((res) => {
            if (res.success) {
                res.result.success ? success({ title: "Successfully assign to the user" }) : error({ title: res.result.successMessage });
                handleModal();
            }
        })

    }
    const handleChange = (value, key) => {
        setContact(value);
    }

    const handleGetUser = () => {
        if (!contact)
            return;
        setIsLoading(true)
        console.log("handleGetUser");
        userService.getUserByContact(contact).then((res) => {
            if (res) {
                console.log("getUserByContact", res);
                setUser(res.result);
            }
            setIsLoading(false);
        })
    }

    return <><Icon type="setting" onClick={handleModal} />
        <CustomModal isModalVisible={isOpenModal} title={title} handleCancel={handleModal}>
            <CustomInput
                title="User Phone"
                type="number"
                handleChange={handleChange}
                value={contact}
                onBlur={handleGetUser}
                stateKey="contact"
                placeholder="Phone"
                errorMessage={!contact ? "Phone Required" : ""}
            />
            {user.id > 0 &&
                <Skeleton loading={isLoading}>
                    <Descriptions title="User Info" size={"small"} layout="vertical">
                        <Descriptions.Item label="Username">{user.userName}</Descriptions.Item>
                        <Descriptions.Item label="First Name">{user.name}</Descriptions.Item>
                        <Descriptions.Item label="Last Name">{user.surname}</Descriptions.Item>
                        <Descriptions.Item label="Phone">{user.phoneNumber}</Descriptions.Item>
                    </Descriptions>
                </Skeleton>

            }
            <Button type="primary" htmlType="submit" disabled={false} onClick={handleSubmit}>
                {'Assign'}
            </Button>
            <Button htmlType="button" onClick={handleModal}>
                Cancel
            </Button>
        </CustomModal>
    </>
}
export default AssignAdmin;