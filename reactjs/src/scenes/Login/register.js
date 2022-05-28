import React, { useState } from 'react';
import { Col, Row, Card, Button, PageHeader } from 'antd';
import CustomInput from '../../components/Input';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';
import userService from '../../services/user/userService';
import { genderOptions } from '../../components/Enum/enum';
import { userRouter } from '../../components/Router/router.config';

const marginTop = {
  marginTop: '10px',
};

export const validateMobile = new RegExp('^.{11,11}$');

const userInitial = {
  id: 0,
  name: '',
  phoneNumber: '',
  gender: 2,
  role: '',
  surname: '',
  username: '',
  email: '',
  password: '',
  roleName: '',
};

const userValidation = Yup.object().shape({
  name: Yup.string().required('Required'),
  gender: Yup.string().required('Required'),
  surname: Yup.string().required('Required'),
  username: Yup.string().required('Required'),
  phoneNumber: Yup.string().required('Required').min(11, 'Contact must contain 12 numbers').max(11, 'Contact must contain 12 numbers'),
  email: Yup.string()
    .required('Required')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i, 'Invalid email format'),
  confirmEmail: Yup.string().oneOf([Yup.ref('email'), null], 'Email must match'),
  password: Yup.string()
    .required('Required')
    .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field '),
  passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const phoneNumberValidation = Yup.object().shape({
  phoneNumber: Yup.string().required('Required').min(11, 'Contact must contain 12 numbers').max(11, 'Contact must contain 12 numbers'),
});

const Register = () => {
  const [mobile, setMobileNumber] = useState(null);
  const [layout, setLayoutMode] = useState(1);
  const [roles, setRoles] = useState([]);
  const [disabledMode, setDisabledMode] = useState(false);
  const history = useHistory();
  //const [user, setUser] = useState(userInitial);
  const handleChange = (value, key) => {
    phoneNumberFormik.setValues({ ...phoneNumberFormik.values, [key]: value });
  };

  const handleChangeUser = (value, key) => {
    userFormik.setValues({ ...userFormik.values, [key]: value });
  };

  const handleSubmitMobileNumber = () => {
    if(!phoneNumberFormik.values.phoneNumber){
      return;
    }
    userService.getUerDetailByContactNumber(phoneNumberFormik.values.phoneNumber).then((res) => {
      if (res.success) {
        setDisabledMode(true);
        setLayoutMode(2);
        getRoles();
        console.log('res', res);
        if (res.result.user) {
          let user = {
            id: 0,
            name: res.result.user.name,
            phoneNumber: res.result.user.contact,
            gender: res.result.user.gender,
            //role: res.result.roleId,
            surname: '',
            username: '',
            email: '',
            password: '',
            confirmEmail: '',
            passwordConfirmation: '',
            roleName: res.result.role,
          };
          if (res.result.roleId) setDisabledMode(true);
          userFormik.setValues({
            ...userFormik.values,
            ...user,
          });
          return;
        }
        debugger
        userFormik.setValues({
          ...userFormik.values,
          ...{ phoneNumber: phoneNumberFormik.values.phoneNumber, roleName: 'Player'},
        });
      }
    });
  };

  const getRoles = () => {
    userService.getRoles().then((res) => {
      setRoles(res);
    });
  };

  const handleRegisterSubmit = () => {
    console.log('handleSubmit');
    let req = {
      id: 0,
      name: userFormik.values.name,
      phoneNumber: userFormik.values.phoneNumber,
      roleNames: [userFormik.values.roleName],
      surname: userFormik.values.surname,
      username: userFormik.values.username,
      emailAddress: userFormik.values.email,
      password: userFormik.values.password,
      isActive: true,
    };
    userService.create(req).then((res) => {
      if (res) {
        history.push('/user/login');
      }
    });
  };

  const phoneNumberFormik = useFormik({
    enableReinitialize: true,
    initialValues: { phoneNumber : null },
    validationSchema: phoneNumberValidation,
    onSubmit: handleSubmitMobileNumber,
  });

  const userFormik = useFormik({
    enableReinitialize: true,
    initialValues: userInitial,
    validationSchema: userValidation,
    onSubmit: handleRegisterSubmit,
  });

  
  return (
    <Col className="name">
      <Row>
        <Row style={{ marginTop: 100 }}>
          <Col span={8} offset={8}>
            <Card>
              {layout == 1 ? (
                <>
                  <Row>
                    <PageHeader title={'Register'}></PageHeader>
                    <CustomInput
                      type="number"
                      handleChange={handleChange}
                      value={phoneNumberFormik.values.phoneNumber}
                      stateKey="phoneNumber"
                      placeholder="Enter Mobile Number"
                      errorMessage={phoneNumberFormik.errors.phoneNumber}
                    />
                  </Row>
                  <Row style={{ marginTop: '10px' }}>
                    <Button style={{ backgroundColor: '#f5222d', color: 'white' }} type="primary" onClick={handleSubmitMobileNumber}>
                      {'Submit'}
                    </Button>
                    <Button style={{ backgroundColor: '#f5222d', color: 'white', marginLeft: '10px' }} type="primary" onClick={history.goBack}>
                      {'Back'}
                    </Button>
                  </Row>
                </>
              ) : (
                <>
                  <Row gutter={16}>
                    <PageHeader title={'Register'}></PageHeader>
                    <Col span={12} style={marginTop}>
                      <CustomInput
                        title="Name"
                        type="text"
                        handleChange={handleChangeUser}
                        value={userFormik.values.name}
                        stateKey="name"
                        placeholder="Name"
                        errorMessage={userFormik.errors.name}
                      />
                    </Col>
                    <Col span={12} style={marginTop}>
                      <CustomInput
                        title="Surname"
                        type="text"
                        handleChange={handleChangeUser}
                        value={userFormik.values.surname}
                        stateKey="surname"
                        placeholder="Surname"
                        errorMessage={userFormik.errors.surname}
                      />
                    </Col>
                    <Col span={12} style={marginTop}>
                      <CustomInput
                        title="Username"
                        type="text"
                        handleChange={handleChangeUser}
                        value={userFormik.values.username}
                        stateKey="username"
                        placeholder="Username"
                        errorMessage={userFormik.errors.username}
                      />
                    </Col>
                    <Col span={12} style={marginTop}>
                      <CustomInput
                        title="Phone Number"
                        type="number"
                        handleChange={handleChangeUser}
                        value={userFormik.values.phoneNumber}
                        disabled={disabledMode}
                        stateKey="phoneNumber"
                        placeholder="Enter Mobile Number"
                        errorMessage={userFormik.errors.phoneNumber}
                      />
                    </Col>
                    <Col span={12} style={marginTop}>
                      <CustomInput
                        title="Gender"
                        type="select"
                        options={genderOptions}
                        handleChange={handleChangeUser}
                        value={userFormik.values.gender}
                        disabled={disabledMode}
                        stateKey="gender"
                        placeholder="Gender"
                        errorMessage={userFormik.errors.gender}
                      />
                    </Col>
                    <Col span={12} style={marginTop}>
                      {' '}
                      <CustomInput
                        title="Role"
                        type="text"
                        handleChange={handleChangeUser}
                        value={userFormik.values.roleName}
                        disabled={disabledMode}
                        stateKey="roleName"
                        placeholder="Role"
                        errorMessage={userFormik.errors.roleName}
                      />
                    </Col>
                    <Col span={12} style={marginTop}>
                      <CustomInput
                        title="Email"
                        type="text"
                        handleChange={handleChangeUser}
                        value={userFormik.values.email}
                        stateKey="email"
                        placeholder="Email"
                        errorMessage={userFormik.errors.email}
                      />
                    </Col>
                    <Col span={12} style={marginTop}>
                      {' '}
                      <CustomInput
                        title="Confirm Email"
                        type="text"
                        handleChange={handleChangeUser}
                        value={userFormik.values.confirmEmail}
                        stateKey="confirmEmail"
                        placeholder="Confirm Email"
                        errorMessage={userFormik.errors.confirmEmail}
                      />
                    </Col>
                    <Col span={12} style={marginTop}>
                      {' '}
                      <CustomInput
                        title="Password"
                        type="text"
                        handleChange={handleChangeUser}
                        value={userFormik.values.password}
                        stateKey="password"
                        placeholder="Password"
                        errorMessage={userFormik.errors.password}
                      />
                    </Col>
                    <Col span={12} style={marginTop}>
                      <CustomInput
                        title="Confirm Password"
                        type="text"
                        handleChange={handleChangeUser}
                        value={userFormik.values.passwordConfirmation}
                        stateKey="passwordConfirmation"
                        placeholder="Confirm Password"
                        errorMessage={userFormik.errors.passwordConfirmation}
                      />
                    </Col>
                  </Row>
                  <Row style={{ marginTop: '10px' }}>
                    <Button style={{ backgroundColor: '#f5222d', color: 'white' }} type="primary" onClick={handleRegisterSubmit}>
                      {'Submit'}
                    </Button>
                    <Button style={{ backgroundColor: '#f5222d', color: 'white', marginLeft: '10px' }} type="primary" onClick={history.goBack}>
                      {'Back'}
                    </Button>
                  </Row>
                </>
              )}
            </Card>
          </Col>
        </Row>
      </Row>
    </Col>
  );
};
export default Register;
